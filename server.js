const express = require('express');
const app = express();

app.use(express.json());

// 💾 משתני הזיכרון של השלוחות
let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע {phone => questionId}
let userAnswers = new Map(); // שומר מה המשתמש הצביע בפועל {phone => choice}

// ========================================================
// 📞 ניהול השלוחות הטלפוניות (ימות המשיח)
// ========================================================
app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       
    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    // שלוחה 2: לולאת המתנה ורענון
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            return res.send("move"); 
        }
    }

    // שלוחה 1: בדיקה אם טרם הוקשה ספרה
    if (userChoice === undefined || userChoice === "") {
        return res.send(""); 
    }

    // קוד מנחה מהטלפון (שינוי שאלה ואיפוס)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        userAnswers.clear();
        return res.send("niklat"); 
    }

    // בדיקה אם המשתמש כבר הצביע לשאלה הנוכחית
    if (votedUsers.get(userPhone) === currentQuestionId) {
        return res.send("taut"); 
    }

    // שמירת ההצבעה בזיכרון
    votedUsers.set(userPhone, currentQuestionId); 
    userAnswers.set(userPhone, userChoice); 
    
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); 
});

// הרצת השרת
app.listen(process.env.PORT || 3000, () => {
    console.log("השרת רץ ומקשיב רק לשלוחות של ימות המשיח!");
});
