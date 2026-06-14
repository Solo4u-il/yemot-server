const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // תיקון לפי עמוד 23: מחזירים פקודת מעבר תיקייה ישירות לשלוחה 1
        return res.send("id_list=t-החלפת שאלה.&תחזיר=go_to_folder&API_go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר הצביע. מחזירים אותו לשלוחה 1 בשקט מוחלט בלי להשמיע כלום
        return res.send("תחזיר=go_to_folder&API_go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // תיקון לפי עמוד 23: משמיעים את קובץ 001 (הביפ) ומעבירים חזרה לשלוחה 1
        return res.send("id_list=f-001&תחזיר=go_to_folder&API_go_to_folder=/1");
    }

    // כניסה ראשונית לשלוחה
    res.send("תחזיר=go_to_folder&API_go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
