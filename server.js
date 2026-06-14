const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    // הגדרת השרת לשליחת טקסט נקי בלבד
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9) - רק כאן אנחנו מאתחלים אקטיבית את השלוחה
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // כאן אנחנו משתמשים ב-go_to_folder כדי לאלץ את המערכת להשמיע את 000 מחדש
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // במקום לשלוח go_to_folder, אנחנו מחזירים פקודת audio ריקה! 
        // המערכת מבינה שזו תשובה חוקית, לא משמיעה כלום ונשארת להמתין בשקט בשלוחה.
        return res.send("audio=");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // בדיוק מה שרצית: משמיעים את קובץ 001 ונשארים בשלוחה בלי לצאת ממנה!
        return res.send("audio=f-001");
    }

    // כניסה ראשונית לשלוחה
    res.send("audio=");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
