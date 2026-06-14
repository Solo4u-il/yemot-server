const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // ימות המשיח שולחים את התשובה של ה-read בפרמטר בשם ApiData
    const userChoice = req.query.ApiData;
    const userPhone = req.query.ApiPhone;

    if (!userChoice) {
        // פעם ראשונה: משמיעים את השאלה.
        // הסבר על הפרמטרים בסוף: =1(מינימום),1(מקסימום),7(שניות המתנה),no(בלי אישור סולמית)
        res.send("read=t-נא להקיש את מספר התשובה שלכם.=1,1,7,no");
    } else {
        // המשתמש הקיש ספרה והיא הגיעה לשרת!
        console.log(`קליקר: הטלפון ${userPhone} הקיש ${userChoice}`);

        // הכלל החשוב: משמיעים הודעה קצרה ומנתקים (hangup) כדי שלא יחזור לתפריט הראשי
        res.send("id_list=t-תשובתך נקלטה בהצלחה.&תחזיר=hangup");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
