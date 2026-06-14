const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    // חובה להגדיר טקסט נקי כדי שימות המשיח יקראו את ה-go_to_folder
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); // מאפסים את רשימת העונים
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // המנחה עבר שאלה, אז אנחנו מחזירים את כולם לשלוחה 1. 
        // מכיוון שהמנחה איפס את השרת, השרת ידע לקבל מהם הצבעות חדשות.
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // משתמש שכבר ענה - אנחנו פשוט מחזירים אותו לשלוחה 1 (go_to_folder=/1)
        // ימות המשיח יחזירו אותו לשלוחה, ומכיוון שהוא כבר ענה על api_000, הוא פשוט ימתין שם בשקט מוחלט!
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // קודם כל משמיעים את קובץ 001 (הביפ) ורק אז משרשרים את ה-go_to_folder באותה שורה בדיוק!
        // זה המבנה התקני של ימות המשיח: קודם כל לבצע השמעה, ומיד אחר כך לאן לעבור.
        return res.send("id_list=f-001&go_to_folder=/1");
    }

    // כניסה ראשונית של המשתמש לשלוחה בתחילת המשחק
    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
