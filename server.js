const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const rawChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    if (rawChoice === undefined || rawChoice === null) {
        return res.send("go_to_folder=/1");
    }

    // הגנה לבידוד הספרה הנוכחית שהוקשה ברגע זה
    const cleanString = String(rawChoice);
    const choiceArray = cleanString.split(',');
    const userChoice = choiceArray[choiceArray.length - 1].trim(); 

    // 1. קוד מנחה - מעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות) - תופס מההקשה השנייה והלאה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב (הקיש: ${userChoice}) ונחסם.`);
        // מחזיר פקודה תקינה, ה-INI של 002 ינעל אותו שם בשקט
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice && userChoice !== "") {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send("go_to_folder=/1");
    }

    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
