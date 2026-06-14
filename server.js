const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("id_list=t-החלפת שאלה.&go_to_folder=/1");
    }

    // 1. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        // מחזירים אותו לשלוחה בשקט מוחלט בלי להשמיע כלום
        return res.send("go_to_folder=/1");
    }

    // 2. קליטת הצבעה פעם ראשונה
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // כאן הקסם: השרת משמיע את קובץ 001 (הביפ) ומחזיר את המשתמש מיד לשלוחה 1 בלולאה!
        return res.send("id_list=f-001&go_to_folder=/1");
    }

    // כניסה ראשונית או איפוס
    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
