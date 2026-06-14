const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone; 

    // 1. קוד מנחה - המנחה מקיש 9 בשלוחה 1 כדי לאפס את המשחק לשאלה הבאה
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); // מוחק את כל מי שהצביע - כולם מורשים להצביע מחדש
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        // המנחה נשאר בשלוחה 1 כדי לנהל את השאלה הבאה
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הנוכחית. נחסם.`);
        // כאן השרת יכול להחזיר באופן מפורש מעבר לשלוחה 2 ליתר ביטחון
        return res.send("go_to_folder=/2");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה!)
    if (userChoice) {
        votedUsers.add(userPhone); // נועלים את המשתמש לשאלה הזו
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // השרת מחזיר תגובה ריקה ותקינה לחלוטין (סטטוס 200 OK). 
        // ימות המשיח מבינים שהשרת קיבל את המידע, ומיד קופצים ל-api_001 ב-INI שעושה את המעבר בפועל.
        return res.send(""); 
    }

    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת פועל ומחכה לאישור הנתונים משלוחה 1!");
});
