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

    // --- מצב 3: הגנה מפני הצבעה כפולה ---
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הנוכחית.`);
        // מחזיר אותו ישר להמתנה הארוכה (3600 שניות = שעה) עם מוזיקת ברירת המחדל
        return res.send("music_on_hold=default,3600"); 
    }

    // --- מצב 4: קליטת הצבעה מוצלחת ---
    votedUsers.add(userPhone); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    
    // הפתרון המדויק לפי ה-PDF שלך:
    // 1. משמיע את הודעת ה-"נקלט"
    // 2. מפעיל את מוזיקת ברירת המחדל (default) למשך שעה שלמה (3600 שניות) כדי שלא יתנתק ולא יברח לשום מקום!
    const responseText = "id_list_message=t-נקלט\r\nmusic_on_hold=Quiet,3600";
    return res.send(responseText); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן עם הגדרות מוזיקה תקניות לפי ה-PDF!");
});
