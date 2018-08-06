//serve uploaded images

var express = require("express");
var router = express.Router();
const path = require("path");


router.get("/:imageName", (req, res) => {
    var name = req.params.imageName;
    console.log("hello " + name);
    var filename = path.join(__dirname, "../public/photo-storage/" + name);
    console.log("filename:" + filename);
    res.sendFile(filename);
});

module.exports = router;
