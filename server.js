const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       
    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;   

    // ==========================================
    //  מצב א': המאזין נמצא בשלוחה 2 (המתנה אוטומטית)
    // ==========================================
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            console.log(`[שחרור] ${userPhone} מועבר חזרה לשלוחה 1`);
            return res.send("move"); 
        }
    }

    // ==========================================
    //  מצב ב': המאזין נמצא בשלוחה 1 (שלוחת המשחק)
    // ==========================================
    if (shluha === "1") {
        
        // 1. כניסה ראשונית לשלוחה 1 (לפני שהמאזין הקיש משהו)
        // מחזיר "knesa" כדי שה-INI ידע שהכל תקין ויעבור להשמעת השאלה
        if (userChoice === undefined || userChoice === "") {
            console.log(`[כניסה] מאזין נכנס לשלוחה 1. שולח אישור כניסה.`);
            return res.send("knesa"); 
        }

        // 2. קוד מנחה (המנחה מקיש 9 בשלוחה 1 כדי לאפס)
        if (userChoice === "9") {
            currentQuestionId++; 
            console.log(`[מנחה] המשחק קודם לשאלה מספר: ${currentQuestionId}`);
            return res.send("niklat"); 
        }

        // 3. הגנה מפני הצבעה כפולה בשלוחה 1
        if (votedUsers.get(userPhone) === currentQuestionId) {
            console.log(`[חסום] ${userPhone} ניסה להצביע שוב בשאלה ${currentQuestionId}.`);
            return res.send("taut"); 
        }

        // 4. הצבעה מוצלחת ותקינה בשלוחה 1
        votedUsers.set(userPhone, currentQuestionId); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send("niklat"); 
    }

    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מחזיר את התגובות המדויקות ל-INI בשתי השלוחות!");
});
