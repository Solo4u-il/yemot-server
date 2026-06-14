const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    // הגדרת השרת לשליחת טקסט נקי בלבד, כדי שימות המשיח יקראו את הפקודות פיקס
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // 1. קוד בדיקה למעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // מעבירים אקטיבית לשלוחה 1 כדי לאתחל אותה ולשמוע את 000 מחדש
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (נחסם)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר ענה. אנחנו לא משמיעים לו כלום, אבל אומרים למערכת:
        // "תמשיכי לחכות לקלט של ספרה אחת (1-1) באותו מקום בשקט"
        return res.send("read=&&type=digits&max=1&min=1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // הפורמט המדויק מה-PDF למודול API:
        // read=f-001= אומר: תשמיע את קובץ 001 (הביפ)
        // type=digits&max=1&min=1 אומר: ותמשיך להמתין לקלט הבא של ספרה אחת בלי לצאת מהשלוחה!
        return res.send("read=f-001=&type=digits&max=1&min=1");
    }

    // כניסה ראשונית לשלוחה
    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
