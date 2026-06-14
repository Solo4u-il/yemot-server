const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // פורמט בסיסי ויציב עבור id_api - משמיע את הטקסט ומחכה שהמאזין יקיש משהו
    res.send("title=ברוכים הבאים למערכת הקליקרים אונליין. נא להקיש את התשובה שלכם.");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
