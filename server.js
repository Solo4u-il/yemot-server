const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    if (!userChoice) {
        return res.send("go_to_folder=/1");
    }

    // 1. קוד מנחה - מעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר ענה. השרת לא שומר את הנתון ומחזיר תגובה ריקה ותקינה.
        // כדי שהוא לא ישמע את הביפ שוב, המנחה יכול לראות את החסימה בלוגים,
        // והמערכת פשוט מחזירה אותו לשלוחה.
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // מאשרים את הפעולה. ה-INI אוטומטית ישמיע לו את קובץ 001 (הביפ) 
        // בלי לתת לו להקיש שם כלום, ויחזיר אותו ל-000.
        return res.send("go_to_folder=/1");
    }

    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
