//'use strict';

/*Controllers*/

angular.module('surveyApp.controllers', [])
.controller('MainController', function($scope, $http, userInfo){

})
.controller('NavbarController', function($scope, $location, userInfo2){
	console.log($location.path());


	$scope.currentPage = function(viewLocation){
		return viewLocation === $location.path();
	};

	userInfo2.get(function(data){
		$scope.user = data.name;
	});

})
//nav controller, function
.controller('UserinfoController', function($scope, urlInfo, userInfo2){


	console.log("Info fra urlINfo   " + urlInfo);

	//asyncron process
	userInfo2.get(function(data){
		$scope.firstname = data.firstName;
		$scope.lastname = data.surname;
	});
	$scope.ButtonClick = function(){
//		alert(userInfo.getFirstname());
};

var ala;

$scope.show = true;

})
.controller('ProgramController', ['$scope', '$http', 'urlInfo', 'programsInfo', function($scope,$http, urlInfo, programsInfo){

	$scope.programs = [];

	programsInfo.get(function(data){
		console.log(data);
		angular.forEach(data.programs, function(value,key){
			if(value.kind == 'SINGLE_EVENT_WITHOUT_REGISTRATION'){
				$scope.programs.push(value);
			}
		});
	});
}])
//ProgramDetailController -> Controller for programDetail side.
.controller('ProgramDetailController', ['$scope', '$filter','$routeParams' ,'urlInfo','singleProgramInfo','programStagesInfo','dataElement','optionSet', function($scope, $filter,$routeParams, urlInfo, singleProgramInfo, programStagesInfo,dataElement, optionSet){
	//var s = [];



	$scope.alert = {
		show: false,
		dataElement: '',
		dataElementLength: ''
	};

	$scope.id = $routeParams.id;

	singleProgramInfo.getData({id: $routeParams.id} , function(data){
		//console.log(data);
		$scope.programId = data;
		$scope.$broadcast('DataElementUpdate',{
			//programId : data
		});


	});

	$scope.$on('DataSetUpdate', function(event, message){
		//console.log("Im printing from dataSetUPdate");
		console.log(message);
		$scope.dataSent = message;

	});

}])
//DataElementController -> Get all dataElement, post them out
.controller('DataElementController',['$scope','urlInfo', 'programStagesInfo','dataElement','optionSet', function($scope, urlInfo, programStagesInfo, dataElement,optionSet){
	console.log("DataElementController");
	//console.log($scope.id);
	//Update when parent contorller is done.
	$scope.$on('DataElementUpdate', function(){
		//Get program stages.
		//then parse all data
		programStagesInfo.getData({id: $scope.programId.programStages[0].id}, function(data){
			//console.log(data);
			$scope.programStageDataElements = data.programStageDataElements;
			parseDataElements($scope.programStageDataElements);
		});
	});

	//$scope.dataSent = [];

	$scope.submitData = function(){
		/*Broadcast to bigcontroller yo*/
		var data = {};
		console.log($scope.programStageDataElements);
		//Angular parser all data in til var data
		angular.forEach($scope.programStageDataElements, function(value, key){
			if(value.userData !== undefined){
				data[value.dataElement.id] = value.userData;
			}
		});
		this.$emit('DataSetUpdate', data);


		console.log(data);


	};
	function parseDataElements(programStageData){
		console.log("parseDataElements");
		console.log(programStageData);

		angular.forEach(programStageData, function(value, key){
			//console.log(value);
			dataElement.getData({id: value.dataElement.id}, function(data){
				//console.log(data);
				value.showElement = true;
				if(data.optionSet === null){
					value.inputType = 'text';
					value.showInput = true;
					console.log(value);
				}
				else{
					value.showSelect = true;
					parseOptionSet(data.optionSet.id, key);
				}
			});
		});
	}
	//Parse based on each dataElement
	function parseOptionSet(id, key){
		optionSet.getData({id: id}, function(data){
			if(data.options.length < 50){
				//console.log(data);
				$scope.programStageDataElements[key].optionSetValues = data.options;
				$scope.programStageDataElements[key].userData = data.options[0];
				console.log("yolo");
			//	console.log($scope.userData);

		}
		else{
			console.log(data);
			$scope.programStageDataElements[key].showElement = false;
			$scope.alert.show = true;
			$scope.alert.dataElement = data.name;
			$scope.alert.dataElementLength = data.options.length;

			console.log($scope.alert.message);
		}
	});
	}
/*	$scope.watch('programId', function(newValue, oldValue){
		
});*/

}])
//General controller for skip logic
.controller('SkipLogicDetailController', ['$scope','$routeParams','singleProgramInfo', 'programStagesInfo',function($scope, $routeParams, singleProgramInfo, programStagesInfo){
	$scope.id = $routeParams.id;
	//Get program
	singleProgramInfo.getData({id: $routeParams.id} , function(data){
	
		console.log(data);
		parseDataElement(data.programStages[0].id);
		//All singleevent program only have 1 stage.
		//parseStages(data.programStages[0].id);
	});

	$scope.dataLength = 6;
	//Send id to program stage
	function parseDataElement(programStage){
		programStagesInfo.getData({id: programStage}, function(data){
			$scope.dataLength = data.programStageDataElements.length;
			console.log($scope.dataLength);
			console.log(data.programStageDataElements);
			$scope.dataElements = data.programStageDataElements;
		});
	}

	
}]);