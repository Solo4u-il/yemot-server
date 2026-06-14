const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; // קלט משתמש
    const userPhone = req.query.ApiPhone;   // טלפון המאזין

    // --- מצב א': פנייה ללא הקשה (בדיקת סטטוס המתנה בשלוחה 2 או כניסה ראשונית לשלוחה 1) ---
    if (userChoice === undefined || userChoice === "") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        // אם המאזין כבר הצביע בשאלה הנוכחית, הוא צריך להמשיך להמתין בשלוחה 2
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            // אם הוא עדיין לא הצביע בשאלה הנוכחית (כי המנחה קידם את השאלה), משחררים אותו לשלוחה 1!
            return res.send("move"); 
        }
    }

    // --- מצב ב': קוד מנחה (המנחה מקיש 9 בשלוחה 1) ---
    if (userChoice === "9") {
        currentQuestionId++; // מעלים את מספר השאלה (למשל משאלה 1 לשאלה 2)
        console.log(`[מנחה] השאלה קודמה לשאלה מספר: ${currentQuestionId}`);
        return res.send("niklat"); // המנחה ישמע נקלט ויעבור לשלוחה 2
    }

    // --- מצב ג': הגנה מפני הצבעה כפולה בשלוחה 1 ---
    if (votedUsers.get(userPhone) === currentQuestionId) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הזו.`);
        return res.send("taut"); 
    }

    // --- מצב ד': קליטת הצבעה מוצלחת ותקינה בשלוחה 1 ---
    votedUsers.set(userPhone, currentQuestionId); // שומרים שהטלפון הזה הצביע לשאלה הנוכחית
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ומוכן לעבוד עם שלוחת המתנה יציבה!");
});
