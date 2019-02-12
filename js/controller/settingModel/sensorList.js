stationModule.controller('sensorListController',function($rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
$scope.stationDetail=configureStaionService.configStationDetail;
$scope.sensor_selected=[]; 
getAssetsDetailInfo();  
$scope.gotoConfig=function(){
         $state.transitionTo("config");
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
$scope.gotoSettingview=function(){
        $state.transitionTo("settingview");
} 
$scope.gotoThresholds=function(sensor,index) {
            angular.forEach($scope.sensors, function(value, key){
                if(key==index){
                $scope.sensor_selected[key]=true;
                configureStaionService.configStationDetail.selectedSensor=sensor
                 
                if(sensor.assetType.assetTypeCode==api.key.temp){
                    getAttribute(false); 
                    $state.transitionTo('thresholdTEMP')
                }else{
                    getAttribute(true); 
                    $state.transitionTo('thresholdSM')
                }            
                }else{
                $scope.sensor_selected[key]=false
                }
            });
}
function getAttribute(isSM){
        angular.forEach(configureStaionService.configStationDetail.selectedSensor.attributes, function(value, key){
            var unit=$scope.stationDetail.organization.unitMeasurePref.substring(0,1);
            if(isSM){
                $rootScope.attributes[value.attributeCode]=value.attributeValue;
                
            }else{
                $rootScope.attributes[value.attributeCode]=value['attributeValue_'+unit]?value['attributeValue_'+unit]:value.attributeValue;
            }
            
        }) 
}
function getAssetsDetailInfo(){
    if(checkConnectionService.checkConnection() == false) {
        showAlertService.showAlert("Please check Internet connection");
        return false;
        }
    $ionicLoading.show({
        template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    });
assetsFactory.assetsDetailInfo($scope.stationDetail.assetId)
    .success(function(data){
       
        $scope.sensors=data.result.children.filter(function(value){
            return value.active
        }).sort(function(a, b){
            var x = a.assetName.toLowerCase();
            var y = b.assetName.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
            // return a.metricCode-b.metricCode
            });
        console.log($scope.sensors)
        configureStaionService.configStationDetail=data.result;
        $scope.stationDetail= configureStaionService.configStationDetail;
        $ionicLoading.hide();
    })
    .error(function(error){
        console.log('error bock');
        $scope.sensors=configureStaionService.configStationDetail
        $ionicLoading.hide();

    });

}
});