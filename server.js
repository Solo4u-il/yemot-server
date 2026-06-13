const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // פקודה שמורה לימות המשיח להקריא טקסט ממוחשב ולהמתין להקשת מקש אחד
    res.send("read=t-ברוכים הבאים למערכת הקליקרים אונליין. נא להקיש אחת לאישור.=1,1,1,Static");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
