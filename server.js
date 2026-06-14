const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // מעבר שלוחה אמיתי שמאתחל את הכל ומפעיל מחדש את קובץ 000 לכולם
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // משתמש שכבר הצביע: אנחנו מחזירים לו "קלט לא תקין".
        // invalid_file=f-002 אומר למערכת להשמיע קובץ שקט (002) ולהישאר בשלוחה בלי להשמיע את 000!
        return res.send("invalid_type=global&invalid_file=f-002");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // הצבעה ראשונה מושמעת בהצלחה:
        // אנחנו בכוונה אומרים למערכת "invalid_type" כדי שהיא תישאר בתוך השלוחה ולא תאתחל אותה,
        // אבל נותנים לה את invalid_file=f-001 כדי שהיא תפעיל את קובץ 001 (הביפ שלך)!
        return res.send("invalid_type=global&invalid_file=f-001");
    }

    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
