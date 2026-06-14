const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       
    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;   

    // ==========================================
    //  מצב א': המאזין בשלוחה 2 (בדיקה אוטומטית)
    // ==========================================
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        // אם המאזין כבר הצביע בשאלה הנוכחית, הוא ממשיך להמתין
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            // אם המנחה החליף שאלה, המאזין משוחרר חזרה לשלוחה 1
            console.log(`[שחרור] ${userPhone} מועבר חזרה לשלוחה 1`);
            return res.send("move"); 
        }
    }

    // ==========================================
    //  מצב ב': המאזין בשלוחה 1 (הצבעה במשחק)
    // ==========================================
    if (shluha === "1") {
        if (!userChoice) {
            return res.send(""); 
        }

        if (userChoice === "9") {
            currentQuestionId++; 
            console.log(`[מנחה] המשחק קודם לשאלה מספר: ${currentQuestionId}`);
            return res.send("niklat"); 
        }

        if (votedUsers.get(userPhone) === currentQuestionId) {
            console.log(`[חסום] ${userPhone} ניסה להצביע שוב.`);
            return res.send("taut"); 
        }

        votedUsers.set(userPhone, currentQuestionId); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send("niklat"); 
    }

    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת פועל ומקשיב לפנייה האוטומטית של שלוחה 2!");
});
