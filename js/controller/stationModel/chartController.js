stationModule.controller('chartController', function($scope,$rootScope,$location ,$ionicModal,$ionicLoading, $timeout,$state,$interval,assetsDetailService,
	allAssetsDetailService,assetsSensorService,sensorDetailService,assetsFactory,flagService,markerDetailService,graphService,checkConnectionService,showAlertService,api) {
//********************************Get the device Dimension to plot Chart According to it ***********************************
$scope.width=(93 * window.innerHeight)/100,
$scope.height = (53 * window.innerWidth)/100;
//Closed
//variabels
var metricCode;
var endDate;
var startDate;
$scope.dataTest = [];
$scope.chart_data=graphService.sensorGraph;
// console.log($scope.chart_data)
$scope.dataTest = $scope.chart_data.history;
$scope.chartStartDate=$scope.chart_data.dateStarts;
$scope.chartEndDate=$scope.chart_data.dateEnd;
$scope.curentDate=$scope.chart_data.dateEnd;
$scope.curentDateStringFormat=$scope.chart_data.dateEnd.toISOString();
$scope.isCalenderClicked=flagService.flagList.periodPickerParentId=="#5"?true:false;
$scope.wiltingPointValue =$scope.chart_data.wiltingPoint;
$scope.fieldCapacityValue=$scope.chart_data.fieldCapacity;
var unit=assetsSensorService.assetsSensorDetail.organization.unitMeasurePref.substring(0,1);
$scope.readingunit=assetsSensorService.assetsSensorDetail.assetType.assetTypeCode==api.key.soil?'%':(assetsSensorService.assetsSensorDetail.organization.unitMeasurePref==api.key.unit?'C':'F');	
var date1 = new Date();
var date2 = new Date(assetsDetailService.assetsDetail.lastCommunication);
var timeDiff = Math.abs(date2.getTime() - date1.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
if(diffDays>1){
	$scope.commcolor='red';
}else{
	$scope.commcolor='blue';
}

$scope.multiSearch= function(text, searchWordsArray){
	return assetsFactory.checkAssetMetricType(text, searchWordsArray);
}

//***********************Set Screen Orientation***************************
$scope.$on("$ionicView.enter", function(event, data){
			window.screen.lockOrientation('landscape');
});

//Got to sensorDetailPage(i.e List page)****************************
$scope.gotoList=function(){
			window.screen.unlockOrientation()
			window.screen.lockOrientation('portrait');
			flagService.flagList.sensorDetailpgFlag=='false'
			// flagService.flagList.daySelectedFlag='#1';
			$state.go("sensordetailview");
}

/*if(ionic.Platform.isIOS()) {
	$("#five").hide();
}*/


// ***
if (flagService.flagList.periodPickerParentId=="#5") {
	$("#calSelected").addClass('activeButtonClass')
} else {
	$("#dateSelected").addClass('activeButtonClass')
}

//Set   Selected Day to Avctive
$("a").click(function(){
			$(".chart-days").removeClass("activeButtonClass");
			if(this.id=='five'){
				$("#one").addClass("activeButtonClass");
			}else {
				$("#"+this.id).addClass("activeButtonClass");
			}

});

//get Current Date in UTC format
function getCurrentdate(){
			// var date =new Date(new Date(assetsDetailService.assetsDetail.lastCommunication).setHours(0,0,0,0));
			var date=new Date(assetsDetailService.assetsDetail.lastCommunication+360000);
			var currentDate=date.toISOString();
			return  currentDate;
}

//get Previous Date in Local time Zone format
function getPreviousDaysdate(previous){
			var date;
			if($scope.isCalenderClicked){
				date=new Date($rootScope.curentDate);
		   	}
			else if(previous==1) {
					date=new Date(assetsDetailService.assetsDetail.lastCommunication+360000);
			}else{
				//new Date(new Date().setHours(0,0,0,0))
				date=new Date(new Date(assetsDetailService.assetsDetail.lastCommunication+360000).setHours(0,0,0,0));
			}	   
			//var date=new Date();
			var previousDate=date.setDate(date.getDate() - previous);
			previousDate=new Date(previousDate)
			return  previousDate;
}
//Function to Call Metric History Service And Store Data

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
		var sensorId=assetsSensorService.assetsSensorDetail.assetId;
		var arrlength=$scope.historyList.length;
		metricCode=$scope.historyList[0]?$scope.historyList[0].assetMetrics[sensorId].Reading?$scope.historyList[0].assetMetrics[sensorId].Reading.unitClass:'':'';
		var flag=false;
		for (var k in $scope.historyList){
			var item=$scope.historyList[k];		
			if(item.assetMetrics[sensorId].Status&&item.assetMetrics[sensorId].Reading||item.assetMetrics[sensorId].Status&&item.assetMetrics[sensorId].errorMsg){			   
			if(item.assetMetrics[sensorId].Status.metricValue=='error'||item.assetMetrics[sensorId].Status.metricValue=='sensor not connected'){
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
			if(!isNaN(value)) {
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
				$scope.sum=$scope.sum+value;
				++$scope.NoOf_Readings;
			} 
			if(k==arrlength-1){
				if(flag)
				$scope.midr = (parseFloat($scope.sum))/$scope.NoOf_Readings;
				$scope.historyList.sort(function(a, b){return b.detectionTime-a.detectionTime});
				sensorDetailService.sensorDetail=$scope.historyList
				console.log($scope.historyList)
			}	
		} 
	}else	{
		$scope.historyList=[];
		$scope.dataTest=[];
		sensorDetailService.sensorDetail=$scope.historyList
		$scope.minr=undefined;
		$scope.maxr=undefined;
		$scope.midr=undefined;
	}
	
       
}
$scope.getHistoryReadings=function(startDate,endDate){
			$ionicLoading.show({
			template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
			});
			assetsFactory.getAssetsMetricInfo($scope.chart_data,$scope.chart_data,startDate,endDate).success(function(data){
					// sensorDetailService.sensorDetail=data.result;
					calculateData(data.result);
					$ionicLoading.hide();
			}).error(function(error){
					if(error==null)
					showAlertService.showAlert(api.errorMsg)
					console.log(error);
					$ionicLoading.hide();

			});
}
//**************Function to selected Calender date to current date************************************
$scope.setCurrentDate=function(){
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
				$(".chart-days").removeClass("activeButtonClass");
				$("#one").addClass("activeButtonClass");
				$scope.isCalenderClicked=true;
				$rootScope.from_date=date.setDate(date.getDate());
				
			    var midnight=date.setDate(date.getDate()+1);//+1
				$rootScope.curentDate=midnight;
				$rootScope.curentDateStringFormat=date.toISOString();
				$scope.makeData(1,"1");
			}
		    //ErrorCallback
			function onError(error) { // Android only
			}
		    window.datePicker.show(options, onSuccess, onError);

}
//Function Get Metric History According to Seleted Date
$scope.makeData=function(day,id){
			flagService.flagList.daySelectedFlag='#'+id;
			$scope.days=day;
			$scope.chartStartDate;
			endDate=getPreviousDaysdate(day);
			if (checkConnectionService.checkConnection() == false) {
				$scope.historyList= showAlertService.showAlert("Please check Internet connection");
				return false;
			}
			if($scope.isCalenderClicked){
				flagService.flagList.periodPickerParentId="#5"
				$("#dateSelected").removeClass("activeButtonClass");
				$("#calSelected").addClass("activeButtonClass");
		    	 startDate=$rootScope.curentDateStringFormat;
				 $scope.chartEndDate=new Date($rootScope.curentDate);;
				 if(day==1)
				 	$rootScope.to_date=$rootScope.from_date
				 else{
					var date=new Date(endDate);
					$rootScope.to_date=date.setDate(date.getDate() - 1);
				 }
			

	    	}else{
				flagService.flagList.periodPickerParentId="#6"
				 $("#calSelected").removeClass("activeButtonClass");
				 $("#dateSelected").addClass("activeButtonClass");
				 startDate=getCurrentdate();
				 $rootScope.from_date=startDate;
				 $scope.chartEndDate=new Date(assetsDetailService.assetsDetail.lastCommunication);
				 $rootScope.to_date=endDate;
				//  $scope.chartEndDate==new Date(new Date(assetsDetailService.assetsDetail.lastCommunication).setHours(0,0,0,0));
	    	}
			
			$scope.chartStartDate=endDate;
			$scope.getHistoryReadings(startDate,endDate.toISOString());

		}

		$scope.lastCommunicationDayRecord=function(){
				flagService.flagList.daySelectedFlag='#1';
			    $scope.isCalenderClicked=false;
				$scope.dayId="1";
				$(".chart-days").removeClass("activeButtonClass");
				$("#one").addClass("activeButtonClass");
			     $scope.makeData(1,"1");

	}	
    //*******************************Get The List page Selected Day And Set that day to Active in Chart Screen**************************
if($scope.chart_data.id==1){
	$(".chart-days").removeClass("activeButtonClass");
	$("#one").addClass("activeButtonClass");
	$scope.makeData(1,'1')
	$scope.days=1;
}else if($scope.chart_data.id==2){
	$(".chart-days").removeClass("activeButtonClass");
	$("#two").addClass("activeButtonClass");
	$scope.days=6;
	$scope.makeData(6,'2')
}else if($scope.chart_data.id==3){
	$(".chart-days").removeClass("activeButtonClass");
	$("#three").addClass("activeButtonClass");
	$scope.days=13;
	$scope.makeData(13,'3')
}else if($scope.chart_data.id==4){
	$(".chart-days").removeClass("activeButtonClass");
	$("#four").addClass("activeButtonClass");
	$scope.days=29;
	$scope.makeData(29,'4')
}else if($scope.chart_data.id==5){
	$scope.days=1;
	$(".chart-days").removeClass("activeButtonClass");
	$("#one").addClass("activeButtonClass");
}else{
	$(".chart-days").removeClass("activeButtonClass");
	$("#"+$scope.chart_data.id).addClass("last-com-active");
}
});


