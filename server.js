const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const rawChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    if (!rawChoice) {
        return res.send("go_to_folder=/1&api_index=000");
    }

    // לוקחים רק את הספרה האחרונה שהוקשה
    const choiceArray = rawChoice.split(',');
    const userChoice = choiceArray[choiceArray.length - 1].trim(); 

    // 1. קוד מנחה - מעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // רק כשהמנחה מאפס, כולם חוזרים לשמוע את השאלה 000 מהתחלה
        return res.send("go_to_folder=/1&api_index=000");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות) - תופס מההקשה השנייה והלאה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב (הקיש: ${userChoice}) ונחסם.`);
        
        // כאן השבירה של הלולאה! אנחנו מחזירים אותו קבוע ל-002. 
        // הוא בחיים לא יחזור ל-000, אלא יישאר תקוע בלולאה שקטה בתוך 002.
        return res.send("go_to_folder=/1&api_index=002");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // פעם ראשונה שלחנו אותו ל-001 (כדי שישמע את הביפ)
        return res.send("go_to_folder=/1&api_index=001");
    }

    res.send("go_to_folder=/1&api_index=000");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
