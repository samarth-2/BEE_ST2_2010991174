const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }))
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "st2_crud"
})

// app.post('/signup', function (req, res) {
//     var username = req.body.username;
//     var password = req.body.password;
//     var name = req.body.name;
//     var contact = req.body.contact;
//     var gender = req.body.gender;
//     console.log(username);
//     console.log(gender)
//     const sqlinsert = "INSERT INTO user (username,password,name,contact,gender) values(?,?,?,?,?);"

//     const sqlinsert2 = "select id from user where username=?;";
//     db.query(sqlinsert2, [username], (error, result1) => {
//         var x = result1;
//         if(x>0){
//             res.redirect('/signup')
//             return false
//         }
//         db.query(sqlinsert, [username, password, name, contact, gender], (error, result) => {
//             console.log("success");
//             res.redirect('/login')
//         })
//     })
// })







app.post("/signup", (req, res) => {
        var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var contact = req.body.contact;
    var gender = req.body.gender;
    // check is username already exists
    db.query(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, result) => {
            if (result.length > 0) {
                res.redirect('/signup');
               
            } else {
                
                // insert into database
                sql.query(
                    `INSERT INTO user (name, password , username, gender, contact) VALUES (?, ?, ?, ?, ?)`,
                    [name, password, username, gender, contact],
                    (err, result) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.redirect("/login");
                        }
                    }
                );
            }
        }
    );
});











app.set('view-engine', 'ejs');


app.get('/', (req, res) => {
    res.render('homepage.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})


app.get('/signup', (req, res) => {
    res.render('signup.ejs');
})


app.listen(3000, (err) => {

    console.log("listening at 3000")
})