stationModule.controller('transmissionController',function($rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
$scope.stationPostDataAttributes=[]
$scope.stationPostDataAttributes[0]={'attributeCode': api.key.TransFreq,'attributeValue': ""};
$scope.stationDetail=configureStaionService.configStationDetail;
$scope.options = [{ time:'15',name: "15 minutes" }, { time:'30',name: "30 minutes" },{ time:'60',name: "1 hour" },{ time:'360',name: "6 hours"}, { time:'720',name: "12 hours" },{time:'1440', name: "24 hours" }];
$scope.freqSelected=[]; 
$scope.stationPostDataAttributes[0].attributeValue=$rootScope.attributes[api.key.TransFreq];
setDefaultFreq($rootScope.attributes[api.key.TransFreq]);
  
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
$scope.changeFrequency=function(freq,index) {
            angular.forEach($scope.options, function(value, key){
                if(key==index){
                $scope.freqSelected[key]=true;
                $scope.stationPostDataAttributes[0].attributeValue=freq.time;
                }else{
                $scope.freqSelected[key]=false
                }
            });
}
// function getAttribute(){
//             if (checkConnectionService.checkConnection() == false) {
//                 showAlertService.showAlert("Please check Internet connection");
//                 return false;
//             }
//             $ionicLoading.show({
//                 template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
//             });
//             assetsFactory.assetsDetailInfo($scope.stationDetail.assetId).success(function(data){
//                 angular.forEach(data.result.attributes, function(value, key){
//                     if(value.attributeCode=='TransFreq'){
//                     $scope.stationPostDataAttributes[0].attributeValue=value.attributeValue;
//                     setDefaultFreq(value.attributeValue);
//                     }
//             })
//             }).error(function(error){
//                 console.log(error);
//             }).finally(function() {
//             $ionicLoading.hide();
//             });  
// }
  

$scope.saveFreq=function() {
            if(checkConnectionService.checkConnection() == false) {
                showAlertService.showAlert("Please check Internet connection");
                return false;
                }

            $ionicLoading.show({
                template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            });
        /* ***************Update Asset Attributes Service Call***************** */
            assetsFactory.assetattributesPost($scope.stationDetail.assetId,$scope.stationPostDataAttributes).success(function(data){
                showAlertService.showAlert("Saved successfully");
                $state.transitionTo("config");									
            }).error(function(error){
                    if(error==null)
                    showAlertService.showAlert(api.errorMsg)
                    else
                    showAlertService.showAlert("Error Saving ");
            }).finally(function(){
                $ionicLoading.hide();
            });
}
function setDefaultFreq(transmition_freq){
        if(transmition_freq == "15"){
            $scope.freqSelected[0]=true;
             
            }
        else if(transmition_freq=="30"){
            $scope.freqSelected[1]=true;
            
            }
        else if(transmition_freq=="60"){
            $scope.freqSelected[2]=true;
            
            }
        else if(transmition_freq=="360"){
            $scope.freqSelected[3]=true;
             
            }
        else if(transmition_freq=="720"){
            $scope.freqSelected[4]=true;
             
            }
        else if(transmition_freq=="1440"){
            $scope.freqSelected[5]=true;
            
            }
        else{
            $scope.freqSelected[2]=true;
              
            }
        }
 

});