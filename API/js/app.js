(function(){
	'use scrict';
	
	var app = angular.module('TestApp', [  ]);
	
	app.controller('firstController', ['$scope', function($scope){
		$scope.myVar='My first Var!';
	}])
	
	app.directive('testingDirective', function(){
		return{
			restrict: 'E',
			templateUrl: '/views/templates/testingDirective.html'
		}
	})
	
})();