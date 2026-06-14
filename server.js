const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // נשמור באיזו שאלה כל מספר טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; // מגיע משלוחה 1 (הקשה)
    const userPhone = req.query.ApiPhone;   // מספר הטלפון של המאזין

    // --- א. פנייה משלוחה 2 (בדיקת סטטוס המתנה) ---
    // אם הבקשה מגיעה ללא user_ans, סימן שהמאזין נמצא בשלוחה 2 ומחכה לעבור שאלה
    if (userChoice === undefined || userChoice === "") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        // אם המאזין כבר הצביע בשאלה הנוכחית, הוא חייב להמשיך לחכות בשלוחה 2
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); // ה-INI של שלוחה 2 ישמיע לו מוזיקה ל-5 שניות ויבדוק שוב
        } else {
            // אם מספר השאלה הנוכחי גבוה יותר ממה שהוא הצביע, סימן שהמנחה איפס את המשחק!
            console.log(`[שחרור] ${userPhone} מועבר חזרה לשלוחה 1 לשאלה החדשה מספר ${currentQuestionId}`);
            return res.send("move"); // ה-INI של שלוחה 2 יעביר אותו מיד לשלוחה 1
        }
    }

    // --- ב. קוד מנחה (המנחה מקיש 9 בשלוחה 1) ---
    if (userChoice === "9") {
        currentQuestionId++; // עוברים רשמית לשאלה הבאה!
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! כולם ישוחררו בשניות הקרובות.`);
        // המנחה עצמו מושמע הודעת מעבר ונשאר בשלוחה 1
        return res.send("niklat"); 
    }

    // --- ג. הגנה מפני הצבעה כפולה בשלוחה 1 ---
    if (votedUsers.get(userPhone) === currentQuestionId) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב בשאלה ${currentQuestionId}.`);
        return res.send("taut"); // ה-INI של שלוחה 1 יגיד לו הקשה שגויה ויעביר לשלוחה 2
    }

    // --- ד. קליטת הצבעה מוצלחת בשלוחה 1 ---
    votedUsers.set(userPhone, currentQuestionId); // רושמים שהטלפון הזה הצביע בשאלה הנוכחית
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); // ה-INI של שלוחה 1 יגיד לו נקלט ויעביר לשלוחה 2
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מנהל את מערכת הקליקרים האוטומטית בהצלחה!");
});
