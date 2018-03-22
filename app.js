var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"), //get data out of the form
    mongoose            = require("mongoose"),
    expressSanitizer    = require("express-sanitizer"),//user can post using html tags but won't be able to run alert() or other script
    Post                = require("./models/post");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());


//INDEX - show all posts
app.get("/", function(req, res) {
    res.redirect("posts");
});

app.get("/posts", function(req, res) {
    Post.find({}, function(err, posts) {
        if(err) {
            console.log("error");
        } else {
            res.render("index", {posts: posts});
        }
    })
})
// NEW ROUTE
app.get("/posts/new", function(req, res) {
    res.render("new");
})
//CREATE ROUTE
app.post("/posts", function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body); //we are sanitizing everything that is entered into write a post box
    //which in our case is under post[body] in our new.ejs file
    
    Post.create(req.body.post, function(err, newPost) {
        if(err) {
            console.log(err + "ERROR WHEN SUBMITTING NEW POST");
            res.render("new");
        } else {
            res.redirect("/posts");
        }
    })
})

//SHOW ROUTE
app.get("/posts/:id", function(req, res) {
    //res.send("show page!");
    Post.findById(req.params.id, function(err, foundId) {
        if(err) {
            console.log("COULD NOT FIND POST'S ID " + err);
            res.redirect("/posts");
        } else {
            res.render("show", {post: foundId});
        }
    })
})

/* FOR TESTING IF DB WORKS
Post.create({
    title: "my first post",
    body: "hello there, this is my first post inside body",
    image: "https://source.unsplash.com/cPF2nlWcMY4"
    
})
*/

//mongodb://kasiarosenberg:Fks!120108@ds153752.mlab.com:53752/codingkasia_blog
//mongoose.connect("mongodb://localhost/codingkasia_blog");
var url = process.env.DATABASEURL || "mongodb://localhost/codingkasia_blog";
mongoose.connect(url);
//mongoose.connect("mongodb://kasiarosenberg:Fks!120108@ds153752.mlab.com:53752/codingkasia_blog");


//start a server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The CodingKasia Server Has Started!");
});