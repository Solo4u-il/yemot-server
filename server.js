const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    // חובה להחזיר כותרת של טקסט פשוט כדי שימות המשיח יבינו את התשובה
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone; 

    // 1. קוד מנחה - המנחה מקיש 9 בשלוחה 1 כדי לאפס את המשחק לשאלה הבאה
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); // מוחק את כל מי שהצביע
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        // מחזיר פקודה למערכת להחזיר את המנחה לשלוחה 1 (להקראת השאלה הבאה)
        return res.send("play_and_return=go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (אם מישהו מנסה לחזור ידנית לשלוחה 1)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הנוכחית.`);
        // מחזיר פקודה למערכת לשלוח אותו מיד לשלוחה 2
        return res.send("play_and_return=go_to_folder=/2");
    }

    // 3. קליטת הצבעה רגילה (פעם ראשונה - הצלחה!)
    if (userChoice) {
        votedUsers.add(userPhone); // נועלים את המשתמש שלא יוכל להצביע שוב
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        // השרת רושם את ההצבעה ומפקד על המערכת לעבור מייד לשלוחה 2 (הביפ וההמתנה)
        return res.send("play_and_return=go_to_folder=/2");
    }

    // אם הגיעה פנייה ריקה ללא הקשה
    return res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ומחזיר פקודות ניתוב ישירות למרכזיה!");
});
