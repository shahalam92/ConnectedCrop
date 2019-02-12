stationModule.controller('portAsensorController',function($ionicHistory,$rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
    $scope.stationDetail=configureStaionService.configStationDetail;
    var popup;
    var popup_restore;
    var popup_deactivate_message;
    var customTemplate='templates/popups/portSetup.html';
    var customTemplate_restore='templates/popups/restorePopup.html';
    var sensorListPage="templates/popups/archiveSensor.html";
    var deactivateMessage="templates/popups/deactivateMessage.html";
    var defaultName=assetsFactory.default_Attribute_Value();
    var length=$scope.stationDetail.children.length-1;
    $scope.deactivate_message_heading=' The readings from the previous sensor were separately archived and will not show on the Home screen. To view archived data, you can use the "Email Excel Report" option from the Home screen menu.'
    $scope.selectedSensor;
    $scope.createAsset=true; 
    $scope.name_changed=false;
    $scope.chld_assetType_none={}
    $scope.child_asset_option={}
    $scope.deactivate_sensor_option={}
    $scope.sensor_selected=[]
    $scope.stationPostDataAttributes=[]
    $scope.message="Would you like to archive the current sensor's readings separately from future readings?"
    $scope.sensor={"assetName":"", "assetTypeCode":api.key.none} 
    $scope.previous={"assetName":"", "assetTypeCode":api.key.none}  
    $scope.sensorType={none:api.key.none,soil:api.key.soil,temp:api.key.temp}
    // $scope.alias=$ionicHistory.currentStateName() === 'portBsensor'?'p2':'p1';
    $scope.alias='p1';
    $scope.attributesForTemp=[]
    $scope.attributesForSM=[]
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
    //***********tab bar navigation functions*************************
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
    $scope.gotoDashboard=function(){
        $state.transitionTo("dashboardview");
        flagService.flagList.goToStationCongigPg='';
    }
    $scope.nameClicked=function() {
        $scope.name_changed=true;
    }
    //************tab bar navigation functions ends*************************
    function createDefaultAsset(){
            $scope.sensor.assetName="No Sensor",
            $scope.previous.assetName="No Sensor",
            $scope.chld_assetType_none={
            active:true,
            // assetLogin:$scope.stationDetail.srNo+'.p1',
            srNo:$scope.stationDetail.srNo+'.'+$scope.alias,
            assetName:"No Sensor",
            alias:$scope.alias,
            assetTypeCode:api.key.none,
            parentSrNo:$scope.stationDetail.srNo,
            organizationCode:$scope.stationDetail.organization.organizationCode
        } 
        $scope.selectedSensor=$scope.chld_assetType_none;
        cretaeAsset($scope.chld_assetType_none);
    }
    angular.forEach($scope.stationDetail.children, function(value, key){
        if(value.active&&value.alias.toLowerCase()==$scope.alias){
            $scope.createAsset=false;
            $scope.selectedSensor=value;
            $scope.sensor.assetTypeCode=value.assetType.assetTypeCode;
            $scope.previous.assetTypeCode=value.assetType.assetTypeCode;
            $scope.sensor.assetName=value.assetName;
            $scope.previous.assetName=value.assetName;    
          }
        if($scope.createAsset&&key==length){  
            createDefaultAsset()
        }

    })
    if($scope.stationDetail.children.length==0){
        createDefaultAsset();
    }
    function deactivate(){
        var time=getCurrentdate();
        $scope.deactivate_sensor_option={
            active:false,
            assetName:$scope.previous.assetName,
            assetLogin:$scope.selectedSensor.srNo+"deactivated"+time,
            srNo:$scope.selectedSensor.srNo+"deactivated"+time,
            alias:$scope.alias+"_deactivated_on_"+time,
        }
    }
    // $scope.deactivate_sensor_option={
    //     active:false,
    //     assetLogin:$scope.selectedSensor.srNo+"deactivated"+getCurrentdate(),
    //     srNo:$scope.selectedSensor.srNo+"deactivated",
    //     alias:'p1'+"deactivated"+getCurrentdate(),
    // }
    $scope.child_asset_option={
        active:true,
        // assetLogin:$scope.selectedSensor.srNo,
        srNo:$scope.selectedSensor.srNo,
        assetName:$scope.sensor.assetName,
        alias:$scope.alias,
        assetTypeCode:$scope.sensor.assetTypeCode,
        parentSrNo:$scope.stationDetail.srNo,
        organizationCode:$scope.stationDetail.organization.organizationCode
    } 
    $ionicModal.fromTemplateUrl('templates/popups/infoModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.modal = modal;
    });   
    $scope.gotoInfo=function(){
        $scope.modal.show();
    }
    $scope.closeGotoInfo=function(){
        $scope.modal.hide();
    }
    $ionicModal.fromTemplateUrl(sensorListPage, {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.archiveModal = modal;
    });    
    $scope.gotoarchiveModal=function(){
        $scope.archiveModal.show();
    }
    $scope.gotoConfig=function(){
        $scope.archiveModal.hide();
    }
    $scope.close = function() {
        popup.close();
    }
    $scope.restore=function(response){
        if(response){
            $scope.gotoarchiveModal();
        }else{
            popup_restore.close();
            $scope.child_asset_option.assetName=$scope.sensor.assetName;
            $scope.child_asset_option.assetTypeCode=$scope.sensor.assetTypeCode,
            // updateAssets($scope.selectedSensor.assetId,$scope.child_asset_option,true);
            cretaeAsset($scope.child_asset_option);
        }
    }
    $scope.restore_cancel=function(response){
        popup_restore.close();            
    }
    $scope.closeDeactivePopup=function(){
        popup_deactivate_message.close();
        if($scope.openrestorepopup){
            popup_restore=$ionicPopup.show({
                templateUrl: customTemplate_restore,
                scope: $scope,
                cssClass:'port-popup'
            });
        }
    }
    $scope.changeSensorType=function(val){
        // console.log(val)
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
    function getCurrentdate(){
        var date=new Date();
        var currentDate=date.toISOString();
        return  currentDate;
    }
    function checkforArchived(){
        var tempSensors=$scope.stationDetail.children.filter(function(value){
            return value.assetType.assetTypeCode==$scope.sensor.assetTypeCode&&!value.active
        })
        return tempSensors;
    }
    $scope.gotoThresholds=function(sensor,index){
        var  activate_sensor_option={
             active:true,
             assetName:$scope.selectedSensor.assetName,
             assetLogin:$scope.selectedSensor.srNo,
             srNo:$scope.selectedSensor.srNo,
             alias:$scope.alias,
         }
         updateAssets(sensor.assetId,activate_sensor_option,false,true);
         popup_restore.close();
         $scope.gotoConfig();
         angular.forEach($scope.sensors, function(value, key){
             if(key==index){
             $scope.sensor_selected[key]=true;            
             }else{
             $scope.sensor_selected[key]=false
             }
         });
    }
    $scope.clickedYes=function(){
        $scope.close();
            if($scope.screen=='none'){
            if($scope.previous.assetTypeCode==api.key.none){
                deleteAsset($scope.selectedSensor.assetId)
            }else{
                var archivedSensors=checkforArchived()
                if(archivedSensors.length){
                     $scope.sensors=archivedSensors;
                     $scope.selectedSensor.assetName=$scope.sensor.assetName;
                     deactivate()
                     updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,false,false)
                    //  popup_restore=$ionicPopup.show({
                    //     templateUrl: customTemplate_restore,
                    //     scope: $scope,
                    //     cssClass:'port-popup'
                    //  });     
                }else{
                   deactivate();
                   updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,true,false)    
                }
            }   
         
            }else{
                $scope.save();
            } 
    }
    $scope.clickedNo=function(){
        $scope.close();
        if($scope.screen=='none'){
            updateAssetsNameOnly($scope.selectedSensor.assetId,$scope.sensor);
        }else{
            $state.go($scope.screen);
        }      
    }
    $scope.gotoScreen=function(screen){
        if($scope.previous.assetName!=$scope.sensor.assetName&&$scope.previous.assetTypeCode==$scope.sensor.assetTypeCode){
            $scope.screen=screen
            $scope.message="Would you like to save the changes before you leave this screen?"  
            popup=$ionicPopup.show({
                templateUrl: customTemplate,
                scope: $scope,
                cssClass:'port-popup'
            });
        }      
        else if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){
            $scope.screen=screen
            $scope.message="Would you like to save the changes before you leave this screen?"  
            popup=$ionicPopup.show({
                templateUrl: customTemplate,
                scope: $scope,
                cssClass:'port-popup'
            });
        }else{
            $state.go(screen);
        }   
    }
    $scope.save=function(){
        $scope.message="Would you like to archive the current sensor's readings separately from future readings?"
        if($scope.previous.assetName!=$scope.sensor.assetName&&$scope.previous.assetTypeCode==$scope.sensor.assetTypeCode){
            $scope.screen='none';
            popup=$ionicPopup.show({
                templateUrl: customTemplate,
                scope: $scope,
                cssClass:'port-popup'
            });
        }else if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){           
                if($scope.previous.assetTypeCode==api.key.none){
                    deleteAsset($scope.selectedSensor.assetId)
                }else{
                var archivedSensors=checkforArchived()
                if(archivedSensors.length){
                $scope.sensors=archivedSensors;
                $scope.selectedSensor.assetName=$scope.sensor.assetName;
                deactivate();
                updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,false,false)
                // popup_restore=$ionicPopup.show({
                //     templateUrl: customTemplate_restore,
                //     scope: $scope,
                //     cssClass:'port-popup'
                // });                 
                }else{
                deactivate();
                updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,true,false)    
                }
            }
        }
       
    }
    function updateAssetsNameOnly(sensorId,sensorOptions){
        if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
            showAlertService.showAlert("Please check Internet connection");	//native alert
            return false;
        }
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
         });
        assetsFactory.updateAssets(sensorId,sensorOptions)
        .success(function(data){
            $scope.name_changed=false;
            $scope.previous.assetName=$scope.sensor.assetName;
            $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
            $scope.selectedSensor.assetId=sensorId;        
        })
        .error(function(error){
            if(error==null)
            showAlertService.showAlert(api.errorMsg)
            else
            showAlertService.showAlert('Please try again later '+ error.message)
            // return false;
        //    console.log(error)
        }).finally(function(){
            $ionicLoading.hide();
        });
    }    
function updateAssets(sensorId,sensorOptions,istrue,fromArchive){
        if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
            showAlertService.showAlert("Please check Internet connection");	//native alert
            return false;
        }
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
         });
    
         console.log(sensorId)
         console.log(sensorOptions)
        assetsFactory.updateAssets(sensorId,sensorOptions)
        .success(function(data){
            $scope.name_changed=false;
            $scope.previous.assetName=$scope.sensor.assetName;
            $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
            $scope.selectedSensor.assetId=sensorId;        
            if(istrue){
                $scope.openrestorepopup=false
                $scope.child_asset_option.assetName=$scope.sensor.assetName;
                $scope.child_asset_option.assetTypeCode=$scope.sensor.assetTypeCode;
                cretaeAsset($scope.child_asset_option);
            }else{
                $scope.openrestorepopup=true
            }
            if(fromArchive){
                getAttribute()
                $scope.openrestorepopup=false
                $scope.deactivate_message_heading="The chosen sensor's readings are restored under Sensors Setup. You can now see it on the Home screen"
            }
                popup_deactivate_message=$ionicPopup.show({
                    templateUrl: deactivateMessage,
                    scope: $scope,
                    cssClass:'port-popup'
                }); 
        })
        .error(function(error){
            if(error==null)
            showAlertService.showAlert(api.errorMsg)
            else
            showAlertService.showAlert('Please try again later '+ error.message)
            // return false;
        //    console.log(error)
        }).finally(function(){
            $ionicLoading.hide();
        });
    }
function cretaeAsset(dto){
        dto.srNo=  dto.srNo.indexOf("deactivated")!= -1? dto.srNo.split("deactivated")[0]:dto.srNo;
        console.log(dto)
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
         });
        assetsFactory.registerAsset(dto)
        .success(function (response) {
            $scope.selectedSensor.assetId=response.result.assetId;
            if(dto.assetTypeCode!=api.key.none) 
            setAttribute($scope.selectedSensor.assetId);
            console.log(response)
            // getAttribute();
            })
        .error(function(error){
            // if(error==null)
            // showAlertService.showAlert(api.errorMsg)
            // else
            // showAlertService.showAlert('Please try again later '+ error.message)
        })
        .finally(function () {
               $ionicLoading.hide();
         });
    }
    function deleteAsset(assetid){
        // $ionicLoading.show({
        //     template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
        // });
        assetsFactory.deleteAsset(assetid)
        .success(function (response){
                $scope.previous.assetName=$scope.sensor.assetName;
                $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
                $scope.child_asset_option.assetName=$scope.sensor.assetName;
                $scope.child_asset_option.assetTypeCode=$scope.sensor.assetTypeCode;
                cretaeAsset($scope.child_asset_option);
               })
        .error(function(error){
            // if(error==null)
            // showAlertService.showAlert(api.errorMsg)
            // else
            // showAlertService.showAlert('Please try again later '+ error.message)
        })
        .finally(function () {
               $ionicLoading.hide();
         });
    }    
function getAttribute(){
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    });
    assetsFactory.assetsDetailInfo($scope.stationDetail.assetId).success(function(data){
        configureStaionService.configStationDetail=data.result;
        $scope.stationDetail=data.result;
        // $state.go('portAsensor',{}, {reload: true});
    }).error(function(error){
        console.log(error);
    }).finally(function() {
        $ionicLoading.hide();
    });  
   }

function setAttribute(assetid){
    if($scope.sensor.assetTypeCode==api.key.temp)
    $scope.recordsToPost=$scope.attributesForTemp
    else
    $scope.recordsToPost=$scope.attributesForSM
    console.log($scope.recordsToPost);
    assetsFactory.assetattributesPost(assetid,$scope.recordsToPost).success(function(data){
               getAttribute()
              }).error(function(error){
                console.log(error);
            });
    }
}).controller('portBsensorController',function($rootScope,$ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
        $scope.stationDetail=configureStaionService.configStationDetail;
        var popup;
        var popup_restore;
        var popup_deactivate_message;
        var customTemplate='templates/popups/portSetup.html';
        var customTemplate_restore='templates/popups/restorePopup.html';
        var sensorListPage="templates/popups/archiveSensor.html";
        var deactivateMessage="templates/popups/deactivateMessage.html";
        var defaultName=assetsFactory.default_Attribute_Value();
        var length=$scope.stationDetail.children.length-1;
        $scope.deactivate_message_heading=' The readings from the previous sensor were separately archived and will not show on the Home screen. To view archived data, you can use the "Email Excel Report" option from the Home screen menu.'
        $scope.selectedSensor;
        $scope.createAsset=true; 
        $scope.name_changed=false;
        $scope.chld_assetType_none={}
        $scope.child_asset_option={}
        $scope.deactivate_sensor_option={}
        $scope.sensor_selected=[]
        $scope.stationPostDataAttributes=[]
        $scope.message="Would you like to archive the current sensor's readings separately from future readings?"
        $scope.sensor={"assetName":"", "assetTypeCode":api.key.none} 
        $scope.previous={"assetName":"", "assetTypeCode":api.key.none}  
        $scope.sensorType={none:api.key.none,soil:api.key.soil,temp:api.key.temp}
        // $scope.alias=$ionicHistory.currentStateName() === 'portBsensor'?'p2':'p1';
        $scope.alias='p2';
        $scope.attributesForTemp=[]
        $scope.attributesForSM=[]
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
        //***********tab bar navigation functions*************************
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
        $scope.gotoDashboard=function(){
            $state.transitionTo("dashboardview");
            flagService.flagList.goToStationCongigPg='';
        }
        $scope.nameClicked=function() {
            $scope.name_changed=true;
        }
        //************tab bar navigation functions ends*************************
        function createDefaultAsset(){
                $scope.sensor.assetName="No Sensor",
                $scope.previous.assetName="No Sensor",
                $scope.chld_assetType_none={
                active:true,
                // assetLogin:$scope.stationDetail.srNo+'.p2',
                srNo:$scope.stationDetail.srNo+'.'+$scope.alias,
                assetName:"No Sensor",
                alias:$scope.alias,
                assetTypeCode:api.key.none,
                parentSrNo:$scope.stationDetail.srNo,
                organizationCode:$scope.stationDetail.organization.organizationCode
            } 
            $scope.selectedSensor=$scope.chld_assetType_none;
            cretaeAsset($scope.chld_assetType_none);
        }
        angular.forEach($scope.stationDetail.children, function(value, key){
            if(value.active&&value.alias.toLowerCase()==$scope.alias){
                $scope.createAsset=false;
                $scope.selectedSensor=value;
                $scope.sensor.assetTypeCode=value.assetType.assetTypeCode;
                $scope.previous.assetTypeCode=value.assetType.assetTypeCode;
                $scope.sensor.assetName=value.assetName;
                $scope.previous.assetName=value.assetName;    
              }
            if($scope.createAsset&&key==length){  
                createDefaultAsset()
            }
    
        })
        if($scope.stationDetail.children.length==0){
            createDefaultAsset();
        }
        function deactivate(){
            var time=getCurrentdate();
            $scope.deactivate_sensor_option={
                active:false,
                assetName:$scope.previous.assetName,
                assetLogin:$scope.selectedSensor.srNo+"deactivated"+time,
                srNo:$scope.selectedSensor.srNo+"deactivated"+time,
                alias:$scope.alias+"_deactivated_on_"+time,
            }
        }
        // $scope.deactivate_sensor_option={
        //     active:false,
        //     assetLogin:$scope.selectedSensor.srNo+"deactivated"+getCurrentdate(),
        //     srNo:$scope.selectedSensor.srNo+"deactivated",
        //     alias:'p2'+"deactivated"+getCurrentdate(),
        // }
        $scope.child_asset_option={
            active:true,
            // assetLogin:$scope.selectedSensor.srNo,
            srNo:$scope.selectedSensor.srNo,
            assetName:$scope.sensor.assetName,
            alias:$scope.alias,
            assetTypeCode:$scope.sensor.assetTypeCode,
            parentSrNo:$scope.stationDetail.srNo,
            organizationCode:$scope.stationDetail.organization.organizationCode
        } 
        $ionicModal.fromTemplateUrl('templates/popups/infoModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
            }).then(function(modal) {
            $scope.modal = modal;
        });   
        $scope.gotoInfo=function(){
            $scope.modal.show();
        }
        $scope.closeGotoInfo=function(){
            $scope.modal.hide();
        }
        $ionicModal.fromTemplateUrl(sensorListPage, {
            scope: $scope,
            animation: 'slide-in-up'
            }).then(function(modal) {
            $scope.archiveModal = modal;
        }); 
          
        $scope.gotoarchiveModal=function(){
            $scope.archiveModal.show();
        }
        $scope.gotoConfig=function(){
            $scope.archiveModal.hide();
        }
        $scope.close = function() {
            popup.close();
        }
        $scope.restore=function(response){
            if(response){
                $scope.gotoarchiveModal();
            }else{
                popup_restore.close();
                $scope.child_asset_option.assetName=$scope.sensor.assetName;
                $scope.child_asset_option.assetTypeCode=$scope.sensor.assetTypeCode,
                // updateAssets($scope.selectedSensor.assetId,$scope.child_asset_option,true);
                cretaeAsset($scope.child_asset_option);
            }
        }
        $scope.restore_cancel=function(response){
            popup_restore.close();            
        }
        $scope.closeDeactivePopup=function(){
            popup_deactivate_message.close();
            if($scope.openrestorepopup){
                popup_restore=$ionicPopup.show({
                    templateUrl: customTemplate_restore,
                    scope: $scope,
                    cssClass:'port-popup'
                });
            }
        }
     
        $scope.changeSensorType=function(val){
            // console.log(val)
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
        function getCurrentdate(){
            var date=new Date();
            var currentDate=date.toISOString();
            return  currentDate;
        }
        function checkforArchived(){
            var tempSensors=$scope.stationDetail.children.filter(function(value){
                return value.assetType.assetTypeCode==$scope.sensor.assetTypeCode&&!value.active
            })
            return tempSensors;
        }
        $scope.gotoThresholds=function(sensor,index){
            var  activate_sensor_option={
                 active:true,
                 assetName:$scope.selectedSensor.assetName,
                 assetLogin:$scope.selectedSensor.srNo,
                 srNo:$scope.selectedSensor.srNo,
                 alias:$scope.alias,
             }
             updateAssets(sensor.assetId,activate_sensor_option,false,true);
             popup_restore.close();
             $scope.gotoConfig();
             angular.forEach($scope.sensors, function(value, key){
                 if(key==index){
                 $scope.sensor_selected[key]=true;            
                 }else{
                 $scope.sensor_selected[key]=false
                 }
             });
        }
        $scope.clickedYes=function(){
            $scope.close();
                if($scope.screen=='none'){
                if($scope.previous.assetTypeCode==api.key.none){
                    deleteAsset($scope.selectedSensor.assetId)
                }else{
                    var archivedSensors=checkforArchived()
                    if(archivedSensors.length){
                         $scope.sensors=archivedSensors;
                         $scope.selectedSensor.assetName=$scope.sensor.assetName;
                         deactivate()
                         updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,false,false)
                        //  popup_restore=$ionicPopup.show({
                        //     templateUrl: customTemplate_restore,
                        //     scope: $scope,
                        //     cssClass:'port-popup'
                        //  });     
                    }else{
                    // $scope.selectedSensor.assetName=$scope.sensor.assetName;
                       deactivate();
                       updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,true,false)    
                    }
                }   
             
                }else{
                    $scope.save();
                } 
        }
        $scope.clickedNo=function(){
            $scope.close();
            if($scope.screen=='none'){
                updateAssetsNameOnly($scope.selectedSensor.assetId,$scope.sensor);
            }else{
                $state.go($scope.screen);
            }      
        }
        $scope.gotoScreen=function(screen){   
            if($scope.previous.assetName!=$scope.sensor.assetName&&$scope.previous.assetTypeCode==$scope.sensor.assetTypeCode){
                $scope.screen=screen
                $scope.message="Would you like to save the changes before you leave this screen?"  
                popup=$ionicPopup.show({
                    templateUrl: customTemplate,
                    scope: $scope,
                    cssClass:'port-popup'
                });
            }   
            else if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){
                $scope.screen=screen
                $scope.message="Would you like to save the changes before you leave this screen?"  
                popup=$ionicPopup.show({
                    templateUrl: customTemplate,
                    scope: $scope,
                    cssClass:'port-popup'
                });
            }else{
                $state.go(screen);
            }   
        }
        $scope.save=function(){
            $scope.message="Would you like to archive the current sensor's readings separately from future readings?"
            if($scope.previous.assetName!=$scope.sensor.assetName&&$scope.previous.assetTypeCode==$scope.sensor.assetTypeCode){
                $scope.screen='none';
                popup=$ionicPopup.show({
                    templateUrl: customTemplate,
                    scope: $scope,
                    cssClass:'port-popup'
                });
            }else if($scope.previous.assetName!=$scope.sensor.assetName||$scope.previous.assetTypeCode!=$scope.sensor.assetTypeCode){           
                    if($scope.previous.assetTypeCode==api.key.none){
                        deleteAsset($scope.selectedSensor.assetId)
                    }else{
                    var archivedSensors=checkforArchived()
                    if(archivedSensors.length){
                    $scope.sensors=archivedSensors;
                    $scope.selectedSensor.assetName=$scope.sensor.assetName;
                    deactivate();
                    updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,false,false)               
                    }else{
                    deactivate();
                    updateAssets($scope.selectedSensor.assetId,$scope.deactivate_sensor_option,true,false)    
                    }
                }
            }
           
        }
        function updateAssetsNameOnly(sensorId,sensorOptions){
            if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
                showAlertService.showAlert("Please check Internet connection");	//native alert
                return false;
            }
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
             });
            assetsFactory.updateAssets(sensorId,sensorOptions)
            .success(function(data){
                $scope.name_changed=false;
                $scope.previous.assetName=$scope.sensor.assetName;
                $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
                $scope.selectedSensor.assetId=sensorId;        
            })
            .error(function(error){
                if(error==null)
                showAlertService.showAlert(api.errorMsg)
                else
                showAlertService.showAlert('Please try again later '+ error.message)
                // return false;
            //    console.log(error)
            }).finally(function(){
                $ionicLoading.hide();
            });
        }    
    function updateAssets(sensorId,sensorOptions,istrue,fromArchive){
            if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
                showAlertService.showAlert("Please check Internet connection");	//native alert
                return false;
            }
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
             });
        
             console.log(sensorId)
             console.log(sensorOptions)
            assetsFactory.updateAssets(sensorId,sensorOptions)
            .success(function(data){
               $scope.name_changed=false;
                $scope.previous.assetName=$scope.sensor.assetName;
                $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
                $scope.selectedSensor.assetId=sensorId;        
                if(istrue){
                    $scope.openrestorepopup=false
                    $scope.child_asset_option.assetName=$scope.sensor.assetName;
                    $scope.child_asset_option.assetTypeCode=$scope.sensor.assetTypeCode;
                    cretaeAsset($scope.child_asset_option);
                }else{
                    $scope.openrestorepopup=true
                }
                if(fromArchive){
                     getAttribute()
                    $scope.openrestorepopup=false
                    $scope.deactivate_message_heading="The chosen sensor's readings are restored under Sensors Setup. You can now see it on the Home screen "
                }
              
                    popup_deactivate_message=$ionicPopup.show({
                        templateUrl: deactivateMessage,
                        scope: $scope,
                        cssClass:'port-popup'
                    });        
    
                // return true;
            //    $scope.stationDetail.selectedSensor.assetName=$scope.station_name.assetName;
            })
            .error(function(error){
                if(error==null)
                showAlertService.showAlert(api.errorMsg)
                else
                showAlertService.showAlert('Please try again later '+ error.message)
                // return false;
            //    console.log(error)
            }).finally(function(){
                $ionicLoading.hide();
            });
        }
    function cretaeAsset(dto){
            dto.srNo=  dto.srNo.indexOf("deactivated")!= -1? dto.srNo.split("deactivated")[0]:dto.srNo;
            console.log(dto)
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
             });
            assetsFactory.registerAsset(dto)
            .success(function (response) {
                $scope.selectedSensor.assetId=response.result.assetId;
                if(dto.assetTypeCode!=api.key.none) 
                setAttribute($scope.selectedSensor.assetId);
                console.log(response)
                // getAttribute();
                })
            .error(function(error){
                // if(error==null)
                // showAlertService.showAlert(api.errorMsg)
                // else
                // showAlertService.showAlert('Please try again later '+ error.message)
            })
            .finally(function () {
                   $ionicLoading.hide();
             });
        }
        function deleteAsset(assetid){
            // $ionicLoading.show({
            //     template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            // });
            assetsFactory.deleteAsset(assetid)
            .success(function (response){
                    $scope.previous.assetName=$scope.sensor.assetName;
                    $scope.previous.assetTypeCode=$scope.sensor.assetTypeCode;
                    $scope.child_asset_option.assetName=$scope.sensor.assetName;
                    $scope.child_asset_option.assetTypeCode=$scope.sensor.assetTypeCode;
                    cretaeAsset($scope.child_asset_option);
                   })
            .error(function(error){
                // if(error==null)
                // showAlertService.showAlert(api.errorMsg)
                // else
                // showAlertService.showAlert('Please try again later '+ error.message)
            })
            .finally(function () {
                   $ionicLoading.hide();
             });
        }    
    function getAttribute(){
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
        });
        assetsFactory.assetsDetailInfo($scope.stationDetail.assetId).success(function(data){
            configureStaionService.configStationDetail=data.result;
            $scope.stationDetail=data.result;
            // $state.go('portAsensor',{}, {reload: true});
        }).error(function(error){
            console.log(error);
        }).finally(function() {
            $ionicLoading.hide();
        });  
       }
    
    function setAttribute(assetid){
        if($scope.sensor.assetTypeCode==api.key.temp)
        $scope.recordsToPost=$scope.attributesForTemp
        else
        $scope.recordsToPost=$scope.attributesForSM
        console.log($scope.recordsToPost);
        assetsFactory.assetattributesPost(assetid,$scope.recordsToPost).success(function(data){
                   getAttribute()
                  }).error(function(error){
                    console.log(error);
                });
        }
});