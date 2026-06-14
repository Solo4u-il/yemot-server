const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const rawChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    // הגנה קריטית: אם הקלט ריק או לא קיים, מחזירים תגובה תקינה ולא קורסים
    if (rawChoice === undefined || rawChoice === null) {
        return res.send("go_to_folder=/1");
    }

    // התיקון לבאג: הופכים את זה לטקסט בצורה מפורשת (String) כדי ש-split בחיים לא ייכשל!
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

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב (הקיש: ${userChoice}) ונחסם.`);
        // השרת מחזיר תגובה חוקית ותקינה - ה-INI כבר ינווט אותו ל-002 וינעל אותו שם
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice && userChoice !== "") {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send("go_to_folder=/1");
    }

    // לכל מקרה אחר שלא תהיה תגובה ריקה
    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
