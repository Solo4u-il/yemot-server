const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    const userChoice = req.query.ApiData;

    if (!userChoice) {
        // שימוש בפורמט הרשמי והיציב ביותר לקליטת ספרה אחת
        res.send("read=t-מה בירת ישראל? אחת תל אביב, שתיים ירושלים.&max=1&min=1&sec_wait=7");
    } else {
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
