const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; 
    const userPhone = req.query.ApiPhone;

    // הגנה למקרה שהגיע קלט ריק - מחזיר לתחילת השלוחה בשקט
    if (!userChoice) {
        return res.send("go_to_folder=/1&api_index=000");
    }

    // 1. קוד מנחה - מעבר שאלה (הקשת 9)
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); // מאפס את רשימת המצביעים - כולם יכולים להצביע מחדש
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        
        // המנחה העביר שאלה -> מחזירים את כולם פיזית לקובץ 000 כדי לשמוע את השאלה החדשה ולהצביע
        return res.send("go_to_folder=/1&api_index=000");
    }

    // 2. הגנה מפני הצבעה כפולה (רמאות)
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} ניסה להצביע שוב לשאלה ${currentQuestionId} ונחסם.`);
        
        // המשתמש כבר הצביע! השרת מתעלם ומחזיר אותו להמתנה שקטה בשלוחה בלי להשמיע כלום
        return res.send("go_to_folder=/1");
    }

    // 3. קליטת הצבעה פעם ראשונה (הצלחה)
    if (userChoice) {
        votedUsers.add(userPhone); 
        console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
        
        // ההצבעה נקלטה! השרת מאשר, וימות המשיח אוטומטית יעברו לפי ה-INI לקובץ 001 (הביפ)
        // ישמיעו אותו בלי אפשרות להקיש, וייכנסו להמתנה שקטה לחלוטין בלי "לא הוקשה בחירה".
        return res.send("go_to_folder=/1");
    }

    res.send("go_to_folder=/1&api_index=000");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
