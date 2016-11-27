app.controller('PostsCtrl', ['$scope', 'API', 'Utils', function ($scope, API, Utils) {
	$scope.setContent = function(content){
		$scope.content = content;
		$scope.content.forEach(function(post){
			post.urlPost = window.location.origin+"/posts/"+post.author.username+"/"+post.title.replace(/[-'`~!@#$%^&*()_|+=¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/ /g, "-")
		})
	}
	$scope.setUser = function(user){
		$scope.user = user;
	}
	$scope.vote = function(state, post){
		var formData = {
			state: state,
			id: post._id,
			type: "Post"
		}
		formData.state = Utils.evalState(state, post, $scope.user)
		API.vote(formData).then(function(res){
			switch(formData.state){
				case "like":
					post.likers.push($scope.user._id);
					post.likes += 1;
				break; 

				case "dislike":
					post.dislikers.push($scope.user._id);
					post.dislikes += 1;
				break;

				case "cancelLike":
					post.likers.splice(post.likers.indexOf($scope.user._id));
					post.likes -= 1;
				break;

				case "cancelDislike":
					post.dislikers.splice(post.dislikers.indexOf($scope.user._id));
					post.dislikes -= 1;
				break;

				case "cancelLikeDislike":
					post.likers.splice(post.likers.indexOf($scope.user._id));
					post.dislikers.push($scope.user._id);
					post.likes -= 1;
					post.dislikes += 1;
				break;

				case "cancelDislikeLike":
					post.dislikers.splice(post.dislikers.indexOf($scope.user._id));
					post.likers.push($scope.user._id);
					post.dislikes -= 1;
					post.likes += 1;
				break;
			}
		})
	}
}]);