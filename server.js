const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Map(); // שומר באיזו שאלה כל טלפון הצביע

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const shluha = req.query.shluha;       // מגיע משלוחה 2 (shluha=2)
    const userChoice = req.query.user_ans; // מגיע משלוחה 1 אחרי שהמשתמש מקיש
    const userPhone = req.query.ApiPhone || req.query.api_phone || "unknown";   

    // ========================================================
    //  מצב א': הבקשה מגיעה משלוחה 2 (בדיקת סטטוס קבועה כל 2 שניות)
    // ========================================================
    if (shluha === "2") {
        const lastVotedQuestion = votedUsers.get(userPhone);

        // אם המאזין כבר הצביע בשאלה הנוכחית, שימשיך לחכות (יקבל wait)
        if (lastVotedQuestion === currentQuestionId) {
            return res.send("wait"); 
        } else {
            // אם המנחה לחץ 9 וקידם את השאלה, המאזין משוחרר מייד! (יקבל move)
            console.log(`[שחרור מהיר] ${userPhone} מועבר חזרה לשלוחה 1`);
            return res.send("move"); 
        }
    }

    // ========================================================
    //  מצב ב': הבקשה מגיעה משלוחה 1 (משחק)
    // ========================================================
    
    // 1. כניסה ראשונית לשלוחה 1 (לפני שהמשתמש הקיש משהו)
    if (userChoice === undefined || userChoice === "") {
        return res.send(""); 
    }

    // 2. קוד מנחה (המנחה מקיש 9 בשלוחה 1 כדי לאפס ולעבור שאלה)
    if (userChoice === "9") {
        currentQuestionId++; 
        console.log(`[מנחה] המשחק קודם לשאלה מספר: ${currentQuestionId}`);
        return res.send("niklat"); 
    }

    // 3. הגנה מפני הצבעה כפולה בשלוחה 1
    if (votedUsers.get(userPhone) === currentQuestionId) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה ${currentQuestionId}.`);
        return res.send("taut"); 
    }

    // 4. הצבעה מוצלחת ותקינה בשלוחה 1
    votedUsers.set(userPhone, currentQuestionId); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    return res.send("niklat"); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת החינמי והמהיר באוויר!");
});
