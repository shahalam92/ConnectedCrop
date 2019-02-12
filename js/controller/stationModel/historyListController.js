
stationModule.controller('historyListController', function($scope,$location ,$ionicModal,$ionicLoading,$timeout,$state,$interval,assetsSensorService
	,sensorDetailService,flagService,assetsFactory) {

//***************Tab Bar Navigation Functions***************
$scope.gotoDashboard=function(){
      $state.transitionTo("dashboardview");
}

$scope.gotoAlertview=function(){
      flagService.flagList.stationDetailpgFlag='';
      $state.transitionTo("alertview");
}

$scope.gotoCompareview=function(){
      flagService.flagList.stationDetailpgFlag='';
      $state.transitionTo("compareview");
}

$scope.gotoSettingview=function(){
      flagService.flagList.stationDetailpgFlag='';
      $state.transitionTo("settingview");
}
//********Tab Bar Navigation Functions Closed
//******************************************Function to navigate back*********88
$scope.gotoSensorDetail=function(){
      $state.transitionTo("sensordetailview");
};

$scope.historyList=[];
$scope.historyList=sensorDetailService.sensorDetail;
console.log($scope.historyList)
var toUTCDate = function(date){
      var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      return _utc;
};

var millisToUTCDate = function(millis){
      return toUTCDate(new Date(millis));
};
$scope.toUTCDate = toUTCDate;
$scope.millisToUTCDate = millisToUTCDate;
});
