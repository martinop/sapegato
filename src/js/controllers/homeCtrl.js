app.controller('HomeCtrl', ['$scope', '$location', 'API', 'Utils', function ($scope, $location, API, Utils) {
	$scope.loading = false;
	API.posts("accepted").then(function(res){
		if(res.data != "error" && res.data.length > 0){
			$scope.posts = res.data;
			$scope.posts.forEach(function(post){
				post.urlPost = window.location.origin+"/posts/"+post.author.username+"/"+post.title.replace(/[-'`~!@#$%^&*()_|+=¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/ /g, "-")
			})
		} 
	})
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

	// Each time the user scrolls
	$(window).scroll(function() {
		// End of the document reached?
		if ($(document).height() - $(window).height() == $(window).scrollTop()) {
			console.log("LOADING MORE POSTS")
			if(!$scope.loading){
				$scope.morePosts();
			}
		}
	});

	$scope.morePosts = function(){
		$scope.loading = true;
		$scope.$apply();
		var endDate = $scope.posts[$scope.posts.length-1].date
		var formData = {
			startDate: moment(endDate).subtract(2,'days').endOf('day').toISOString(),
			endDate: moment(endDate).subtract(10,'minutes').toISOString(),
			limit: 10,
			sort: "-date"
		}
		API.byDate(formData).then(function(res){
			if(res.data != "error" && res.data.length > 0){
				$scope.posts = $scope.posts.concat(res.data)
			}
			$scope.loading = false;
		})
	}
}])