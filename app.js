var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/info_app", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// no need for .ejs-endings
app.set("view engine", "ejs");

// Schema setup

var newsSchema = new mongoose.Schema({
   overskrift: String,
   undertitle: String,
   foto: String
});

var News = mongoose.model("News", newsSchema);

// News.create({
//         overskrift: "Årets første studenter",
//         undertitle: "Søren og Bent er skolens første studenter",
//         foto: "https://c1.staticflickr.com/5/4233/34556819534_b55e590d88_k.jpg"
//     }, function(err, cat){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("NEW NEWS");
//         console.log(cat);
//     }
//     });

app.get("/", function(req, res) {
    // Get all news from DB
    News.find({}, function(err, allNews){
        if(err){
            console.log(err);
        } else {
            res.render("index", {allNews:allNews});
        }
    });
});

app.get("/admin", function(req, res) {
    // Get all news from DB
    News.find({}, function(err, allNews){
        if(err){
            console.log(err);
        } else {
            res.render("adminindex", {allNews:allNews});
        }
    });
});

//NEW - show form to create new campground
app.get("/new", function(req, res){
   res.render("new"); 
});

app.post("/", function(req, res) {
    var overskrift = req.body.overskrift;
    var undertitle = req.body.undertitle;
    var foto = req.body.foto;
    var newNews = {overskrift:  overskrift, undertitle: undertitle, foto: foto}
    
    News.create(newNews, function(err, newlyNews){
    if(err){
        console.log(err);
    } else {
        res.redirect("/admin");
    }
    });
   
});

//SHOW
app.get("/:id", function(req, res) {
    News.findById(req.params.id, function(err, foundNews){
        if(err) {
            res.redirect("/admin");
        } else {
            res.render("news", {news: foundNews});
        }
    })
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});

//EDIT
//app.get("/:id/edit", function(req, res) {
//    res.render("edit");
//})