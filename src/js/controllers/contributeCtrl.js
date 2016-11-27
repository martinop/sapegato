app.controller('ContributeCtrl', ['$scope', '$location', 'API', 'Utils', 'Upload',function ($scope, $location, API, Utils, Upload) {
	$scope.post = {files: []};
	$scope.addUrl = function(){
		if($scope.url && $scope.url.trim() != ""){
			switch($scope.post.mediaType){
				case "Imagen":
					Utils.isImage($scope.url).then(function(exist) {
						if(exist){
							$scope.post.files.push($scope.url)
						}
						else{
							$.notify({
								icon: "fa fa-times fa-4x pull-left",
								title: "Error",
								message: "URL erronea"
							},{
							icon_type: "class",
							type: "minimalist true",
							delay: 0, 
							template:  
								"<div data-notify=\'container\' class=\'col-xs-11 col-sm-3 alert alert-{0}\' role=\'alert\'> " +
								"<button type=\'button\' aria-hidden=\'true\' class=\'close\' data-notify=\'dismiss\'><i class=\'fa fa-times\' aria-hidden=\'true\'></i></button>"+
								"<span data-notify=\icon\></span>"+
								"<span data-notify=\'title\'>{1}</span>"+
								"<span data-notify=\'message\'>{2}</span>"+
								"</div>"
							});
						}
						$scope.url = "";
					});	
				break;

				case "GIF":
					$scope.post.files.push($scope.url)
					$scope.post.category = "GIF"
					$scope.url = "";

				break;

				case "Video":
					$scope.url = $scope.url.replace("watch?v=", "embed/").replace(/&.*/g,"")
					$scope.post.files.push($scope.url)
					$scope.post.category = "Video"
					$scope.url = "";
				break;
			}
		} 
	}
	$scope.processFiles = function (files) {
    	if(files && files.length) {
    		files.forEach(function (e, index) {
    	 		var reader = new FileReader();
	    		reader.onload = function(file) {
	    			if($scope.post.mediaType == "GIF"){
	    				$scope.post.category = "GIF"
	    			}
	    			$scope.post.files.push(file.target.result)
	    			$scope.$apply();
	    		} 
    			reader.readAsDataURL(e)
    		})               
      	}
    }
	$scope.addPost = function(){
		if($scope.post.title && $scope.post.category && $scope.post.files.length > 0){
			switch($scope.post.mediaType){
				case "Imagen":
					html2canvas(document.getElementById("images"), {
			            useCORS: true,
			            onrendered: function (canvas) {
			                var img = canvas.toDataURL("image/png");
			                var file;
							file = new File([Upload.dataUrltoBlob(img)], $scope.user.username+".png")
							Postear(file, $scope.post)
			            }
			        }); 
				break;

				case "GIF":
					if($scope.post.files[0].length > 300){
						var files = [];
						$scope.post.files.forEach(function (file) {
							var byteCharacters = atob(file.split(',')[1]);
							var byteNumbers = new Array(byteCharacters.length);
							for (var i = 0; i < byteCharacters.length; i++) {
							    byteNumbers[i] = byteCharacters.charCodeAt(i);
							}
							var byteArray = new Uint8Array(byteNumbers);
							var blob = new Blob([byteArray], {type: "image/gif"});

		                	var ffile = new File([blob], $scope.user.username+".gif")
		                	files.push(ffile);
		                	
						})
	                	Postear(files, $scope.post)
					}
					else{
						Postear(null, $scope.post)
					}
							
				break;

				case "Video":
					Postear(null, $scope.post)
				break;
			}
		}
		else{
			$.notify({
				icon: "fa fa-exclamation fa-4x pull-left",
				title: "Upss",
				message: "Ocurrio un error, revisa la informacion"
			},{
			icon_type: "class",
			type: "minimalist true",
			delay: 0,
			template: 
				"<div data-notify=\'container\' class=\'col-xs-11 col-sm-3 alert alert-{0}\' role=\'alert\'> " +
				"<button type=\'button\' aria-hidden=\'true\' class=\'close\' data-notify=\'dismiss\'><i class=\'fa fa-times\' aria-hidden=\'true\'></i></button>"+
				"<span data-notify=\icon\></span>"+
				"<span data-notify=\'title\'>{1}</span>"+
				"<span data-notify=\'message\'>{2}</span>"+
				"</div>"
			});
		}
	}

	function Postear(file, post){
		if(file){
			Upload.upload({
	            url: '/api/post',
	            data: {file: file, post: post}
	        }).then(function (res) {
				var icon;
				if(res.data.indexOf("error") == -1){
					icon = "fa fa-check fa-4x pull-left"
				}
				else{
					icon = "fa fa-times fa-4x pull-left"
				}
				$.notify({
					icon: icon,
					title: "Completado",
					message: res.data
				},{
				icon_type: "class",
				type: "minimalist true",
				delay: 0,
				template:  
					"<div data-notify=\'container\' class=\'col-xs-11 col-sm-3 alert alert-{0}\' role=\'alert\'> " +
					"<button type=\'button\' aria-hidden=\'true\' class=\'close\' data-notify=\'dismiss\'><i class=\'fa fa-times\' aria-hidden=\'true\'></i></button>"+
					"<span data-notify=\icon\></span>"+
					"<span data-notify=\'title\'>{1}</span>"+
					"<span data-notify=\'message\'>{2}</span>"+
					"</div>"
				});
				$scope.post = {files: []}
				$scope.progress = 0;
	        }, function (err) {
	            console.log(err);
	        }, function (evt) {
	            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
	        });
		}
		else{
			API.addPost({post: post}).then(function(res) {
				var icon;
				if(res.data.indexOf("error") == -1){
					icon = "fa fa-check fa-4x pull-left"
				} 
				else{
					icon = "fa fa-times fa-4x pull-left"
				}
				$.notify({
					icon: icon,
					title: "Completado",
					message: res.data
				},{
				icon_type: "class",
				type: "minimalist true",
				delay: 0,
				template:  
					"<div data-notify=\'container\' class=\'col-xs-11 col-sm-3 alert alert-{0}\' role=\'alert\'> " +
					"<button type=\'button\' aria-hidden=\'true\' class=\'close\' data-notify=\'dismiss\'><i class=\'fa fa-times\' aria-hidden=\'true\'></i></button>"+
					"<span data-notify=\icon\></span>"+
					"<span data-notify=\'title\'>{1}</span>"+
					"<span data-notify=\'message\'>{2}</span>"+
					"</div>"
				});
				$scope.post = {files: []}
			})
		}
		
	}
}])
app.controller('NavCtrl', ['$scope', '$rootScope', '$auth', '$location', function ($scope, $rootScope, $auth, $location) {
    $scope.logout = function () {
        $auth.logout();
        $rootScope.user = null;
        $location.path("/")
    }

}])