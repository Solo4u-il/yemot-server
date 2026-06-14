const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // קריאת הפרמטרים שנשלחים אוטומטית לפי ה-PDF
    const userChoice = req.query.user_ans;
    const userPhone = req.query.ApiPhone;

    // אם המשתמש הקיש ספרה (1, 2, 3...)
    if (userChoice) {
        // הדפסה מיידית ללוג של השרת - כאן זה יופיע אצלך במסך המנחה בזמן אמת!
        console.log(`[קליקר חי] טלפון: ${userPhone} | הקיש: ${userChoice}`);
    }

    // הכלל החשוב ביותר: כדי שלא יחזור לתפריט הראשי, אנחנו שולחים פקודת מעבר תיקייה חזרה לשלוחה 1.
    // זה משאיר את המאזין על הקו באותה שלוחה בדיוק ומפעיל מחדש את api_000 לקבלת ההקשה הבאה!
    res.send("go_to_folder=/1&");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
