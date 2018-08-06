// ===================
// ROUTES for COMMENTS  /campgrounds/:id/comments
// ===================

var express = require("express");
var router = express.Router({mergeParams: true}); //keep :<var> from router
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

//NEW - show form to create new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log("error: " + err);
        } else {
            //console.log(foundCampground);
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//CREATE - add comment to db
router.post("/", middleware.isLoggedIn, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campground) {
        if(err){
            console.log("Cant find campground " +err);
            res.redirect("/campgrounds", {campground: campground});
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add usernamd and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    
                    //add and save comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT comment - display form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    var campId = req.params.id;
    var commId = req.params.comment_id;
    Campground.findById(campId, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(commId, function(err, foundcomment){
            if(err || !foundcomment) {
                req.flash("error", "Comment not found");
                return res.redirect("back");
            }
            res.render("comments/edit", {comment: foundcomment, campground_id: campId});
        });
    });
});


//UPDATE comment - update DB
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    var id = req.params.id;
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedBlog){
        if(err){
            console.log("Error: " +err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + id);
        }
    });
});


//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    var id = req.params.id;
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log("Error: " +err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + id);
        }
    });
});


module.exports = router;
