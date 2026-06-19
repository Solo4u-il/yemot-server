const express = require('express');
const app = express();

app.use(express.json());

// 🌟 טיפול קפדני ומלא ב-CORS ללא ספריות חיצוניות - פותר שגיאות אבטחה בדפדפן!
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    
    // אם הדפדפן שולח בקשת בדיקה מקדימה (Preflight / OPTIONS) נחזיר לו מיד 200 OK
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 💾 משתני הזיכרון של השרת
let currentQuestionId = 1;     // מספר השאלה הפעילה כרגע
let votedUsers = new Map();     // שומר מי הבחורים שכבר הצביעו בשאלה הנוכחית {phone => questionId}
let userAnswers = new Map();    // שומר מה כל בחור הצביע {phone => choice}

// 📚 בנק השאלות (מתמלא בלייב כשלוחצים "שמירה" בדשבורד)
let questionsBank = {};

// ========================================================
// 1️⃣ קבלת שאלות מהדשבורד (Dashboard -> Server)
// ========================================================
app.post('/add-question', (req, res) => {
    const { id, text, answers, correctIndex } = req.body;
    questionsBank[id] = { text, answers, correctIndex };
    console.log(`[שרת] שאלה מספר ${id} נשמרה בהצלחה בבנק השאלות.`);
    res.json({ success: true });
});

// ========================================================
// 2️⃣ שליטה חיה מהמחשב - מעבר שאלה ידני (Dashboard -> Server)
// ========================================================
app.post('/set-question', (req, res) => {
    const qId = parseInt(req.query.id);
    if (!isNaN(qId)) {
        currentQuestionId = qId;
        votedUsers.clear();   // מאפס הצבעות קודמות של הבחורים!
        userAnswers.clear();  // מאפס את התשובות הישנות!
        console.log(`[שליטה ידנית] המנהל העביר לשאלה ${currentQuestionId}. ההצבעות אופסו.`);
        return res.json({ success: true, currentQuestionId });
    }
    res.status(400).json({ error: "מספר שאלה לא תקין" });
});

// ========================================================
// 3️⃣ שליחת נתונים חיים למסך באולם (Server -> index.html)
// ========================================================
app.get('/studio-data', (req, res) => {
    // מושך את השאלה הנוכחית מהבנק. אם אין, שם ברירת מחדל
    const question = questionsBank[currentQuestionId] || { 
        text: "מחכה להזנת שאלות מהדשבורד...", 
        answers: ["-", "-", "-", "-"], 
        correctIndex: 0 
    };
    
    let distribution = [0, 0, 0, 0, 0]; // מונה הקשות לכל תשובה (1 עד 5)
    let correctCount = 0;
    let wrongCount = 0;

    // חישוב קולות חיות
    userAnswers.forEach((choice) => {
        const idx = parseInt(choice) - 1;
        if (idx >= 0 && idx < 5) distribution[idx]++;

        // בדיקה האם התשובה נכונה (choice הוא מחרוזת כמו "1", "2")
        if (choice === (question.correctIndex + 1).toString()) {
            correctCount++;
        } else {
            wrongCount++;
        }
    });

    const totalVotes = correctCount + wrongCount;
    // הפיכה לאחוזים עבור הגרפים באולם
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

// ========================================================
// 4️⃣ קבלת הקשות מימות המשיח (ימות המשיח -> Server)
// ========================================================
app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    const shluha = req.query.shluha;       
    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    // שלוחה 2: בדיקה האם הבחור כבר הצביע בשאלה הזו
    if (shluha === "2") {
        if (votedUsers.get(userPhone) === currentQuestionId) {
            return res.send("wait"); // כבר הצביע, תגיד לו להמתין
        } else {
            return res.send("move"); // לא הצביע, תעביר אותו להקיש
        }
    }

    // הגנה: אם אין הקשה, אל תעשה כלום
    if (userChoice === undefined || userChoice === "") {
        return res.send(""); 
    }

    // מקש 9: המנחה מעביר שאלה מהטלפון שלו
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        userAnswers.clear();
        console.log(`[מנחה בטלפון] לחץ 9. המשחק עבר לשאלה ${currentQuestionId}.`);
        return res.send("niklat"); 
    }

    // הגנה: אם הבחור מנסה להצביע פעמיים לאותה שאלה
    if (votedUsers.get(userPhone) === currentQuestionId) {
        return res.send("taut"); 
    }

    // שמירת ההצבעה התקינה של הבחור
    votedUsers.set(userPhone, currentQuestionId); 
    userAnswers.set(userPhone, userChoice); 
    
    console.log(`[הצבעה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); 
});

// הפעלת השרת
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 השרת הראשי של סורוצקליק באוויר ומוכן לאירוע!");
});
