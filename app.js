//yelp camp
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");



var passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");


//var seedDB     = require("./seeds");
var User       = require("./models/user");

//requiring routes
var commentRoutes   = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    pictureRoutes   =  require("./routes/pictures");

//setup database
//mongoose.connect("mongodb://localhost/yelp_camp");

//mongodb://<dbuser>:<dbpassword>@ds127954.mlab.com:27954/yelpcamp
//mongodb://yelpcamp:yelpcamp1@ds127954.mlab.com:27954/yelpcamp
mongoose.connect("mongodb://yelpcamp:yelpcamp1@ds127954.mlab.com:27954/yelpcamp");


//seedDB();  //seed the db

//setup this app
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport/auth
app.use(require("express-session")({
    secret: "tell me where the gold is",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//calls function on every single route!  very cool
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



// setup routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/images", pictureRoutes);


// == Start server

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started");
});
