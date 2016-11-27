var Promise = require("bluebird");

module.exports = function(express, Post, User){
  var staticviews = express.Router()

  staticviews.get("/creator", function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('creator',{ 
      url: fullUrl,
      seo:{
        title: "Creador",
        type: "Creador",
        description: "Herramienta que te permite crear imagenes con texto personalizado",
        image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
        author: "Sapegato"
      }
    })
  })
  staticviews.get('/info/contact', function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('contact',{ 
      url: fullUrl,
      seo:{
        title: "Contacto",
        type: "Contacto",
        description: "Comunicate con nosotros",
        image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
        author: "Sapegato"
      }
    })
  })
  staticviews.get('/info/conditions', function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('conditions',{ 
      url: fullUrl,
      seo:{
        title: "Terminos y condiciones",
        type: "Condiciones",
        description: "Los terminos y condiciones aplicaciones en esta aplicacion web",
        image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
        author: "Sapegato"
      }
    })
  })
  staticviews.get('/posts/:user/:title', function (req, res) {
    var username = req.params.user;
    var title = req.params.title.replace(/-/g, ".+")
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    User.findOne({username: username},function(err, user){
      if(user){
        var p = Post.findOne({state: "accepted", author: user.id, title: new RegExp(title, "ig")}).populate("author", "name username picture id").populate("comments")
        p.exec(function(err, post){
          if(!err && post){
            console.log(post);
            var image;
            post.description = post.description || post.title

            if(post.mediaType == "Video"){
              image = "http://ohcopy.vnz.la/app/img/avatar.jpg"
            }
            else{
              image = post.files[0]
            }
            Promise.map(post.comments, function(comment){
                return Promise.all([
                Post.populate(comment, {
                    path: "author",
                    select: 'name username picture id'
                  })
                ]).then(function(wAuthor){
                    return wAuthor[0];
                })
            }).then(function(comments) {
              post.comments = comments;
              res.render('index',{ 
                post: post,
                url: fullUrl,
                seo: {
                  title: post.title,
                  type: post.category,
                  description: post.description,
                  image: image,
                  author: post.author.name
                }
              })
            })
          }
          else{
            res.render('404',{ 
              url: fullUrl,
              seo: {
                title: "Error",
                type: "content",
                description: "El contenido no fue encontrado",
                image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
                author: "Sapecat"
              }
            })            
          }
        })
      } 
      else{
        res.render('404',{ 
          url: fullUrl,
          seo: {
            title: "Error",
            type: "content",
            description: "El contenido no fue encontrado",
            image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
            author: "Sapecat"
          }
        })            
      } 
    })
  })

  staticviews.get('/:user', function (req, res) {
    var username = req.params.user;
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    User.findOne({username: username},function(err, user){
      if(user){
        var p = Post.find({state: "accepted", author: user.id}).populate("author", "name username picture id").sort("-date").limit(10)
        p.exec(function(err, posts){
          if(!err){
            res.render('profile',{ 
              posts: posts,
              url: fullUrl,
              user: user,
              seo:{
                title: username,
                type: "Perfil",
                description: "Perfil de "+user.name+" alias "+username,
                image: user.picture,
                author: user.name
              }
            })
          }
          else{
            res.render('404',{ 
              url: fullUrl,
              seo: {
                title: "Error",
                type: "content",
                description: "El contenido no fue encontrado",
                image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
                author: "Sapecat"
              }
            })            
          }
        })
      }
      else{
        res.render('404',{ 
          url: fullUrl,
          seo: {
            title: "Error",
            type: "content",
            description: "El contenido no fue encontrado",
            image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
            author: "Sapecat"
          }
        })            
      } 
    })
  })
  
  staticviews.get('/category/:category', function (req, res) {
    console.log(req.params.category)
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var p = Post.find({state: "accepted", category: req.params.category}).populate("author", "name username picture id").sort("-date").limit(10)
    p.exec(function(err, posts){
      if(!err){
        res.render('posts',{ 
          posts: posts,
          url: fullUrl,
          category: req.params.category,
          seo:{
            title: "#"+req.params.category,
            type: req.params.category,
            description: "Posts acerca de #"+req.params.category,
            image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
            author: "Sapegato"
          }
        })
      }
      else{
        res.render('404',{ 
          url: fullUrl,
          seo: {
            title: "Error",
            type: "content",
            description: "El contenido no fue encontrado",
            image: "http://ohcopy.vnz.la/app/img/avatar.jpg",
            author: "Sapecat"
          }
        })            
      } 
    })
  })

  return staticviews;
  
}