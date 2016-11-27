var cloudinary  =     require("cloudinary"),
  multiparty  =     require("connect-multiparty"),
  fs          =     require("fs"),
  Promise     =     require("bluebird");

var multipartyMiddleware = multiparty()
cloudinary.config({ 
  cloud_name: 'ddbjdk5wf', 
  api_key: '299766331155867', 
  api_secret: 'ueH8dOmpdQLidccCPdTTtiWxE7g' 
});

module.exports = function(express){
  	var upload = express.Router()
	upload.post("/upload", multipartyMiddleware, function(req, res){
	  Promise.map(req.files.file, function(file){
	    return Promise.all([
	      cloudinary.uploader.upload(file.path) 
	    ]).then(function(image){
	        fs.unlink(file.path)
	        return image[0].url;
	    });
	  }).then(function(urls){
	    res.send(urls)
	  }).catch(function(error){
	    console.log(error);
	  });
	})
	return upload;
}

