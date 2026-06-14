const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // במודול get_data, המקש שהוקש מגיע תמיד בתוך req.query.ApiData
    const userChoice = req.query.ApiData;
    const userPhone = req.query.ApiPhone; // מספר הטלפון של המאזין

    if (userChoice) {
        // הדפסה לשרת (כאן בהמשך נציג את זה במסך של המנחה בזמן אמת!)
        console.log(`קליקר אונליין: הטלפון ${userPhone} הקיש את התשובה: ${userChoice}`);
    }

    // השרת אומר לימות המשיח: "הנתונים אצלי, תגידו לו תודה ותנתקו/תעבירו אותו"
    res.send("id_list=t-תשובתך נקלטה, תודה.&");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
