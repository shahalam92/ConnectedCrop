stationModule.controller('compareController', function($scope,$location ,$rootScope,$ionicModal,$ionicLoading, $timeout,$state,allAssetsDetailService,
assetsDetailService,assetsListService,stationCompareService,sensorCompareService,assetsFactory,flagService,checkConnectionService,showAlertService) {

$scope.stations = [];
$scope.stationDetails=[];
$scope.stationsMetrics=[];
$scope.allStationsInfoDetail=[];
$scope.selectedStationToCompare = [];
$scope.selectedStationToCompareTwoStation = [];
$scope.sensorsCollapsed = [];
$scope.selectedSensor =[];
$scope.selectedTotalSensorLength = 0;
$scope.stationIndexTemp ='';
$scope.dataSensor = [];

//**************Function for pull to Refresh********

$scope.pullToRefresh=function(){
				if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
          $scope.$broadcast('scroll.refreshComplete');
					showAlertService.showAlert("Please check Internet connection");	//native alert
				}else{
						$scope.getAssets();
				}

}
//********************************Function to Match Strings********************************
$scope.multiSearch= function(text, searchWordsArray){
                return assetsFactory.checkAssetMetricType(text, searchWordsArray);
}
//**************************************Tab Bar Navigation Functions************************************************
$scope.gotoDashboard=function(){
				$state.transitionTo("dashboardview");

}

$scope.gotoAlertview=function(){
				$state.transitionTo("alertview");


}

$scope.gotoCompareview=function(){
				$state.transitionTo("compareview");

}

$scope.gotoSettingview=function(){
				$state.transitionTo("settingview");

}

//********Function to convert Current date in Universal Time zone******************

function getCurrentdate(){
				 var date=new Date();
				 var currentDate=date.toISOString();
				 return  currentDate;

	}

//********Function to Get  Past date & Convert in Universal Time zone******************

function getPreviousDaysdate(previous){
				 var date=new Date();
				 var previousDate=date.setDate(date.getDate() - previous);
				 previousDate=new Date(previousDate).toISOString();
				 return  previousDate;

	}

//**************************************Function to show/hide Station's Sensor list**************************************

$scope.toggleStationList=function(index) {
							if($scope.allStationsInfoDetail[index].metrics.length > 0){
							    $scope.sensorsCollapsed[index] = !$scope.sensorsCollapsed[index];
								if($scope.sensorsCollapsed[index]){
								$scope.allStationsInfoDetail[index].selectedSensorList=[];
								$scope.newSelectedStation($scope.allStationsInfoDetail[index]); //function call to add sensor to compare array

								}else{
								$scope.removeStation($scope.allStationsInfoDetail[index]); //function call to remove station's all selected sensor  from  compare array  on hide

								}

							}
       }

//**************************************Function for  adding Selected sensor to compare array**************************************

$scope.newSelectedStation = function(selectedStation){
	         		$scope.selectedStationToCompare.push(selectedStation);
       }

//**************************************Function for  Remove UnSelected sensor from compare array**************************************
$scope.removeStation=function(unselectedStation){
							$scope.selectedTotalSensorLength = $scope.selectedTotalSensorLength - unselectedStation.selectedSensorList.length;
							unselectedStation.selectedSensorList=[];
							var indexSelectedStation=$scope.selectedStationToCompare.indexOf(unselectedStation);
							$scope.selectedStationToCompare.splice(indexSelectedStation,1);

}

//************************Function to navigate to Compare Graph Page**************************************
$scope.gotoCompareStation=function(comparebottomtopclick){

							var elementListChekbx = document.querySelector('#ulStationListContainer');	//get Selected sensor count
							var totalSelectedCheckbx = elementListChekbx.querySelectorAll('input[type="checkbox"]:checked').length;
							if(totalSelectedCheckbx==0){
								showAlertService.showAlert("Select minimum 2 or maximum 4 sensors to compare");
								return;
							}
							if(totalSelectedCheckbx<2){
								showAlertService.showAlert("Select minimum 2 sensors to compare");
								return;
							}
							$ionicLoading.show({
								template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
							});
							sensorCompareService.sensorCompareList=[];
							stationCompareService.stationCompareList=[];
							if($scope.selectedStationToCompare.length > 0){
									for(var i=0; i < $scope.selectedStationToCompare.length; i++){
										if($scope.selectedStationToCompare[i].selectedSensorList.length > 0){
											stationCompareService.stationCompareList.push($scope.selectedStationToCompare[i]);
										}
										for(var j=0; j < $scope.selectedStationToCompare[i].selectedSensorList.length; j++){
										    sensorCompareService.sensorCompareList.push($scope.selectedStationToCompare[i].selectedSensorList[j]);
										}
									}
									//$state.transitionTo("sensorcompareviewtest");
							}
							$timeout(function() {
									$ionicLoading.hide();
								    $state.transitionTo("sensorcompareview");
							},2000);

  }//*****************Function to navigate to Compare Graph Page Ends*************

//Function to get Indexof SelectedSensor
var getIndexSelectedSensor = function(array, attr, value) {
			for(var i = 0; i < array.length; i++) {
				 if(array[i][attr] === value) {
				 return i;//return array.indexOf(unselectedStation)
				 }
			 }
}
//Function to get Checked Sensor's Metric History
$scope.checkedOr = function (stationdetail,metric, isCheck, index, parentindex, clickEvent) {
				//ulStationListContainer
				var elementListChekbx = document.querySelector('#ulStationListContainer');
				var totalSelectedCheckbx = elementListChekbx.querySelectorAll('input[type="checkbox"]:checked').length;
				if(totalSelectedCheckbx > 4){
					showAlertService.showAlert("you can select maximum of 4 sensors");
					clickEvent.currentTarget.checked=false;
				 }
				else{
					$scope.stationIndexTemp ='';
					if (isCheck) {
						$scope.stationIndexTemp = parentindex;
						var assets = stationdetail.asset;
						var sensor = metric;
						var currentdayformat=getCurrentdate();
						var maxdayformat=getPreviousDaysdate(7);
						console.log("compare")
						console.log($scope.allStationsInfoDetail);
						$scope.allStationsInfoDetail[parentindex].selectedSensorList.push({
						'assetId':  stationdetail.asset.assetId,
						'metricCode': metric.metricCode,
						'metricName':metric.metricName,
						'frendlyName':$rootScope[parentindex+'st'+index],
						'assetDetail':stationdetail.asset,
						'sensorArray':[]
						});
						$scope.getAssetsMetricInfo(sensor,assets,currentdayformat,maxdayformat,index);//Function call for metric history
						$scope.selectedTotalSensorLength = $scope.selectedTotalSensorLength + 1;
					}
					else {
						var sectedSensorindex=getIndexSelectedSensor($scope.allStationsInfoDetail[parentindex].selectedSensorList, stationdetail.assetId, metric.metricCode);
						$scope.allStationsInfoDetail[parentindex].selectedSensorList.splice(sectedSensorindex, 1);
						$scope.selectedTotalSensorLength = $scope.selectedTotalSensorLength - 1;
					}
				}//close for total check box else
}

$scope.getAssets=function(){

										if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
											showAlertService.showAlert("Please check Internet connection");	//native alert
											return false;
										}
										$ionicLoading.show({
												template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
										});

/*ServiceCall*/				assetsFactory.assetsList().success(function(data){
											if(data.result.length==0){												
												$("#signInBtn").prop("disabled", true);
												//showAlertService.showAlert("No Station to show");
											  return false;
											}
											$scope.stations=[];
											$scope.stationDetails=[];
											$scope.stations= data.result;
											assetsListService.assetsList=[];
											allAssetsDetailService.allAssetsDetail=[];
											assetsListService.assetsList=data.result;//Storing Station List to Service
											for(var i=0;i<$scope.stations.length;i++){
												var filterMetricArray=[];
																var metricCount=0;
																var assetTyp=0;
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
												$scope.metricListData=data.result[i].metrics;
												///////////////////////////////////

												for (var k in $scope.metricListData){
													var itemDate=$scope.metricListData[k];
													$scope.dateList.push(itemDate.detectionTime);
												  }

												$scope.dateList.sort(function(a, b){return a-b});

												var minDateSensor = $scope.dateList[0];
												var maxDateSensor = $scope.dateList[$scope.dateList.length-1];

												var formateddatemin= new Date(minDateSensor);
												var formateddatemax= new Date(maxDateSensor);

												var date1 = new Date();
												var date2 = new Date(maxDateSensor);
												var timeDiff = Math.abs(date2.getTime() - date1.getTime());
												var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

																											//Setting Station Last Communication date ColorS
												if(diffDays > 1){
													$scope.stationDetails[i].metricsColor='red';
												}else{
													$scope.stationDetails[i].metricsColor='blue';
												}

												//////////////////////////////////////////////////////
												//$scope.stationDetails[i].metrics=data.result[i].metrics;
												//Getting Station Type
												if (typeof($scope.stations[i].assetType) === "undefined"){
												}else if($scope.multiSearch($scope.stations[i].assetType.assetTypeCode,["t1sm1","sm1t1"])){
												assetTyp=1;
												}else if($scope.multiSearch($scope.stations[i].assetType.assetTypeCode,["t2"])){
												assetTyp=2;
												}else if($scope.multiSearch($scope.stations[i].assetType.assetTypeCode,["sm2"])){
												assetTyp=3;
												}else {
													assetTyp=4;
												}
												for(var j=0;j<$scope.stations[i].metrics.length;j++){
													if($scope.multiSearch($scope.stations[i].metrics[j].metricCode,['batlvl'])){
														$scope.stationDetails[i].batteryValue=$scope.stations[i].metrics[j].metricValue;
														}
														//Filtering metrics According to asset type
														if((assetTyp == 1)){
																		if(metricCount>1){
																			break;
																		}else{
																			if($scope.stations[i].metrics[j].metricCode.toLowerCase()=='t1'){
																				filterMetricArray.push($scope.stations[i].metrics[j]);
																				metricCount++;
																				//asset.t1sm1.t1=false;
																			}else if ($scope.stations[i].metrics[j].metricCode.toLowerCase()=='sm2') {
																				filterMetricArray.push($scope.stations[i].metrics[j]);
																				metricCount++;
																				//asset.t1sm1.sm2=false;
																			}
																			if($scope.stations[i].metrics[j].metricCode.toLowerCase()=='t2'){
																				if($scope.stations[i].metrics[j].metricValue>=-55&&$scope.stations[i].metrics[j].metricValue<=70)
																					 $scope.stations[i].needToSwap++;
																			}else if ($scope.stations[i].metrics[j].metricCode.toLowerCase()=='sm1') {
																					if($scope.stations[i].metrics[j].metricValue>=0&&$scope.stations[i].metrics[j].metricValue<=60)
																						 $scope.stations[i].needToSwap++;
																			}
															}
														}else if((assetTyp == 2)){
																if(metricCount>1){
																	break;
																}else{
																		if($scope.stations[i].metrics[j].metricCode.toLowerCase()=='t1'){
																			 filterMetricArray.push($scope.stations[i].metrics[j]);
																			 metricCount++;
																			// asset.t2.t1=false;
																		 }else if ($scope.stations[i].metrics[j].metricCode.toLowerCase()=='t2') {
																			 filterMetricArray.push($scope.stations[i].metrics[j]);
																			 metricCount++;
																			 //asset.t2.t2=false;
																		 }

															}
														}else if((assetTyp == 3)){
																if(metricCount>1){
																	break;
																}else{
																	if($scope.stations[i].metrics[j].metricCode.toLowerCase()=='sm1'){
																		 filterMetricArray.push($scope.stations[i].metrics[j]);
																		 metricCount++;
																		// asset.sm2.sm1=false;
																	 }else if ($scope.stations[i].metrics[j].metricCode.toLowerCase()=='sm2') {
																		 filterMetricArray.push($scope.stations[i].metrics[j]);
																		 metricCount++;
																		 //asset.sm2.sm2=false;
																	 }
																 }
															}else if((assetTyp == 4)&&!($scope.multiSearch($scope.stations[i].metrics[j].metricCode,['batlvl']))){
															// filterMetricArray.push($scope.stations[i].metrics[j]);
															// metricCount++;
															if(metricCount>1){
																break;
																}else{
																filterMetricArray.push($scope.stations[i].metrics[j]);
																metricCount++;
																}
															} //ifelse ends
										}//inner for loop ends
											//Sorting Station's Sensor According to name
											 filterMetricArray.sort(function(a, b){
														var x = a.metricCode.toLowerCase();
													var y = b.metricCode.toLowerCase();
													return x < y ? -1 : x > y ? 1 : 0;
												 return a.metricCode-b.metricCode
												 });
												 $scope.stationDetails[i].metrics=filterMetricArray
												 allAssetsDetailService.allAssetsDetail.push($scope.stationDetails[i]);

									}//Outer for loop end

											flagService.flagList.dashboardAssetFlag='true';
											//Sorting Station Acording to Name
											allAssetsDetailService.allAssetsDetail.sort(function(a, b){
												var x = a.asset.assetName.toLowerCase();
												var y = b.asset.assetName.toLowerCase();
												return x < y ? -1 : x > y ? 1 : 0;
												});
											//Copying Station Detail with their Attributes
											$scope.allStationsInfoDetail=allAssetsDetailService.allAssetsDetail;
											$timeout(function() {
												 $ionicLoading.hide();
											},2000);

									 }).error(function(error){
													console.log('error bock');
													console.log(error);


									}).finally(function() {
												 // Stop the ion-refresher from spinning
												 	$ionicLoading.hide();
												 $scope.$broadcast('scroll.refreshComplete');
									});

}

	            $scope.getAssets(); //Function call to get station List with their sensor's list


//******************************Function for getting all Sensor's History Reading ******************************
$scope.getAssetsMetricInfo=function(sensor,assets,currentdayformat,maxdayformat,index){
                //Checking for Internet Connectivity
				if (checkConnectionService.checkConnection() == false) {
					showAlertService.showAlert("Please check Internet connection");
					return false;
				}
				$ionicLoading.show({
					template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
				});
				//Calling Metric History Api
				assetsFactory.getAssetsMetricInfo(sensor,assets,currentdayformat,maxdayformat).success(function(data){

						$scope.sensorMetricList=data.result.metric.values;
						$scope.historyList=[];
						$scope.dataTestSingleSensor=[];
						$scope.dataSensor=[];
						$scope.dateListSensor=[];

						if (typeof(data.result.metric.values) === "undefined"){
						}else{
							$scope.historyList=data.result.metric.values;
							$scope.updatedMetricList = data.result.metric.values;
							for (var L in $scope.historyList){
								var itemDate=$scope.historyList[L];
								$scope.dateListSensor.push(itemDate.detectionTime);
							}
							$scope.dateListSensor.sort(function(a, b){return a-b});	//sort sensor according to date
							var minDateForSensor = $scope.dateListSensor[0];
							var maxDateForSensor = $scope.dateListSensor[$scope.dateListSensor.length-1];
							var date1Sensor = new Date();
							var date2Sensor = new Date(maxDateForSensor);
							var timeDiffSensor = Math.abs(date2Sensor.getTime() - date1Sensor.getTime());
							var diffDaysSensor = Math.ceil(timeDiffSensor / (1000 * 3600 * 24));
							var flagForSensorTextColor='';

							if(diffDaysSensor > 1){
								flagForSensorTextColor='red';
							}else{
								flagForSensorTextColor='blue';
							}
							if($scope.multiSearch(data.result.metric.metricCode,['temp','t1','t2'])){
                    for (var k in $scope.historyList){
                        var item=$scope.historyList[k];

                        $scope.dataSensor.push({
                            "detectionTime":new Date(item.detectionTime).toISOString() , //d.detectionTime,
                            "metricValue": Math.round(item.metricValue,0)> (-1000)?(item.metricValue>-56&&item.metricValue<71?Math.round(item.metricValue, 0):'Error'): $scope.stations[index].needToSwap==2?'Please swap the sensors':'Please connect the sensor',// item.metricValue
                            "sensorColor":flagForSensorTextColor,
                            "metricCode":data.result.metric.metricCode,
                        })

                     }
							}else{
                      for (var k in $scope.historyList){
                          var item=$scope.historyList[k];

                          $scope.dataSensor.push({
                              "detectionTime":new Date(item.detectionTime).toISOString() , //d.detectionTime,
                              "metricValue": Math.round(item.metricValue,0)>(-1000)?(item.metricValue>=0?(item.metricValue<61?Math.round(item.metricValue, 0):'Error'):'Please install in soil'):$scope.stations[index].needToSwap==2?'Please swap the sensors':'Please connect the sensor', //item.metricValue>=0&&item.metricValue<61?Math.round(item.metricValue, 0):'Please Install',// item.metricValue
                              "sensorColor":flagForSensorTextColor,
                              "metricCode":data.result.metric.metricCode,
                          })

                       }
							}

						}
							var sensorListIndex = $scope.allStationsInfoDetail[$scope.stationIndexTemp].selectedSensorList.length;
							if(sensorListIndex > 0){
								$scope.allStationsInfoDetail[$scope.stationIndexTemp].selectedSensorList[sensorListIndex - 1].sensorArray.push($scope.dataSensor);
							}else{
								$scope.allStationsInfoDetail[$scope.stationIndexTemp].selectedSensorList[0].sensorArray.push($scope.dataSensor);
							}
							$scope.stationIndexTemp ='';
							$ionicLoading.hide();

				}).error(function(error){
							console.log('error bock');
							console.log(error);
							$ionicLoading.hide();

				});



 }

});
