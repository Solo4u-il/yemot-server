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
        
        // משתמשים ב-t-000 כי מדובר בקובץ 000.tts
        return res.send("play_and_get_input=t-000");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // אם יצרת קובץ שקט בשם 002.tts נפעיל אותו. 
        // אם אין לך קובץ 002, המערכת פשוט תשמיע שקט כברירת מחדל ותמתין לקלט
        return res.send("play_and_get_input=t-002");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // משתמשים ב-t-001 כדי להקריא את קובץ הביפ/אישור 001.tts
        return res.send("play_and_get_input=t-001");
    }

    // כניסה ראשונית של המשתמש לשלוחה בתחילת המשחק (הקראת 000.tts)
    res.send("play_and_get_input=t-000");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
