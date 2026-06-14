const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       // מגיע רק משלוחה 2 (shluha=2)
    const userChoice = req.query.user_ans; // מגיע משלוחה 1 אחרי שהמשתמש מקיש
    const userPhone = req.query.ApiPhone;   // טלפון המאזין

    // ========================================================
    //  מצב א': הבקשה מגיעה משלוחה 2 (זיהוי לפי shluha === "2")
    // ========================================================
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            console.log(`[שחרור] ${userPhone} מועבר חזרה לשלוחה 1`);
            return res.send("move"); 
        }
    }

    // ========================================================
    //  מצב ב': הבקשה מגיעה משלוחה 1 (אין shluha=2)
    // ========================================================
    
    // 1. כניסה ראשונית לשלוחה 1 (המאזין רק נכנס, עדיין לא הקיש כלום)
    // מחזיר תשובה ריקה כדי שימות המשיח ימשיכו להשמעת קובץ 000 וקליטת המקשים בנחת
    if (userChoice === undefined || userChoice === "") {
        console.log(`[כניסה] מאזין נכנס לשלוחה 1 וממתין להקשה.`);
        return res.send(""); 
    }

    // 2. קוד מנחה (המנחה מקיש 9 בשלוחה 1 כדי לאפס)
    if (userChoice === "9") {
        currentQuestionId++; 
        console.log(`[מנחה] המשחק קודם לשאלה מספר: ${currentQuestionId}`);
        return res.send("niklat"); 
    }

    // 3. הגנה מפני הצבעה כפולה בשלוחה 1
    if (votedUsers.get(userPhone) === currentQuestionId) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה ${currentQuestionId}.`);
        return res.send("taut"); // מפעיל את api_answer_taut ב-INI שלך
    }

    // 4. הצבעה מוצלחת ותקינה בשלוחה 1
    votedUsers.set(userPhone, currentQuestionId); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); // מפעיל את api_answer_niklat ב-INI שלך
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ועובד בצורה נקייה עם ה-INI המקורי של שלוחה 1!");
});
