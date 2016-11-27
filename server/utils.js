var jwt = require('jwt-simple');
var moment = require('moment');
var Promise = require('bluebird');

module.exports = function(config, request, User){
	var module = {}
	module.ensureAuthenticated = function(req, res, next) {
	    if (!req.headers.authorization) {
	        return res.send({data:'Sin Autorizacion'});
	    }
	    var token = req.headers.authorization.split(' ')[1];

	    var payload = null;
	    try {
	        payload = jwt.decode(token, config.SECRET_TOKEN);
	    } catch (err) {
	        return res.send({data: "Error"});
	    }

	    if (payload.exp <= moment().unix()) {
	        return res.send({data: "Sesion Expirada"});
	    }
	    req.user = payload;
	    next();
	}

	module.getLocation = function(req, res, next){
	    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	    var location = null;
	    request({url: 'http://ip-api.com/json/' + ip}, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            req.country = JSON.parse(response.body).country
	            next();  
	        }
	    });
	}

	module.createJWT = function(user) {
	    var payload = {
	        id: user.id,
	        iat: moment().unix(),
	        exp: moment().add(14, 'days').unix(),
	        permission: user.permission,
	        username: user.username
	    };
	    return jwt.encode(payload, config.SECRET_TOKEN);
	}

	module.decode = function(token){
		return jwt.decode(token, config.SECRET_TOKEN)
	}

	module.noHeader = function(user, socialmedia){
		return new Promise(function(resolve, reject){
			var social = {}
			social[socialmedia] = user[socialmedia];
			User.findOne(social, function(err, existingUser) {
	            if (existingUser) {
	            	resolve({
	            		user: existingUser,
	            		token: module.createJWT(existingUser)
	            	})
	            }
	            else{
  					var nuser = new User();
            		nuser[socialmedia] = user[socialmedia];
            		nuser.name = user.name;
            		nuser.picture = user.picture;
            		nuser.permission = "user"
            		if(user.email){
            			nuser.email = user.email;
            		}
            		nuser.save(function(err, user){
            			if(!err){
            				user.firstTime = true;
	            			resolve({
	            				user: user,
	            				token: module.createJWT(user)
	            			})
            			}
            			else{
            				resolve(err);
            			}
            		})
	            }
	        });
		})
	}

	/*module.haveHeader = function(header, user){
		return new Promise(function(resolve, reject){
		    var token = header.split(' ')[1];
		    var payload = module.decode(token);
		    User.findOne({id: user.id}, function(err, existingUser){
		    	if(existingUser)
		    })
		    if (payload.id_social == user.id_social) {
		        queryString = 'SELECT permission, name, avatar, id_social, url_cv, url_portfolio, email, area, specialities from users \
		        WHERE id_social = ?';
		        values = [payload.id_social];
		        conexion.query(queryString, values).then(function (data) {
		        	payload.permission = data[0].permission;
	                data.length > 0 ? resolve({
	                    user: data[0],
	                    token: module.createJWT(payload),
	                    location: country
	                }) : resolve("No existe");

		        }).catch(function (error) {
		            reject(error);
		        })
		    } else {
		        resolve("Bad token");
		    }

		})
	}
*/
	return module;

}