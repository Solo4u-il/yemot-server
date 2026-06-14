const express = require('express');
const app = express();

let currentQuestionId = 1; 
let votedUsers = new Set(); 

app.get('/clicker', (req, res) => {
    // הגדרת הכותרת כדי שימות המשיח יבינו את הטקסט בעברית
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const userChoice = req.query.user_ans; // הקלט של המשתמש (מגיע רק אחרי הקשה)
    const userPhone = req.query.ApiPhone;   // מספר הטלפון של המאזין

    // --- מצב 1: כניסה ראשונית לשלוחה (לפני הקשה) ---
    // כשהמאזין רק נכנס, אנחנו רוצים שהוא ישמע את השאלה שבקובץ 000. 
    // לכן נחזיר תגובה ריקה, שגורמת למערכת להמשיך להגדרות ה-INI הרגילות (להשמיע ולקלוט).
    if (!userChoice) {
        console.log(`[כניסה] מאזין נכנס לשלוחה. טלפון: ${userPhone}. מאפשרים לו לשמוע את השאלה ולהקיש.`);
        return res.send(""); 
    }

    // --- מצב 2: קוד מנחה (איפוס משחק בהקשת 9) ---
    if (userChoice === "9") {
        currentQuestionId++; 
        votedUsers.clear(); 
        console.log(`[מנחה] המנחה עבר לשאלה מספר: ${currentQuestionId}! הרשימה אופסה.`);
        return res.send("go_to_folder=/1");
    }

    // --- מצב 3: הגנה מפני הצבעה כפולה ---
    // אם הוא כבר הצביע, נשגר אותו ישירות למוזיקת המתנה כדי שלא יקבל הודעת שגיאה
    if (votedUsers.has(userPhone)) {
        console.log(`[חסום] ${userPhone} כבר הצביע בשאלה הנוכחית.`);
        return res.send("music_on_hold=yes"); 
    }

    // --- מצב 4: קליטת הצבעה מוצלחת (הצבעה ראשונה) ---
    votedUsers.add(userPhone); 
    console.log(`[הצבעה נקלטה] שאלה ${currentQuestionId} | טלפון: ${userPhone} | תשובה: ${userChoice}`);
    
    // הפתרון מה-PDF: מחזירים פקודה משולבת שמחולקת בתו אנטר (\n)
    // המערכת קודם כל תשמיע את ה-"נקלט" (id_list_message) ומיד בסיום תפעיל מוזיקת המתנה (music_on_hold)
    // כך המאזין תקוע בשלוחה בצורה יציבה ובלי שום שגיאות!
    return res.send("id_list_message=t-נקלט\nmusic_on_hold=yes"); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("השרת מעודכן ומגיב פקודות ישירות למערכת!");
});
