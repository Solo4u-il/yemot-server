const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone; 

    // 1. קוד מנחה - המנחה מקיש 9 בשלוחה 1 כדי לאפס את המשחק לשאלה הבאה
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); // מוחק את כל מי שהצביע - כולם מורשים להצביע מחדש בשאלה החדשה
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (אם מישהו מנסה לרמות או לחזור לשלוחה 1)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הנוכחית. מועבר חזרה להמתנה.`);
        return res.send("go_to_folder=/2");
    }

    // 3. קליטת הצבעה רגילה (פעם ראשונה - הצלחה!)
    if (userChoice) {
        votedUsers.add(userPhone); // נועלים את המשתמש שלא יוכל להצביע שוב בשאלה הזו
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send(""); // מחזיר תגובה ריקה ומאושרת. ה-INI יזרוק אותו מיד לשלוחה 2
    }

    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת פועל ומסונכרן באופן מושלם עם ימות המשיח!");
});
