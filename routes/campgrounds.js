// routes for campgrounds  /campgrounds

var express = require("express");
var router = express.Router();
const multer = require('multer');

var Campground = require("../models/campground");
var middleware = require("../middleware");


//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

        //specify destination
        destination: function(req, file, next){
            next(null, './public/photo-storage');
        },

        //specify the filename to be unique
        filename: function(req, file, next){
            console.log(file);
            //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
            const ext = file.mimetype.split('/')[1];
            //set the file fieldname to a unique name containing the original name, current datetime and the extension.
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
    }),

    // filter out and prevent non-image files.
    fileFilter: function(req, file, next){
        if(!file){
            next();
        }

        // only permit image mimetypes
        const image = file.mimetype.startsWith('image/');
        if(image){
            console.log('photo uploaded');
            next(null, true);
        }else{
            console.log("file not supported");
            req.flash("error", "That is not a photo");
            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};



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
router.post("/", middleware.isLoggedIn, multer(multerConfig).single('photo'), function(req, res){
    //get data from form
//    var name  = req.body.name;
//    var image = req.body.image;
//    var price = req.body.price;
//    var desc  = req.body.description;
    
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    req.body.campground.author = author;
    if(req.file) {
		req.body.campground.picturePath = req.file.filename;
	} else {
		console.log("do something? no filename");
	}
    // var newCampground = {name: name, price: price, image: image,
    //     description: desc, author: author,
    //     picturePath: req.file.filename
    // };

   Campground.create(req.body.campground, function(err, newlyCreated){
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
router.put("/:id", middleware.checkCampgroundOwnership, multer(multerConfig).single('photo'), function(req, res){
    //req.body.blog.body = req.sanitize(req.body.blog.body);
    if(req.file) {
		console.log("file:" + req.filename);
		req.body.campground.picturePath = req.file.filename;    
	} else { 
		console.log("NOOOOOOO file"); 
	}

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
