(function(){
    angular.module('stationModule').controller('StepOneController',StepOneController);
    StepOneController.$inject=['$state','$timeout','$rootScope','assetsFactory','showAlertService','checkConnectionService','$ionicLoading','flagService','$scope','api','$ionicModal']
    function StepOneController($state,$timeout,$rootScope,assetsFactory,showAlertService,checkConnectionService,$ionicLoading,flagService,$scope,api,$ionicModal) {
              //
              
              var vm=this;
              var defaultName=assetsFactory.default_Attribute_Value();
              var timeZoneId=moment.tz.guess();
              vm.showPopUp=false;
              vm.collapsed=false;
              vm.disabled=false;
              var dateFormat = "YYYY-MM-DD";
              // !moment($scope.newUser.birth_date_custom, dateFormat, true).isValid()
              vm.request_dto={
                    "organizationCode":'none',
                    "srNo":'',
                    "assetName":'',
                    "assetTypeCode":'CC.STATION',
                    "timeZoneId":timeZoneId,
                    "assetLogin":'',
              }
              
              /*Functions*/
              vm.goBack=goBack;
              vm.organizationService=organizationService;
            //  vm.registraionService=registraionService;
              vm.register=register;
              vm.scanBarCode=ionic.Platform.isAndroid()?cameraPermission:scanBarCode;
              currentLoct()
              vm.organizationService();  
              $("#srNo").keydown (function (e) {
                  $('#srNo').css("border-color","#DAD7D7")
              });
              $("#0").keydown (function (e) {
                $('#0').css("border-color","#DAD7D7")
              });
              $("#2").keydown (function (e) {
                $('#2').css("border-color","#DAD7D7")
              });
              $("#3").keydown (function (e) {
                $('#3').css("border-color","#DAD7D7")
              });
              $("#4").keydown (function (e) {
                $('#4').css("border-color","#DAD7D7")
              });
              $("#5").keydown (function (e) {
                $('#5').css("border-color","#DAD7D7")
              });
                //***********************************Variable Initialization *******************************

              vm.stationPostDataAttributes=[];
              vm.stationPostDataAttributes[0]={
              'attributeCode': api.key.HWversion,
              'attributeValue': ""
              };
              vm.stationPostDataAttributes[1]={
              'attributeCode': "PCBversion",
              'attributeValue': "(Not Specified)"
              };

              vm.stationPostDataAttributes[2]={
              'attributeCode': api.key.InitFWversion,
              'attributeValue': ""
              };

              vm.stationPostDataAttributes[3]={
              'attributeCode': api.key.BLversion,
              'attributeValue': ""
              };
              vm.stationPostDataAttributes[4]={
              "attributeCode" : api.key.ICCID,
              "attributeValue" : ""
              };
              vm.stationPostDataAttributes[5]={
              "attributeCode" : api.key.MFGdate,
              "attributeValue" : ""
              };
              vm.stationPostDataAttributes[6]={
              'attributeCode': api.key.TransFreq,
              'attributeValue': "60"
              };
              vm.stationPostDataAttributes[7]={
              "attributeCode" : api.key.latitude,
              "attributeValue" : "(Not Specified)"
              };
              vm.stationPostDataAttributes[8]={
              "attributeCode" : api.key.longitude,
              "attributeValue" : "(Not Specified)"
              };
              vm.stationPostDataAttributes[9]={
              "attributeCode" : api.key.email,
              "attributeValue" : window.localStorage.getItem("loginUserLclstrg")
              };
              vm.stationPostDataAttributes[10]={
              'attributeCode': api.key.emailOn,
              'attributeValue': false
              };
              vm.stationPostDataAttributes[11]={
              "attributeCode" : api.key.smsOn,
              "attributeValue" : false
              };
              vm.stationPostDataAttributes[12]={
              "attributeCode" : api.key.OSversion,
              "attributeValue" : ionic.Platform.platform()
              };//Variable Initialization End
              vm.stationPostDataAttributes[13]={
                'attributeCode': api.key.inversion,
                'attributeValue': "2"
                }; 
              
              function currentLoct(){    //**************current location function Start
                // Current location success callback function
                  var onSuccess = function(position) {
                    vm.stationPostDataAttributes[7].attributeValue = position.coords.latitude?position.coords.latitude:"(Not Specified)";
                    vm.stationPostDataAttributes[8].attributeValue = position.coords.longitude?position.coords.longitude:"(Not Specified)";
                  }
                  // currrent Loation Callback onError  ,receives a PositionError object
                  function onError(error) {
                  }
                  navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });
              }
              function multiSearch(text, searchWordsArray){
                    return assetsFactory.checkAssetMetricType(text, searchWordsArray);
              }
              function goBack(){
                    $state.transitionTo("settingview");
              }
              /**
              Organization list popup model controller &function
              ************************************************************************************/
              $scope.items = flagService.orgList.length==0?vm.organizationService:flagService.orgList;
              $scope.updateSelection = function(position, items, item) {
                  vm.request_dto.organizationCode=item.organizationCode;
                  angular.forEach(items, function(subscription, index) {
                      if (position != index) {
                          subscription.checked = false;
                      }
                  });
              }
              $ionicModal.fromTemplateUrl('templates/settingModel/activateStation/orgListPopup.html', {
                  scope: $scope,
                  animation: 'slide-in-up'
              }).then(function(modal) {
                  $scope.modal = modal;
              });
              $scope.chooseOrg=function(){
                  $scope.modal.show();
              }
              $scope.closeChooseOrg=function(){
                  $scope.modal.hide();
              }
              $scope.saveChooseOrg=function(){
                  if(vm.request_dto.organizationCode=='none'){
                    showAlertService.showAlert("Please select organization")
                  }else{
                    $scope.modal.hide();
                    registraionService(vm.request_dto);
                  }
              }
              /**Organization list popup model controller &function Ends here**/
              //********************************************************************************
                      function postBarCodeValue(assetid){
                        console.log(vm.stationPostDataAttributes);
                        assetsFactory.assetattributesPost(assetid,vm.stationPostDataAttributes).success(function(data){
                                  
                                  }).error(function(error){
                                    console.log(error);
                              });
                        }
                     function registraionService(dto){
                                if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
                                  showAlertService.showAlert("Please check Internet connection");	//native alert
                                  return false;
                                }
                                $ionicLoading.show({
                                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                                });
                                dto.assetLogin=dto.srNo;
                                  if(dto.assetName==""){
                                  dto.assetName=dto.srNo;
                                }
                                console.log(dto);
                                assetsFactory.registerAsset(dto)
                                    .success(function (response) {
                                              
                                               flagService.flagList.activtedStation={}
                                               flagService.flagList.activtedStation.assetId=response.result.assetId;
                                               flagService.flagList.activtedStation.srNo=dto.srNo;
                                               flagService.flagList.activtedStation.organizationCode=dto.organizationCode;
                                               flagService.flagList.activtedPortA=false;
                                               flagService.flagList.activtedPortB=false;
                                              // flagService.flagList.barCodeValue=$scope.stationPostDataAttributes;
                                              showAlertService.showAlert("Station was registered successfully to the system. Let's get the readings!");
                                              postBarCodeValue(response.result.assetId)
                                              $state.transitionTo("stepTwo");
                                            })
                                    .error(errorCallback)
                                    .finally(function () {
                                            $ionicLoading.hide();
                                      });
                           
                          function errorCallback(error){
                            			 if(error==null||error==undefined){
                                        showAlertService.showAlert(api.errorMsg);
                            				}else if(typeof error =="string"){
                            						if(multiSearch(error,['404'])){
                            								showAlertService.showAlert('404- '+api.key.errorMsg);
                            						}
                            				}
                            				else{
                                          if(multiSearch(error.message,['unauthorized','not found'])){
                                            api.authtoken  = '';
                                            window.localStorage.clear(); //Clear Localstorage
                                            cookieMaster.clear();//Clear Cokie on logout
                                            window.localStorage.setItem("authTokenLclstrg",null);
                                            window.localStorage.setItem("loginUserLclstrg",null);
                                            window.localStorage.setItem("loginPassLclstrg",null);
                                            window.localStorage.setItem("logOutLclstrg",'true');
                                            window.localStorage.setItem("baseUrlLclstrg",api.baseUrl);
                                            window.localStorage.setItem("sliderVisitedStatus",'true');
                                            $state.transitionTo("loginview");
                                          }else if(multiSearch(error.message,['already exists in organization','already exists'])){
                                              showAlertService.showAlert('Station already registered!');
                                          }else{
                                              showAlertService.showAlert(error.message);
                                          }
                            		       }
                          }

                    }
                    function organizationService(){
                          if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
                            showAlertService.showAlert("Please check Internet connection");	//native alert
                            return false;
                          }
                          assetsFactory.getOrganization()
                            .success(function (response) {
                               flagService.orgList=response.result;
                               $scope.items=response.result;
                              //  vm.request_dto.organizationCode=response.result[0].organizationCode;
                               if(response.result.length==1){
                                 vm.request_dto.organizationCode=response.result[0].organizationCode;
                               }
                               console.log(vm.request_dto);
                               console.log(response);
                            })
                            .error(function (error) {
                               console.log(error);
                            })
                    }
                    function register(dto) {
                      console.log(dto);
                      if(dto.srNo==""){
                        $('#srNo').css("border-color","red")
                        $('#srNo0').fadeIn();
                        $timeout(function(){
                        $('#srNo0').fadeOut();
                        },2000) 
                        // showAlertService.showAlert('Please scan the QR code or fill  the serial number');
                        return false;
                      }
                      else if(vm.stationPostDataAttributes[0].attributeValue==""){
                        $('#0').css("border-color","red")
                        $('#00').fadeIn();
                        $timeout(function(){
                        $('#00').fadeOut();
                        },2000) 
                      } 
                      else if(vm.stationPostDataAttributes[3].attributeValue==""){
                        $('#3').css("border-color","red")
                        $('#33').fadeIn();
                        $timeout(function(){
                        $('#33').fadeOut();
                        },2000) 
                      }
                      else if(vm.stationPostDataAttributes[2].attributeValue==""){
                        $('#2').css("border-color","red")
                        $('#22').fadeIn();
                        $timeout(function(){
                        $('#22').fadeOut();
                        },2000) 
                      }
                      else if(vm.stationPostDataAttributes[4].attributeValue==""){
                        $('#4').css("border-color","red")
                        $('#44').fadeIn();
                        $timeout(function(){
                        $('#44').fadeOut();
                        },2000) 
                      }
                      else if(vm.stationPostDataAttributes[5].attributeValue==""){
                        $('#5').css("border-color","red")
                        $('#55').fadeIn();
                        $timeout(function(){
                        $('#55').fadeOut();
                        },2000) 
                      }
                      else if(!moment(vm.stationPostDataAttributes[5].attributeValue, dateFormat, true).isValid()){
                        $('#5').css("border-color","red")
                        $('#55').html('Please enter valid date');
                        $('#55').fadeIn();
                        $timeout(function(){
                        $('#55').fadeOut();
                        },2000) 
                      }
                      else if($scope.items.length==1&&vm.request_dto.organizationCode !='none'){

                        registraionService(dto)
                      }
                      else{
                        $scope.chooseOrg();
                      }


                    }

                    function setAssetType(assettype){
                           if(assettype=='T2'){
                             $('.solution_select').css('color','#14892c')
                             vm.selected=vm.Options[0]
                             vm.request_dto.assetTypeCode=vm.selected.solutionCode;
                             flagService.flagList.stationTypeId=vm.selected.id;
                             console.log(flagService.flagList.stationTypeId);
                             $scope.$apply();
                           }else if (assettype=='T1SM1'||assettype=='SM1T1') {
                             $('.solution_select').css('color','#14892c')
                             vm.selected=  vm.Options[2]
                             vm.request_dto.assetTypeCode=vm.selected.solutionCode;
                             flagService.flagList.stationTypeId=vm.selected.id;
                             console.log(flagService.flagList.stationTypeId);
                             $scope.$apply();
                           }else if (assettype=='SM2') {
                             $('.solution_select').css('color','#14892c')
                             vm.selected=  vm.Options[1]
                             vm.request_dto.assetTypeCode=vm.selected.solutionCode;
                             flagService.flagList.stationTypeId=vm.selected.id;
                             console.log(flagService.flagList.stationTypeId);
                             $scope.$apply();
                           }


                     }

                    function cameraPermission(){
                      var permissions = cordova.plugins.permissions;
                      permissions.checkPermission(permissions.CAMERA, function( status ){
                            if ( status.hasPermission ) {
                              scanBarCode();
                              console.log("Yes :D ");
                            }
                            else {
                              console.warn("No :( ");
                              permissions.requestPermission(permissions.CAMERA, success, error);
                              function error() {
                               showAlertService.showAlert('Camera permission is not turned on');
                              }
                              function success( status ) {
                               if( !status.hasPermission )
                               error();
                               else
                                scanBarCode();
                              }
                          }
                        });

                    }
                    function scanBarCode() {
                      setTimeout(function () {
                        cordova.plugins.barcodeScanner.scan(
                              function (result) {
                                console.log(result)
                                if(!result.cancelled){
                                      var barCodeValue=result.text.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                                      console.log(barCodeValue)
                                      if(barCodeValue.length<5){
                                        showAlertService.showAlert("Sorry, something went wrong, please try again");
                                        return false;
                                      }
                                      vm.collapsed=true;
                                      vm.request_dto.srNo=barCodeValue[0];
                                      vm.stationPostDataAttributes[0].attributeValue=barCodeValue[3];
                                      vm.stationPostDataAttributes[4].attributeValue=parseInt(barCodeValue[1]);
                                      vm.stationPostDataAttributes[5].attributeValue=barCodeValue[2];
                                      // vm.stationPostDataAttributes[1].attributeValue=barCodeValue[6];
                                      var bl_fw=barCodeValue[4].split("/");
                                      vm.stationPostDataAttributes[3].attributeValue=bl_fw[0];
                                      vm.stationPostDataAttributes[2].attributeValue=bl_fw[1];
                                      vm.disabled=true;
                                      $scope.$apply();
                                      // console.log(vm.stationPostDataAttributes);
                                     var container = $('.scan_QR');
                                     $('#stepone').animate({scrollTop: $(window).height()/2},'slow');

                                  }
                               
                                 
                              },
                              function (error) {
                                  console.log(error);
                                 showAlertService.showAlert("Seems the scanning is not working, sorry about that, please use the fields below to enter the information.")
                              }
                              // ,{
                              //     preferFrontCamera : false, // iOS and Android
                              //     showFlipCameraButton : false, // iOS and Android
                              //     showTorchButton : true, // iOS and Android
                              //     torchOn: false, // Android, launch with the torch switched on (if available)
                              //     prompt : "Place a barcode inside the scan area", // Android
                              //     resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                              //     // formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                              //     // orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                              //     disableAnimations : true, // iOS
                              //     disableSuccessBeep: true // iOS
                              // }
                           );
                      }, 1000);

                    }


					 }
})();
