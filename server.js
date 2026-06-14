const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const rawChoice = req.query.user_ans; // יכול להגיע כ-"1" או כ-"1,2" או כ-"1,2,2"
    const userPhone = req.query.ApiPhone;

    // הגנה למקרה שאין קלט בכלל
    if (!rawChoice) {
        return res.send("go_to_folder=/1&api_index=000");
    }

    // הפתרון: לוקחים רק את הספרה האחרונה שהוקשה ברצף!
    const choiceArray = rawChoice.split(',');
    const userChoice = choiceArray[choiceArray.length - 1].trim(); 

    // 1. קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // מאתחלים לחלוטין את השלוחה כדי להתחיל רצף חדש לגמרי בשאלה החדשה
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב (הקיש: ${userChoice}) לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר הצביע בעבר. אנחנו מחזירים אותו ל-002 (השקט) כדי שלא ישמע את השאלה מחדש
        return res.send("go_to_folder=/1&api_index=002");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); // שומרים את הנייד שלו כדי לחסום אותו בפעם הבאה
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // הצבעה ראשונה נקלטה בהצלחה! שולחים אותו ל-001 (שישמע ביפ) וימשיך ברצף לקלט הבא
        return res.send("go_to_folder=/1&api_index=001");
    }

    res.send("go_to_folder=/1&api_index=000");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
