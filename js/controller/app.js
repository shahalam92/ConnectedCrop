var userModule = angular.module('userModule', []);
var stationModule = angular.module('stationModule', ["angularMoment",'ionic']);
var  concrops = angular.module('concrops', [ 'userModule', 'stationModule'])
.run(function($ionicPlatform,$ionicHistory,api,$state,flagService,$rootScope,$ionicPopup,cellService,assetsFactory,emailService) {
$rootScope.notificationAssetId='none'
/************************************************************************/
function getParameterByName(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
}/*******************************************************************************/
$ionicPlatform.registerBackButtonAction(function (event) {
	if ($ionicHistory.currentStateName() === 'dashboardview'){
		ionic.Platform.exitApp();
	}else{
		event.preventDefault();
	}
}, 600);
/*******************************************************************************/
$ionicPlatform.ready(function() {
	console.log(window.devicePixelRatio)
	console.log($(window ).height())
	    window.screen.lockOrientation('portrait'); //locak orientation to portrait
			//Set Version of App
		if(ionic.Platform.isAndroid()){
			cordova.getAppVersion(function(version) {
			$rootScope.versonNumber=version;
			});
		}else{
			$rootScope.versonNumber='3.1.0.20';
		}
		/***************************************************************************************/
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
	    /***************************************************************************************/
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		/***************************************************************************************/
		document.addEventListener("offline", onOffline, false);
		document.addEventListener("online", onOnline, false); 
		// onResume();
		// document.addEventListener("resume", onResume, false);
		function onOffline() {
			api.networkStatus=false;
		 }
		 function onOnline() {
			api.networkStatus=true;
		 }
		 function onResume(){
			var notificationOption=JSON.parse(window.localStorage.getItem("notificationOption"));
			console.log(notificationOption);
			if(notificationOption!=null&&notificationOption!=false){
				notificationOption.email_list=notificationOption.email_list.filter(Boolean).filter(function(item){
					return emailService.checkEmail(item)
				})
				notificationOption.phone_list=notificationOption.phone_list.filter(Boolean).filter(function(item){
					return cellService.checkPhoneNo(item)
				})
				notificationOption.stationPostDataAttributes[0].attributeValue=notificationOption.phone_list.join(",");
				notificationOption.stationPostDataAttributes[1].attributeValue=notificationOption.email_list.join(",");
				if(notificationOption.phone_list.length<=0){
					notificationOption.stationPostDataAttributes[0].attributeValue="(Not Specified)"
					notificationOption.stationPostDataAttributes[3].attributeValue=false;
				}
				if(notificationOption.email_list.length<=0){
					notificationOption.stationPostDataAttributes[1].attributeValue="(Not Specified)"
					notificationOption.stationPostDataAttributes[2].attributeValue=false;
				}
				console.log(notificationOption);
				assetsFactory.assetattributesPost(notificationOption.assetId,notificationOption.stationPostDataAttributes).success(function(data){
					window.localStorage.setItem("notificationOption",false)								
				}).error(function(error){
						// showAlertService.showAlert("Error Saving ");
				}).finally(function(){
					// $ionicLoading.hide();
				});
			}
		}
		/***************************************************************************************/
		//Popup
		function notificationPopup(title,body,page) {
				var confirmPopup = $ionicPopup.confirm({
					title: title,
					template: body,
					cancelText: 'Cancel',
					okText: 'Ok'
				});
				confirmPopup.then(function(res) {
					if(res&&page) {
						$state.go(page,{}, {reload: true});
					} else {
					$rootScope.notificationAssetId='none'
					}
				});
		}
		/***************************************************************************************/
		//Called on Notofication receved.
		window.FirebasePlugin.onNotificationOpen(
			        function(notification) {
						console.log(notification);
						window.FirebasePlugin.setBadgeNumber(0);
						var logOutFlagLocal = window.localStorage.getItem("logOutLclstrg");
					    $rootScope.notificationAssetId=notification.assetid;
						// $rootScope.$broadcast('push', {assetId :notification.assetId});
						if(notification.tap){
                                if(logOutFlagLocal == 'true')
                                	$state.go('loginview');
                                else{
                                    $state.go(notification.NavigateTo,{}, {reload: true});
                                }
						}else{
							 ionic.Platform.isAndroid()?notificationPopup(notification.title,notification.body,notification.NavigateTo):notificationPopup(notification.title,notification.aps.alert.body,notification.NavigateTo);
						}
					}, function(error) {
					    console.error(error);
					});

		/***************************************************************************************/
			// handles dynamic link
		window.cordova.plugins.firebase.dynamiclinks.onDynamicLink(function(data) {
				api.verificationCode=getParameterByName('verificationcode',data.deepLink);
				var pageToGo=getParameterByName('data',data.deepLink);
				var logOutFlagLocal = window.localStorage.getItem("logOutLclstrg");
				//if(pageToGo=='login')
				if(logOutFlagLocal == 'true'){
				}else if(logOutFlagLocal=="null"||logOutFlagLocal==null){
					window.localStorage.setItem("logOutLclstrg",'true');
				}else{
					$state.go('loginview');
					cookieMaster.clear();//Clear Cokie on logout
					window.localStorage.setItem("authTokenLclstrg",null);
					window.localStorage.setItem("loginUserLclstrg",null);
					window.localStorage.setItem("loginPassLclstrg",null);
					window.localStorage.setItem("logOutLclstrg",'true');
						}
				if(window.localStorage.getItem("sliderVisitedStatus")){
						flagService.flagList={};
						$state.go('loginview', {}, {reload: true});
				}else{
					//  $state.go("demofirstview")
				$state.go('loginview', {}, {reload: true});
				}

	    });
    });
/******************************************************************************/ 
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
		  $ionicConfigProvider.tabs.position('bottom');
		  $ionicConfigProvider.views.maxCache(0);
		  $ionicConfigProvider.scrolling.jsScrolling(false);
		  $ionicConfigProvider.views.swipeBackEnabled(false);

		  /*$ionicPlatform.views.swipeBackEnabled(false);*/



      $stateProvider
      .state('demofirstview', {
            url: '/demofirstview',
            templateUrl: 'templates/userModel/demoFirstView.html',
            controller: 'demoFirstCtrl'
	    }).state('loginview', {
				  cache: false,
	        url: '/loginview',
	        templateUrl: 'templates/userModel/loginView.html',
	        controller: 'loginCtrl'
	    }).state('SignUpView', {
	        url: '/SignUp',
	        templateUrl: 'templates/userModel/SignUpView.html',
	        controller:'SignUp'
	    }).state('configureserver', {
	        url: '/configureserver',
	        templateUrl: 'templates/settingModel/configureServerView.html',
	        controller: 'configureServerController'
	    }).state('dashboardview', {
	        url: '/dashboardview',
	        templateUrl: 'templates/stationModel/dashboardView.html',
	        controller: 'dashBoardController'
	    }).state('sensordetailview', {
	        url: '/sensordetailview',
	        templateUrl: 'templates/stationModel/sensorDetailView.html',
	        controller: 'sensorDetailController'
	    }).state('historylistview', {
	        url: '/historylistview',
	        templateUrl: 'templates/stationModel/historyListView.html',
	        controller: 'historyListController'
	    }).state('stationdetailview', {
	        url: '/stationdetailview',
	        templateUrl: 'templates/stationModel/stationDetailView.html',
	        controller: 'stationDetailController'
	    }).state('mapview', {
	        url: '/mapview',
	        templateUrl: 'templates/stationModel/mapView.html',
	        controller: 'mapController'
	    }).state('alertview', {
	        url: '/alertview',
	        templateUrl: 'templates/alertModel/alertView.html',
	        controller: 'alertsController'
	    }).state('compareview', {
	        url: '/compareview',
	        templateUrl: 'templates/compareModel/compareView.html',
	        controller: 'compareController'
	    }).state('sensorcompareview', {
	        url: '/sensorcompareview',
	        templateUrl: 'templates/compareModel/sensorCompareViewTest.html',
	        controller: 'sensorCompareControllerTest'
	    }).state('settingview', {
	        url: '/settingview',
	        templateUrl: 'templates/settingModel/settingView.html',
	        controller: 'settingsController'
		})
		.state('accounts', {
	        url: '/accounts',
	        templateUrl: 'templates/settingModel/accounts.html',
	        controller: 'accountsController'
	    }).state('orgList', {
	        url: '/orgList',
	        templateUrl: 'templates/settingModel/orgList.html',
	        controller: 'orgListController'
	    }).state('config', {
	        url: '/config',
	        templateUrl: 'templates/settingModel/configStation.html',
	        controller: 'configController'
	    }).state('set-notification-option', {
	        url: '/set-notification-option',
	        templateUrl: 'templates/settingModel/set-notification-option.html',
	        controller: 'set-notification-option'
	    }).state('portAsensor', {
	        url: '/portAsensor',
	        templateUrl: 'templates/settingModel/portAsensor.html',
	        controller: 'portAsensorController'
		})
		.state('portBsensor', {
	        url: '/portBsensor',
	        templateUrl: 'templates/settingModel/portBsensor.html',
	        controller: 'portBsensorController'
	    }).state('restoreSensorFrom', {
	        url: '/portBsensor',
	        templateUrl: 'templates/settingModel/sensorList.html',
	        controller: 'restoreSensorFromController'
	    }).state('inversionAlert', {
	        url: '/inversionAlert',
	        templateUrl: 'templates/settingModel/inversionAlert.html',
	        controller: 'inversionAlertController'
	    }).state('sensors-list', {
	        url: '/sensors-list',
	        templateUrl: 'templates/settingModel/sensorList.html',
	        controller: 'sensorListController'
	    }).state('thresholdSM', {
	        url: '/thresholdSM',
	        templateUrl: 'templates/settingModel/thresholdSM.html',
	        controller: 'thresholdSMController'
	    }).state('thresholdTEMP', {
	        url: '/thresholdTEMP',
	        templateUrl: 'templates/settingModel/thresholdTEMP.html',
	        controller: 'thresholdTEMPController'
	    }).state('transmission', {
	        url: '/transmission',
	        templateUrl: 'templates/settingModel/transmission.html',
	        controller: 'transmissionController'
	    }).state('helpview', {
	        url: '/helpview',
	        templateUrl: 'templates/userModel/helpView.html',
	        controller: 'helpController'
	    }).state('configStationListView', {
	        url: '/selectStation',
	        templateUrl: 'templates/settingModel/selectStationView.html',
	        controller: 'selectStation'
	    }).state('aboutView', {
	        url: '/about',
	        templateUrl: 'templates/settingModel/aboutView.html',
	        controller: 'about'
	    }).state('contactView', {
	        url: '/contact',
	        templateUrl: 'templates/settingModel/contact.html',
	        controller:'contact',
	    }).state('chartview/:name', {
	        url: '/chart/:name',
	        templateUrl: 'templates/stationModel/chartView.html',
	        controller: 'chartController'
	    }).state('changePassword', {
	        url: '/changePassword',
	        templateUrl: 'templates/settingModel/changePassword.html',
	        controller:'changePassword'
	    }).state('setlocation', {
	        url: '/setlocation',
	        templateUrl: 'templates/settingModel/setLocationView.html',
	        controller:'stationlocation'
	    }).state('soilinfo', {
	        url: '/soilinfo',
	        templateUrl: 'templates/settingModel/infoView.html',
	        controller:'InfoController',
					controllerAs: 'vm',
	    }).state('stepOne', {
	        url: '/stepOne',
	        templateUrl: 'templates/settingModel/activateStation/stepOne.html',
	        controller:'StepOneController',
					controllerAs: 'vm',
	    }).state('stepTwo', {
	        url: '/stepTwo',
	        templateUrl: 'templates/settingModel/activateStation/stepTwo.html',
	        controller:'StepTwoController',
			controllerAs: 'vm',
		})
		.state('step2_portB', {
	        url: '/step2_portB',
	        templateUrl: 'templates/settingModel/activateStation/stepTwo_portB.html',
	        controller:'StepTwoPortBController',
	    }).state('step2_connection', {
	        url: '/step2_connection',
	        templateUrl: 'templates/settingModel/activateStation/stepTwo_connection_instruction.html',
			controller:'StepTwoConnectionController',
			controllerAs: 'vm',
	    }).state('waitingToConnect', {
	        url: '/waitingToConnect',
	        templateUrl: 'templates/settingModel/activateStation/waitingToConnect.html',
	        controller:'StepThreeController',
			controllerAs: 'waitVm',
	    })
        $urlRouterProvider.otherwise('/demofirstview');
    });
