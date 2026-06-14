const express = require('express');
const app = express();

// משתנים לשליטת המשחק (בשלב הבא המנחה ישנה את זה מהמסך שלו)
let currentQuestionId = 1; // מספר השאלה הנוכחית במשחק
let votedUsers = new Set(); // רשימת מספרי הטלפון שכבר ענו בשאלה הזו

app.get('/clicker', (req, res) => {
    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // הגדרה זמנית: אם מישהו מקיש 9 שריין את זה כאילו המנחה עבר שאלה (לצורך בדיקה בטלפון)
    if (userChoice === "9") {
        currentQuestionId++; // עוברים שאלה
        votedUsers.clear(); // מאפסים את רשימת העונים
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("id_list=t-החלפת שאלה.&go_to_folder=/1");
    }

    // 1. הגנה מפני הצבעה כפולה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // נחזיר אותו לשלוחה, אבל בלי להפעיל מחדש את api_000 כדי שלא ישמע את השאלה שוב
        // שולחים הודעה שקטה או פשוט מעבירים תיקייה
        return res.send("go_to_folder=/1");
    }

    // 2. קליטת הצבעה תקנית (פעם ראשונה בשאלה הזו)
    if (userChoice) {
        votedUsers.add(userPhone); // מסמנים שהטלפון הזה כבר ענה בשאלה הזו
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);

        // המשתמש שומע את הביפ מהטלפון + אנחנו מחזירים לו חיווי קולי קצר ומחזירים אותו ללולאה
        // הוא יחזור לשלוחה במצב המתנה שקט עד שהמנחה יחליף שאלה
        return res.send("id_list=t-נקלט.&go_to_folder=/1");
    }

    // כניסה ראשונית לשלוחה (או כשהמנחה מחליף שאלה ומפעיל מחדש)
    // המערכת מריצה את השלוחה מחדש ומשמיעה את קובץ 000 ("אנא הקישו...")
    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
