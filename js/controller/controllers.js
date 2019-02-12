/******************************************************Controller  */
concrops.controller('AppCtrl', function($scope,$location, $ionicModal, $timeout,$state) {

// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
$scope.$on('$ionicView.enter', function(e) {
// console.log('$ionicView.enter');
});

$scope.go = function (path) {
$location.path(path);
}

})//******************************************************Help Page Controller******************************************************
.controller('helpController', function($scope,$location,$state,$ionicSlideBoxDelegate) {
$scope.go = function (path) {
		$location.path(path);
 }
$scope.skip=function() {
		$state.go('settingview');
}
$scope.next = function() {
		$ionicSlideBoxDelegate.next();
 };

$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
 };
 $scope.gotoDashboard=function(){
	$state.transitionTo("dashboardview");
}
$scope.gotoAlertview=function(){
	$state.transitionTo("alertview");
}

$scope.gotoSettingview=function(){
	$state.transitionTo("settingview");
}

// Called each time the slide changes
$scope.slideChanged = function(index) {
		$scope.slideIndex = index;
 };

 $scope.gotoManual=function(){

 	var ref = cordova.InAppBrowser.open('http://connectedcrops.ca/manual', '_system', 'location=yes');
 }

 $scope.gotoFaq=function(){

 	var ref = cordova.InAppBrowser.open('http://connectedcrops.ca/faq', '_system', 'location=yes');
 }
$scope.goToSetting = function() {
		$state.go('settingview');
 }
 $scope.gotoSendMail=function(){
 	window.location = 'mailto:support@connectedcrops.ca';
 }
})
//******************************************************App Help Image Slides Controller ******************************************************
.controller('demoFirstCtrl', function($scope,$location,$state,$ionicSlideBoxDelegate,$http,$ionicLoading ,$ionicModal, $timeout,assetsFactory,api,checkConnectionService,showAlertService) {

$scope.go = function (path) {
		$location.path(path);
}
var sliderVisted = window.localStorage.getItem("sliderVisitedStatus");
if(sliderVisted == 'true'){
		$state.go('loginview');
}
$scope.skip=function() {
	  window.localStorage.setItem("sliderVisitedStatus",'true');
		$state.go('loginview');
}
$scope.next = function() {
		$ionicSlideBoxDelegate.next();
};

$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
};

// Called each time the slide changes
$scope.slideChanged = function(index) {
		$scope.slideIndex = index;
};

$scope.startApp = function() {
		$state.go('loginview');
}//startApp method

})
//******************************************************Login  Controller ******************************************************
.controller('loginCtrl', function($scope,$location,$state,$http,$ionicLoading ,$ionicModal, $timeout,assetsFactory,api,checkConnectionService,
showAlertService,flagService,$ionicHistory) {
$scope.taps=0;
$scope.show=true;
$scope.username='';
$scope.password='';
$scope.multiSearch= function(text, searchWordsArray){
			return assetsFactory.checkAssetMetricType(text, searchWordsArray);
}

//************Counter for logo click******************8
$scope.logoClicked=function(){
	if($scope.taps<6){
		$scope.taps=$scope.taps+1;
	}

}
//******Function navigates to sign up page*********************
$scope.goToSignUp=function(){
	$state.go('SignUpView');
}
//********Open ConnectedCrop Website in browser********
$scope.gotoOpenWebsite=function(){
			var ref = cordova.InAppBrowser.open('http://connectedcrops.ca/', '_system', 'location=yes');
}
//Send mail
$scope.gotoSendMail=function(){
	window.location = 'mailto:info@connectedcrops.ca ';
}
window.addEventListener('native.keyboardshow', function(){
			document.body.classList.add('keyboard-open');
});

$scope.gotoServerConfigPg=function(){
			$state.transitionTo("configureserver");
}
function verifyLink(){
	assetsFactory.loginWithLink().success(function (res) {
		 console.log(res);
		 cookieMaster.clear();
		 api.verificationCode='NotPresent'
	}).error(function (error) {
		api.verificationCode='NotPresent'
		cookieMaster.clear();
		$ionicLoading.hide();
		if(error==null)
		showAlertService.showAlert(api.errorMsg)
	});
}
function organizationService(){
			assetsFactory.getOrganization()
				.success(function (response) {
					flagService.orgList=[]
					 var i,org=response.result;
					 flagService.orgList=response.result;
					 window.FirebasePlugin.unsubscribe(' CC-Global-'+api.baseUrl.split('.').shift().split('//').pop())
					 for(i in org){
						  flagService.orgList.push(org[i].organizationCode)
						//   console.log(flagService.orgList);
						  window.FirebasePlugin.subscribe(org[i].organizationCode);
					 }
				 })
				.error(function (error) {
					 console.log(error);
				})
}
$scope.forgotPassword=function(email){
			if (checkConnectionService.checkConnection() == false) {
				showAlertService.showAlert("Please check Internet connection");
				return false;
			}else if(api.baseUrl == "" || api.baseUrl == undefined){
				showAlertService.showAlert("Please set base url");
				return false;
			}else if(email == "" || email == undefined){
				$('#email_error').html('please enter username');
				$('.email_log').fadeIn();
				$timeout(function(){
					$('.email_log').fadeOut();
				},2000)
				return false;
			}
			$ionicLoading.show({
				template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
			});
			assetsFactory.forgotPass(email).success(function(data){
				showAlertService.showAlert(data.result);
			}).error(function(error){
					if(error==null)
					showAlertService.showAlert(api.errorMsg)
					else
					showAlertService.showAlert('Please enter a valid user name');
			}).finally(function(){
				$ionicLoading.hide();
			});
}
$scope.getLogin = function(username,password) {
			if(api.baseUrl == "" || api.baseUrl == undefined){
				showAlertService.showAlert("Please set base url");
				return false;
			}
			/****************************************************/
			if (window.cordova && window.FirebasePlugin) {
						window.FirebasePlugin.hasPermission(function(data){
				    if(!data.isEnabled)
				      window.FirebasePlugin.grantPermission();

				});
			}
			if(username == "" || username == undefined){
				$('#email_error').html('please enter username');
				$('.email_log').fadeIn();
				$timeout(function(){
				$('.email_log').fadeOut();
				},2000)
				return false;
			}else if(password == "" || password == undefined){
				$('#password_error').html('please enter password');
				$('.password_log').fadeIn();
				$timeout(function(){
				$('.password_log').fadeOut();
				},2000)
				return false;
			}else{

			var usrid= username.replace(/ /g,'');
			var pass= password.replace(/ /g,'');
			var encodedUserAuth=btoa(usrid+":"+pass);
			

			api.authtoken='';
			api.authtoken=encodedUserAuth;
			$ionicLoading.show({
				template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
			});
			assetsFactory.getLoginAuth(encodedUserAuth).success(function(data){
				var logout=window.localStorage.getItem("logOutLclstrg");
				var lastChecked=window.localStorage.getItem("lastChecked");
				window.localStorage.clear();
				window.localStorage.setItem("lastChecked",lastChecked);
				window.localStorage.setItem("authTokenLclstrg",encodedUserAuth);
				window.localStorage.setItem("loginUserLclstrg",usrid);
				window.localStorage.setItem("loginPassLclstrg",pass);
				window.localStorage.setItem("logOutLclstrg",logout);
				window.localStorage.setItem("baseUrlLclstrg",api.baseUrl);
				window.localStorage.setItem("sliderVisitedStatus",'true');
				window.localStorage.setItem("user_emails",usrid);
				flagService.flagList.dashboardAssetFlag='';
				$ionicLoading.hide();
				$scope.username='';
				$scope.password='';
				$state.transitionTo("dashboardview");
				// $state.transitionTo("pushdetailview");
				/*
        Subscribe to topic for notification
 				**/
				organizationService();
			}).error(function(error){
				$scope.username='';
				$scope.password='';
				api.authtoken='';
				window.localStorage.clear();
				window.localStorage.setItem("authTokenLclstrg",null);
				window.localStorage.setItem("loginUserLclstrg",null);
				window.localStorage.setItem("loginPassLclstrg",null);
				window.localStorage.setItem("baseUrlLclstrg",api.baseUrl);
				window.localStorage.setItem("sliderVisitedStatus",'true');
				$ionicLoading.hide();
				if (checkConnectionService.checkConnection()!=false) {
					cookieMaster.clear();
				} 
			 if(error==null||error==undefined){
						showAlertService.showAlert('The app is facing connection / access issues. Please ensure you have strong connection and try again. If you still face the same issue, please contact the support team at support@connectedcrops.ca');
			 }else if(typeof error =="string"){
						if($scope.multiSearch(error,['404'])){
												showAlertService.showAlert('Oops! We can\'t seem to find the page you\'re looking for, please contact the support team at support@connectedcrops.ca');
						}
				}
				else{
					if($scope.multiSearch(error.message,['not exist'])){
						$('#email_error').html('incorrect Username ');
						$('.email_log').fadeIn();
						$timeout(function(){
						$('.email_log').fadeOut();
						},2000)
					}else if($scope.multiSearch(error.message,['invalid credentials'])){
						$('#password_error').html('incorrect password');
						$('.password_log').fadeIn();
						$timeout(function(){
						$('.password_log').fadeOut();
						},2000)
					}else if($scope.multiSearch(error.message,['deactivated'])){
						// showAlertService.showAlert('Account is deactive');
						showAlertService.showAlert('The account you are trying to login with is not active, please verify your email first');
					}else{
						showAlertService.showAlert('Seems like your internet connection is not strong enough to connect. Please try a different connection or location');
					}
		    }
			});
		}
}

$scope.getLoginOnClick=function(username,password){
	  if(checkConnectionService.checkConnection() == false) {
			showAlertService.showAlert("Please check Internet connection");
			return false;
	    }
        $scope.getLogin(username,password);
 	}
	//********************************************************************************* 

	var authTokenLocal ='';
	window.localStorage.setItem("sliderVisitedStatus",'true');
	authTokenLocal = window.localStorage.getItem("authTokenLclstrg");
	var loginUserLocal = window.localStorage.getItem("loginUserLclstrg");
	var loginPassLocal = window.localStorage.getItem("loginPassLclstrg");
	var logOutFlagLocal = window.localStorage.getItem("logOutLclstrg");
	/**************************************************************************************/ 
	if(api.verificationCode!="NotPresent"){
		 verifyLink();
		if(loginPassLocal!="null"){
			 setTimeout(function () {
			 	$scope.getLogin(loginUserLocal,loginPassLocal);
			}, 50);

		}
	}
	/*****************************************************************************/ 
	if(authTokenLocal == null || authTokenLocal == "null"){
	}else{
		if(logOutFlagLocal == 'true'){
		}else{
		 $scope.getLogin(loginUserLocal,loginPassLocal);
		}
	}
	//************************************************************************************88 


});
