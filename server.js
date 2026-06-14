const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;   

    // --- מצב 1: כניסה ראשונית לשלוחה (לפני הקשה) ---
    if (!userChoice) {
        console.log(`[כניסה] מאזין נכנס לשלוחה: ${userPhone}`);
        return res.send(""); 
    }

    // --- מצב 2: קוד מנחה (איפוס משחק בהקשת 9) ---
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1");
    }

    // --- מצב 3: הקשה נוספת (הצבעה כפולה / חסום) ---
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב. נשלחה הודעת שגיאה.`);
        // משמיע "הקשה לא תקפה" (או הודעת טקסט שהמערכת מקריאה) ומעביר אותו לשלוחה 2 (המתנה)
        return res.send("id_list_message=t-הקשה_לא_תקפה\r\ngo_to_folder=/2"); 
    }

    // --- מצב 4: הקשה ראשונה (הצבעה מוצלחת!) ---
    votedUsers.add(userPhone); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    
    // משמיע "נקלט" ומעביר אותו מיד לשלוחה 2 (המתנה)
    return res.send("id_list_message=t-נקלט\r\ngo_to_folder=/2"); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן עם פיצול הודעות ומעבר לשלוחת המתנה!");
});
