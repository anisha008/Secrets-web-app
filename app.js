const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/userDB");


const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("home");
});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const user=mongoose.model("model",userSchema);


app.get("/home",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/submit",function(req,res){
    res.render("submit");
});

app.get("/logout",function(req,res){
    res.render("home");
})

app.post("/login",function(req,res){
    const useremail=req.body.username;
    const pass=req.body.password;
    async function find(){
        const usercred=await user.findOne({email:useremail});
        if(usercred){
            if(usercred.password===pass){
                res.render("secrets");
            }
            else{
                console.log("password incorrect");
                res.render("home");
            }
        }
        else{
            console.log("not found");
            res.render("home");
        }
    }
    find();
})


app.post("/register",function(req,res){
    const newUser=new user({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save().then(
        function(){
            res.render("secrets");
        }
    ).catch(
        function(err){
            console.log(err);
        }
    )
})

app.post("/submit",function(req,res){
    const usersecret=req.body.secret;

})

app.listen(3000,function(){
    console.log("server started running");
});
