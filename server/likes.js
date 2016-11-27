module.exports = function(express, utils, mongoose){
	var likes = express.Router()
	likes.post('/like', function (req, res) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = utils.decode(token);
        if(payload.id){
        	switch(req.body.state){
        		case "like":
					mongoose.model(req.body.type).like(req.body.id, payload.id, function(err, data) {
					   res.send(data)
					});
        		break;

        		case "dislike":
					mongoose.model(req.body.type).dislike(req.body.id, payload.id, function(err, data) {
					   res.send(data)
					});
        		break;

        		case "cancelLike":
					mongoose.model(req.body.type).cancelLike(req.body.id, payload.id, function(err, data) {
					   res.send(data)
					});
        		break;

        		case "cancelLikeDislike":
					mongoose.model(req.body.type).cancelLike(req.body.id, payload.id, function(err) {
						mongoose.model(req.body.type).dislike(req.body.id, payload.id, function(err, data) {
						   res.send(data)
						});
					});
        		break;

        		case "cancelDislike":
					mongoose.model(req.body.type).cancelDislike(req.body.id, payload.id, function(err, data) {
					   res.send(data)
					});
        		break;

        		case "cancelDislikeLike":
					mongoose.model(req.body.type).cancelDislike(req.body.id, payload.id, function(err) {
						mongoose.model(req.body.type).like(req.body.id, payload.id, function(err, data) {
						   res.send(data)
						});
					});
        		break;
        	}
        }

	});

	return likes
}