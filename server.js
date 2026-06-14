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
        
        // המנחה העביר שאלה -> המערכת מקריאה את הטקסט החי ומחכה לקלט
        return res.send("read=t-אנא הקישו את התשובה שלכם.=");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר ענה! השרת שולח פקודת המתנה שקטה לחלוטין (בלי להקריא כלום) כדי שלא ישמע את השאלה שוב
        return res.send("read=t-=");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // ההצבעה נקלטה! המערכת מקריאה טקסט קצרצר של "ביפ" או "נקלט" ומחזירה אותו מיד להמתנה שקטה לקלט הבא
        return res.send("read=t-ביפ.=");
    }

    // כניסה ראשונית של המשתמש לשלוחה בתחילת המשחק
    // השרת אומר למערכת להקריא את הטקסט ישירות ולחכות לקלט הראשון
    res.send("read=t-אנא הקישו את התשובה שלכם.=");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
