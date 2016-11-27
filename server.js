var express 	=     require("express"),
  app 		    =     express(),
	bodyParser 	= 	  require("body-parser"),
	qs			    =	    require("qs"),	
	request  	  =	    require("request"),	
	mongoose	  =	    require("mongoose"),
	User		    = 	  require("./server/models/User"),
	Post 		    =	    require("./server/models/Post"),
  Comment     =     require("./server/models/Comment"),
	config		  = 	  require("./server/config"),
	utils 		  = 	  require('./server/utils')(config, request, User);

var upload = require("./server/upload")(express)
var authTwitter = require('./server/auth/twitter')(express, utils, request, qs, config)
var authFacebook = require('./server/auth/facebook')(express, utils, request, qs, config)
var authGoogle = require('./server/auth/google')(express, utils, request, qs, config)
var profile = require('./server/auth/profile')(express, utils, User)
var post = require("./server/post")(express, utils, Post)
var likes = require("./server/likes")(express, utils, mongoose)
var comments = require("./server/comments")(express, utils, Post, Comment)
var staticviews = require("./server/staticviews")(express, Post, User)

app.listen(14028);
console.log("ONLINE");

app.set('views', __dirname + '/dist/views')
app.set('view engine', 'jade')

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(staticviews);
app.use('/api', post, likes, upload, comments);
app.use('/api/auth', authTwitter, authFacebook, authGoogle, profile);


mongoose.connect('mongodb://martinop:26471049m@ds161475.mlab.com:61475/ohcopy');
mongoose.connection.on('error', function(err) {
  console.log(err);
});


