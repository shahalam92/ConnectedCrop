//Not Used
stationModule.controller('changePassword', function($scope,$location ,$ionicModal, $timeout,$state,api,flagService,assetsListService,checkConnectionService,
		showAlertService,configureStaionService,$ionicHistory,api,$http) {
		$scope.hide=true;
	    $scope.password={
	    		'old':'',
	    		'newPass':'',
	    		'confirm':''

	    };
		$scope.gotoSettingPg = function (path) {
  		   $state.transitionTo("settingview");
          }
	   $scope.close=function(){
		  $scope.hide=true;
	      }

	  $scope.gotoDashboard=function(){
		  $state.transitionTo("dashboardview");
		  flagService.flagList.goToStationCongigPg='';
		 }

	  $scope.gotoAlertview=function(){
	      $state.transitionTo("alertview");
	      flagService.flagList.goToStationCongigPg='';
	     }

      $scope.gotoCompareview=function(){
    	  $state.transitionTo("compareview");
    	  flagService.flagList.goToStationCongigPg='';
         }
      $scope.changePassword=function(){
    	  if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
				 showAlertService.showAlert("Please check Internet connection");	//native alert
				 return false;
			}
    	  else  if($scope.password.newPass!==$scope.password.confirm){
    		       $scope.hide=false;
   		           return false;
   	        }
    	  else{
    		  $scope.hide=true;
    	   }
         }

});
