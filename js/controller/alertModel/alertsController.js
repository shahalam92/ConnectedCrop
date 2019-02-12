
stationModule.controller('alertsController', function($rootScope,$scope,$location ,showAlertService,$ionicModal,assetsFactory, $timeout,$state,$ionicLoading,checkConnectionService,api) {
/*variables*/
$scope.evnets_list='';
$scope.isCollapsed = [];
$scope.stationMetricListShowStatus = [];
$scope.in_progress= true;
$scope.queryParam=''

/********************Tab Bar Navigation Functions****************************/
$scope.gotoDashboard=function(){
				$state.transitionTo("dashboardview");
}

$scope.gotoAlertview=function(){
}

$scope.gotoCompareview=function(){
				$state.transitionTo("compareview");
}

$scope.gotoSettingview=function(){
				$state.transitionTo("settingview");
}

$scope.multiSearch= function(text, searchWordsArray){
				 return assetsFactory.checkAssetMetricType(text, searchWordsArray);
}
/******************Function to Show/Hide Events*********************/
$scope.toggleList=function(index) {
				 $scope.stationMetricListShowStatus[index] = !$scope.stationMetricListShowStatus[index];
}
/******************function to rotate refresh icon and refresh page**********************/
function rotate() {
				$('.reload_icon').css({
					'-webkit-animation': 'spin 1s linear infinite',
					'animation': 'spin 1s linear infinite'
				});
 }

 //************************Function to refresh Events List*******************
$scope.doRefresh=function(){
				if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
					$scope.$broadcast('scroll.refreshComplete');
					showAlertService.showAlert("Please check Internet connection");	//native alert
				}else{	$scope.in_progress=true;
						rotate();
						$scope.getEvents();
				}

}
/**************************Function to get All events*******************/


$scope.getEvents=function(){
				if($scope.in_progress){
					$scope.evnets_list=[];
					$scope.queryParam='';
				}else{
					 if($scope.queryParam!='&endTime='+$scope.evnets_list[$scope.evnets_list.length-1].createdDate){
						$scope.queryParam='&endTime='+$scope.evnets_list[$scope.evnets_list.length-1].createdDate;
					 }else{
						 return false;
					 }
 						
			    }
				if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
					showAlertService.showAlert("Please check Internet connection");	//native alert
					return false;
				}				
				$ionicLoading.show({
					template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
				});
				assetsFactory.getAllEvent($scope.queryParam).success(function(data){									
					$scope.time=new Date();
					$scope.in_progress=false;
					angular.forEach(data.result, function(value, key){																 
									  $scope.count=0;
									  if(api.key.eventTypes.indexOf(value.resultLog.app.appArguments[0].value)>=0){
										angular.forEach(value.resultLog.app.appArguments, function(child_value, child_key){
											if(child_value.code=='system.log.event.description')
											{ $scope.count=$scope.count+1;
												value.event_description=child_value.value
											  
											}else  if(child_value.code=='system.log.event.message')
											{		$scope.count=$scope.count+1;
													value.event_message=child_value.value	
											}
											if($scope.count==2){
												 $scope.evnets_list.push(value);
												 $scope.evnets= $scope.evnets_list;
											}
										
									  }); 
									  }
												  
						    }); 
						$rootScope.events_count=""
						window.localStorage.setItem("lastChecked",$scope.evnets_list[0].createdDate)
				})
				.error(function(error){
					if(error==null)
					showAlertService.showAlert(api.errorMsg)
				}).finally(function() {
						$ionicLoading.hide();
						$('.reload_icon').css({
							'-webkit-animation': 'none',
							'animation': 'none'
						});
												       // Stop the ion-refresher from spinning
						$scope.$broadcast('scroll.refreshComplete');

				});
 }

 /********************Function Called on Controller Load****************************/
$scope.getEvents();


});
