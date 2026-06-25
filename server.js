const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.static(path.join(__dirname)));

// 💾 מצב המשחק בזיכרון
let currentQuestionId = 1;
let votedUsers = new Map();   // { phone => questionId }
let userAnswers = new Map();  // { phone => digit pressed }
let voteTimestamps = new Map(); // { phone => timestamp }

const questions = new Map([
    [1, {
        id: 1,
        type: 'trivia',
        text: "מהי האות הראשונה הפותחת את דברי הגמרא במסכת בבא קמא?",
        answers: ["אות מ'", "אות ב'", "אות א'", "אות ח'"],
        correctIndex: 0,
        timer: 15
    }],
    [2, {
        id: 2,
        type: 'survey',
        text: "איזה סוג סוגיה הכי אהבתם ללמוד בזמן האחרון?",
        answers: ["סוגיית מועד", "סוגיית נזיקין", "סוגיית קדשים"],
        correctIndex: -1,
        timer: 20
    }],
    [3, {
        id: 3,
        type: 'bonus',
        text: "שאלת המיליון של ראש הישיבה שליט\"א!",
        answers: ["אפשרות א'", "אפשרות ב'", "אפשרות ג'"],
        correctIndex: 0,
        timer: 30
    }]
]);

function getQuestionIds() {
    return [...questions.keys()].sort((a, b) => a - b);
}

function isAnswerableQuestion(question) {
    return question && question.type !== 'topic';
}

function getActiveQuestion() {
    return questions.get(currentQuestionId) || null;
}

function clearVotes() {
    votedUsers.clear();
    userAnswers.clear();
    voteTimestamps.clear();
}

function computeStats(question) {
    const answerCount = question.answers.length;
    const counts = new Array(answerCount).fill(0);
    let correctCount = 0;
    let wrongCount = 0;

    for (const [phone, qId] of votedUsers.entries()) {
        if (qId !== currentQuestionId) continue;
        const choice = userAnswers.get(phone);
        const idx = parseInt(choice, 10) - 1;
        if (idx >= 0 && idx < answerCount) {
            counts[idx]++;
            if (question.correctIndex === -1) {
                correctCount++;
                continue;
            }
            if (idx === question.correctIndex) correctCount++;
            else wrongCount++;
        }
    }

    const totalVotes = counts.reduce((a, b) => a + b, 0);
    const percents = counts.map(c => totalVotes > 0 ? Math.round((c / totalVotes) * 100) : 0);

    const fastest = [];
    for (const [phone, qId] of votedUsers.entries()) {
        if (qId === currentQuestionId) {
            fastest.push({ phone, time: voteTimestamps.get(phone) || 0 });
        }
    }
    fastest.sort((a, b) => a.time - b.time);

    return { counts, correctCount, wrongCount, percents, fastest: fastest.slice(0, 2) };
}

// ========================================================
// 📊 API לדשבורד ולמקרן
// ========================================================

app.get('/health', (req, res) => {
    res.json({ ok: true, questionCount: questions.size, currentQuestionId });
});

app.get('/studio-data', (req, res) => {
    const question = getActiveQuestion();
    if (!question) {
        return res.json({
            type: 'empty',
            questionNumber: currentQuestionId,
            questionText: "אין שאלה פעילה — שמור משחק בדשבורד והפעל שאלה",
            answers: ["-", "-", "-", "-"],
            correctCount: 0,
            wrongCount: 0,
            percents: [0, 0, 0, 0],
            correctIndex: -1,
            timer: 15
        });
    }

    if (question.type === 'topic') {
        return res.json({
            type: 'topic',
            questionNumber: currentQuestionId,
            questionText: question.text,
            answers: [],
            correctCount: 0,
            wrongCount: 0,
            percents: [],
            correctIndex: -1,
            timer: 0,
            fastestPlayers: []
        });
    }

    const stats = computeStats(question);
    res.json({
        type: question.type || 'trivia',
        questionNumber: currentQuestionId,
        questionText: question.text,
        answers: question.answers,
        correctCount: stats.correctCount,
        wrongCount: stats.wrongCount,
        percents: stats.percents,
        correctIndex: question.correctIndex,
        timer: question.timer || 15,
        fastestPlayers: stats.fastest.map(f => f.phone)
    });
});

app.post('/add-question', (req, res) => {
    const { id, type, text, answers, correctIndex, timer } = req.body;
    if (!id || !text || (type !== 'topic' && !Array.isArray(answers))) {
        return res.status(400).json({ error: 'חסרים שדות חובה: id, text, answers' });
    }

    questions.set(Number(id), {
        id: Number(id),
        type: type || 'trivia',
        text,
        answers: Array.isArray(answers) ? answers : [],
        correctIndex: typeof correctIndex === 'number' ? correctIndex : 0,
        timer: type === 'topic' ? 0 : (timer || 15)
    });

    console.log(`[שאלה נשמרה] #${id}: ${text.substring(0, 40)}...`);
    res.json({ ok: true, id: Number(id) });
});

app.post('/save-game', (req, res) => {
    const incomingQuestions = Array.isArray(req.body.questions) ? req.body.questions : null;
    if (!incomingQuestions) {
        return res.status(400).json({ error: 'חסר מערך שאלות בשם questions' });
    }

    const nextQuestions = new Map();
    for (const item of incomingQuestions) {
        const id = Number(item.id);
        if (!id || !item.text || (item.type !== 'topic' && !Array.isArray(item.answers))) {
            return res.status(400).json({ error: 'שאלה לא תקינה בשמירה מלאה' });
        }

        nextQuestions.set(id, {
            id,
            type: item.type || 'trivia',
            text: item.text,
            answers: Array.isArray(item.answers) ? item.answers : [],
            correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
            timer: item.type === 'topic' ? 0 : (item.timer || 15)
        });
    }

    questions.clear();
    for (const [id, question] of nextQuestions.entries()) {
        questions.set(id, question);
    }

    if (!questions.has(currentQuestionId)) {
        currentQuestionId = getQuestionIds()[0] || 1;
        clearVotes();
    }

    console.log(`[משחק נשמר] ${questions.size} שאלות סונכרנו בשרת`);
    res.json({ ok: true, questionCount: questions.size, currentQuestionId });
});

app.post('/set-question', (req, res) => {
    const qNum = parseInt(req.query.id, 10);
    if (isNaN(qNum) || qNum < 1) {
        return res.status(400).json({ error: 'מספר שאלה לא תקין' });
    }
    if (!questions.has(qNum)) {
        return res.status(404).json({ error: 'השאלה לא קיימת בשרת. שמור את המשחק מהדשבורד ונסה שוב.' });
    }

    currentQuestionId = qNum;
    clearVotes();
    console.log(`[שאלה הופעלה] #${qNum}`);
    res.json({ ok: true, currentQuestionId: qNum });
});

// ========================================================
// 📞 ניהול השלוחות הטלפוניות (ימות המשיח)
// ========================================================
app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;
    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";
    const activeQuestion = getActiveQuestion();

    if (shluha === "2") {
        if (!isAnswerableQuestion(activeQuestion)) {
            return res.send("wait");
        }
        const lastVotedQuestion = votedUsers.get(userPhone);
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait");
        }
        return res.send("move");
    }

    if (userChoice === undefined || userChoice === "") {
        return res.send("");
    }

    if (userChoice === "9") {
        const ids = getQuestionIds();
        const currentIdx = ids.indexOf(currentQuestionId);
        if (currentIdx >= 0 && currentIdx < ids.length - 1) {
            currentQuestionId = ids[currentIdx + 1];
        } else if (ids.length > 0) {
            currentQuestionId = ids[0];
        } else {
            currentQuestionId++;
        }
        clearVotes();
        console.log(`[טלפון] מעבר לשאלה #${currentQuestionId}`);
        return res.send("niklat");
    }

    if (!isAnswerableQuestion(activeQuestion)) {
        return res.send("wait");
    }

    if (votedUsers.get(userPhone) === currentQuestionId) {
        return res.send("taut");
    }

    votedUsers.set(userPhone, currentQuestionId);
    userAnswers.set(userPhone, userChoice);
    voteTimestamps.set(userPhone, Date.now());

    console.log(`[הצבעה] שאלה ${currentQuestionId} | ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`סורוצקליק רץ על http://localhost:${PORT}`);
    console.log(`  דשבורד:  http://localhost:${PORT}/admin.html`);
    console.log(`  מקרן:    http://localhost:${PORT}/index.html`);
    console.log(`  טלפון:   GET /clicker`);
});
