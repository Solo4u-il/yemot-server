const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // המנחה העביר שאלה -> משמיעים מחדש את קובץ השאלה 000 ומחכים לקלט
        return res.send("play_and_get_input=f-000");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר ענה! משמיעים לו את קובץ 002 (השקט) ומחכים מיד לקלט הבא בלי לשמוע את השאלה
        return res.send("play_and_get_input=f-002");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // ההצבעה נקלטה! משמיעים לו את קובץ 001 (הביפ) ומחכים מיד לקלט הבא (בשקט)
        return res.send("play_and_get_input=f-001");
    }

    // כניסה ראשונית של המשתמש לשלוחה בתחילת המשחק
    // משמיעים לו את קובץ 000 ומחכים לקלט הראשון שלו
    res.send("play_and_get_input=f-000");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
