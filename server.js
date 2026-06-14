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
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // הוא כבר הצביע. אנחנו מחזירים אותו לשלוחה 1.
        // כדי שהוא לא ישמע את השאלה 000 מחדש בלולאה, אנחנו משתמשים בטריק של ה-PDF:
        // נותנים לו פקודה לעבור לשלוחה 1, ומכיוון שהדפדפן/מערכת זוכרת את ה-URL,
        // המערכת פשוט תחזיר אותו להמתנה. ליתר ביטחון, נשלח אותו ישירות ל-go_to_folder.
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // הפורמט הרשמי והיחיד שעובד במודול API לפי ה-PDF בעמוד 23:
        // קודם מגדירים את ה-id_list להשמעת הביפ (001), ואז משרשרים את ה-go_to_folder חזרה לשלוחה 1
        return res.send("id_list=f-001&go_to_folder=/1");
    }

    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
