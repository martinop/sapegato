var cloudinary  =     require("cloudinary"),
  multiparty  =     require("connect-multiparty"),
  fs          =     require("fs"),
  Promise     =     require("bluebird");

var multipartyMiddleware = multiparty({maxFieldsSize: 2000000000})
cloudinary.config({ 
  cloud_name: 'ddbjdk5wf', 
  api_key: '299766331155867', 
  api_secret: 'ueH8dOmpdQLidccCPdTTtiWxE7g' 
});

module.exports = function(express, utils, Post){
	var post = express.Router()
	post.post('/post', multipartyMiddleware, function (req, res) {
        if(req.headers.authorization){
            var token = req.headers.authorization.split(' ')[1];
            var payload = utils.decode(token);
            if(payload.id){
                var post = new Post();
                post.title = req.body.post.title;
                Post.find({title: new RegExp(post.title, "ig")}, function(err, posts) {
                    if(!err){
                        if(posts.length > 0 ){
                            post.title = post.title + " #"+(posts.length+1);   
                        }
                        post.urlTitle = post.title.replace(/[-'`~!@#$%^&*()_|+=¿?;:'",.<>\{\}\[\]\\\/]/gi, '')
                        post.description = req.body.post.description;
                        post.source = req.body.post.source;
                        post.category = req.body.post.category;
                        post.mediaType = req.body.post.mediaType;
                        if(req.body.post.tags){
                            post.tags = req.body.post.tags.trim().split(",");   
                        }
                        post.author = payload.id;
                        if(req.files){
                            switch(req.body.post.mediaType){
                                case "Imagen":
                                    cloudinary.uploader.upload(req.files.file.path).then(function(image){
                                        post.files = [image.url]
                                        fs.unlink(req.files.file.path)
                                        post.save(function(err, post){
                                            if(!err){
                                                res.send("Tu post ha sido enviado y se encuentra en revision")
                                            }
                                            else{
                                                res.send("Hubo un error con tu peticion, intenta mas tarde");
                                            }
                                        })
                                    })
                                break;
                                case "GIF":
                                    Promise.map(req.files.file, function(file){
                                        return Promise.all([
                                            cloudinary.uploader.upload(file.path)
                                        ]).then(function(image){
                                            fs.unlink(file.path)
                                            return image[0].url;
                                        })
                                    }).then(function(images) {
                                        post.files = images
                                        post.save(function(err, post){
                                            if(!err){
                                                res.send("Tu post ha sido enviado y se encuentra en revision")
                                            }
                                            else{
                                                res.send("Hubo un error con tu peticion, intenta mas tarde");
                                            }
                                        })      
                                    })
                                break;
                            }  
                        }
                        else{
                            post.files = req.body.post.files
                            post.save(function(err, post){
                                if(!err){
                                    res.send("Tu post ha sido enviado y se encuentra en revision")
                                }
                                else{
                                    res.send("Hubo un error con tu peticion, intenta mas tarde");
                                }
                            })
                        }
                    }
                    else{
                        res.send("error")
                    }
                })
            }
        }
        else{
            res.send("error")
        }
	});
    post.post('/audit', function(req, res){
        if(req.headers.authorization){
            var token = req.headers.authorization.split(' ')[1];
            var payload = utils.decode(token);
            if(payload.permission != "user"){
                if(!req.body.audit){
                    Post.remove({_id: req.body.id}, function(err, data){
                        if(!err){
                            if(req.body.public_id){
                                cloudinary.uploader.destroy(req.body.public_id, function(result) { 
                                    res.send(result)
                                });
                            }
                            else{
                                res.send("Ok, Post rechazado")
                            }
                        }
                        else{
                            res.send(err)
                        }
                    })
                }
                else{
                    Post.update({_id: req.body.id}, {$set: { state: "accepted", date: Date.now()}}, function(err, data){
                        if(!err){
                            res.send(data)
                        }
                        else{
                            res.send(err);
                        }
                    })
                }
            }
            else{
                res.send("error");
            }
        }
        else{
            res.send("error")
        }


    })
    post.get("/posts", function (req, res){
        var state;
        if(req.headers.authorization){
            var token = req.headers.authorization.split(' ')[1];
            var payload = utils.decode(token);
            if(req.query.state == "audit" && payload.permission != "user"){
                state = "audit"
            }
            else{
                state = "accepted"
            }
        }
        else{
            state = "accepted"
        }
        var p = Post.find({state: state}).populate("author", "name username picture id").sort('-date').limit(10)
        p.exec(function(err, posts){
            if(!err){
                res.send(posts)
            }
        })
    


    })
    post.get("/postsbydate",function (req, res){
        var p = Post.find({state: "accepted", date: {$gte: req.query.startDate, $lte: req.query.endDate}}).populate("author", "name username picture id").limit(parseInt(req.query.limit)).sort(req.query.sort)
        p.exec(function(err, posts){
            if(!err){
                res.send(posts);
            }
        })
    })
    post.get("/usersbydate",function (req, res){
        Post.aggregate([{
            $match: {
              date: {$gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate)}
            }
          },{
            $group: {
              _id: '$author',
              points: { $sum: '$likes'}
            }
          },{
            $limit: parseInt(req.query.limit)
          },{
            $sort: {"points": -1}
          }], function(err, users){
            if(!err){
                Post.populate(users, {
                  path: "_id",
                  model: "User",
                  select: "username picture name"
                }, function(err, data){
                    if(!err){
                        var tosend = data.filter(function(e){
                            return e.points > 0
                        })
                        res.send(tosend)
                    }
                    else{
                        res.send("error")
                    }
                })
            }
            else{
                res.send(err)
            }
          }
        );
    })

	return post
}