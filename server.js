const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9) - רק פה מאתחלים את השלוחה כדי שכולם ישמעו את 000 מחדש!
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // אומרים למערכת לעבור מחדש לשלוחה 1 כדי להשמיע את קובץ 000 לשאלה החדשה
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // לא שולחים go_to_folder! מחזירים תשובה ריקה/שקטה כדי שימות המשיח יישארו בהמתנה בלי להשמיע כלום
        return res.send("");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // משמיעים למשתמש את קובץ 001 (הביפ) כחיווי, ולא מעבירים תיקייה כדי שלא ישמע את 000 מחדש!
        return res.send("id_list=f-001");
    }

    // כניסה ראשונית של המשתמש לשלוחה בתחילת המשחק (השמעת השאלה 000)
    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
