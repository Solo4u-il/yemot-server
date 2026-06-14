const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    const userChoice = req.query.ApiData;

    if (!userChoice) {
        // המבנה הרשמי והנקי ביותר לקליטת ספרה אחת (מינימום 1, מקסימום 1)
        res.send("read=t-מה בירת ישראל? אחת תל אביב, שתיים ירושלים.=1,1");
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
