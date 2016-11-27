app.controller('ModerateCtrl', ['$scope','API', function ($scope, API) {
	API.posts("audit").then(function(res){
		if(res.data != "error"){
			$scope.posts = res.data;
		}
	})

	$scope.audit = function(condition, post, url){
		var formData = {
			audit: condition,
			id: post._id, 
		}
		if(post.mediaType != "Video"){
			formData.public_id = url.split("/")[7].split(".")[0]
		}
		API.auditPost(formData).then(function(res){
			if(res.data != "error"){
				$scope.posts.forEach(function(e, index){
					if(e._id == post._id)
						$scope.posts.splice(index, 1);
				})
			}
		})
	}
}])