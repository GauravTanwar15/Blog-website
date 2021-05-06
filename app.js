//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { forEach } = require("lodash");


//connecting to database
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const homeStartingContent = "A few years ago, I edited a piece written by a colleague focusing on the highlights of a major technology conference. The writer, under a seriously tight deadline, had done a bang-up job of writing great copy in virtually no time, but he failed to properly check his facts. He cited an article from Forbes in which the writer claimed Steve Jobs was using PowerPoint on stage – something that never happened. It was lazy journalism on the part of the Forbes writer, and an easy mistake to make on my colleague’s part, but the result was the same; one poorly researched article directly impacted another because both writers failed to do their due diligence.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
