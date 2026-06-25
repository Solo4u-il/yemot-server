# SorotzClick - העלאה ל-GitHub ו-Render

## קבצים שצריך להעלות ל-GitHub

העלה את כל הקבצים שבתיקייה הראשית, חוץ ממה שמופיע ב-.gitignore.

חובה שיהיו בריפו:

- `server.js`
- `admin.html`
- `index.html`
- `package.json`
- `package-lock.json`
- כל קבצי התמונות, הווידאו והסאונד שנמצאים בתיקייה הראשית

לא להעלות:

- `node_modules`
- `archive-old-files`
- `.agents`
- `.codex`

## הגדרות Render

צור Web Service חדש שמחובר לריפו ב-GitHub.

ההגדרות:

- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: לפי מה שבחרת, גם Free מספיק לבדיקה

לא צריך להגדיר PORT ידנית. Render נותן אותו לבד, והשרת כבר משתמש בו דרך `process.env.PORT`.

## כתובות אחרי העלאה

נניח ש-Render נתן כתובת:

```text
https://your-app-name.onrender.com
```

אז אלה הכתובות:

```text
https://your-app-name.onrender.com/admin.html
https://your-app-name.onrender.com/index.html
https://your-app-name.onrender.com/health
https://your-app-name.onrender.com/clicker
```

## בדיקה ראשונה אחרי העלאה

1. פתח את `/health`.
2. ודא שמופיע משהו כמו:

```json
{"ok":true,"questionCount":3,"currentQuestionId":1}
```

3. פתח את `/admin.html`.
4. בשדה כתובת השרת בראש הדשבורד הכנס את כתובת Render בלי סלאש בסוף.
5. לחץ שמירת משחק בשרת.
6. פתח את `/index.html`.
7. לחץ בדשבורד על הפעל שאלה / הצג נושא במקרן.

## בדיקת ימות המשיח ידנית

בדפדפן אפשר לבדוק הצבעה כך:

```text
https://your-app-name.onrender.com/clicker?ApiPhone=0500000000&user_ans=1
```

אם הכל תקין, התשובה תהיה:

```text
niklat
```

בדיקת שלוחת המתנה:

```text
https://your-app-name.onrender.com/clicker?ApiPhone=0500000000&shluha=2
```

התשובה תהיה `move` אם המשתמש עוד לא הצביע בשאלה הנוכחית, או `wait` אם הוא כבר הצביע או אם מוצג נושא.

## חיבור ליְמות המשיח

כתובת ה-API שצריך לתת לשלוחה היא:

```text
https://your-app-name.onrender.com/clicker
```

הפרמטרים שהשרת קורא:

- `ApiPhone` או `api_phone` - מספר הטלפון של המשתתף
- `user_ans` - הבחירה של המשתתף
- `shluha=2` - מצב המתנה/בדיקה האם להעביר להצבעה

מקש `9` כרגע משמש להעברת המנחה לפריט הבא בסדר היום.
