const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // פקודה שמקריאה טקסט ומחייבת את ימות המשיח לחכות להקשת מקש אחד (מקסימום ספרה אחת)
    res.send("read=t-ברוכים הבאים למערכת הקליקרים. אנא הקישו את מספר התשובה שלכם.&=max=1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
