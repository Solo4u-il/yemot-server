const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // ימות המשיח שולחים את מה שהמשתמש הקיש בתוך req.query.ApiData
    const userChoice = req.query.ApiData;

    // אם המשתמש עדיין לא הקיש כלום (זו הפעם הראשונה שהוא נכנס לשלוחה)
    if (!userChoice) {
        // נשאל אותו שאלה
        res.send("read=t-ברוכים הבאים לקליקר. מה בירת ישראל? אחת תל אביב, שתיים ירושלים.=1,1,no,no,no,no");
    } else {
        // אם הוא הקיש ספרה, נבדוק מה היא
        if (userChoice === "2") {
            // תשובה נכונה!
            res.send("id_list=t-כל הכבוד! ירושלים היא התשובה הנכונה! תודה שהשתתפתם.&");
        } else {
            // תשובה שגויה
            res.send("id_list=t-טעות. תל אביב היא לא בירת ישראל. תודה שהשתתפתם.&");
        }
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
