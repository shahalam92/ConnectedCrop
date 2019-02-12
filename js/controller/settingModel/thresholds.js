stationModule.controller('thresholdSMController',function($rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
$scope.unit='%';
$scope.regx=/^\d+\.?\d{0,1}$/; 
$scope.valid={
    wiltingPointValue:false,
    fieldCapacityValue:false,
    highSoilMoisValue:false,
    lowSoilMoisValue:false
}
$scope.message="Please provide a valid number between 0%-60%"
$scope.stationDetail=configureStaionService.configStationDetail;
var Default=assetsFactory.default_Attribute_Value();
$scope.station_name={"assetName":$scope.stationDetail.selectedSensor.assetName}
$scope.stationPostDataAttributes=[]
$scope.stationPostDataAttributes[0]={ "attributeCode" : api.key.soilType};
$scope.stationPostDataAttributes[1]={"attributeCode" : api.key.wilting};
$scope.stationPostDataAttributes[2]={"attributeCode" : api.key.fieldCapacity};
$scope.stationPostDataAttributes[3]={"attributeCode" : api.key.highSm};
$scope.stationPostDataAttributes[4]={"attributeCode" : api.key.lowSm}; 
$scope.soilOptions= assetsFactory.default_Attribute_Value().soilType;
$scope.default={
    wiltingPointValue:isNaN(parseFloat($rootScope.attributes[api.key.wilting]))?Default.soilType[7].wiltingPoint:+parseFloat($rootScope.attributes[api.key.wilting]).toFixed(1),
    soilTypeValue:$rootScope.attributes[api.key.soilType]=="(Not Specified)"?Default.soilType[7].soilType:$rootScope.attributes[api.key.soilType],
    fieldCapacityValue:isNaN(parseFloat($rootScope.attributes[api.key.fieldCapacity]))?Default.soilType[7].fieldcapacity:+parseFloat($rootScope.attributes[api.key.fieldCapacity]).toFixed(1),
    highSoilMoisValue:isNaN(parseFloat($rootScope.attributes[api.key.highSm]))?Default.soilType[7].highThreshold:+parseFloat($rootScope.attributes[api.key.highSm]).toFixed(1),
    lowSoilMoisValue:isNaN(parseFloat($rootScope.attributes[api.key.lowSm]))?Default.soilType[7].lowThreshold:+parseFloat($rootScope.attributes[api.key.lowSm]).toFixed(1),
};
$scope.maxValue=59;
$scope.minValue=1;
$scope.gotoConfig=function(){
         $state.transitionTo("config");
}
$scope.gotoInfo=function(){
     $state.go("soilinfo");
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
$scope.gotoSensorsList=function(){
    $state.transitionTo("sensors-list");
}
// ********************************************************
$scope.incrementSoilHigh=function(){

    if( $scope.default.highSoilMoisValue<=$scope.maxValue)
    $scope.default.highSoilMoisValue =  $scope.default.highSoilMoisValue + 1;
    $scope.checkValue($scope.default.highSoilMoisValue,'highSoilMoisValue')
}
$scope.decrementSoilHigh=function(){
 
    if( $scope.default.highSoilMoisValue>=$scope.minValue)
    $scope.default.highSoilMoisValue = $scope.default.highSoilMoisValue - 1;
    $scope.checkValue($scope.default.highSoilMoisValue,'highSoilMoisValue')
}
$scope.incrementSoilLow =function(){
   
    if( $scope.default.lowSoilMoisValue<=$scope.maxValue)
    $scope.default.lowSoilMoisValue =  $scope.default.lowSoilMoisValue + 1;
    $scope.checkValue($scope.default.lowSoilMoisValue,'lowSoilMoisValue')
}
$scope.decrementSoilLow=function(){
   
    if( $scope.default.lowSoilMoisValue>=$scope.minValue)
    $scope.default.lowSoilMoisValue =  $scope.default.lowSoilMoisValue - 1;
    $scope.checkValue($scope.default.lowSoilMoisValue,'lowSoilMoisValue')
}
$scope.incrementWilting=function(){
   
    if( $scope.default.wiltingPointValue<=$scope.maxValue)
    $scope.default.wiltingPointValue =  $scope.default.wiltingPointValue + 1;
    $scope.checkValue($scope.default.wiltingPointValue,'wiltingPointValue')
}
$scope.decrementWilting=function(){
   
    if( $scope.default.wiltingPointValue>=$scope.minValue)
    $scope.default.wiltingPointValue = $scope.default.wiltingPointValue - 1;
    $scope.checkValue($scope.default.wiltingPointValue,'wiltingPointValue')
}
$scope.incrementField =function(){
    
    if( $scope.default.fieldCapacityValue<=$scope.maxValue)
    $scope.default.fieldCapacityValue =  $scope.default.fieldCapacityValue + 1;
    $scope.checkValue($scope.default.fieldCapacityValue,'fieldCapacityValue')
}
$scope.decrementField=function(){
   
    if( $scope.default.fieldCapacityValue>=$scope.minValue)
    $scope.default.fieldCapacityValue =  $scope.default.fieldCapacityValue - 1;
    $scope.checkValue($scope.default.fieldCapacityValue,'fieldCapacityValue')
}

// ******************************************************************************************
$scope.setDefaultSoil=function(){
    var isfound=0
    for(var i=0;i<$scope.soilOptions.length;i++){
        if($scope.soilOptions[i].soilType==$scope.default.soilTypeValue){
            $scope.selectedSoil=$scope.soilOptions[i];
            isfound=1;
            break;
        }
        if(!isfound){
            $scope.selectedSoil=$scope.soilOptions[7];
        }
    }

   }
$scope.setDefaultSoil();    
$scope.changeSoilType = function(soil){
     $scope.selectedSoil = soil;
     if(soil){
         $scope.default.highSoilMoisValue=soil.highThreshold;
         $scope.default.lowSoilMoisValue=soil.lowThreshold;
         $scope.default.wiltingPointValue=soil.wiltingPoint;
         $scope.default.fieldCapacityValue=soil.fieldcapacity;
         $scope.default.soilTypeValue=soil.soilType;
     }else{
         $scope.default.soilTypeValue=$scope.Options[7];
     }
   }
   $scope.checkValue=function(data,id){
    // console.log(id)
    // console.log(data)
    validate(data,id);
    
    }
    
   function validate(data,id){
       $scope.default[id]=data;
       var value=data==undefined||data==null?'-1000.55':data.toString();
        if(data<($scope.minValue-1)||(data>($scope.maxValue+1))){
            // console.log("inif")
            $('.'+id).fadeIn();
            $scope.valid[id]=true;
            
        }else if(!value.match($scope.regx)){
            // console.log("elseif")
            $('.'+id).fadeIn(); 
            $scope.valid[id]=true;          
        }else{
            $('.'+id).fadeOut();
            $scope.valid[id]=false;
        }
   } 
// ******************************************************************************************   
$scope.save=function(){
       if($scope.valid["wiltingPointValue"]||$scope.valid["fieldCapacityValue"]||$scope.valid["highSoilMoisValue"]||$scope.valid["lowSoilMoisValue"]){

       }else{
        if(checkConnectionService.checkConnection() == false) {
        showAlertService.showAlert("Please check Internet connection");
        return false;
        }
        $ionicLoading.show({
            template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
        }); 
        // +($scope.unit);
        $scope.stationPostDataAttributes[0].attributeValue=$scope.default.soilTypeValue
        $scope.stationPostDataAttributes[1].attributeValue=$scope.default.wiltingPointValue  
        $scope.stationPostDataAttributes[2].attributeValue=$scope.default.fieldCapacityValue
        $scope.stationPostDataAttributes[3].attributeValue=$scope.default.highSoilMoisValue
        $scope.stationPostDataAttributes[4].attributeValue=$scope.default.lowSoilMoisValue
   
        // console.log($scope.stationPostDataAttributes)
        updateAssets();
    /* ***************Update Asset Attributes Service Call***************** */
        assetsFactory.assetattributesPost($scope.stationDetail.selectedSensor.assetId,$scope.stationPostDataAttributes).success(function(data){
            // showAlertService.showAlert("Saved successfully");
            $state.transitionTo("sensors-list");									
        }).error(function(error){
                showAlertService.showAlert("Error Saving ");
        }).finally(function(){
            $ionicLoading.hide();
        });
       }
       
 
}
function updateAssets(){
    if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
        showAlertService.showAlert("Please check Internet connection");	//native alert
        return false;
    }
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
     });
    assetsFactory.updateAssets($scope.stationDetail.selectedSensor.assetId,$scope.station_name)
    .success(function(data){
       $scope.stationDetail.selectedSensor.assetName=$scope.station_name.assetName;

    })
    .error(function(error){
    //    console.log(error)
    }).finally(function(){
        $ionicLoading.hide();
    });
}
}).controller('thresholdTEMPController',function($rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
checkConnectionService,	showAlertService,configureStaionService) {
$scope.stationDetail=configureStaionService.configStationDetail;
$scope.station_name={"assetName":$scope.stationDetail.selectedSensor.assetName}
$scope.stationPostDataAttributes=[]
$scope.regx=/^[+-]?\d+\.?\d{0,1}$/;   
var u=$scope.stationDetail.organization.unitMeasurePref==api.key.unit?'C':'F';
$scope.maxValue=u=='C'?api.key.maxTempinC:api.key.maxTempinF;
$scope.minValue=u=='C'?api.key.minTempinC:api.key.minTempinF;
var incrementValue=u=='C'?1:2;
$scope.unit=u
$scope.message=u=='C'?"Please provide a valid number between -55 to 70 C":"Please provide a valid number between -67 to 158 F"
$scope.stationPostDataAttributes[0]={'attributeCode': api.key.highTemp};
$scope.stationPostDataAttributes[1]={'attributeCode': api.key.lowTemp};
console.log($rootScope.attributes)
$scope.threshold={high:isNaN(parseFloat($rootScope.attributes[api.key.highTemp]))?25:+parseFloat($rootScope.attributes[api.key.highTemp]).toFixed(1),
                  low:isNaN(parseFloat($rootScope.attributes[api.key.lowTemp]))?3:+parseFloat($rootScope.attributes[api.key.lowTemp]).toFixed(1)}
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
$scope.gotoSensorsList=function(){
    $state.transitionTo("sensors-list");
}
// ******************************************************************************************
$scope.gotoIncrementTempHeigh=function(){
    
    if($scope.threshold.high<=$scope.maxValue)
    $scope.threshold.high = $scope.threshold.high + incrementValue;
    $scope.checkValue($scope.threshold.high,'temp_high_log')
}
$scope.gotoDecrementTempHeigh=function(){
    
    if($scope.threshold.high>=$scope.minValue)
    $scope.threshold.high = $scope.threshold.high - incrementValue;
    $scope.checkValue($scope.threshold.high,'temp_high_log')
}
$scope.gotoIncrementTempLow=function(){
   
    if($scope.threshold.low<=$scope.maxValue)
    $scope.threshold.low = $scope.threshold.low + incrementValue;
    $scope.checkValue($scope.threshold.low,'temp_low_log')
}
$scope.gotoDecrementTempLow=function(){
    
    if($scope.threshold.low>=$scope.minValue)
    $scope.threshold.low = $scope.threshold.low - incrementValue;
    $scope.checkValue($scope.threshold.low,'temp_low_log')
}

$scope.checkValue=function(threshold,id){
// console.log(id)
    if(id=='temp_low_log'){
        $scope.threshold.low=threshold;
    }else{
        $scope.threshold.high=threshold;
    }
    // console.log(threshold);
    var value=threshold==undefined||threshold==null?'-1000.55':threshold.toString();
    // var value=threshold?threshold.toString():null;
    if(threshold<($scope.minValue-1)||(threshold>($scope.maxValue+1))){
        $('.'+id).fadeIn();
    }else if(!value.match($scope.regx)){
        $('.'+id).fadeIn();  
    }else{
        $('.'+id).fadeOut();
    }

} 
// ******************************************************************************************   
$scope.save=function(){
         var value=$scope.threshold.high==undefined||$scope.threshold.high==null?'-1000.55':$scope.threshold.high.toString();   
         var value2=$scope.threshold.low==undefined||$scope.threshold.low==null?'-1000.55':$scope.threshold.low.toString();   
         if($scope.threshold.high<($scope.minValue-1)||($scope.threshold.high>($scope.maxValue+1))){   
            $('.temp_high_log').fadeIn();
            $timeout(function(){
            $('.temp_high_log').fadeOut();
            },2000)  
          }
         else if(!value.match($scope.regx)){
            $('.temp_high_log').fadeIn();
            $timeout(function(){
            $('.temp_high_log').fadeOut();
            },2000)
            // return false;   
         }else if($scope.threshold.low<($scope.minValue-1)||($scope.threshold.low>($scope.maxValue+1))){   
            $('.temp_low_log').fadeIn();
            $timeout(function(){
            $('.temp_low_log').fadeOut();
            },2000)  
          }else if(!value2.match($scope.regx)){
            $('.temp_low_log').fadeIn();
            $timeout(function(){
            $('.temp_low_log').fadeOut();
            },2000)
            // return false;   
        }else{
        if(checkConnectionService.checkConnection() == false) {
            showAlertService.showAlert("Please check Internet connection");
            return false;
            }
        $ionicLoading.show({
            template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
        });
        $scope.stationPostDataAttributes[0].attributeValue=$scope.threshold.high+(u);  
        $scope.stationPostDataAttributes[1].attributeValue=$scope.threshold.low+(u);  
        // console.log($scope.stationPostDataAttributes)
        // console.log($rootScope.attributes)
        updateAssets();
    /* ***************Update Asset Attributes Service Call***************** */
        assetsFactory.assetattributesPost($scope.stationDetail.selectedSensor.assetId,$scope.stationPostDataAttributes).success(function(data){
            $state.transitionTo("sensors-list");								
        }).error(function(error){
                if(error==null)
                showAlertService.showAlert(api.errorMsg)
                else
                showAlertService.showAlert("Error Saving ");
        }).finally(function(){
            $ionicLoading.hide();
        });
         }
        
 
}
function updateAssets(){
    // if (checkConnectionService.checkConnection()== false) { //chek for inernet connection
    //     showAlertService.showAlert("Please check Internet connection");	//native alert
    //     return false;
    // }
    // $ionicLoading.show({
    //     template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    //  });
    assetsFactory.updateAssets($scope.stationDetail.selectedSensor.assetId,$scope.station_name)
    .success(function(data){
       $scope.stationDetail.selectedSensor.assetName=$scope.station_name.assetName;

    })
    .error(function(error){
    //    console.log(error)
    }).finally(function(){
        // $ionicLoading.hide();
    });
}
});