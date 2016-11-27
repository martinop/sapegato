app.controller('SideCtrl', ['$scope', 'API', function ($scope, API) {
	function postYesterday(){
		var formData = {
			startDate: moment().subtract(1,'days').startOf('day').toString(),
			endDate: moment().subtract(1,'days').endOf('day').toString(),
			limit: 1,
			sort: "-likes"
		}

		API.byDate(formData).then(function(res){
			if(res.data != "error" && res.data.length > 0){
				$scope.yesterday = res.data[0];
				$scope.yesterday.urlPost = window.location.origin+"/posts/"+$scope.yesterday.author.username+"/"+$scope.yesterday.title.replace(/ /g, "-")
			}
		})
	}
	function usersWeek(){
		var formData = {
			startDate: moment().startOf('isoWeek').toString(),
			endDate: moment().endOf('isoWeek').toString(),
			limit: 5,
			sort: "-likes"
		}

		API.byDateUsers(formData).then(function(res){
			if(res.data != "error"){
				$scope.usersWeek = res.data;
			}
		})
	}
	function usersMonth(){
		var formData = {
			startDate: moment().startOf('month').toString(),
			endDate: moment().endOf('month').toString(),
			limit: 5,
			sort: "-likes"
		}

		API.byDateUsers(formData).then(function(res){
			if(res.data != "error"){											
				$scope.usersMonth = res.data;
			}
		})
	}
	function usersYear(){
		var formData = {
			startDate: moment().startOf('year').toString(),
			endDate: moment().endOf('year').toString(),
			limit: 5,
			sort: "-likes"
		}

		API.byDateUsers(formData).then(function(res){
			if(res.data != "error"){
				$scope.usersYear = res.data;
			}
		})
	}
	postYesterday();
	usersWeek();
	usersMonth();
	usersYear();

}]);
