stationModule.controller('sensorDetailController', function($filter,$scope,$rootScope,$location ,$ionicModal,$ionicLoading, $timeout,$state,$interval,assetsDetailService,
allAssetsDetailService,assetsSensorService,sensorDetailService,api,assetsFactory,flagService,markerDetailService,checkConnectionService,showAlertService,graphService) {
var endDate;
var startDate;
var unit;
$scope.isCalenderClicked=flagService.flagList.periodPickerParentId=="#5"?true:false;
var metricCode;
$scope.flag={};
$scope.sensor_name=$state.params.name;
$scope.dayId="1";

$scope.wiltingPointValue =11;
$scope.fieldCapacityValue=21;
$scope.minr=undefined;
$scope.maxr=undefined;
$scope.midr=undefined;
$scope.updatedMetricList=[];
$scope.dataTest = [];
$scope.historyList=[];
$scope.historyListArray=[];

$scope.isSwap=flagService.flagList.needSensorSwap;
$scope.sensorDetailLastCom={};
if($rootScope.notificationAssetId!='none'){
	$scope.assetsDetail={};
	$scope.assetsDetail.relative_time="Today"
	$scope.assetsDetail.assetName="ANil-SM2"
	$scope.assetsDetail.lastCommunication="1522215831501"
	for (var index = 0; index < allAssetsDetailService.allAssetsDetail.length; index++) {
		console.log(allAssetsDetailService.allAssetsDetail.asset)
		if(allAssetsDetailService.allAssetsDetail.asset.assetId==$rootScope.parentId){
			$scope.assetsDetail=allAssetsDetailService.allAssetsDetail[index].asset
		}
		
	}
	flagService.flagList.stationDetailpgFlag='false';
    flagService.flagList.daySelectedFlag='#1';
	flagService.flagList.sensorDetailpgFlag='true';
	getStation($rootScope.notificationAssetId);
	// $scope.assetSensorDetail=assetsSensorService.assetsSensorDetail;
}
else if(flagService.flagList.stationDetailpgFlag == 'true'){
		//Called when Coming from Station detail Page
		//Get Selected Assets detail And its metric's Soil type Values
		$scope.assetSensorDetail=assetsSensorService.assetsSensorDetail;
		$scope.assetsDetail=markerDetailService.markerDetail.asset;
		unit=$scope.assetSensorDetail.organization.unitMeasurePref.substring(0,1);	
}
else{
		//Called when Coming from DashBoard
		//Get Selected Assets detail And its  metric's Soil type Values
		
		$scope.assetSensorDetail=assetsSensorService.assetsSensorDetail;
		$scope.assetsDetail=assetsDetailService.assetsDetail;
		unit=$scope.assetSensorDetail.organization.unitMeasurePref.substring(0,1);	

}
	
var date1 = new Date();
var date2 = new Date($scope.assetsDetail.lastCommunication);
var timeDiff = Math.abs(date2.getTime() - date1.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
if(diffDays>1){
	$scope.commcolor='red';
}else{
	$scope.commcolor='blue';
}

$scope.multiSearch=function(text, searchWordsArray){
	return assetsFactory.checkAssetMetricType(text, searchWordsArray);
}
//**************Function for pull to Refresh********
$scope.pullToRefresh=function(){
					if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
             			$scope.$broadcast('scroll.refreshComplete');
						showAlertService.showAlert("Please check Internet connection");	//native alert
					}else{
						$scope.getAssetsMetricInfo($scope.assetSensorDetail,$scope.assetsDetail,startDate,endDate);
					}

}
// Function  navigates to chart view and stores chart related dto to service
$scope.gotoChart=function(){
		  var dto={
		 			'id':$scope.dayId,
					'history':$scope.dataTest,
					'assetName':$scope.assetsDetail.assetName,
					'srNo':$scope.assetSensorDetail.srNo,
					'assetId':$scope.assetSensorDetail.assetId,
					'metricCode':$scope.assetSensorDetail.assetType.assetTypeCode,
					'metricName':$scope.assetSensorDetail.assetName,
					'LastDetection':$scope.sensorDetailLastCom,
					'dateStarts':$scope.chartStartDate,
					'dateEnd':$scope.chartEndDate,
					'isCalenderClicked':$scope.isCalenderClicked,
					'wiltingPoint':$scope.wiltingPointValue,
					'fieldCapacity':$scope.fieldCapacityValue
					// 'organizationName':$scope.assetsDetail.organization.organizationName
					}
			 graphService.sensorGraph=dto;//Store above dto to Service  which will be called in chart controller
			 $state.go("chartview/:name",{name:$scope.sensor_name});
 }

//***********Function for Back Button**********************
$scope.gotoBackFromSensorDetail=function(){
				if(flagService.flagList.stationDetailpgFlag == 'true'){
					flagService.flagList.stationDetailpgFlag='';
					flagService.flagList.daySelectedFlag='#1';
					$state.transitionTo("stationdetailview");	//
				}else{
					$state.transitionTo("dashboardview");
					flagService.flagList.daySelectedFlag='#1';
				}
}
//**********Tab Bar Navigation function*(**********

$scope.gotoAlertview=function(){
		    	flagService.flagList.daySelectedFlag='#1';
		    	flagService.flagList.stationDetailpgFlag='';
		    	$state.transitionTo("alertview");
}
$scope.gotoCompareview=function(){
		    	flagService.flagList.daySelectedFlag='#1';
		    	flagService.flagList.stationDetailpgFlag='';
		    	$state.transitionTo("compareview");
}
$scope.gotoSettingview=function(){
		    	flagService.flagList.daySelectedFlag='#1';
		    	flagService.flagList.stationDetailpgFlag='';
		    	$state.transitionTo("settingview");
}
$scope.gotoDashboard=function(){
				flagService.flagList.daySelectedFlag='#1';
				flagService.flagList.stationDetailpgFlag='';
				$state.transitionTo("dashboardview");
 }
//**********Tab Bar Navigation function Closed**********

//************Navigate to history page
$scope.goToHistotyListPg=function(){
	console.log(sensorDetailService.sensorDetail)
		$state.transitionTo("historylistview");
}
angular.forEach($scope.assetSensorDetail.attributes, function(value, key){
		if(value.attributeCode==api.key.wilting){
			$scope.wiltingPointValue=isNaN(value['attributeValue_'+unit])?11:+value['attributeValue_'+unit];
		}else if(value.attributeCode==api.key.fieldCapacity){
			$scope.fieldCapacityValue=isNaN(value['attributeValue_'+unit])?21:+value['attributeValue_'+unit];
		}
})
function getStation(assetId){
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    });
    assetsFactory.assetsDetailInfo(assetId).success(function(data){
        configureStaionService.configStationDetail=data.result;
		$scope.assetSensorDetail=data.result;
        // $state.go('portAsensor',{}, {reload: true});
    }).error(function(error){
        console.log(error);
    }).finally(function() {
        $ionicLoading.hide();
    });  
   }


//Selects Past Day Option  When Coming from Dashboard
if(flagService.flagList.sensorDetailpgFlag=='false'){
					
}
//Set Active  To Selected Day
$(".day-picker").click(function(){
					 $(".day-picker").removeClass("selected-day");
					 $("#" + this.id).addClass("selected-day");
					 $scope.dayId=this.id;
					 flagService.flagList.daySelectedFlag=("#" + this.id)

     });
//Function to Get Last Comunication of Metrics
// $scope.getAssetsMetricLastComm=function(sensor,assets){
// 						if (checkConnectionService.checkConnection() == false) {
// 						showAlertService.showAlert("Please check Internet connection");
// 						return false;
// 						}
// 						$ionicLoading.show({
// 						template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
// 						});
// 						assetsFactory.assetsMetricLCOM(sensor,assets).success(function(data){
// 						$scope.sensorDetailLastCom = data.result.metric
// 						flagService.flagList.lastCommDate=$scope.sensorDetailLastCom;
// 						$ionicLoading.hide();
// 						}).error(function(error){
// 						console.log('error bock');
// 						console.log(error);
// 						$ionicLoading.hide();
// 						});
//  }

//get Current Date in UTC format
function getCurrentdate(){
				    // var date=new Date(new Date(assetsDetailService.assetsDetail.lastCommunication).setHours(0,0,0,0));
					var date=new Date($scope.assetsDetail.lastCommunication+3600000);
					var currentDate=date.toISOString();
					return  currentDate;
}

//get Previous Date in Local time Zone format
function getPreviousDateString(previous){
					var date;
					if($scope.isCalenderClicked){
						date=new Date($rootScope.curentDate);
				   	}
				   	else if(previous==1) {
				   		 date=new Date($scope.assetsDetail.lastCommunication+360000);
				   	}else{
						//new Date(new Date().setHours(0,0,0,0))
						date=new Date(new Date($scope.assetsDetail.lastCommunication+360000).setHours(0,0,0,0));
					}
					var previousDate=date.setDate(date.getDate() - previous);
					previousDate=new Date(previousDate)
					return  previousDate;
}

//get Previous Date in UTC format
function getPreviousDaysdate(previous){
					//var date=new Date(assetsDetailService.assetsDetail.lastCommunication);
					var date;
					if($scope.isCalenderClicked){
						date=new Date($rootScope.curentDate);
				   	}
					else if(previous==1) {
						date=new Date($scope.assetsDetail.lastCommunication+360000);
				    }else{
					//new Date(new Date().setHours(0,0,0,0))
					date=new Date(new Date($scope.assetsDetail.lastCommunication+360000).setHours(0,0,0,0));
				}
					var previousDate=date.setDate(date.getDate() - previous);
					previousDate=new Date(previousDate).toISOString();
					return  previousDate;
}
function calculateData(data){
	            if(data.length>0){
					$scope.sum=0;
					$scope.historyList=[];
					$scope.dataTest=[];
					$scope.minr=undefined;
					$scope.maxr=undefined;
					$scope.midr=undefined;
					$scope.NoOf_Readings=0;
					$scope.historyList=data;
					var sensorId=$scope.assetSensorDetail.assetId;
					var arrlength=$scope.historyList.length;
					metricCode=$scope.historyList[0]?$scope.historyList[0].assetMetrics[sensorId].Reading?$scope.historyList[0].assetMetrics[sensorId].Reading.unitClass:'':'';
					var flag=false;
					for (var k in $scope.historyList){
						var item=$scope.historyList[k];	
						if(item.assetMetrics[sensorId].Status&&item.assetMetrics[sensorId].Reading||item.assetMetrics[sensorId].Status&&item.assetMetrics[sensorId].errorMsg){							   
						if((item.assetMetrics[sensorId].Status.metricValue=='error'||item.assetMetrics[sensorId].Status.metricValue=='sensor not connected')){
							$scope.historyList[k].reading=item.assetMetrics[sensorId].errorMsg.metricValue;
							$scope.historyList[k].unit= ""
							$scope.historyList[k].status='sensor-status-error'
						}else{
							
								$scope.historyList[k].reading=item.assetMetrics[sensorId].Reading['metricValue_'+unit];
								$scope.historyList[k].unit= item.assetMetrics[sensorId].Reading['unit_'+unit];
								$scope.historyList[k].status='sensor-status-'+item.assetMetrics[sensorId].Status.metricValue;
							
							
						}}		
						var value=$scope.historyList[k].reading
						$scope.dataTest.push({
							"detectionTime": new Date(item.detectionTime).toISOString(),
							"metricValue": +$scope.historyList[k].reading,
							"metricCode":metricCode,
							"wiltingPoint":parseFloat($scope.wiltingPointValue),
							"fieldCapacity":parseFloat($scope.fieldCapacityValue)
						})
						if(!isNaN(value)){
							if($scope.minr===undefined&&$scope.maxr===undefined){
								// set first default element
								$scope.minr= value;
								//   Math.round($scope.historyList[k].reading, 0);
								$scope.maxr= value;
								//   Math.round($scope.historyList[k].reading, 0);
							}else{
								if($scope.minr>value)
									$scope.minr=value;
								else 
								if($scope.maxr<value)
									$scope.maxr = value;
							}
							flag=true;
							$scope.sum=$scope.sum+(+value);
							++$scope.NoOf_Readings;
						} 
						if(k==arrlength-1){
							if(flag)
							$scope.midr = (parseFloat($scope.sum))/$scope.NoOf_Readings;
							$scope.historyList.sort(function(a, b){return b.detectionTime-a.detectionTime});
							sensorDetailService.sensorDetail=$scope.historyList;
							console.log($scope.historyList)
							console.log(sensorDetailService.sensorDetail)
						}	
					}
				}else{
					$scope.historyList=[];
					$scope.dataTest=[];
					sensorDetailService.sensorDetail=$scope.historyList
					console.log(sensorDetailService.sensorDetail)
					$scope.minr=undefined;
					$scope.maxr=undefined;
					$scope.midr=undefined;
				}
        
}
// *********************
//Function for getting graph Data Called  when coming from dashboard/Stationdetail page
$scope.getAssetsMetricInfo=function(sensor,assets,currentdayformat,maxdayformat){
			    	if (checkConnectionService.checkConnection() == false) {
			    			 showAlertService.showAlert("Please check Internet connection");
			            	return false;
			        }
				    $ionicLoading.show({
				    	 	template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
				     });
				    assetsFactory.getAssetsMetricInfo(sensor,assets,currentdayformat,maxdayformat).success(function(data){
					
						calculateData(data.result);
					  }).error(function(error){
						if(error==null)
						showAlertService.showAlert(api.errorMsg)
						  console.log('error bock');
				          console.log(error);
					  }).finally(function() {
						   // Stop the ion-refresher from spinning
						   $ionicLoading.hide();
					       $scope.$broadcast('scroll.refreshComplete');
					});



}
//******************************Function to Set calender date to Current date**************************

$scope.setCurrentDate=function(){

					$scope.flag={}
					var options = {
						    date: new Date(),
						    mode: 'date', // or 'time'
						    maxDate: ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf(),
						    allowOldDates: true,
						    allowFutureDates: false,
							androidTheme:5,
						    doneButtonLabel: 'DONE',
						    doneButtonColor: '#000000',
						    cancelButtonLabel: 'CANCEL',
						    cancelButtonColor: '#000000'
						  }
				    //SuccesCallback
					function onSuccess(date) {
						$scope.isCalenderClicked=true;
						$(".day-picker").removeClass("selected-day");
						$("#1").addClass("selected-day");
						$rootScope.from_date=date.setDate(date.getDate());
				        $rootScope.to_date=date.setDate(date.getDate());
						var midnight=date.setDate(date.getDate()+1);
						$rootScope.curentDate=midnight;
						$rootScope.curentDateStringFormat=date.toISOString();
				   		$scope.makeData(1);
					}
				    //ErrorCallback
					function onError(error) { // Android only

					}
				    window.datePicker.show(options, onSuccess, onError);

}
//***********************Gets metric history values for Selected Day*********************************
$scope.makeData=function(day){
	
			    	$scope.days=day;
			    	$scope.chartStartDate;
					$scope.historyListArray=[];
					endDate=getPreviousDaysdate(day)
					console.log(endDate)
			    	if($scope.isCalenderClicked){
						flagService.flagList.periodPickerParentId="#5";
						$("#6").removeClass("selected-day-from");
						$("#5").addClass("selected-day-from");
				    	 startDate=$rootScope.curentDateStringFormat;
						 $scope.chartEndDate=new Date($rootScope.curentDate);
						 if(day==1)
							$rootScope.to_date=$rootScope.from_date
							else{
							var date=new Date(endDate);
							$rootScope.to_date=date.setDate(date.getDate() - 1);
							}		

			    	}else{
						flagService.flagList.periodPickerParentId="#6";
						$("#5").removeClass("selected-day-from");
						$("#6").addClass("selected-day-from");
						 startDate=getCurrentdate();
						 $rootScope.from_date=startDate;
						 $scope.chartEndDate=new Date($scope.assetsDetail.lastCommunication);
						 $rootScope.to_date=endDate;
						//  $scope.chartEndDate==new Date(new Date(assetsDetailService.assetsDetail.lastCommunication).setHours(0,0,0,0));
					}
			      	$scope.chartStartDate=getPreviousDateString(day);//chart end date should be in date format not in isoString
			    	$scope.getAssetsMetricInfo($scope.assetSensorDetail,$scope.assetsDetail,startDate,endDate);


			}
$scope.lastCommunicationDayRecord=function(){
				$scope.isCalenderClicked=false;
				$scope.dayId="1";
				$(".day-picker").removeClass("selected-day");
				$("#1").addClass("selected-day");
				$scope.makeData(1);
				
		}			
//Initial Function Calls

if(flagService.flagList.sensorDetailpgFlag=='true' || $rootScope.notificationAssetId!='none'){
			$scope.lastCommunicationDayRecord();
			// $scope.sensorDetailLastCom=$scope.assetsDetail.relative_time;
			$scope.sensorDetailLastCom=$filter('amDateFormat')($scope.assetsDetail.lastCommunication,'Do MMM YYYY h:mm A')
			// + ' at '+  $filter('amDateFormat')($scope.lastComm,' h:mm A');
			flagService.flagList.sensorDetailpgFlag='false'
			
}else{
			$(".day-picker").removeClass("selected-day");
			console.log(flagService.flagList.periodPickerParentId);
			$(flagService.flagList.periodPickerParentId).addClass("selected-day-from");
			$(flagService.flagList.daySelectedFlag).addClass("selected-day");
			$scope.chartStartDate=getPreviousDateString(+(flagService.flagList.daySelectedFlag).substr(1,1))
			$scope.chartEndDate=new Date($scope.assetsDetail.lastCommunication);
			calculateData(sensorDetailService.sensorDetail)
			// $scope.sensorDetailLastCom=$scope.assetsDetail.relative_time;
			$scope.sensorDetailLastCom=$filter('amDateFormat')($scope.assetsDetail.lastCommunication,'Do MMM YYYY h:mm A')
			// + ' at '+  $filter('amDateFormat')($scope.lastComm,' h:mm A');

}

}); //controller close here
