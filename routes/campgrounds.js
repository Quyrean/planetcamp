// routes for campgrounds  /campgrounds

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - list all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("error: " + err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form
    var name =req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    
   Campground.create(newCampground, function(err, newlyCreated){
       if(err) {
           console.log("error: " + err);
       } else {
            //redirect back to campgrounds page
            //console.log(newlyCreated);
            res.redirect("/campgrounds");
       }
   });
});


//NEW - show form to create new
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//SHOW - has to be AFTER new, show info about one campground
router.get("/:id", function(req, res){
    //find camp w/id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

//EDIT campground - display form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.render("back");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//UPDATE campground - update DB
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //req.body.blog.body = req.sanitize(req.body.blog.body);
    var id = req.params.id;
    Campground.findByIdAndUpdate(id, req.body.campground, function(err, updatedBlog){
        if(err || !updatedBlog) {
            req.flash("error", "Unable to update comment");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+id);
        }
    });
});


//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var id = req.params.id;
    Campground.findByIdAndRemove(id, function(err){
        if(err){
            console.log("Error: " +err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;

