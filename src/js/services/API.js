app.factory('API', ['$http', '$q',function ($http, $q) {
	var user, services = [];
	var init = $q.defer();
    var service = {
    	defer: init,
    	promise: init.promise,
	    getProfile: function(){
	    	return $http.get('/api/auth/profile');
	    },
	    addPost: function(data){
	    	return $http.post("/api/post", data)
	    },
	    posts: function(state){
	    	return $http.get("/api/posts", {params:{state: state}});
	    },
	    vote: function(data){
	    	return $http.post("/api/like",data)
	    },
	    updateProfile: function(data){
	    	return $http.post("/api/auth/profile", data)
	    },
	    auditPost: function(data){
	    	return $http.post("/api/audit", data);
	    },
	    byDate: function(data){
	    	return $http.get("/api/postsbydate", {params: data})
	    },
	    byDateUsers: function(data){
	    	return $http.get("/api/usersbydate", {params: data})
	    },
	    comment: function(data) {
	    	return $http.post("/api/comment", data)
	    }
	}
	return service;
}]);
