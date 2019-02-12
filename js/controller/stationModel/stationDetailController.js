
stationModule.controller('stationDetailController', function($scope,$location,$ionicLoading ,$ionicPopover,$ionicHistory,$ionicModal, $timeout,$state,markerDetailService,assetsFactory,
		assetsSensorService,flagService, markerDetailService,emailService,showAlertService,configureStaionService,api,sensorDetailService) {
	$scope.stationDetails=markerDetailService.markerDetail;
	$scope.stationCollapseStatus=[];
    $scope.gotoDashboard=function(){
		$state.transitionTo("dashboardview");
	 }

	$scope.gotoAlertview=function(){
		 flagService.flagList.stationDetailpgFlag='';
	     $state.transitionTo("alertview");
	    }

    $scope.gotoCompareview=function(){
    	flagService.flagList.stationDetailpgFlag='';
    	$state.transitionTo("compareview");
    }
    $scope.gotoSettingview=function(){
    	flagService.flagList.stationDetailpgFlag='';
    	$state.transitionTo("settingview");
    }

    $scope.gotoMap=function(){
    	flagService.flagList.stationDetailpgFlag='';
    	$state.transitionTo("mapview");
	}
	$scope.toggleStationList=function(index) {
		$scope.stationCollapseStatus[index] = !$scope.stationCollapseStatus[index];
	}
/***********Goto station configuration page*************/
$scope.gotoStationConfigPg=function(){
	$scope.popover.hide();
	// $ionicHistory.removeBackView();
	configureStaionService.configStationDetail=$scope.selectedStation.asset;
	flagService.flagList.fromSetLocation=false;
	$state.transitionTo("config");
	}
    //Gotot Sensor detail page
    $scope.gotoSensorDetail=function(sensor,station){
    	assetsSensorService.assetsSensorDetail=sensor;
    	flagService.flagList.stationDetailpgFlag='true';
    	flagService.flagList.daySelectedFlag='#1';
		flagService.flagList.sensorDetailpgFlag='true';
    	// sensorDetailService.sensorDetail=[]
     	$state.transitionTo("sensordetailview");
    };

    setTimeout(function(){
    if($scope.stationDetails.metrics.length == 0){
    	$('.noRecordsfound').addClass('ng-show');
    }else{
    	$('.noRecordsfound').addClass('ng-hide');
    }
	},2000);	
	/***********************************************************************************************************************/ 
//**** popupmenu
$scope.menu_item=true;
$scope.user_emails=window.localStorage.getItem("user_emails");
window.addEventListener('native.keyboardshow', keyboardShowHandler);
window.addEventListener('native.keyboardhide', keyboardHideHandler);

 function keyboardShowHandler(e){
			 $('#dashScroll').css(
					{"bottom": "0%"}
				);
			   $(".popup-lg-item-container").css(
					{"margin-top": "-2%"}
				);
			   $(".export-popup").css(
					{"margin-top": "2%"}
				); 
 }
 function keyboardHideHandler(e){
			 $(".popup-lg-item-container").css(
					{"margin-top": "46%"}
				);
			  $(".export-popup").css(
					{"margin-top": "50%"}
				); 
				$('#dashScroll').css(
					{"bottom": "45px"}
				);
 }
$ionicPopover.fromTemplateUrl('templates/stationModel/menu.html', {
   scope: $scope,
}).then(function(popover) {
   $scope.popover = popover;

});

$scope.openPopover = function($event,station) {
   $scope.popover.show($event);
   $scope.selectedStation=station;
};

//Cleanup the popover when we're done with it!
$scope.$on('$destroy', function() {
   $scope.popover.remove();
});
$scope.opendialog=function(){
		$scope.popover.hide();
		$scope.menu_item=false;		
}
$scope.cancel=function () {
		$scope.menu_item=true;
}
$scope.emailReport=function (emails) {
	var request={}
	if(emails == ""){
		 showAlertService.showAlert("Please Enter email")
		 return false;
	 }else if(!emailService.checkEmail(emails)){	
		 showAlertService.showAlert("You have entered invalid email address(es). Please correct and try again. Make sure you're using commas to separate multiple emails")		
		 return false;
	 }else{
		 $ionicLoading.show({
						 template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
						 });
		  request={"assetId":$scope.selectedStation.asset.assetId,    
						 "appCode":"system.email.metrics",   
						 "arguments":{        
							 "system.email.metrics.to":emails,       
							 "system.email.metrics.subject":"Readings from the station property(\"assetname\")",       
							 "system.email.metrics.body":"<html><head><meta http-equiv=Content-Type content=\"text\/html;\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes\">\r\n<style>\r\nbody {width: 800px;margin: 20px auto 20px auto;background-color:#A5C249;font-family : Arial;font-size: 1em;}\r\ntable { width: 100%; height: 100%; background-color: #FFFFFF; border-radius: 20px; border: solid #ccc 1px; padding: 20px; }\r\ntable td {vertical-align: top; }\r\np, li, a { font-family : Arial; font-size: 1em; }\r\na { color: #0B4D8A; text-decoration: underline; }\r\n.logo {text-align: left;}\r\n@media screen and (max-width: 481px) { body {width: 90%; margin: 10px auto 10px auto; } p, li, a {font-size: .8em;}}\r\n.r { text-indent: 50px;line-height:90%;}\r\n<\/style><\/head>\r\n<body><table>\r\n<tbody>\r\n<tr>\r\n<td>\r\n<p>Hi,<\/p>\r\n<p>Please find the requested report attached. It is a extract of all the sensors readings from the station property(\"assetname\") since activation.<\/p>\r\n<br \/>Serial Number: property(\"serialnumber\")<br \/>Farm Name: property(\"organization\")<\/p>\r\n<p><br \/>This email was sent to you from  ConnectedCrops&trade;<\/p>\r\n<p class=\"r\"> <\/p>\r\n<p class=\"logo\"><span style=\"font-size: 16px;\"><img src=\"http:\/\/connectedcrops.ca\/wp-content\/uploads\/2017\/05\/ConnectedCrops_logo_green-2.png\" alt=\"\" height=\"60\" \/><\/span><\/p>\r\n<\/td>\r\n<\/tr>\r\n<\/tbody>\r\n<\/table>\r\n<\/body>\r\n<\/html>"
							 
							 } 
					 }
					 var lengthMetric=$scope.metric.length;
					 if(lengthMetric){
						 $scope.metricjobsarray="[";
						 for(var j in $scope.metric){
							 if(j!=0)
							 $scope.metricjobsarray+=','
							 $scope.metricjobsarray+="{\"assetId\":\""+$scope.metric[j].assetId+"\",\"metricCodes\": [\{\"metricCode\": \"Reading\",\"columnName\":\""+$scope.metric[j].class+"\"}]}"
							 if(j==lengthMetric-1)
							 $scope.metricjobsarray+="]"
							 request.arguments["system.email.metrics.metricobjects"]=$scope.metricjobsarray;
						 }
					 }
					 
		  window.localStorage.setItem("user_emails",emails);						
		  assetsFactory.exportStationRecord(request)
				 .success(function(data){
					 $ionicLoading.hide();
					 showAlertService.showAlert("Request sent successfully");
					 $scope.menu_item=true;
					 
					 $scope.popover.hide();

				 })
				 .error(function(error){
					 $ionicLoading.hide();
					 if(error==null)
					showAlertService.showAlert(api.errorMsg)
					else
					 showAlertService.showAlert("ooops! Something went wrong. Please try again later or contact support@connectedcrops.ca for assistance");

				 });
		   

	 }
	
	// body...
}

});
