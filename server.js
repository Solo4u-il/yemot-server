const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // זה הפורמט הרשמי והמחייב של ימות המשיח להקראת טקסט ב-API
    res.send("id_list=t-ברוכים הבאים למערכת הקליקרים אונליין.&");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
