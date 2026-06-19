const express = require('express');
const app = express();

app.use(express.json());

// 🌟 מעקף CORS מוחלט - מאפשר גישה מכל מחשב ומכל דפדפן ללא חסימות!
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 💾 משתני הזיכרון של השרת
let currentQuestionId = 1;     
let votedUsers = new Map();     // {phone => questionId}
let userAnswers = new Map();    // {phone => choice}
let questionsBank = {};         // בנק השאלות הדינמי

// 1️⃣ קבלת שאלות מהדשבורד
app.post('/add-question', (req, res) => {
    const { id, text, answers, correctIndex } = req.body;
    questionsBank[id] = { text, answers, correctIndex };
    console.log(`[שרת] שאלה מספר ${id} נשמרה בהצלחה.`);
    res.json({ success: true });
});

// 2️⃣ שליטה ידנית - מעבר שאלה מהדשבורד
app.post('/set-question', (req, res) => {
    const qId = parseInt(req.query.id);
    if (!isNaN(qId)) {
        currentQuestionId = qId;
        votedUsers.clear();   
        userAnswers.clear();  
        console.log(`[שליטה] מעבר לשאלה ${currentQuestionId}. ההצבעות אופסו.`);
        return res.json({ success: true, currentQuestionId });
    }
    res.status(400).json({ error: "מספר שאלה לא תקין" });
});

// 3️⃣ שליחת נתונים חיים למסך באולם (index.html)
app.get('/studio-data', (req, res) => {
    const question = questionsBank[currentQuestionId] || { 
        text: "מחכה להזנת שאלות מהדשבורד...", 
        answers: ["-", "-", "-", "-"], 
        correctIndex: 0 
    };
    
    let distribution = [0, 0, 0, 0, 0]; 
    let correctCount = 0;
    let wrongCount = 0;

    userAnswers.forEach((choice) => {
        const idx = parseInt(choice) - 1;
        if (idx >= 0 && idx < 5) distribution[idx]++;

        if (choice === (question.correctIndex + 1).toString()) {
            correctCount++;
        } else {
            wrongCount++;
        }
    });

    const totalVotes = correctCount + wrongCount;
    const percents = totalVotes > 0 ? distribution.map(c => Math.round((c / totalVotes) * 100)) : [0, 0, 0, 0, 0];

    res.json({
        questionNumber: currentQuestionId,
        questionText: question.text,
        answers: question.answers,
        correctIndex: question.correctIndex,
        correctCount,
        wrongCount,
        percents
    });
});

// 4️⃣ קבלת הקשות מימות המשיח
app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    const shluha = req.query.shluha;       
    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    if (shluha === "2") {
        if (votedUsers.get(userPhone) === currentQuestionId) {
            return res.send("wait"); 
        } else {
            return res.send("move"); 
        }
    }

    if (userChoice === undefined || userChoice === "") {
        return res.send(""); 
    }

    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        userAnswers.clear();
        return res.send("niklat"); 
    }

    if (votedUsers.get(userPhone) === currentQuestionId) {
        return res.send("taut"); 
    }

    votedUsers.set(userPhone, currentQuestionId); 
    userAnswers.set(userPhone, userChoice); 
    return res.send("niklat"); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 השרת באוויר!");
});
