stationModule.controller('SignUp', function($scope,$location,$ionicLoading, $ionicModal, $timeout,$state,checkConnectionService,showAlertService,emailService,assetsFactory,api,cellService) {
	$scope.user_detail={"organizationName":"",
						"adminEmail":"",
						"adminPassword":"",
						"adminFirstName":"",
						"adminLastName":"",
						"adminPhoneNumber":"",
						"unitMeasurePref":"metric"
						}
	$scope.confirmPassword='';
	$scope.metric=true;
	$scope.imperial=false;	

  	$scope.serverSideChange = function(item) {
  	  console.log("Selected Serverside, text:", item.text, "value:", item.value);
 	 };		
	$scope.gotoOpenWebsite=function(){
				 var ref = cordova.InAppBrowser.open('http://connectedcrops.ca/license/connectedcrops.html', '_system', 'location=yes');
	}
	$scope.gotoLogin=function(){
		$state.go('loginview');//Naviaget back to login
	}
	$scope.multiSearch= function(text, searchWordsArray){
				return assetsFactory.checkAssetMetricType(text, searchWordsArray);
	}
	$scope.checkConfirmPassword=function (detail,confirmPassword) {
		var elem = document.getElementById("warning_border");
		if(confirmPassword==''||confirmPassword==null||confirmPassword==undefined)
		elem.setAttribute("style","border-bottom: 1px solid #998F8B !important;");		
		else if(detail.adminPassword==confirmPassword)
		elem.setAttribute("style","border-bottom: 1px solid #93d637 !important;");			
		else if(detail.adminPassword!=confirmPassword)
		elem.setAttribute("style","border-bottom: 1px solid #FA421e !important;");
		else 
		elem.setAttribute("style","border-bottom: 1px solid #998F8B !important;");
		
		
	}
	$scope.changeUnitPref=function(){
		
	}
	//Function to Register user
	$scope.signUp = function(detail,confirmPassword) {
		if (checkConnectionService.checkConnection() == false) {
			showAlertService.showAlert("Please check Internet connection");
			return false;
		}
		if(api.baseUrl == "" || api.baseUrl == undefined){
			showAlertService.showAlert("Please set base url");
			return false;
		}
		if(detail.organizationName == "" ){
			$('#org_error').html('please enter organization name');
			$('.org_log').fadeIn();
			$timeout(function(){
			$('.org_log').fadeOut();
			},2000)
			return false;
		}else if(detail.adminFirstName == ""){
			$('#fname_error').html('please enter first name');
			$('.fname_log').fadeIn();
			$timeout(function(){
			$('.fname_log').fadeOut();
			},2000)
			return false;
		}
		else if(detail.adminLastName == ""){
			$('#lname_error').html('please enter last name');
			$('.lname_log').fadeIn();
			$timeout(function(){
			$('.lname_log').fadeOut();
			},2000)
			return false;
		}else if(detail.adminPhoneNumber == ""||detail.adminPhoneNumber==null){
			$('#phone_error').html('please enter phone no.');
			$('.phone_log').fadeIn();
			$timeout(function(){
			$('.phone_log').fadeOut();
			},2000)
			return false;
		}else if(!cellService.checkPhoneNo(detail.adminPhoneNumber)){
			$('#phone_error').html('Inavlid phone no.');
			$('.phone_log').fadeIn();
			$timeout(function(){
			$('.phone_log').fadeOut();
			},2000)
			return false;
		}else if(detail.adminEmail == ""){
			$('#email_error_sigunup').html('please enter email');
			$('.email_log').fadeIn();
			$timeout(function(){
			$('.email_log').fadeOut();
			},2000)
			return false;
		}else if(!emailService.checkEmail(detail.adminEmail)){
			$('#email_error_sigunup').html('Inavlid email');
			$('.email_log').fadeIn();
			$timeout(function(){
			$('.email_log').fadeOut();
			},2000)
			return false;
		}else if(detail.adminPassword==""){
			$('#password_error_sigunup').html('please enter password');
			$('.password_log').fadeIn();
			$timeout(function(){
			$('.password_log').fadeOut();
			},2000)
			return false;
		}else if(detail.adminPassword!=confirmPassword){
			$('#password_error_sigunup').html("Passwords don't match");
			$('.password_log').fadeIn();
			$timeout(function(){
			$('.password_log').fadeOut();
			},2000)
			return false;
		}else{
		    $ionicLoading.show({
			template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
			});
			window.localStorage.setItem("loginUserLclstrg",detail.adminEmail);
			window.localStorage.setItem("loginPassLclstrg",detail.adminPassword);
			assetsFactory.signUp(detail).success(function(data){
			 showAlertService.showAlert('Thank you for signing up to ConnectedCrops. A user verification email has been sent to you. Please click on confirmation link from your phone to get started!');
			 $state.transitionTo("loginview");
			  api.verificationCode='NotPresent'
		  }).error(function(error){
			window.localStorage.setItem("authTokenLclstrg",null);
			window.localStorage.setItem("loginUserLclstrg",null);
			window.localStorage.setItem("loginPassLclstrg",null);
		  if(error==null||error==undefined){
				showAlertService.showAlert("Seems like your internet connection is not strong enough or the server is not reachable . Please try a different connection or location. Or try again at another time.");
			}
			else{
				  if($scope.multiSearch(error.message,['alternative email'])){
							showAlertService.showAlert('The email you provided is already in use. Please provide alternative email');
					}
					else	if($scope.multiSearch(error.message,['organization name cannot'])){
						showAlertService.showAlert('Farm / Organization name cannot be null/empty');
					}
					else if($scope.multiSearch(error.message,['alternative organization name'])){
							showAlertService.showAlert('Farm / Organization name is already in use. Please provide alternative name');
					}
					else if($scope.multiSearch(error.message,['provide authentication'])){
							showAlertService.showAlert("Sorry, not authorized with the server you're connecting to!");
					}else	if($scope.multiSearch(error.message,['no organization found for ap'])){
						showAlertService.showAlert("Sorry, not authorized with the server you're connecting to!");
					}else if($scope.multiSearch(error.message,['server failed'])){
							showAlertService.showAlert("Oooops! We couldn't create your account. Please try again later.");
					}else{
						showAlertService.showAlert("Oops! We couldn't create your account. Please try again later.");
					   }
	      }
		}).finally(function() {
		       // Stop the Loader
			  $ionicLoading.hide();
		});
	}
}

});
