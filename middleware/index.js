//all middleware goes here

var Campground = require("../models/campground");
var Comment    = require("../models/comment");


var middlewareObj = {};


//check if campground exists, user is logged in, and is submitter of campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //is user logged in?
    if(!req.isAuthenticated()) {
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("back");
    }
    
    //we are logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        //could not find anything
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("/campgrounds");
            
        //not the owner    
        } else if(!foundCampground.author.id.equals(req.user._id) ) {
            req.flash("error", "That does not belong to you, get your grimy paws off of it.");
            return res.redirect("back");
        }

        //return the campground we found
        req.campground = foundCampground;
        next();
    });
};


//check if campground exists, user is logged in, and is submitter of campground
middlewareObj.checkCampgroundOwnershipOrig = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
                
            } else {
                //do they own it?
                if(foundCampground.author.id.equals(req.user._id) ) {
                    next();
                } else {
                    req.flash("error", "That does not belong to you, get your grimy paws off of it.");
                    res.redirect("back");
                }
            }
        });
        
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                //do they own it?
                if(foundComment.author.id.equals(req.user._id) ) {
                    next();
                } else {
                    req.flash("error", "That comment not belong to you, get your grimy paws off of it.");
                    res.redirect("back");
                }
            }
        });
        
    } else {
        req.flash("error", "You must login to do that.");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
};


module.exports = middlewareObj;
