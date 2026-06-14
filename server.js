const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // קליטת ההקשה - תמיכה בכל צורות השליחה של ימות המשיח
    const userChoice = req.query.ApiData || req.query.Selection_1;

    if (!userChoice) {
        // פעם ראשונה בשלוחה: משמיעים ועוצרים להקשה ללא אישור סולמית
        res.send("read=t-מה בירת ישראל? אחת תל אביב, שתיים ירושלים.=1,1,7,no");
    } else {
        // המשתמש הקיש - בודקים את התשובה
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
