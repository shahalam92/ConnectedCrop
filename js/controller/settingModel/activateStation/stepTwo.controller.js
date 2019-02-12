(function(){
    angular.module('stationModule').controller('StepTwoController',StepTwoController);
    StepTwoController.$inject=['$state','flagService','$rootScope','$ionicLoading','checkConnectionService','showAlertService','assetsFactory','api','$scope','$ionicPopup']
    angular.module('stationModule').controller('StepTwoPortBController',StepTwoPortBController);
    StepTwoPortBController.$inject=['$state','flagService','$rootScope','$ionicLoading','checkConnectionService','showAlertService','assetsFactory','api','$scope','$ionicPopup']
    function StepTwoController($state,flagService,$rootScope,$ionicLoading,checkConnectionService,showAlertService,assetsFactory,api,$scope,$ionicPopup) {
    var popup;
    var timeZoneId=moment.tz.guess();
    var defaultName=assetsFactory.default_Attribute_Value();
    $scope.sensor={"assetName":"No Sensor", "assetTypeCode":api.key.none} 
    $scope.previous={"assetName":"No Sensor", "assetTypeCode":api.key.none}  
    $scope.sensorType={none:api.key.none,soil:api.key.soil,temp:api.key.temp}
    var popup_deactivate_message;
    var customTemplate='templates/popups/portSetup.html';
    var deactivateMessage="templates/popups/deactivateMessage.html";
    $scope.deactivate_message_heading='Please,setup the sensors first before moving to the next step'
    $scope.message=""
    $scope.attributesForTemp=[];
    $scope.name_changed=false;
    $scope.attributesForSM=[];
    $scope.attributesForTemp[0]={
        'attributeCode': api.key.highTemp,
        'attributeValue': "25"
        };
    $scope.attributesForTemp[1]={
           'attributeCode': api.key.lowTemp,
         'attributeValue': "3"
        };   
    $scope.attributesForSM[0]={
          'attributeCode':   api.key.highSm,
          'attributeValue': "15.5"
        };
    $scope.attributesForSM[1]={
         'attributeCode':  api.key.lowSm,
         'attributeValue': "11.5"
        };
    $scope.attributesForSM[2]={
         'attributeCode':  api.key.soilType,
         'attributeValue': "Sandy Loam"
        };
    $scope.attributesForSM[3]={
         'attributeCode': api.key.wilting,
         'attributeValue': "8"
        };
    $scope.attributesForSM[4]={
         'attributeCode': api.key.fieldCapacity,
         'attributeValue': "18"
        };
    $scope.nameClicked=function() {
        $scope.name_changed=true;
    }  
    $scope.closeDeactivePopup=function(){
        popup_deactivate_message.close();
        // $state.go("step2_portB"); 

    }  
    if(flagService.flagList.activtedPortA){
        // $rootScope.request_dto_portA= $rootScope.request_dto_portA;
        $scope.sensor.assetName= $rootScope.request_dto_portA.assetName
        $scope.previous.assetName=$rootScope.request_dto_portA.assetName
        $scope.sensor.assetTypeCode=$rootScope.request_dto_portA.assetTypeCode
        $scope.previous.assetTypeCode=$rootScope.request_dto_portA.assetTypeCode
       
    }else{
        $rootScope.request_dto_portA={
            "organizationCode":flagService.flagList.activtedStation.organizationCode,
            "srNo": flagService.flagList.activtedStation.srNo+'.p1',
            "assetName":"No Sensor",
            "parentSrNo":flagService.flagList.activtedStation.srNo,
            "assetTypeCode":api.key.none,
            "timeZoneId":timeZoneId,
            // "assetLogin":flagService.flagList.activtedStation.srNo+'.p1',
            "alias":'p1'
            }
    }  
    $scope.close = function(){
        popup.close();
    }
    $scope.clickedYes=function(){
          $scope.close();
          $scope.save($scope.screen);     
    }
    $scope.clickedNo=function(){
          $scope.close();
          if($scope.previous.assetName=="No Sensor"&&$scope.previous.assetTypeCode==api.key.none){
            $scope.screen=screen
            popup_deactivate_message=$ionicPopup.show({
                templateUrl: deactivateMessage,
                scope: $scope,
                cssClass:'port-popup'
            });
        }else{
              $state.go($scope.screen);   
        }
        
    }
    $scope.changeSensorType=function(val){
        if(!$scope.name_changed){            
            if(val==$scope.sensorType.soil)
            $scope.sensor.assetName=defaultName.friendly_name.SM_friendly_name
            else if(val==$scope.sensorType.temp)
            $scope.sensor.assetName=defaultName.friendly_name.T_friendly_name
            else if(val==$scope.sensorType.none)
                $scope.sensor.assetName="No Sensor"
            }
            $scope.sensor.assetTypeCode=val;
    }
    $scope.gotoScreen=function(screen){   
        if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){
            $scope.screen=screen
            $scope.message="Would you like to save changes to Port A before moving to the next step?"  
            popup=$ionicPopup.show({
                templateUrl: customTemplate,
                scope: $scope,
                cssClass:'port-popup'
            });
        }
        else if($scope.previous.assetName=="No Sensor"&&$scope.previous.assetTypeCode==api.key.none){
            $scope.screen=screen
            popup_deactivate_message=$ionicPopup.show({
                templateUrl: deactivateMessage,
                scope: $scope,
                cssClass:'port-popup'
            });
        } else{
            $state.go(screen);
        }  
    }
    $scope.save=function(goto){
        if(flagService.flagList.activtedPortA){
        //console.log($scope.sensor)
          updateAssets($scope.sensor)
          $state.go(goto);   
        }else{
          $rootScope.request_dto_portA.assetTypeCode=$scope.sensor.assetTypeCode;
          $rootScope.request_dto_portA.assetName=$scope.sensor.assetName;
        //console.log($rootScope.request_dto_portA)
          cretaeAsset($rootScope.request_dto_portA)
          $state.go(goto);  
        }
       
    }
    function updateAssets(sensorOptions){
        if($scope.sensor.assetName==""){
            
        }else{
          if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
              showAlertService.showAlert("Please check Internet connection");	//native alert
              return false;
          }
          $ionicLoading.show({
              template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
          });
          assetsFactory.updateAssets($rootScope.request_dto_portA.assetId,sensorOptions)
          .success(function(data){
              $scope.previous.assetName=$scope.sensor.assetName;
              $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
              showAlertService.showAlert("Sensor in Port A is configured!")
              if(sensorOptions.assetTypeCode!=api.key.none) 
              setAttribute($rootScope.request_dto_portA.assetId);

          })
          .error(function(error){
            if(error==null)
            showAlertService.showAlert(api.errorMsg)
            else
            showAlertService.showAlert('Please try again later')
          }).finally(function(){
              $ionicLoading.hide();
          });
          }
  
    }
    function cretaeAsset(dto){
        if($scope.sensor.assetName==""){
          showAlertService.showAlert("Please provide asset name");	//native alert
        }else if($scope.sensor.assetTypeCode==""){
          showAlertService.showAlert("Please choose asset type");	//native alert
        }
        else{
          if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
            showAlertService.showAlert("Please check Internet connection");	//native alert
            return false;
          }
          $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
         });
          assetsFactory.registerAsset(dto)
          .success(function (response) {
              console.log(response);
              $scope.previous.assetName=$scope.sensor.assetName;
              $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
              $rootScope.request_dto_portA.assetId=response.result.assetId
              flagService.flagList.activtedPortA=true
              showAlertService.showAlert("Sensor in Port A is configured!")
              if(dto.assetTypeCode!=api.key.none) 
              setAttribute(response.result.assetId);
              
          })
          .error(function(error){
            if(error==null)
            showAlertService.showAlert(api.errorMsg)
            else
            // flagService.flagList.activtedPortA=false
            showAlertService.showAlert('Please try again later')
          })
          .finally(function () {
                $ionicLoading.hide();
            });
          }

    }
    function setAttribute(assetid){
        if($scope.sensor.assetTypeCode==api.key.temp)
        $scope.recordsToPost=$scope.attributesForTemp
        else
        $scope.recordsToPost=$scope.attributesForSM
        console.log($scope.recordsToPost);
        assetsFactory.assetattributesPost(assetid,$scope.recordsToPost).success(function(data){
                  
                  }).error(function(error){
                    console.log(error);
                });
        }
  }


  function StepTwoPortBController($state,flagService,$rootScope,$ionicLoading,checkConnectionService,showAlertService,assetsFactory,api,$scope,$ionicPopup) {
    var popup;
    $scope.name_changed=false;
    var defaultName=assetsFactory.default_Attribute_Value();
    $scope.sensor={"assetName":"No Sensor", "assetTypeCode":api.key.none} 
    $scope.previous={"assetName":"No Sensor", "assetTypeCode":api.key.none}  
    var timeZoneId=moment.tz.guess();
    $scope.sensorType={none:api.key.none,soil:api.key.soil,temp:api.key.temp}
    var popup_deactivate_message;
    var customTemplate='templates/popups/portSetup.html';
    var deactivateMessage="templates/popups/deactivateMessage.html";
    $scope.deactivate_message_heading='Please,setup the sensors first before moving to the next step'
    $scope.message=""
    $scope.attributesForTemp=[];
    $scope.attributesForSM=[];
    $scope.attributesForTemp[0]={
        'attributeCode': api.key.highTemp,
        'attributeValue': "25"
        };
        $scope.attributesForTemp[1]={
           'attributeCode': api.key.lowTemp,
           'attributeValue': "3"
        };
    $scope.attributesForSM[0]={
         'attributeCode':   api.key.highSm,
          'attributeValue': "15.5"
        };
    $scope.attributesForSM[1]={
         'attributeCode':  api.key.lowSm,
         'attributeValue': "11.5"
        };
    $scope.attributesForSM[2]={
         'attributeCode':  api.key.soilType,
         'attributeValue': "Sandy Loam"
        };
    $scope.attributesForSM[3]={
         'attributeCode': api.key.wilting,
         'attributeValue': "8"
        };
    $scope.attributesForSM[4]={
         'attributeCode': api.key.fieldCapacity,
         'attributeValue': "18"
        };
    
        $scope.nameClicked=function() {
            $scope.name_changed=true;
        }
        $scope.closeDeactivePopup=function(){
            popup_deactivate_message.close();
            $state.go("step2_portB"); 

        }
        $scope.gotoNext=function(){
             if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){
                $scope.screen=screen
                $scope.message="Would you like to save changes to Port B before moving to the next step?"  
                popup=$ionicPopup.show({
                    templateUrl: customTemplate,
                    scope: $scope,
                    cssClass:'port-popup'
                });
            }if($scope.previous.assetName=="No Sensor"&&$scope.previous.assetTypeCode==api.key.none){
                $scope.screen=screen
                popup_deactivate_message=$ionicPopup.show({
                    templateUrl: deactivateMessage,
                    scope: $scope,
                    cssClass:'port-popup'
                });
            }else{
                $state.go("step2_connection");
            }   
        }
    if(flagService.flagList.activtedPortB){
        // $rootScope.request_dto_portB= $rootScope.request_dto_portB;
        $scope.sensor.assetName= $rootScope.request_dto_portB.assetName
        $scope.previous.assetName=$rootScope.request_dto_portB.assetName
        $scope.sensor.assetTypeCode=$rootScope.request_dto_portB.assetTypeCode
        $scope.previous.assetTypeCode=$rootScope.request_dto_portB.assetTypeCode
    }else{
        $rootScope.request_dto_portB={
            "organizationCode":flagService.flagList.activtedStation.organizationCode,
            "srNo": flagService.flagList.activtedStation.srNo+'.p2',
            "assetName":"No Sensor",
            "parentSrNo":flagService.flagList.activtedStation.srNo,
            "assetTypeCode":api.key.none,
            "timeZoneId":timeZoneId,
            // "assetLogin":flagService.flagList.activtedStation.srNo+'.p2',
            "alias":'p2'
            }
    }  

    $scope.close = function(){
        popup.close();
    }
    $scope.clickedYes=function(){
          $scope.close();
          $scope.save($scope.screen); 
        //   $state.go();       
    }
    $scope.clickedNo=function(){
          $scope.close();
          $scope.sensor.assetName=$scope.previous.assetName
          $scope.sensor.assetTypeCode=$scope.previous.assetTypeCode
          $state.go("step2_portB");   
    }
    $scope.changeSensorType=function(val){
        if(!$scope.name_changed){           
            if(val==$scope.sensorType.soil)
            $scope.sensor.assetName=defaultName.friendly_name.SM_friendly_name
            else if(val==$scope.sensorType.temp)
            $scope.sensor.assetName=defaultName.friendly_name.T_friendly_name
            else if(val==$scope.sensorType.none)
                $scope.sensor.assetName="No Sensor"
            }
            $scope.sensor.assetTypeCode=val;
    }
    $scope.gotoScreen=function(screen){      
        if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){
            $scope.screen=screen
            $scope.message="Would you like to save changes to Port B before moving to the next step?"  
            popup=$ionicPopup.show({
                templateUrl: customTemplate,
                scope: $scope,
                cssClass:'port-popup'
            });
        }else{
            $state.go(screen);
        }   
    }
    $scope.save=function(goto){
        if(flagService.flagList.activtedPortB){
        //   console.log($scope.sensor)
             updateAssets($scope.sensor,goto)
        }else{
            $rootScope.request_dto_portB.assetTypeCode=$scope.sensor.assetTypeCode;
            $rootScope.request_dto_portB.assetName=$scope.sensor.assetName;
        //  console.log($rootScope.request_dto_portB)
            cretaeAsset($rootScope.request_dto_portB,goto)
        }
       
    }
    function updateAssets(sensorOptions,goto){
        if($scope.sensor.assetName==""){
            // step2_connection
        }else{
          if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
              showAlertService.showAlert("Please check Internet connection");	//native alert
              return false;
          }
          $ionicLoading.show({
              template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
          });
          assetsFactory.updateAssets($rootScope.request_dto_portB.assetId,sensorOptions)
          .success(function(data){
              $scope.previous.assetName=$scope.sensor.assetName;
              $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
              if(sensorOptions.assetTypeCode!=api.key.none) 
              setAttribute($rootScope.request_dto_portA.assetId);
              $state.go(goto)
           })
          .error(function(error){
            if(error==null)
            showAlertService.showAlert(api.errorMsg)
            else
            showAlertService.showAlert('Please try again later')
            if(goto!='step2_connection'){
                $state.go(goto)
            }
          }).finally(function(){
              $ionicLoading.hide();
          });
          }
  
    }
    function cretaeAsset(dto,goto){
        if($scope.sensor.assetName==""){
          showAlertService.showAlert("Please provide asset name");	//native alert
        }else if($scope.sensor.assetTypeCode==""){
          showAlertService.showAlert("Please choose asset type");	//native alert
        }
        else{
          if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
            showAlertService.showAlert("Please check Internet connection");	//native alert
            return false;
          }
          $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
         });
          assetsFactory.registerAsset(dto)
          .success(function (response) {
              console.log(response);
              $scope.previous.assetName=$scope.sensor.assetName;
              $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
              $rootScope.request_dto_portB.assetId=response.result.assetId
              flagService.flagList.activtedPortB=true
              if(dto.assetTypeCode!=api.key.none) 
              setAttribute(response.result.assetId);
              $state.go(goto);
              
          })
          .error(function(error){
            // flagService.flagList.activtedPortA=false
            if(error==null)
            showAlertService.showAlert(api.errorMsg)
            else        
            showAlertService.showAlert('Please try again later')
          })
          .finally(function () {
                $ionicLoading.hide();
          });
          }

    }

    function setAttribute(assetid){
        if($scope.sensor.assetTypeCode==api.key.temp)
        $scope.recordsToPost=$scope.attributesForTemp
        else
        $scope.recordsToPost=$scope.attributesForSM
        console.log($scope.recordsToPost);
        assetsFactory.assetattributesPost(assetid,$scope.recordsToPost).success(function(data){
                  }).error(function(error){
                    console.log(error);
                });
        }
  }
})();
