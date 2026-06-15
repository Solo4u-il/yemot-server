const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       // מגיע אם הגדרנו משתנה סטטי
    const userChoice = req.query.user_ans; // הקלט של המשתמש/מנחה משלוחה 1
    
    // תפיסת מספר הטלפון מכל האפשרויות של ימות המשיח למניעת קריסות
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    // ========================================================
    //  מצב א': הבקשה מגיעה משלוחה 1 (משחק)
    // ========================================================
    
    // 1. כניסה ראשונית לשלוחה 1 (המאזין רק נכנס, עדיין לא הקיש כלום)
    if (userChoice === undefined || userChoice === "") {
        console.log(`[כניסה] מאזין נכנס לשלוחה 1 וממתין להקשה.`);
        return res.send(""); // מחרוזת ריקה כדי שימות המשיח ימשיכו לקליטת המקשים בנחת
    }

    // 2. קוד מנחה (המנחה מקיש 9 בשלוחה 1 כדי לאפס ולעבור שאלה)
    if (userChoice === "9") {
        currentQuestionId++; 
        console.log(`[מנחה] המשחק קודם לשאלה מספר: ${currentQuestionId}. משחרר את חדר ההמתנה!`);
        
        // השרת מחזיר "niklat" ל-INI של המנחה, ומיד שולח פקודה לימות המשיח לרוקן את התור clicker_game
        // כל 40 האנשים שנמצאים בשלוחה 2 יעברו באותו שבריר שנייה חזרה לשלוחה 1!
        return res.send("niklat\r\napi_queue_release=clicker_game"); 
    }

    // 3. הגנה מפני הצבעה כפולה בשלוחה 1
    if (votedUsers.get(userPhone) === currentQuestionId) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה ${currentQuestionId}.`);
        return res.send("taut"); // מפעיל את api_answer_taut ב-INI שלך
    }

    // 4. הצבעה מוצלחת ותקינה בשלוחה 1
    votedUsers.set(userPhone, currentQuestionId); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); // מפעיל את api_answer_niklat ב-INI שלך
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת המלא באוויר ומנהל את חדר ההמתנה המהיר!");
});
