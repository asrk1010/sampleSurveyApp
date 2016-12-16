var log = angular.module('skipLogic',[]);

log.controller('formController', function($scope){
	$scope.name = {};
	$scope.age = {};
	$scope.inData = 2;
	if($scope.inData !== undefined){
		console.log($scope.inData);
		if(isNaN($scope.data)){//Its not a number
			console.log("isnan");
			$scope.age.show = false;
			$scope.name.name = $scope.inData;
			$scope.name.show = true;
		}
		else{
			$scope.name.show = false;
			$scope.age.age = $scope.inData;
			$scope.age.show = true;
		}
	}
//console.log($scope.inData);
});