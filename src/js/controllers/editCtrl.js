app.controller('EditCtrl', ['$scope','$rootScope', 'API', function ($scope, $rootScope, API) {
	if(!$scope.user.username || $scope.user.username.trim() == ""){
		$scope.editable = true
	}
	$scope.updateProfile = function(){
		API.updateProfile($scope.user).then(function(res){
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
		})
	}
}])