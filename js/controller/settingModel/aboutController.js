
stationModule.controller('about', function($scope,$location ,$ionicModal, $timeout,$state,api,flagService,assetsListService,
		showAlertService,configureStaionService,$ionicHistory) {
 ///Back button function
  $scope.gotoSettingPg = function (path) {
      $state.go("settingview");
    }
  //Tab Navigation Functions
  $scope.gotoDashboard=function(){
	 $state.transitionTo("dashboardview");
	}
	 
  $scope.gotoAlertview=function(){
    	 $state.transitionTo("alertview");
	}
	    
  $scope.gotoCompareview=function(){
	 $state.transitionTo("compareview");
    }
    
    $scope.gotoSettingview=function(){
      $state.transitionTo("settingview");
      }
	   

});


