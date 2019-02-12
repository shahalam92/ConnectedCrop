(function(){
    angular.module('stationModule').controller('StepThreeController',StepThreeController);
    StepThreeController.$inject=['$state','$rootScope','$scope','flagService','$rootScope','configureStaionService','allAssetsDetailService','assetsListService','checkConnectionService','assetsFactory','showAlertService','$ionicHistory','api','$ionicLoading']
    function StepThreeController($state,$rootScope,$scope,flagService,$rootScope,configureStaionService,allAssetsDetailService,assetsListService,checkConnectionService,assetsFactory,showAlertService,$ionicHistory,api,$ionicLoading) {
      var vm=this;
      var station;
      var defaultName=assetsFactory.default_Attribute_Value();
      var metricCodes=[
        [['T2'],['T1'],['BatLvl']],[['SM1'],['SM2'],['BatLvl']],[['SM1'],['T1'],['BatLvl']]
      ];
      vm.header=false;
      var text1={
        header:"Congratulations!",
        message:"The Station activation was successful! Here are the readings:"
      }
      var text2={
        header:"Congratulations!",
        message:"The Station activation was successful! Please check out the messages indicated to get the readings in the valid range."
      }
      vm.success=text1;
      vm.goBack=goBack;
      vm.next=next;
      vm.batlvl=0;
      vm.gotoDashboard=gotoDashboard;
      vm.gotoAlertview=gotoAlertview;
      vm.gotoCompareview=gotoCompareview;
      vm.getAssets=getAssets;
      vm.count=0;
      vm.checkStep=0;
      allAssetsDetailService
      vm.sensor={metricCode:api.key.batLvl}
      vm.getAssets()
      $scope.gotoOpenWebsite=function(){
            var ref = cordova.InAppBrowser.open('http://connectedcrops.ca/manual', '_system', 'location=yes');
      }
      $scope.pullToRefresh=function(){
                if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
                  $scope.$broadcast('scroll.refreshComplete');
                  showAlertService.showAlert("Please check Internet connection");	//native alert
                }
                else{
                vm.count=0;
                $('.error_one_page').hide();
                $('.error_two_page').hide();
                $('.error_three_page').hide();
                $("has-header").removeClass("has-footer");
                $('.step_3_page').hide();
                $('#dashboardFooter').hide();
                vm.header=false
                $('.waiting_page').show();
                setTimeout(function () {
                  vm.getAssets();
                }, 60);

              }

        }
      function goBack(){
                $state.transitionTo("step2_connection");
              }
      function gotoDashboard(){
                $state.transitionTo("dashboardview");
                flagService.flagList.goToStationCongigPg='';
              }
      function gotoAlertview(){
                $state.transitionTo("alertview");
                flagService.flagList.goToStationCongigPg='';
              }
      function gotoCompareview(){
                $state.transitionTo("compareview");
                flagService.flagList.goToStationCongigPg='';
              }
      function connectionCheck(count){
                if(count==3){
                }else{
                }
              }
      function errorOne(){
                vm.header=true;
                $('.waiting_page').hide('slow');
                setTimeout(function () {
                $('.error_one_page').show();
                }, 50);
            } 
      function errorTwo(){
                vm.header=true;
                $('.waiting_page').hide('slow');
                setTimeout(function (){
                $('.error_two_page').show();
                }, 50);
      }
      function errorThree(){
                vm.header=true;
                $('.waiting_page').hide('slow');
                setTimeout(function (){
                $('.error_three_page').show();
                }, 50);
      }
      function congratsScreen(){
                vm.success=text1;
                $('.waiting_page').hide('slow');
                setTimeout(function () {
                $("has-header").addClass("has-footer");
                $('.step_3_page').show();
                $('#dashboardFooter').show();
                }, 50);
      }
      function congratsScreenWithError(){
        vm.success=text2;
        $('.waiting_page').hide('slow');
        setTimeout(function () {
        $("has-header").addClass("has-footer");
        $('.step_3_page').show();
        $('#dashboardFooter').show();
        }, 50);
      }                 
      function next(){
                  $ionicHistory.clearCache();
                  configureStaionService.configStationDetail=$scope.stationDetails.asset
                  flagService.flagList.fromSetLocation=false;
                  $state.transitionTo("config"); 
              }
      function getAssets(){
                if (checkConnectionService.checkConnection() == false) {
                showAlertService.showAlert("Please check Internet connection");
                return false;
                }
                $ionicLoading.show({
                template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                });
                assetsFactory.assetsDetailInfo(flagService.flagList.activtedStation.assetId).success(successCallback).error(errorCallback).finally(function(){
                      $ionicLoading.hide();
                });  
                
                function errorCallback(error){
                  $scope.$broadcast('scroll.refreshComplete');
                  if(vm.count<2){
                    ++vm.count;
                    setTimeout(function () {
                      vm.getAssets();
                    }, 30000);
                  }else{
                    if(error==null){
                      showAlertService.showAlert(api.errorMsg)
                      errorThree();
                    }else {
                      errorThree();
                    }
                  }  
                }      
                
                function successCallback(data){
                  $scope.$broadcast('scroll.refreshComplete');
                  if(data.result){
                    var filterMetricArray=[];
                    $scope.stationDetails={}
                    $scope.stationDetails.asset=data.result;
                    angular.forEach(data.result.metrics, function(value, key){																
                      if(value.metricCode==api.key.batLvl)
                      {
                      $scope.stationDetails.batteryValue=value.metricValue;
                      }
                      else if(value.metricCode=='BatStatus')
                      {
                      $scope.stationDetails.batteryStatus='battery-icon-'+(value.metricValue).toLowerCase();
                      }
                    });
                    if($scope.stationDetails.batteryValue){	 
                      angular.forEach(data.result.children, function(value, key){
                        value.sensor_not_connected=false;
                        value.not_created=false
                        value.sensor_error=false
                          if(value.active&&value.assetType.assetTypeCode!=api.key.none){	 
                            var unit=value.organization.unitMeasurePref.substring(0,1);
                            angular.forEach(value.metrics, function(sub_value, key){
                              if(sub_value.metricCode=="Status")
                              { 
                                  if(sub_value.metricValue=='sensor not connected'){
                                    sub_value.metricValue='error'
                                    value.sensor_not_connected=true
                                  }else if(sub_value.metricValue=='not created'){
                                    sub_value.metricValue='error'
                                    value.not_created=true
                                  }else if(sub_value.metricValue=='error'){
                                    sub_value.metricValue='error'
                                    value.sensor_error=true
                                  }
                                  value.status='sensor-status-'+sub_value.metricValue;
                              }
                              else if(sub_value.metricCode=='Reading')
                              { value.Reading=sub_value;
                                value.class=sub_value.unitClass;
                                value.icon=sub_value.unitClass==api.key.unit_classTemp?'t-active':'sm-active'
                              }
                              else if(sub_value.metricCode.toLowerCase()=='errormsg')
                              {
                                    value.ErrorMsg=sub_value.metricValue;
                              }
                              else if(sub_value.metricCode=='A')
                              {
                                    value.A=sub_value.metricValue;
                              }
                              else if(sub_value.metricCode=='D')
                              {
                                    value.D=sub_value.metricValue;
                              }
                              if(key==value.metrics.length-1){
                                if(value.status!='sensor-status-error'){
                                  
                                  value.reading=value.Reading['metricValue_'+unit];
                                  value.unit= value.Reading['unit_'+unit];
                                  
                                }else{
                                  value.reading=value.Reading.metricValue
                                  value.unit= ""
                                }
                                filterMetricArray.push(value);
                                console.log(filterMetricArray)
                              }
                            });        
                          }	  
                      });
                      if(filterMetricArray.length>1){ 
                        if(filterMetricArray[0].status==undefined||filterMetricArray[1].status==undefined){
                          errorThree();
                        }  
                        else if(filterMetricArray[0].status!='sensor-status-error'&&filterMetricArray[1].status!='sensor-status-error'){
                          $scope.stationDetails.metrics=filterMetricArray;
                          congratsScreen();
                        }else if(filterMetricArray[0].sensor_error||filterMetricArray[1].sensor_error) {
                          $scope.stationDetails.metrics=filterMetricArray;
                          congratsScreenWithError();
                        }else if(filterMetricArray[0].sensor_not_connected||filterMetricArray[1].sensor_not_connected) {
                          errorTwo();
                        }else if(filterMetricArray[0].not_created||filterMetricArray[1].not_created) {
                          errorThree();
                        }
                      }else{
                        errorThree();
                      }
                    }else{
                      errorOne();
                    }
                  }else{
                      errorOne();
                  }
                }    
          }    

}

})();
