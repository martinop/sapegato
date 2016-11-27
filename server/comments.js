module.exports = function(express, utils, Post, Comment){
	var comments = express.Router()
	comments.post('/comment', function (req, res) {
 		var comment = new Comment();
 		comment.author = req.body.author;
 		comment.text = req.body.text;
        comment.save(function(err){
            if(!err){
            	Post.findOne({_id: req.body.idPost}, function(err, post) {
            		if(!err && post){
            			post.comments.push(comment.id)
            			post.save(function(err){
            				if(!err){
            					res.send(comment)	
            				}
            				else{
            					res.send("Hubo un error con tu peticion, intenta mas tarde");
            				}
            			})
            		}
            		else{
            			res.send("Hubo un error con tu peticion, intenta mas tarde");
            		}
            	})
                
            }
            else{
                res.send("Hubo un error con tu peticion, intenta mas tarde");
            }
        })
	});

	return comments
}