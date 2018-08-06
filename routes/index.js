// ===========
// main and  AUTH ROUTES
// ============

var express = require("express");
var router = express.Router();

var passport    = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res) {
    res.render("landing");
});


// show sign up form
router.get("/register", function(req, res){
   res.render("register");
});

// callback from register form
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "I have recorded your information " + user.username);
            res.redirect("/campgrounds"); 
        });
    });
});


//login routes

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login logic
router.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});


module.exports = router;
