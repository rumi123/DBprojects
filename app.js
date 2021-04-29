const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDb", { useUnifiedTopology: true, useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const userSchema = {
    name: String,
    age: Number,
    email: String,
    password: String
};

const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);

app.route("/home")
.get((req,res)=>{
    res.sendFile(__dirname+"/welcome.html")
});

app.get("/signup",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
});

app.get("/signin",(req,res)=>{
    res.sendFile(__dirname+"/signin.html")
});

app.post("/newUser",(req,res)=>{
    const user = new User(req.body);
    user.save((err)=>{
        if(!err){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
    })
});

app.post("/login",(req,res)=>{
    User.findOne(req.body,(err,userData)=>{
        if(userData){
            res.sendFile(__dirname+"/articlePage.html")
        }else{
            res.sendFile(__dirname+"/notregist.html")
        }
    })
});

app.get("/create",(req,res)=>{
    res.sendFile(__dirname+"/writeArticle.html")
});




app.route("/articles").get((req, res) => {
    Article.find((err, articledata) => {
        res.send(articledata);
    });
}).post((req, res) => {
    const article = new Article(req.body);
    article.save((err) => {
        if (err) {
            res.send("failed");
        } else {
            res.end("success");
        }
    });
})
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err){
            res.send("Action failed")
        }else{
            res.send("Deleted all articles")
        }
    })
});

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,articleFound)=>{
        if(articleFound){
            res.send(articleFound);
        }else{
            res.send("No such article");
        }
    })
})
.put((req,res)=>{
    Article.updateOne({title:req.params.articleTitle},{content:req.body.content},{overwrite: true},(err)=>{
        if(!err){
            res.send("Update succesfull")
        }else{
            res.send("Failed")
        }
    })
})
.patch((req,res)=>{
    Article.updateOne({title:req.params.articleTitle},{$set:req.body},(err)=>{
        if(err){
            res.send("Updation failed")
        }else{
            res.send(`${req.params.articleTitle} file updated succesfully`)
        }
    })
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err)=>{
        if(err){
            res.send("Delete operation failed")
        }else{
            res.send(`${req.params.articleTitle} file deleted`)
        }
    })
});




app.listen(3000, function () {
    console.log("Server started on port 3000");
});

app.get('/', (req, res) => {
    res.send("hello");
});