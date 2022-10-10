require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/usersDB",{
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
}); 

userSchema.plugin(encrypt, {secret: process.env.SECRET, excludeFromEncryption: ['email']}); 

const User = new mongoose.model('User', userSchema); 

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(err => {
        if(!err){
            res.render('secrets');
        } else{
            res.send(err);
            console.log(err);
        }
    });
}); 

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    User.findOne(
        {email: req.body.username},
        function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    if(foundUser.password === req.body.password){
                        res.render("secrets");
                    }
                }
            }
        }
    );
}); 

app.listen(3000, () => {
    console.log("Server started running on port 3000");
})