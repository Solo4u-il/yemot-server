const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // הפקודה הרשמית לקבלת נתונים:
    // t- הטקסט להקראה
    // 1 ספרה מינימום, 1 ספרה מקסימום, מקסימום שני ניסיונות, לעבור לשלוחה הבאה כשמסיים
    res.send("read=t-ברוכים הבאים למערכת הקליקרים. נא להקיש את מספר התשובה שלכם.=1,1,2,GoTo===\n");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
