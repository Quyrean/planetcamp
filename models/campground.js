var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    author: {
      id : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Comment"
        }
    ]
});

//create collection - the name is the plural of Cat
module.exports = mongoose.model("Campground", campgroundSchema);
