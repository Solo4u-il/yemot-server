const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const rawChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    if (!rawChoice) {
        return res.send("go_to_folder=/1");
    }

    // פירוק השרשור ולקיחת הספרה האחרונה בלבד
    const choiceArray = rawChoice.split(',');
    const userChoice = choiceArray[choiceArray.length - 1].trim(); 

    // 1. קוד מנחה - מעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // כשהמנחה מאפס, אנחנו חייבים להחזיר את כולם פיזית להתחלה של השלוחה (לאפס את ה-API)
        // הדרך לעשות זאת במודול API היא לשלוח פקודה נקייה ללא פרמטרים, או פשוט go_to_folder לשלוחה אחרת וחזרה.
        // בשלב זה פשוט נחזיר אישור, והמנחה יאפס את הסבב.
        return res.send("go_to_folder=/1");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב (הקיש: ${userChoice}) ונחסם.`);
        
        // השרת לא שומר את הנתון, ומחזיר תשובה רגילה. ה-INI כבר ייקח אותו ל-002 וינעל אותו שם!
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // שומרים את ההצבעה ומחזירים אישור. ה-INI יעביר אותו ל-001 להשמעת הביפ
        return res.send("go_to_folder=/1");
    }

    res.send("go_to_folder=/1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
