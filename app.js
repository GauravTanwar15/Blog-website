//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { forEach } = require("lodash");


//connecting to database
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const homeStartingContent = "A few years ago, I edited a piece written by a colleague focusing on the highlights of a major technology conference. The writer, under a seriously tight deadline, had done a bang-up job of writing great copy in virtually no time, but he failed to properly check his facts. He cited an article from Forbes in which the writer claimed Steve Jobs was using PowerPoint on stage – something that never happened. It was lazy journalism on the part of the Forbes writer, and an easy mistake to make on my colleague’s part, but the result was the same; one poorly researched article directly impacted another because both writers failed to do their due diligence.";
const aboutContent = "A few years ago, I edited a piece written by a colleague focusing on the highlights of a major technology conference. The writer, under a seriously tight deadline, had done a bang-up job of writing great copy in virtually no time, but he failed to properly check his facts. He cited an article from Forbes in which the writer claimed Steve Jobs was using PowerPoint on stage – something that never happened. It was lazy journalism on the part of the Forbes writer, and an easy mistake to make on my colleague’s part, but the result was the same; one poorly researched article directly impacted another because both writers failed to do their due diligence.";
const contactContent = "A few years ago, I edited a piece written by a colleague focusing on the highlights of a major technology conference. The writer, under a seriously tight deadline, had done a bang-up job of writing great copy in virtually no time, but he failed to properly check his facts. He cited an article from Forbes in which the writer claimed Steve Jobs was using PowerPoint on stage – something that never happened. It was lazy journalism on the part of the Forbes writer, and an easy mistake to make on my colleague’s part, but the result was the same; one poorly researched article directly impacted another because both writers failed to do their due diligence.";

const app = express();

//Database Schema
const postSchema = {

  title: String,
  content: String
 
 };

 //Model for Database
 const Post = mongoose.model("Post", postSchema);



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//using Lodash utility
const _ = require('lodash');

//home page
app.get("/", function(req, res){

  Post.find({}, function(err, posts){ 
  res.render("home", {
    homePageContent: homeStartingContent,
    posts: posts
    });
   });
});

//about us page

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//contact us page
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//compose page
app.get("/compose", function(req, res){
  res.render("compose");
});

//post request and storing in javascript object

app.post("/compose", function(req, res){
   const post = new Post({
     title: req.body.postTitle,
     content: req.body.postBody
   });

   post.save(function(err){
    if(!err){
    res.redirect("/");
    }
   });

   
});


//end of Database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//routing parameters

app.get("/posts/:postId", function(req, res){
  
  const requestedPostId = req.params.postId;

Post.findOne({_id: requestedPostId}, function(err, post){
    
        res.render("post", {
        title:post.title,
        content:post.content
      });
    });
  
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
