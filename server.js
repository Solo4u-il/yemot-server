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

    // --- מצב 3: הקשה נוספת / רמאות (כבר הצביע בשאלה הזו) ---
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב בשאלה מספר ${currentQuestionId}.`);
        return res.send("taut"); // מחזיר taut לקובץ ה-INI
    }

    // --- מצב 4: קליטת הצבעה מוצלחת (פעם ראשונה) ---
    votedUsers.add(userPhone); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); // מחזיר niklat לקובץ ה-INI
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ומחזיר רק סטטוסים פשוטים ל-INI!");
});
