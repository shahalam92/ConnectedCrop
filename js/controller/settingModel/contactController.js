
stationModule.controller('contact', function($scope ,$ionicModal,$state) {
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
    //********Open ConnectedCrop Website in browser********
    $scope.gotoOpenWebsite=function(url){
    			var ref = cordova.InAppBrowser.open(url, '_system', 'location=yes');
    }
    //Send mail
    $scope.gotoSendMail=function(){
    	window.location = 'mailto:support@connectedcrops.ca ';
    }

});
