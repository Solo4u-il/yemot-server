const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       // המשתנה הסטטי מה-INI
    const userChoice = req.query.user_ans; // הקלט משלוחה 1 (אם יש)
    const userPhone = req.query.ApiPhone;   // טלפון המאזין

    // ==========================================
    //  מצב א': המאזין נמצא בשלוחה 2 (המתנה אוטומטית)
    // ==========================================
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        // אם המאזין כבר הצביע בשאלה הנוכחית, הוא ממשיך להמתין בשלוחה 2
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            // אם המנחה קידם את השאלה, משחררים אותו חזרה לשלוחה 1
            console.log(`[שחרור] ${userPhone} מועבר חזרה לשלוחה 1`);
            return res.send("move"); 
        }
    }

    // ==========================================
    //  מצב ב': המאזין נמצא בשלוחה 1 (שלוחת המשחק)
    // ==========================================
    if (shluha === "1") {
        
        // 1. כניסה ראשונית לשלוחה 1 (לפני שהמאזין הקיש משהו)
        // בזכות הבדיקה הזו, המערכת תאפשר לו לשמוע את קובץ השאלה 000 בנחת!
        if (userChoice === undefined || userChoice === "") {
            console.log(`[כניסה] מאזין נכנס לשלוחה 1 וממתין להקשה: ${userPhone}`);
            return res.send(""); // מחזיר תשובה ריקה כדי שה-INI ימשיך להשמעה וקליטה
        }

        // 2. קוד מנחה (המנחה מקיש 9 בשלוחה 1 כדי לאפס)
        if (userChoice === "9") {
            currentQuestionId++; 
            console.log(`[מנחה] המשחק קודם לשאלה מספר: ${currentQuestionId}`);
            return res.send("niklat"); 
        }

        // 3. הגנה מפני הצבעה כפולה בשלוחה 1
        if (votedUsers.get(userPhone) === currentQuestionId) {
            console.log(`[חסום] ${userPhone} ניסה להצביע שוב בשאלה ${currentQuestionId}.`);
            return res.send("taut"); 
        }

        // 4. הצבעה מוצלחת ותקינה בשלוחה 1
        votedUsers.set(userPhone, currentQuestionId); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        return res.send("niklat"); 
    }

    // הגנה כללית למקרה חירום
    res.send("");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מתוקן ומפריד בהצלחה בין כניסה ראשונית בשלוחה 1 לבדיקה בשלוחה 2!");
});
