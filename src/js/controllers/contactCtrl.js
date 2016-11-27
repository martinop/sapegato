app.controller('ContactCtrl', ['$scope', function ($scope) {
	emailjs.init("user_6ZtuXDzjLucTxRLFj2j3K");
	$scope.sendEmail = function(){
		emailjs.send("gmail","template_sapecat",$scope.email)
		.then(
		  function(response) {
			$.notify({
				icon: icon,
				title: "Completado",
				message: "Tu email ha sido enviado con exito"
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
			$scope.email = {};
		  }, 
		  function(error) {
			$.notify({
				icon: icon,
				title: "Error",
				message: "Algo salio mal, verifica la informacion e intenta de nuevo"
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
			$scope.email = {};
		  }
		);
	}
}]);