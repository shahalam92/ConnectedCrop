
stationModule.controller('selectStation', function($scope,$location ,assetsFactory,$ionicModal,$ionicLoading, $timeout,$state,api,flagService,assetsListService,checkConnectionService,
		showAlertService,configureStaionService,$ionicHistory) {
//***********************Function to goback*****************************************
$scope.orgCollapsed=[]
$scope.stationList=[];
$scope.gotoSettingPg = function (path) {

			$state.go("settingview");
}
//***********************Tab  NAvigation functions*********************************
$scope.gotoDashboard=function(){
			$state.transitionTo("dashboardview");
			// flagService.goToStationCongigPg='';
}

$scope.gotoAlertview=function(){
			$state.transitionTo("alertview");
			//flagService.goToStationCongigPg='';
}

$scope.gotoCompareview=function(){
			$state.transitionTo("compareview");
			//flagService.goToStationCongigPg='';
}

$scope.gotoSettingview=function(){
			  $state.transitionTo("settingview");

}
//***********************Function To go to Configure Station Page ************************************
$scope.gotoStationConfigPg=function(station,index){
	//$ionicHistory.removeBackView();
	flagService.flagList.stationIndex=index;
	configureStaionService.configStationDetail=station;
	flagService.flagList.fromSetLocation=false;
	$state.transitionTo("config");

}
$scope.toggleOrg=function(index){
	$scope.orgCollapsed[index]=!$scope.orgCollapsed[index];
}
//**************Function for pull to Refresh********
$scope.pullToRefresh=function(){
				if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
          			 $scope.$broadcast('scroll.refreshComplete');
					 showAlertService.showAlert("Please check Internet connection");	//native alert
				}else{	$scope.stationList=[]
						$scope.getAssets();
				}
}
//Tab  NAvigation functions closed****************************

//***********************Function To get Station List************************************
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item.orgName) ? false : (seen[item] = true);
    });
}
$scope.getAssets=function(){
			if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
				showAlertService.showAlert("Please check Internet connection");	//Invoke native alert
				return false;
			}
			$ionicLoading.show({
				template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
			});
			/*ServiceCall*/
			var orgCount=flagService.orgList.length;
			console.log(orgCount)
			assetsFactory.assetsList().success(function(data){
				if(data.result){
					    var assets=data.result;
					    var set=true;
					    var group={orgName:'',stations:[]}
					    var sortedStation=assets.sort(function(a, b){
					    var x = a.organization.organizationName.toLowerCase();
					    var y = b.organization.organizationName.toLowerCase();
					    var x1 = a.assetName.toLowerCase();
					    var y1 = b.assetName.toLowerCase();
					    return (x < y ? -1 : x > y ? 1 : 0) || (x1 < y1 ? -1 : x1 > y1 ? 1 : 0);
						});
						console.log(sortedStation)
						angular.forEach(sortedStation,function name(value,key) {
						if(set){
							group.orgName=value.organization.organizationName;
							set=false;
						}						
						if(value.organization.organizationName==group.orgName){
							group.stations.push(value);
						}else if(value.organization.organizationName!=group.orgName){
							$scope.stationList.push(group);
							group={orgName:'',stations:[]}
							group.stations.push(value);
							group.orgName=value.organization.organizationName;
						} 
						if(sortedStation.length-key==1){
							$scope.stationList.push(group);
							console.log($scope.stationList);
						}
					});
					
					$scope.stationList=uniq($scope.stationList);

				}else{
					showAlertService.showAlert("No Station to show");
					return false;
				}
			}).error(function(error){
				if(error==null)
				showAlertService.showAlert(api.errorMsg)
				
			}).finally(function() {
							$ionicLoading.hide();
			       // Stop the ion-refresher from spinning
			       $scope.$broadcast('scroll.refreshComplete');
			});

}

//$scope.stationListShowStatus = false;
$scope.getAssets();
});
