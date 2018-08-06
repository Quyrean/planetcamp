    var mongoose = require("mongoose");
    var Campground = require("./models/campground");
    var Comment   = require("./models/comment");
     
    var data = [
        {
            name: "Cloud's Rest", 
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3TFNplzuzFV-TE7boMJNu-8btt4iBwaTpj2dB_S33cos7VjGiHQ",
            description: "Cloud City Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        },
        {
            name: "Desert Mesa", 
            image: "https://media.wired.com/photos/5909633776f462691f012e5c/master/pass/tatooine-ft.jpg",
            description: "Tatoonie Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        },
        {
            name: "Canyon Floor", 
            image: "https://i.stack.imgur.com/yvNps.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        }
    ];
     
    function seedDB(){
       //Remove all campgrounds
       Campground.remove({}, function(err){
            if(err){
                console.log("Unable to remove: " + err);
            }
            console.log("removed campgrounds!");
            // Comment.remove({}, function(err) {
            //     if(err){
            //         console.log(err);
            //     }
            //     console.log("removed comments!");
              //add a few campgrounds
                data.forEach(function(seed){
                    Campground.create(seed, function(err, campground){
                        if(err){
                            console.log("error creating campground: " + err);
                        } else {
                            console.log("added a campground");
                            //create a comment
                            Comment.create(
                                {
                                    text: "This place is great, but I wish there was internet",
                                    author: "Homer"
                                }, function(err, comment){
                                    if(err){
                                        console.log("problem adding comment " + err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Created new comment");
                                    }
                                });
                        }
                    });
                });
            // });
        }); 
        //add a few comments
    }
     
    module.exports = seedDB;