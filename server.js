const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // ימות המשיח שולחים את התשובה בפרמטר שהגדרנו ב-ext.ini
    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone; // מספר הטלפון מגיע אוטומטית כברירת מחדל

    if (userChoice) {
        // הדפסה חלקה בזמן אמת לשרת (עבור מסך המנחה שלך!)
        console.log(`[קליקר אונליין] הטלפון: ${userPhone} | בחר בתשובה: ${userChoice}`);
    }

    // בסיום, השרת אומר למערכת להשמיע הודעה קצרה ולנתק (hangup) כדי שלא יחזור לתפריט הראשי
    res.send("id_list=t-תשובתך נקלטה, תודה.&תחזיר=hangup");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
