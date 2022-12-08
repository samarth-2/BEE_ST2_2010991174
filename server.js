const express=require('express');
const app=express();
const dotenv=require("dotenv");
const mysql=require("mysql");
const bodyParser=require('body-parser');
const cors=require('cors');
const fs = require('fs');





app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config();

const db_host=process.env.HOST;
const db_user=process.env.USER;
const db_pass=process.env.PASSWORD;
const db_database=process.env.DATABASE;

const db=mysql.createPool({
    host:db_host,
    user:db_user,
    password:db_pass,
    database:db_database,
});
// // 404 page

// app.use(function(req, res, next){
//     res.status(404);
//     res.type('txt').send('Not found');
// });




// event all api


app.post("/signup-form",(req,res)=>{  
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var contact = req.body.contact.toString();
        var gender  = req.body.gender;
        var loggedIn = 1;
        const getEach="select id from user where username=?";
        const PostEach="INSERT INTO user (username,password,name,contact,gender,log) values(?,?,?,?,?,?);";
        db.query(getEach,[username],(err,result)=>{
            if(result.length==0)
            {
                db.query(PostEach,[username,password,name,contact,gender,0],(err,result)=>{
                    console.log(result)
                    res.redirect('/login');
                })
            }
            else
            {
                err_msg = "This user already exists.";
                return res.render('signup.ejs', { err_msg: err_msg } );
            }
        })
})



app.post("/login-form",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;

    const getEach="select id from user where username=? and password=?;"
    db.query(getEach,[username,password],(err,result)=>{
        if(result.length==0)
        {
            res.redirect("/login")
        }
        else
        {
            const post="update user set log=? where username=?;"
            db.query(post,[1,username],(err,result)=>{
                res.render('homepage.ejs',{check:false,logout:true});
            })
            
        }
    })
})





app.post("/logout-form", (req, res) => {
    const checkLogin="update user set log=? where log=?"
    db.query(checkLogin,[0,1],(err,result)=>{
        res.render('homepage.ejs',{check:true,logout:false});
    })
})

app.get("/admin-get", (req, res) => {
    const checkLogin="select * from user;"
    db.query(checkLogin,(err,result)=>{
        res.render('admin.ejs',{result:result});
    })
})





app.set('view-engine', 'ejs');


app.get('/', (req, res) => {

    const checkLogin="select * from user where log=?;"
    db.query(checkLogin,[1],(err,result)=>{
        console.log(result)
        if(result.length==0)
        {
            res.render('homepage.ejs',{check:true,logout:false});
        }
        else
        {
            res.render('homepage.ejs',{check:false,logout:true});
        }
    })
    
})

app.get('/login', (req, res) => {
    const checkLogin="select * from user where log=?;"
    db.query(checkLogin,[1],(err,result)=>{
        if(result.length==0)
        {
            res.render('login.ejs');
        }
        else
        {
            res.render('homepage.ejs');
        }
    })

    
})


app.get('/signup', (req, res) => {
    const checkLogin="select * from user where log=?;"
    db.query(checkLogin,[1],(err,result)=>{
        if(result.length==0)
        {
            res.render('signup.ejs');
        }
        else
        {
            res.render('homepage.ejs');
        }
    })
})



app.get('/profile-get', (req, res) => {
    const checkLogin="select * from user where log=?;"
    db.query(checkLogin,[1],(err,result)=>{
        res.render('profile.ejs',{result:result});
    })
})


app.post('/change-pass-form', (req, res) => {
    
    var oldpass=req.body.oldpass;
    var newpass=req.body.newpass;
    var conpass=req.body.conpass;
    const checkLogin="select * from user where log=?;"
    db.query(checkLogin,[1],(err,result)=>{
        if(oldpass===result[0].password )
        {
            if(newpass===conpass)
            {
                const updatePass="update user set password=? where log=?;";
                db.query(updatePass,[newpass,1],(err,result)=>{
                    res.render('homepage.ejs',{result:result,check:false,logout:true});
                })
            }
            else
            {
                var err_msg="Password not correctly filled!!";
                res.render('profile.ejs',{err_msg:err_msg,result:result});
            }
        }
        else
        {
            var err_msg=" old Password did not match!!";
            res.render('profile.ejs',{err_msg:err_msg,result:result});
        }
    })
})





app.get('/profile', (req, res) => {
    res.render('profile.ejs');
})

app.get('/admin', (req, res) => {
    res.render('admin.ejs');
})

app.get('/homepage', (req, res) => {
    res.render('homepage.ejs');
})


app.listen(3000, (err) => {

    console.log("listening at 3000")
})