const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    if (!userChoice) {
        return res.send("go_to_folder=/1&api_index=000");
    }

    // 1. קוד מנחה - מעבר שאלה (הקשת 9) -> מאפס את הרשימה ומחזיר את כולם ל-000
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1&api_index=000");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר הצביע. שולחים אותו ל-api_index=001 (הביפ) כהשמעה בלבד, 
        // ומאחר וזה מוגדר כ-play ב-INI, הוא לא יכול להקיש שם כלום והרמאות נעצרת.
        return res.send("go_to_folder=/1&api_index=001");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // הצבעה מוצלחת! שולחים אותו לשמוע את קובץ הביפ 001.
        return res.send("go_to_folder=/1&api_index=001");
    }

    res.send("go_to_folder=/1&api_index=000");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
