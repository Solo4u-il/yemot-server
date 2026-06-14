const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // קבלת ההקשה של המשתמש מהפרמטרים שימות המשיח שולחים
    const userChoice = req.query.ApiData;

    if (!userChoice) {
        // אם אין בחירה, נשמיע את השאלה
        res.send("read=t-מה בירת ישראל? אחת תל אביב, שתיים ירושלים.=1,1");
    } else {
        // אם יש בחירה, נבדוק אותה
        if (userChoice === "2") {
            res.send("id_list=t-כל הכבוד! ירושלים היא התשובה הנכונה!&");
        } else {
            res.send("id_list=t-טעות. תל אביב היא לא בירת ישראל.&");
        }
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
