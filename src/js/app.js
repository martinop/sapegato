var app = angular.module('Ohcopy', ['satellizer','ngRoute', 'ui.router','timer','angular-humanize-duration','ngFileUpload']);
app.config(['$routeProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$authProvider', function ($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider, $authProvider) {
	$urlRouterProvider.otherwise("/");
	$stateProvider
    .state("home", {
        url: "/",
        templateUrl: "views/home.html",
        controller: "HomeCtrl"
    })
    .state("contribute", {
        url: "/contribute",
        templateUrl: "views/contribute.html",
        controller: "ContributeCtrl",
        resolve: {
            init: ['API', function (API) {
                return API.promise;
            }]
        }
    })
    .state("editprofile", {
        url: "/editprofile",
        templateUrl: "views/edit.html",
        controller: "EditCtrl",
        resolve: {
            init: ['API', function (API) {
                return API.promise;
            }]
        }
    })
    .state("moderate", {
        url: "/moderate",
        templateUrl: "views/moderate.html",
        controller: "ModerateCtrl",
        resolve: {
            init: ['API', function (API) {
                return API.promise;
            }]
        }
    })
 	$authProvider.authToken = 'ohcopy';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'ohcopy';
	$authProvider.twitter({
	    url: '/api/auth/twitter',
	    authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
	    redirectUri: window.location.origin,
	    type: '1.0',
	    popupOptions: {
	        width: 495,
	        height: 645
	    }
	});
    $authProvider.facebook({
        clientId: '881773071927465',
        name: 'facebook',
        url: '/api/auth/facebook',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        redirectUri: window.location.origin+"/",
        requiredUrlParams: ['display', 'scope'],
        scope: ['email'],
        scopeDelimiter: ',',
        display: 'popup',
        type: '2.0',
        popupOptions: { width: 580, height: 400 }
    });
    
    $authProvider.google({
        clientId: '91619521452-9mh04bj1naqvegl2gnni2qcus2fcvoer.apps.googleusercontent.com',
        url: '/api/auth/google',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
        redirectUri: window.location.origin,
        requiredUrlParams: ['scope'],
        optionalUrlParams: ['display'],
        scope: ['profile', 'email'],
        scopePrefix: 'openid',
        scopeDelimiter: ' ',
        display: 'popup',
        type: '2.0',
        popupOptions: {
            width: 452,
            height: 633
        }
    });
}]);
app.run(['$auth', '$location', '$rootScope', 'API', function ($auth, $location, $rootScope, API) {
    API.getProfile().then(function (res) {
        if (!res.data.token) {
            $auth.logout();
            $location.path("/");
        } else {
            $auth.setToken(res.data.token);
            $rootScope.user = res.data.user;
        }
        API.defer.resolve();
    }).catch(function (error) {
        console.log(error);
    })
}])