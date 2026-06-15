const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public')); // 1. מאפשר להגיש את dashboard.html ו-play.html מתיקיית public

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע {phone => questionId}
let userAnswers = new Map(); // חדש: שומר מה הבחור הצביע בפועל {phone => choice} לטובת הגרפים והניקוד

// 📊 משתני מערכת חדשים עבור המקרן והדשבורד
let currentStage = 1;      // 1=המתנה, 3=ברוכים הבאים, 4=שאלה, 8=מובילים, 9=מנצחים
let currentMode = 'idle';   // 'run' = טיימר רץ במקרן, 'reveal' = חשיפת תוצאות
let extraData = "";         // כותרת נושא משתנה

// רשימת שאלות בסיסית - המנחה יוכל להוסיף עליה בלייב מהדשבורד!
let gameItems = [
    { id: 1, type: "topic", title: "נושא: בקיאות במסכת בבא קמא דף ב'" },
    { id: 2, type: "trivia", title: "איך קוראים לבית המדרש של שיעור ב'?", timer: 15, answers: ["שטיבל", "בית יצחק", "עטרת שלמה", "בית שלמה"], correct: 3 }
];

// ========================================================
// 📞 הקוד המקורי שלך (נשאר בדיוק אותו דבר עם תוספת קטנה לשמירת התשובה)
// ========================================================
app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       
    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            return res.send("move"); 
        }
    }

    if (userChoice === undefined || userChoice === "") {
        return res.send(""); 
    }

    // קוד מנחה מהטלפון (נשמר כגיבוי, למרות שכעת יש דשבורד)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); // איפוס ההצבעות לשאלה החדשה
        userAnswers.clear();
        return res.send("niklat"); 
    }

    if (votedUsers.get(userPhone) === currentQuestionId) {
        return res.send("taut"); 
    }

    // הצבעה מוצלחת: שומרים גם את ה-ID של השאלה וגם את התשובה שהקיש (1-4)
    votedUsers.set(userPhone, currentQuestionId); 
    userAnswers.set(userPhone, userChoice); 
    
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); 
});

// ========================================================
// ⚙️ נתיבים חדשים (APIs) בשביל הדשבורד והמקרן
// ========================================================

// 1. למשוך את השאלות הקיימות לדשבורד
app.get('/api/questions', (req, res) => {
    res.json(gameItems);
});

// 2. הוספת שאלה חדשה בזמן אמת מהדשבורד
app.post('/api/questions', (req, res) => {
    const newQuestion = req.body;
    newQuestion.id = gameItems.length + 1; // קביעת מזהה מספרי רץ
    gameItems.push(newQuestion);
    res.json({ success: true, item: newQuestion });
});

// 3. הדשבורד מעדכן את מצב המשחק (החלפת שלבים, הפעלת טיימר)
app.post('/api/state', (req, res) => {
    currentStage = req.body.stage || currentStage;
    currentMode = req.body.currentMode || currentMode;
    extraData = req.body.extraData || "";
    
    // אם המנהל החליט להחליף שאלה אקטיבית דרך הדשבורד
    if (req.body.activeQuestionId) {
        currentQuestionId = parseInt(req.body.activeQuestionId);
        // אם המצב הוא 'run' (התחלת שאלה), נאפס את ההצבעות של השאלה הקודמת
        if (currentMode === 'run') {
            votedUsers.clear();
            userAnswers.clear();
        }
    }
    res.json({ success: true });
});

// 4. המקרן מושך את זה כל שנייה כדי לדעת מה להציג ולקבל נתוני הצבעה בזמן אמת
app.get('/api/state-live', (req, res) => {
    // סופרים את התוצאות הנוכחיות בזיכרון עבור הגרף במקרן
    let votesCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
    userAnswers.forEach((choice) => {
        if (votesCount[choice] !== undefined) votesCount[choice]++;
    });

    const activeItem = gameItems.find(i => i.id === currentQuestionId) || null;

    res.json({
        stage: currentStage,
        currentMode: currentMode,
        currentQuestionId: currentQuestionId,
        extraData: extraData,
        itemDetails: activeItem,
        votesLive: votesCount,
        totalVoters: userAnswers.size
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ועובד עם תמיכה מלאה במקרן, דשבורד, וטלפונים!");
});
