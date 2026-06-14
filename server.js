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
        votedUsers.clear(); // מוחק את רשימת המצביעים - כולם יכולים להצביע מחדש בשאלה הבאה
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הנוכחית. מועבר חזרה לשלוחה 2.`);
        return res.send("go_to_folder=/2");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); // נועלים את המשתמש לשאלה הזו
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send(""); // תגובה ריקה ומאושרת, ה-INI מעביר אותו מיד לשלוחה 2
    }

    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת פועל ומסונכרן עם שלוחת המשחק ושלוחת ההשמעה!");
});
