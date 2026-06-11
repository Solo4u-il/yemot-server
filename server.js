const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    res.send("read=t-ברוכים הבאים למערכת הקליקרים אונליין&=max=1");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
