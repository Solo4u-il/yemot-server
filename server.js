const express = require('express');
const app = express();

app.get('/clicker', (req, res) => {
    // ימות המשיח שולחים את הספרה שהמשתמש הקיש בפרמטר ApiGetInput
    const userChoice = req.query.ApiGetInput;
    // מספר הטלפון של המאזין (כדי שתדע מי ענה מה)
    const userPhone = req.query.ApiPhone; 

    if (!userChoice) {
        // פעם ראשונה שהמאזין נכנס - השרת רק אומר למערכת להשמיע את השאלה
        res.send("id_list=t-נא להקיש את מספר התשובה שלכם.&");
    } else {
        // המאזין הקיש ספרה! 
        // כאן (במקום ה-console.log) אתה תכניס בהמשך את הקוד שמציג למנחה במסך
        console.log(`המאזין עם הטלפון ${userPhone} הקיש את התשובה: ${userChoice}`);

        // מחזירים פקודה שאומרת לימות המשיח להשמיע "תשובתך נקלטה" ולנתק או להמתין
        res.send("id_list=t-תשובתך נקלטה בהצלחה.&");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});
