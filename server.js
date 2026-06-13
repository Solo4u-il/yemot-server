const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // פקודה יציבה לחלוטין שמקריאה טקסט ומחכה להקשה
    res.send("read=t-ברוכים הבאים למערכת הקליקרים אונליין תקישו אחת לחיוג&=max=1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
