const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       // מגיע משלוחה 2 (shluha=2)
    const userChoice = req.query.user_ans; // מגיע משלוחה 1 (הקשה)
    
    // תפיסת מספר הטלפון מכל האפשרויות של ימות המשיח כדי למנוע קריסה
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    // ========================================================
    //  מצב א': הבקשה מגיעה משלוחה 2 (נתון קבוע shluha=2)
    // ========================================================
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        // אם הטלפון כבר הצביע בשאלה הנוכחית, הוא ממשיך לחכות
        if (lastVotedQuestion === currentQuestionId) {
            console.log(`[המתנה] ${userPhone} ממתין בשלוחה 2`);
            return res.send("wait"); 
        } else {
            // אם המנחה העביר שאלה, הוא משוחרר חזרה לשלוחה 1
            console.log(`[שחרור] ${userPhone} מועבר חזרה לשלוחה 1`);
            return res.send("move"); 
        }
    }

    // ========================================================
    //  מצב ב': הבקשה מגיעה משלוחה 1 (משחק)
    // ========================================================
    
    // 1. כניסה ראשונית לשלוחה 1 (לפני הקשה)
    if (userChoice === undefined || userChoice === "") {
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
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב.`);
        return res.send("taut"); 
    }

    // 4. הצבעה מוצלחת ותקינה בשלוחה 1
    votedUsers.set(userPhone, currentQuestionId); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ועובד רק עם תבניות קבועות וזיהוי טלפון מאובטח!");
});
