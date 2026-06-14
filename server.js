const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    const userChoice = req.query.ApiData;

    if (!userChoice) {
        // המשתמש רק נכנס - נשאל אותו שאלה
        res.send("read=t-מה בירת ישראל? אחת תל אביב, שתיים ירושלים.=1,1,no,no,no,no");
    } else {
        // המשתמש הקיש תשובה - נחזיר לו הודעה בהתאם
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
