stationModule.controller('configController',function($rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
// $scope.stationDetail=configureStaionService.configStationDetail;
var customTemplate='templates/rename-station.html';

$rootScope.attributes={}
var popup;

function getStation(assetId){
    $scope.tempMetricCount=0;
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    });
    assetsFactory.assetsDetailInfo(assetId).success(function(data){
        configureStaionService.configStationDetail=data.result;
        $scope.stationDetail=data.result;
        $scope.station_name={"assetName":$scope.stationDetail.assetName}
        angular.forEach($scope.stationDetail.children, function(value, key){
            if(value.assetType.assetTypeCode==api.key.temp&&value.active){
                $scope.tempMetricCount=$scope.tempMetricCount+1;
            }
        });
        angular.forEach(data.result.attributes, function(value, key){
            var unit=$scope.stationDetail.organization.unitMeasurePref.substring(0,1);
            if(value.attributeCode==api.key.inversion){
                $rootScope.attributes[value.attributeCode]=value['attributeValue_'+unit]?value['attributeValue_'+unit]:value.attributeValue;
            }else{
                $rootScope.attributes[value.attributeCode]=value.attributeValue;
            }
            
        })
        // $state.go('portAsensor',{}, {reload: true});
    }).error(function(error){
        console.log(error);
    }).finally(function() {
        $ionicLoading.hide();
    });  
   }
if($rootScope.notificationAssetId!='none') {
    getStation($rootScope.notificationAssetId);
    $rootScope.notificationAssetId="none"
}else{
    $scope.tempMetricCount=0;
    $scope.stationDetail=configureStaionService.configStationDetail;
    $scope.station_name={"assetName":$scope.stationDetail.assetName}
    angular.forEach($scope.stationDetail.children, function(value, key){
        if(value.assetType.assetTypeCode==api.key.temp&&value.active){
            $scope.tempMetricCount=$scope.tempMetricCount+1;
        }
    });
    getAttribute()
}  
$scope.gotoSelectStationPg=function(){
    $state.go("configStationListView");
}
$scope.gotoTransmission=function(){
    configureStaionService.configStationDetail=$scope.stationDetail;
    $state.transitionTo("transmission");
}
$scope.gotoSensorSetup=function(){
    $state.transitionTo("portAsensor");
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
$scope.gotoSetNotification=function() {
    $state.transitionTo("set-notification-option");
}
$scope.gotoSetInversion=function() {
    console.log($scope.tempMetricCount)
    if($scope.tempMetricCount>1)
    $state.transitionTo("inversionAlert");
}
$scope.gotoSensorsList=function(){
     $state.transitionTo("sensors-list");
}

// ******************* Rename station popup functions***************
$scope.close = function() {
    popup.close();
}
$scope.save=function(name){
    $scope.station_name.assetName=name==""?$scope.stationDetail.srNo:name;
    popup.close();
    updateAssets();
    
}
$scope.changeName=function(){
    popup=$ionicPopup.show({
        templateUrl: customTemplate,
        scope: $scope,
        cssClass:'custom-popup'
    });
}

// ***********************************Function to Update Asset Name
function updateAssets(){
    if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
        showAlertService.showAlert("Please check Internet connection");	//native alert
        return false;
    }
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
     });

    assetsFactory.updateAssets($scope.stationDetail.assetId,$scope.station_name)
    .success(function(data){
        // console.log('succes');
    //    $('.headeTextDark').text($scope.station_name);
       $scope.stationDetail.assetName=$scope.station_name.assetName;

    })
    .error(function(error){
        if(error==null)
        showAlertService.showAlert(api.errorMsg)
    }).finally(function(){
        $ionicLoading.hide();
    });
}
// ****************************************************************************
//Navigate to map view for setting station location
$scope.gotoMap=function(station){
    if (device.platform == "Android") {
    cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
    if (status == "GRANTED") {
            cordova.plugins.diagnostic.isLocationEnabled(function (result) {
            if(result == false){
            showAlertService.showAlert('To continue, please turn on location from Settings');
            }else{
                    $rootScope.stationToLocate={
                    'stationDetail':station,
                    'lat':$rootScope.attributes[api.key.latitude],
                    'lng':$rootScope.attributes[api.key.longitude]
                    };
                    $state.transitionTo("setlocation");
            }
            });
        }
     });
    }else{
        $rootScope.stationToLocate={
            'stationDetail':station,
            'lat':isNaN($rootScope.attributes[api.key.latitude])?0:$rootScope.attributes[api.key.latitude],
            'lng':isNaN($rootScope.attributes[api.key.longitude])?0:$rootScope.attributes[api.key.longitude]
        };
        $state.transitionTo("setlocation");
    }


}
 
function getAttribute(){
    if (checkConnectionService.checkConnection() == false) {
        showAlertService.showAlert("Please check Internet connection");
        return false;
    }
    $ionicLoading.show({
        template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    });
    assetsFactory.assetsDetailInfo($scope.stationDetail.assetId).success(function(data){
        configureStaionService.configStationDetail=data.result;
        $scope.stationDetail=data.result;
        angular.forEach(data.result.attributes, function(value, key){
            var unit=$scope.stationDetail.organization.unitMeasurePref.substring(0,1);
            if(value.attributeCode==api.key.inversion){
                $rootScope.attributes[value.attributeCode]=value['attributeValue_'+unit]?value['attributeValue_'+unit]:value.attributeValue;
            }else{
                $rootScope.attributes[value.attributeCode]=value.attributeValue;
            }
            
        })
    console.log($rootScope.attributes)
    }).error(function(error){
        console.log(error);
    }).finally(function() {
    $ionicLoading.hide();
    });  
}

// ********************************

}).controller('set-notification-option',function($timeout,$rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
   checkConnectionService,	showAlertService,configureStaionService,cellService,emailService) {
    var user_email=window.localStorage.getItem("loginUserLclstrg"); 
   $scope.stationDetail=configureStaionService.configStationDetail;
   $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
   $scope.phoneFormat = /^(\+?\d{8,15}(,\+?\d{8,15})*)?$/;   
   $scope.valid={}
   $rootScope.attributes[api.key.smsOn]=$rootScope.attributes[api.key.smsOn]!="true"||$rootScope.attributes[api.key.smsOn]=="(Not Specified)"?false:true;
   $rootScope.attributes[api.key.emailOn]=$rootScope.attributes[api.key.emailOn]!="true"||$rootScope.attributes[api.key.emailOn]=="(Not Specified)"?false:true;
   $scope.active=true;
   var popup;
   var customTemplate='templates/popups/portSetup.html';
   $scope.message="Would you like to save your changes?";
   $scope.stationPostDataAttributes=[];
   $scope.stationPostDataAttributes[0]={'attributeCode': api.key.email,'attributeValue': ""};
   $scope.stationPostDataAttributes[1]={'attributeCode': api.key.sms,'attributeValue': ""};
   $scope.stationPostDataAttributes[2]={ "attributeCode" : api.key.emailOn, "attributeValue" : ""};
   $scope.stationPostDataAttributes[3]={"attributeCode" : api.key.smsOn,"attributeValue" : ""};
   $scope.stationPostDataAttributes[0].attributeValue=$rootScope.attributes[api.key.email];
   $scope.stationPostDataAttributes[1].attributeValue=$rootScope.attributes[api.key.sms];
   $scope.stationPostDataAttributes[2].attributeValue=$rootScope.attributes[api.key.emailOn]
   $scope.stationPostDataAttributes[3].attributeValue=$rootScope.attributes[api.key.smsOn]
    if($rootScope.attributes[api.key.email]=="(Not Specified)"||$rootScope.attributes[api.key.email]==undefined||$rootScope.attributes[api.key.email]==""){
        $rootScope.email_list=[user_email]
        $rootScope.attributes[api.key.email]= $rootScope.email_list;
        $scope.stationPostDataAttributes[0].attributeValue=user_email;
    }else{
        $rootScope.email_list=$rootScope.attributes[api.key.email].split(","); 
    }
    if($rootScope.attributes[api.key.sms]=="(Not Specified)"||$rootScope.attributes[api.key.sms]==undefined||$rootScope.attributes[api.key.sms]==""){
        $rootScope.phone_list=[null]
        $rootScope.attributes[api.key.sms]=$rootScope.phone_list;
    }else{
        $rootScope.phone_list=$rootScope.attributes[api.key.sms].split(",");
    }
    $scope.gotoConfig=function(){
            unSavePopup("config");
    }
    $scope.checkForChanges=function(){

        var phone_list= $rootScope.phone_list
        var email_list=$rootScope.email_list
        console.log(email_list+" n  "+$rootScope.attributes[api.key.email])
        console.log(phone_list+" n "+$rootScope.attributes[api.key.sms])
        if(email_list!=$rootScope.attributes[api.key.email]||phone_list!=$rootScope.attributes[api.key.sms]
        ||$scope.stationPostDataAttributes[2].attributeValue!=$rootScope.attributes[api.key.emailOn]||
        $scope.stationPostDataAttributes[3].attributeValue!=$rootScope.attributes[api.key.smsOn]){
            $scope.active=false;
        }else{
            $scope.active=true;
            
        }
    }
    function unSavePopup(page){
        $scope.page=page;
        var phone_list= $rootScope.phone_list
        var email_list=$rootScope.email_list
        console.log(email_list+" n "+$rootScope.attributes[api.key.email])
        console.log(phone_list+" n "+$rootScope.attributes[api.key.sms])
        if(email_list!=$rootScope.attributes[api.key.email]||phone_list!=$rootScope.attributes[api.key.sms]
            ||$scope.stationPostDataAttributes[2].attributeValue!=$rootScope.attributes[api.key.emailOn]||
            $scope.stationPostDataAttributes[3].attributeValue!=$rootScope.attributes[api.key.smsOn]){
            popup=$ionicPopup.show({
                templateUrl: customTemplate,
                scope: $scope,
                cssClass:'port-popup notification'
            });
        }else{
            $state.go($scope.page);    
        }
    }
    $scope.clickedYes=function(){
        $scope.close();
        $scope.save(true,$scope.page);
    }
    $scope.clickedNo=function(){
        $scope.close();
        $state.go($scope.page);   
    }
    $scope.close = function() {
        popup.close();
    }
    $scope.gotoDashboard=function(){
        //    $state.transitionTo("dashboardview");
           flagService.flagList.goToStationCongigPg='';
           unSavePopup("dashboardview");
    }
   
    $scope.gotoAlertview=function(){
        //    $state.transitionTo("alertview");
           flagService.flagList.goToStationCongigPg='';
           unSavePopup("alertview");
    }
   
    $scope.gotoCompareview=function(){
           $state.transitionTo("compareview");
           flagService.flagList.goToStationCongigPg='';   
    }
    $scope.gotoSettingview=function(){
        //    $state.transitionTo("settingview");
          unSavePopup("settingview");
    } 
    $scope.addEmail=function(){
           
             if($rootScope.email_list.length<10){
                $rootScope.email_list.push("");
                $scope.checkForChanges()
             }
               
    }
    $scope.addPhone=function(){
            if($rootScope.phone_list.length<10){
                $rootScope.phone_list.push(null);
                $scope.checkForChanges()
            }
           
    }
    $scope.remove=function(array,index,type){
        if(type){
            $rootScope.phone_list.splice(index, 1); 
            $scope.checkForChanges()
            angular.forEach($rootScope.phone_list,function(value ,key){
                var elem = document.getElementById("phone"+key);
                if(value!=undefined||value!=null){
                if(!cellService.checkPhoneNo(value)){
                elem.setAttribute("style","border-bottom: 1px solid #FA421e ");	
                }else{
                elem.setAttribute("style","border-bottom: 1px solid #998F8B ");	    
                }
                }{
                elem.setAttribute("style","border-bottom: 1px solid #998F8B ");	        
                }
            })
        }else{
            $rootScope.email_list.splice(index, 1); 
            $scope.checkForChanges()  
            angular.forEach($rootScope.email_list,function(value ,key){
                var elem = document.getElementById("email"+key);
                if(value!=undefined||value!=null||value!=""){
                if(!emailService.checkEmail(value)){
                    elem.setAttribute("style","border-bottom: 1px solid #FA421e ");	
                }else{
                    elem.setAttribute("style","border-bottom: 1px solid #998F8B ");	    
                } 
                }else{
                    elem.setAttribute("style","border-bottom: 1px solid #998F8B ");	        
                }
            })   
        }

    }
    $scope.validateInput=function(isEmail,value,index){
        if(isEmail){
            $rootScope.email_list[index]=value;
            console.log(value)
            $scope.checkForChanges()
            if(value!=undefined||value!=null){
                var elem = document.getElementById("email"+index);
                if(!emailService.checkEmail(value)){
                    $('#email_error'+index).fadeIn();
                    $timeout(function(){
                    $('#email_error'+index).fadeOut();
                    },2000)
                    elem.setAttribute("style","border-bottom: 1px solid #FA421e ");	     
                    }else{
                    elem.setAttribute("style","border-bottom: 1px solid #998F8B ");	  
                    }
                }
                else{
                $('#email_error'+index).fadeIn();
                $timeout(function(){
                $('#email_error'+index).fadeOut();
                },2000)
                }
        }else{
            $rootScope.phone_list[index]=value
            $scope.checkForChanges()
            if(value!=undefined||value!=null){
                var elem = document.getElementById("phone"+index);
                if(!cellService.checkPhoneNo(value)){
                    $('#phone_error'+index).fadeIn();
                    $timeout(function(){
                    $('#phone_error'+index).fadeOut();
                    },2000)
                    elem.setAttribute("style","border-bottom: 1px solid #FA421e ");	
                    }else{
                    elem.setAttribute("style","border-bottom: 1px solid #998F8B ");	    
                    }
                }else{
                $('#phone_error'+index).fadeIn();
                $timeout(function(){
                $('#phone_error'+index).fadeOut();
                },2000)
                }
        }  
    }
    $scope.save=function(config,goto){ 
            $scope.allGood=true
            if(config){
                $rootScope.phone_list= $rootScope.phone_list.filter(Boolean)
                $rootScope.email_list=$rootScope.email_list.filter(Boolean)
            }
            if($scope.stationPostDataAttributes[2].attributeValue&&$rootScope.email_list.length>0){
                $scope.allGood=true
                var joined=$rootScope.email_list.join(",");

                if(!emailService.checkEmail(joined)){
                    for(var i=0;i<$rootScope.email_list.length;i++){
                        if(!emailService.checkEmail($rootScope.email_list[i])){
                            var elem = document.getElementById("email"+i);
                            $('#email_error'+i).fadeIn();
                            $timeout(function(){
                            $('#email_error'+i).fadeOut();
                            },3000)
                            $scope.allGood=false;
                            elem.setAttribute("style","border-bottom: 1px solid #FA421e ");	
                            $ionicLoading.hide();
                            return false;
                        } 
                    }
                }else{
                    $scope.stationPostDataAttributes[0].attributeValue=joined
                }
            }else{
                $scope.stationPostDataAttributes[0].attributeValue=$rootScope.attributes[api.key.email]
            }
            console.log($scope.stationPostDataAttributes)
            if($scope.stationPostDataAttributes[3].attributeValue&&$rootScope.phone_list.length>0){ 
                var joined=$rootScope.phone_list.join(",");     
                console.log(joined) 
                $scope.allGood=true
                      if(!cellService.checkPhoneNo(joined)){
                        for(var i=0;i<$rootScope.phone_list.length;i++){
                            if(!cellService.checkPhoneNo($rootScope.phone_list[i])){
                                var elem = document.getElementById("phone"+i);
                                $('#phone_error'+i).fadeIn();
                                $timeout(function(){
                                $('#phone_error'+i).fadeOut();
                                },3000)
                                $scope.allGood=false;
                                $ionicLoading.hide();
                                elem.setAttribute("style","border-bottom: 1px solid #FA421e ");	
                                return false;
                                // break;
                            }
                            
                            
                        }
                       
                    }else{
                        $scope.stationPostDataAttributes[1].attributeValue=joined
                    }                
            }else{
                $scope.stationPostDataAttributes[1].attributeValue=$rootScope.attributes[api.key.sms]
                
            }
            if($rootScope.phone_list.length<=0){
                $scope.stationPostDataAttributes[1].attributeValue="(Not Specified)"
                $scope.stationPostDataAttributes[3].attributeValue=false;
            }
            if($rootScope.email_list.length<=0){
                $scope.stationPostDataAttributes[0].attributeValue="(Not Specified)"
                $scope.stationPostDataAttributes[2].attributeValue=false;
            }
            
            if(checkConnectionService.checkConnection() == false) {
            showAlertService.showAlert("Please check Internet connection");
            return false;
            }
            $ionicLoading.show({
                template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            }); 
            console.log($scope.stationPostDataAttributes)
        /* ***************Update Asset Attributes Service Call***************** */
            assetsFactory.assetattributesPost($scope.stationDetail.assetId,$scope.stationPostDataAttributes).success(function(data){
                if($rootScope.phone_list.length<=0&&$rootScope.email_list.length<=0)
                $scope.allGood=true;
                if(!$scope.stationPostDataAttributes[3].attributeValue&&!$scope.stationPostDataAttributes[3].attributeValue)
                $scope.allGood=true;
                if(config&&$scope.allGood)
                 $state.transitionTo(goto);									
            }).error(function(error){
                    showAlertService.showAlert("Error Saving ");
            }).finally(function(){
                $ionicLoading.hide();
            });
     
    }
}).controller('inversionAlertController',function($timeout,$rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService,cellService,emailService) {
    $scope.stationDetail=configureStaionService.configStationDetail;   
    $scope.stationPostDataAttributes=[] 
    $scope.sensorSelected=[]
    var popup;
    $scope.regx=/^\d+\.?\d{0,1}$/;   
    // var unit="attributeValue_"+$scope.stationDetail.organization.unitMeasurePref.substring(0,1);
    var unit="attributeValue";
    $scope.unit_value=unit;    
    var customTemplate='templates/sensors-list.html';
    $scope.stationPostDataAttributes[0]={'attributeCode': api.key.sensorTop,'attributeValue': ""};
    $scope.stationPostDataAttributes[1]={'attributeCode': api.key.sensorBottom,'attributeValue': ""};
    $scope.stationPostDataAttributes[2]={ "attributeCode" : api.key.inversion};
    $scope.stationPostDataAttributes[0].attributeValue=$rootScope.attributes[api.key.sensorTop];
    $scope.stationPostDataAttributes[1].attributeValue=$rootScope.attributes[api.key.sensorBottom];
    $scope.stationPostDataAttributes[2][unit]=isNaN(parseFloat($rootScope.attributes[api.key.inversion]))?0:+parseFloat($rootScope.attributes[api.key.inversion]).toFixed(1);
    $scope.inversionValue=$scope.stationPostDataAttributes[2][unit];
    $scope.unit=$scope.stationDetail.organization.unitMeasurePref==api.key.unit?'C':'F';
    $scope.maxDiff=$scope.stationDetail.organization.unitMeasurePref==api.key.unit?api.key.maxInversioninC:api.key.maxInversioninF;  
    console.log($scope.maxDiff)  
    var tempSensors=$scope.stationDetail.children.filter(function(item){
        if(item.srNo==$scope.stationPostDataAttributes[0].attributeValue){
            $scope.stationPostDataAttributes[0].assetName=item.assetName;
        }else if(item.srNo==$scope.stationPostDataAttributes[1].attributeValue){
            $scope.stationPostDataAttributes[1].assetName=item.assetName;
        }
        return item.assetType.assetTypeCode==api.key.temp;
    })      
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
   $scope.closePopup = function() {
            popup.close();
   }
   $scope.remove=function(index){
    $scope.stationPostDataAttributes[index].attributeValue="";
    $scope.stationPostDataAttributes[index].assetName="";
   }
   $scope.setSensor=function(sensor,index){
             $scope.sensorSelected[index] = true;
             $timeout(function(){
                $scope.sensorSelected[index] = false;
            },100)  
             $scope.stationPostDataAttributes[$scope.position].attributeValue=sensor.srNo;
             $scope.stationPostDataAttributes[$scope.position].assetName=sensor.assetName;
            //  console.log($scope.stationPostDataAttributes[$scope.position])
             popup.close();
    }
   $scope.openPopup=function(sensor,pos){     
            $scope.position=pos;  
            $scope.sensors=tempSensors.filter(function(item){
                // &&item.active;
                return (item.srNo!=sensor.attributeValue&&item.active)
            })
            $timeout(function(){
                popup=$ionicPopup.show({
                    templateUrl: customTemplate,
                    title:'Select Sensor',
                    scope: $scope,
                    cssClass:'sensor-list-popup'
                    });
            },10)  
           
    }
    $scope.gotoIncrementTempDiff=function(){
         $('#inversion').blur()
           if($scope.inversionValue<=$scope.maxDiff){
            $scope.inversionValue= $scope.inversionValue + 1;
            $('#inversion').val($scope.inversionValue)
            $scope.checkValue($scope.inversionValue)
           }
           if($scope.inversionValue==null){
            $('#inversion').val(1)
            $scope.checkValue($scope.inversionValue)
            }
    }
    $scope.gotoDecrementTempDiff=function(){
       
        if($scope.inversionValue>=1){
            $scope.inversionValue= $scope.inversionValue - 1;
            $('#inversion').val($scope.inversionValue)
            $scope.checkValue($scope.inversionValue)
        }
        if($scope.inversionValue==null){
            $('#inversion').val(0)
            $scope.checkValue($scope.inversionValue)
        }
    }
    $scope.checkValue=function(inversion){
        $scope.inversionValue=inversion
        console.log(inversion);
        var value=inversion==undefined||inversion==null?'-1000.55':inversion.toString();
        if(inversion<0||(inversion>($scope.maxDiff+1))){
            
            $('#inversion_error').html( "Please provide a valid number");
            $('.email_log').fadeIn();
        }else if(!value.match($scope.regx)){
            console.log("elseif")
            $('#inversion_error').html( "Please provide a valid number");
            $('.email_log').fadeIn();
            // $timeout(function(){
            // $('.email_log').fadeOut();
            // },2000)
            // return false;   
        }else{
            $('.email_log').fadeOut();
        }
    }    
    $scope.save=function(){
            var value=$scope.inversionValue==undefined||$scope.inversionValue==null?'-1000.55':$scope.inversionValue.toString();
            console.log($scope.stationPostDataAttributes)
          if($scope.stationPostDataAttributes[0].assetName==undefined||$scope.stationPostDataAttributes[1].assetName==undefined){
              showAlertService.showAlert("Please pick the sensors first");
          } 
          else if($scope.inversionValue<0||($scope.inversionValue>($scope.maxDiff+1))){   
            $('#inversion_error').html( "Please provide a valid number");
            $('.email_log').fadeIn();
            $timeout(function(){
            $('.email_log').fadeOut();
            },2000)  
           }else if(!value.match($scope.regx)){
            $('#inversion_error').html( "Please provide a valid number");
            $('.email_log').fadeIn();
            $timeout(function(){
            $('.email_log').fadeOut();
            },2000)
            // return false;   
        }else{
               /* ***************Update Asset Attributes Service Call***************** */
            if(checkConnectionService.checkConnection() == false) {
            showAlertService.showAlert("Please check Internet connection");
            return false;
            }
            $ionicLoading.show({
            template:'<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            });
            // console.log($scope.inversionValue+($scope.stationDetail.organization.unitMeasurePref==api.key.unit?'C':'F'))
            $scope.stationPostDataAttributes[2][unit]=$scope.inversionValue
            // +($scope.stationDetail.organization.unitMeasurePref==api.key.unit?'C':'F');   
            assetsFactory.assetattributesPost($scope.stationDetail.assetId,$scope.stationPostDataAttributes).success(function(data){
                showAlertService.showAlert("Saved successfully");
                $state.transitionTo("config");									
            }).error(function(error){
                    showAlertService.showAlert("Error Saving ");
            }).finally(function(){
                $ionicLoading.hide();
            });
          } 
       
    }
    });