//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose =require("mongoose");
const encrypt=require("mongoose-encryption");
const port = 3000;
 
const app = express();
 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB" , {useNewUrlParser:true});

const userSchema =new mongoose.Schema({
    email:String,
    password:String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt,{secret:process.env.SECRET ,encrtptedFields :['password']});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")
});

app.get("/register",function(req,res){
    res.render("register")
});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save()
    .then(() =>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    });
});
 
app.post("/login",(req,res)=>{
    const username =req.body.username;
    const password= req.body.password;

    User.findOne({email:username})
    .then((foundUser)=>{
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets")
            }
        }
    })
    .catch((err)=>{
        console.log(err);
    });

});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
