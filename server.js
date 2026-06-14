const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // הפורמט הכי בסיסי של פקודת read בלי סיבוכים
    // הגדרות: מינימום 1 ספרה, מקסימום 1 ספרה, ללא השמעת מספרים שהוקשו, ללא מעבר שלוחה
    res.send("read=t-ברוכים הבאים למערכת הקליקרים אונליין נא להקיש את התשובה שלכם=1,1,no,no,no,no");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
