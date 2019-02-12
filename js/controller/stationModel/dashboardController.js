 
stationModule.controller('dashBoardController', function($scope,$location,$rootScope, $ionicPlatform,$ionicModal,$ionicLoading,$timeout,$state,
	assetsFactory,assetsListService,assetsDetailService,allAssetsDetailService,assetsSensorService,sensorDetailService,$ionicHistory,$ionicScrollDelegate,
	flagService,checkConnectionService,showAlertService,$ionicPopup,api,$filter,$ionicPopover,configureStaionService,emailService){
         /*All Variables*/
$scope.pull=true;
$scope.activate=false
$scope.sensor=[];
$scope.asset=[];
$scope.stations = [];
$scope.stationDetails=[];
$scope.stationsMetrics=[];
//  $scope.showPopover=[];
$scope.allStationsInfoDetail=[];
$scope.checkboxModelDAS = false;
$scope.stationCollapseStatus = flagService.flagList.collapseHistory;
var defaultName=assetsFactory.default_Attribute_Value();
$scope.t2=[];
$scope.sm1=[];
$scope.showadd=false;
var logout=window.localStorage.getItem("logOutLclstrg");
//scrollListner
$('#dashScroll').scroll(getScrollPos);
	// Function to GetScrollPosition
function getScrollPos() {
localStorage.scrollPosition = $('#dashScroll').scrollTop();
}

/*************************************************** Save password*/
$scope.showConfirm = function() {
	var confirmPopup = $ionicPopup.confirm({
	// title: 'Consume Ice Cream',
		template: 'Would you like CC Mobile to save your password?',
		cancelText: 'No',
		okText: 'Yes'
	});
	confirmPopup.then(function(res) {
		if(res) {
			window.localStorage.setItem("logOutLclstrg",'false');
			cookieMaster.clear();
		} else{
			api.showPopUp=false;
			cookieMaster.clear();
			window.localStorage.setItem("logOutLclstrg",'true');
		}
	})
}

/***********Goto station configuration page*************/
$scope.gotoStationConfigPg=function(){
$scope.popover.hide();
$ionicHistory.removeBackView();
flagService.flagList.stationIndex=$scope.selectedStationIndex;
configureStaionService.configStationDetail=$scope.selectedStation;
flagService.flagList.fromSetLocation=false;
$state.transitionTo("config");
}

$scope.showmenu=function(index) {
$scope.showPopover[index]=!$scope.showPopover[index];
}

//**************Function for pull to Refresh********
$scope.pullToRefresh=function(){
		$scope.pull=false;
				if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
					$scope.$broadcast('scroll.refreshComplete');
					showAlertService.showAlert("Please check Internet connection");	//native alert
				}else{
					$scope.sensor=[];
					$scope.asset=[];	
					$scope.getAssets();
				}

}
//***Function to Naigates to map page************
$scope.gotoMapViewPg= function(){
					$state.transitionTo("mapview");
					flagService.flagList.dashboardSensorListFlag='';
}

//******tab bar  naviagtion function******************
$scope.gotoAlertview=function(){
					$state.transitionTo("alertview");
					flagService.flagList.dashboardSensorListFlag='';
}

$scope.gotoCompareview=function(){
					$state.transitionTo("compareview");
					flagService.flagList.dashboardSensorListFlag='';
}
$scope.gotoSettingview=function(){
				$ionicLoading.show({
					template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
				});
				$ionicHistory.clearCache().then(function(){
						$state.go('settingview');
						flagService.flagList.dashboardSensorListFlag='';
						$ionicLoading.hide();
				});

}
//*********tab Navigation Function Closed*******************

//*************Function to show/Hide Station's Metric on Click of up/down Arrow button
$scope.toggleStationList=function(index) {
			$scope.stationCollapseStatus[index] = !$scope.stationCollapseStatus[index];
}

	//******************Function to navigate sensor detail page on click of metric box********************

$scope.gotoSensorDetail=function(sensor,stationDetail){
					assetsSensorService.assetsSensorDetail=sensor;
					assetsDetailService.assetsDetail=stationDetail.asset;
					flagService.flagList.dashboardSensorListFlag='true';								
					flagService.flagList.sensorDetailpgFlag='true';
					flagService.flagList.daySelectedFlag='#1';
					flagService.flagList.collapseHistory=$scope.stationCollapseStatus;
					// sensorDetailService.sensorDetail=[]
					$state.transitionTo("sensordetailview");

}

//badge count for event

function getEvents(){
	$rootScope.events_count=0
	var d=window.localStorage.getItem("lastChecked")
	if(d==null||d=='null')
	$scope.queryParam="";
	else
	$scope.queryParam='&startTime='+d+1;

	assetsFactory.getAllEvent($scope.queryParam).success(function(data){
		angular.forEach(data.result, function(value, key){																 
		  $scope.count=0;
		  if(api.key.eventTypes.indexOf(value.resultLog.app.appArguments[0].value)>=0){
		  angular.forEach(value.resultLog.app.appArguments, function(child_value, child_key){																
				if(child_value.code=='system.log.event.description')
				{ $scope.count=$scope.count+1;
					value.event_description=child_value.value
				  
				}else  if(child_value.code=='system.log.event.message')
				{		$scope.count=$scope.count+1;
						value.event_message=child_value.value	
				}
				if($scope.count==2){
					$rootScope.events_count=$rootScope.events_count+1;
				}
			
		  }); 
		}				  
		}); 									
		// if($scope.queryParam!="")
		// $rootScope.events_count=($rootScope.events_count).toString();
		// else{
		$rootScope.events_count=($rootScope.events_count).toString();
		// }
		if($rootScope.events_count=="0")
		$rootScope.events_count="";															
	})
	.error(function(error){
	}).finally(function(){
	});
 }
/* *********Function to get Assets/Station-Detail ****************/

$scope.getAssets=function(){
					$scope.showadd=false;
					if(logout!='false'){
						if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
						showAlertService.showAlert("Please check Internet connection");	//native alert
						return false;
						}
					}
					$ionicLoading.show({
					template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
					});
			    	/*ServiceCall*/					
					assetsFactory.assetsList().success(function(data){
						if(data.result==undefined ||data.result.length==0){
							$scope.activate=true;
							assetsListService.assetsList=[];
							allAssetsDetailService.allAssetsDetail=[];
							return false;
						}
						$scope.stations=[];
						$scope.stationDetails=[];
						$scope.stations= data.result;
						assetsListService.assetsList=[];
						allAssetsDetailService.allAssetsDetail=[];
						assetsListService.assetsList=data.result;//Storing Station List to Service
						var length=$scope.stations.length;
						for(var i=0;i<length;i++){
							var filterMetricArray=[];  //store filtered metric according to station type
							$scope.stations[i].needToSwap=0;//Flag to Check for Swapable Sensor
							$scope.stationDetails[i]={};
							$scope.stationDetails[i].asset=data.result[i];
							//$scope.stationDetails[i].metrics=data.result[i].metrics;
							$scope.stationDetails[i].attributes=data.result[i].attributes;
							$scope.stationDetails[i].batteryValue=-100;
							//////////////////////////////////////////////
							/*Var for Calculation of the time diffrence */
							$scope.dateList=[];
							$scope.metricListData=[];
							$scope.metricListData=data.result[i].children;
							///////////////////////////////////
							$scope.dateList.push($scope.stationDetails[i].asset.lastCommunication);
							var d={}
								d.current_time = new Date();
								d.current_time_sec=(d.current_time).getSeconds()
								d.current_time_min=(d.current_time).getMinutes()
								d.current_time_hr=(d.current_time).getHours()
								d.current_time_day=(d.current_time).getDate()
								d.current_time_month=(d.current_time).getMonth()
								d.current_time_mili=(d.current_time).getTime()

								d.com_time = new Date($scope.stationDetails[i].asset.lastCommunication);
								// console.log(d.com_time);
								d.com_time_sec=(d.com_time).getSeconds()
								d.com_time_min=(d.com_time).getMinutes()
								d.com_time_hr=(d.com_time).getHours()
								d.com_time_day=(d.com_time).getDate()
								d.com_time_month=(d.com_time).getMonth()
							//  d.com_time_mili=(d.com_time).getTime()
								var timeDiff = Math.abs(d.current_time_mili - $scope.stationDetails[i].asset.lastCommunication);
								var diffDays=Math.ceil(timeDiff/1000);	
								if(d.current_time_month==d.com_time_month){
									d.daydiff=Math.abs(d.current_time_day-d.com_time_day)
									if(d.daydiff==0){		 			
										if((Math.abs(d.current_time_hr-d.com_time_hr)==1)&&(d.current_time_min==d.com_time_min)){
											console.log("in i");
											$scope.stationDetails[i].asset.relative_time= '1 hour ago'										 				
										}else if(diffDays<=3600){	
											if(diffDays<60){
												$scope.stationDetails[i].asset.relative_time= Math.ceil(timeDiff/1000) +' seconds ago' 
											}else
											{
												$scope.stationDetails[i].asset.relative_time= Math.ceil(timeDiff/60000) +' minutes ago' 
											}
										}else{
											$scope.stationDetails[i].asset.relative_time= 'Today at '+ $filter('date')($scope.stationDetails[i].asset.lastCommunication,'h:mm a') 
										}
									}else if(d.daydiff==1){
										$scope.stationDetails[i].asset.relative_time= 'Yesterday at '+ $filter('date')($scope.stationDetails[i].asset.lastCommunication,'h:mm a');
									}else if(d.daydiff>1&&d.daydiff<7){
										$scope.stationDetails[i].asset.relative_time= $filter('date')($scope.stationDetails[i].asset.lastCommunication,'EEEE') +' at '+ $filter('date')($scope.stationDetails[i].asset.lastCommunication,'h:mm a');
									}else{
										$scope.stationDetails[i].asset.relative_time=$filter('amDateFormat')($scope.stationDetails[i].asset.lastCommunication,'Do MMM YYYY')+ ' at '+  $filter('amDateFormat')($scope.stationDetails[i].asset.lastCommunication,' h:mm A');
									}
								}else{
								if(d.current_time_day>=7)
									$scope.stationDetails[i].asset.relative_time=$filter('amDateFormat')($scope.stationDetails[i].asset.lastCommunication,'Do MMM YYYY')+ ' at '+  $filter('amDateFormat')($scope.stationDetails[i].asset.lastCommunication,' h:mm A');
								else{
									if(diffDays<60){
										$scope.stationDetails[i].asset.relative_time= diffDays+' seconds ago'
									}
									else if(diffDays<=3600&&diffDays>=60){
										console.log("in ii");
										$scope.stationDetails[i].asset.relative_time= Math.ceil(diffDays/60)==60? Math.ceil(diffDays/3600)+' hour ago':Math.ceil(diffDays/60)+' minutes ago'
									}
									else if(diffDays>3600&&diffDays<=(3600*24)){
										$scope.stationDetails[i].asset.relative_time= 'Today at '+ $filter('date')($scope.stationDetails[i].asset.lastCommunication,'h:mm a') 
									}
									else if(diffDays>(3600*24)&&diffDays<=(3600*48)){
										$scope.stationDetails[i].asset.relative_time= 'Yesterday at '+ $filter('date')($scope.stationDetails[i].asset.lastCommunication,'h:mm a');
									}
									else if(diffDays>(3600*48)&&diffDays<=(3600*24*7)){
										$scope.stationDetails[i].asset.relative_time= $filter('date')($scope.stationDetails[i].asset.lastCommunication,'EEEE') +' at '+ $filter('date')($scope.stationDetails[i].asset.lastCommunication,'h:mm a');
									}
									else {
										$scope.stationDetails[i].asset.relative_time=$filter('amDateFormat')($scope.stationDetails[i].asset.lastCommunication,'Do MMM YYYY')+ ' at '+  $filter('amDateFormat')($scope.stationDetails[i].asset.lastCommunication,' h:mm A');
									
									}
									}
						
							}
							//Getting Station Type														
							angular.forEach($scope.stations[i].metrics, function(value, key){																
									if(value.metricCode==api.key.batLvl)
									{
									$scope.stationDetails[i].batteryValue=value.metricValue;
									}
									else if(value.metricCode=='BatStatus')
									{
									$scope.stationDetails[i].batteryStatus=(value.metricValue).toLowerCase();
									}
							});															
							angular.forEach($scope.stations[i].children, function(value, key){
								// console.log(value);
										
										var unit=value.organization.unitMeasurePref.substring(0,1);
										angular.forEach(value.metrics, function(sub_value, key){
											if(sub_value.metricCode=="Status")
											{   if(sub_value.metricValue=='sensor not connected'){
												sub_value.metricValue='error'
												}
												value.status='sensor-status-'+sub_value.metricValue;
											}
											else if(sub_value.metricCode=='Reading')
											{   value.class=sub_value.unitClass;
												value.reading=sub_value['metricValue_'+unit];
												value.unit= sub_value['unit_'+unit];
												value.icon=sub_value.unitClass==api.key.unit_classTemp?'sensor-icon-t1sm1-temp':'sensor-icon-t1sm1-soil'
											}
											else if(sub_value.metricCode.toLowerCase()=='errormsg')
											{
												value.ErrorMsg=sub_value.metricValue;
											}
											if(key==value.metrics.length-1){
												filterMetricArray.push(value);
											}
										}); 
										if(value.metrics.length==0){
											value.class=""
											filterMetricArray.push(value);
										}	
									
								$scope.dateList.sort(function(a, b){return a-b});
								var minDateSensor = $scope.dateList[0];
								var maxDateSensor = $scope.dateList[$scope.dateList.length-1];			
								var date1 = new Date();
								var date2 = new Date(maxDateSensor);
								var timeDiff = Math.abs(date2.getTime() - date1.getTime());
								var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

								//Setting Station Last Communication date Color
								if(diffDays > 1){
									$scope.stationDetails[i].metricsColor='comm-time-red';
								}else{
									$scope.stationDetails[i].metricsColor='comm-time-blue';
								}	  
							});
						//Sorting Station's Sensor According to name
							filterMetricArray.sort(function(a, b){
								var x = a.assetName.toLowerCase();
								var y = b.assetName.toLowerCase();
								return x < y ? -1 : x > y ? 1 : 0;
								// return a.metricCode-b.metricCode
								});

								$scope.stationDetails[i].metrics=filterMetricArray
								allAssetsDetailService.allAssetsDetail.push($scope.stationDetails[i]);
								// console.log(allAssetsDetailService)

				}//assets for loop end

						flagService.flagList.dashboardAssetFlag='true';
						//Sorting Station Acording to Name

						allAssetsDetailService.allAssetsDetail.sort(function(a, b) {
							
							return a["one"] - b["one"] || a["two"] - b["two"];
						});
						allAssetsDetailService.allAssetsDetail.sort(function(a, b){
							var x = a.asset.organization.organizationName.toLowerCase();
							var y = b.asset.organization.organizationName.toLowerCase();
							var x1 = a.asset.assetName.toLowerCase();
							var y1 = b.asset.assetName.toLowerCase();
							return (x < y ? -1 : x > y ? 1 : 0) || (x1 < y1 ? -1 : x1 > y1 ? 1 : 0);
							});
						//Copying Station Detail with their Attributes
						$scope.allStationsInfoDetail=allAssetsDetailService.allAssetsDetail;
						console.log($scope.allStationsInfoDetail);
						//Scroll the view to last Scrolled position
						if(localStorage.scrollPosition){
								$ionicScrollDelegate.scrollTo(0, localStorage.scrollPosition, [true])
						}
				}).error(function(error){
					if(error==null)
					showAlertService.showAlert(api.errorMsg)
				}).finally(function() {
						// Stop the ion-refresher from spinning
								if($rootScope.notificationAssetId!='none') {
								$location.hash('liId'+$rootScope.notificationAssetId);
								$ionicScrollDelegate.anchorScroll();
								$rootScope.notificationAssetId='none'
								console.log($rootScope.notificationAssetId);
								}else{
									getEvents();
								}
								$scope.showadd=true;
								$ionicLoading.hide();
								if($scope.pull){
									if(logout!='false'||logout=="null"||logout==null){
										if(api.showPopUp)
										$scope.showConfirm();
								}
								}

						$scope.$broadcast('scroll.refreshComplete');
				});

}
$scope.getAssets();
	/***Function Called on Controller Load*****/
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

$scope.openPopover = function($event,station,index,metric) {
	$scope.popover.show($event);
	$scope.metric=metric;
	$scope.selectedStation=station;
	$scope.selectedStationIndex=index;
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
		//console.log($scope.selectedStation);
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
			request={
				"assetId":$scope.selectedStation.assetId,    
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
			console.log(error);
			showAlertService.showAlert("ooops! Something went wrong. Please try again later or contact support@connectedcrops.ca for assistance");

			});


		}
}


});
