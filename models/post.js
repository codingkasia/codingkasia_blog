var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    body: String,
    created: {
        type: Date, 
        default: Date.now},
    image: String
})

module.exports = mongoose.model("Post", postSchema);
