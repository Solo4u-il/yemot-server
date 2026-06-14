const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // ימות המשיח שולחים את מספר הטלפון וההקשה של המאזין
    const userChoice = req.query.ApiData;
    const userPhone = req.query.ApiPhone;

    if (!userChoice) {
        // כניסה ראשונה: משמיעים את השאלה ומחכים לספרה אחת (1,1) ללא צורך בסולמית (no)
        res.send("read=t-נא להקיש את מספר התשובה שלכם.=1,1,7,no");
    } else {
        // המאזין הקיש! הנתון נתפס בשרת בשביל מסך המנחה שלך
        console.log(`[קליקר אונליין] הטלפון: ${userPhone} | הקיש תשובה: ${userChoice}`);

        // כדי שלא יחזור לתפריט הראשי, אנחנו שולחים פקודת סיום שקטה שמשאירה אותו בשלוחה או מנתקת
        res.send("id_list=t-תשובתך נקלטה.&תחזיר=hangup");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
