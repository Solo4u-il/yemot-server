const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // ימות המשיח שולחים את המקש שהוקש בפרמטר ApiGetInput
    const userChoice = req.query.ApiGetInput;

    if (!userChoice) {
        // פעם ראשונה שהמאזין נכנס - משמיעים לו את השאלה כטקסט רגיל
        res.send("id_list=t-מה בירת ישראל? אחת תל אביב, שתיים ירושלים.&");
    } else {
        // המאזין הקיש ספרה - השרת בודק ומחזיר תשובה
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
