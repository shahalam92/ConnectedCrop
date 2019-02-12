
stationModule.controller('sensorCompareControllerTest', function($scope,$location ,$ionicModal,$ionicLoading, $timeout,$state,$interval,assetsDetailService,
allAssetsDetailService,assetsSensorService,sensorDetailService,assetsFactory,flagService,markerDetailService,sensorCompareService,
stationCompareService,checkConnectionService,showAlertService) {
var sensorRecordIndex=0;
$scope.sensorColor;
$scope.updatedMetricList=[];
$scope.dataTest = [];
$scope.dataTestArray=[];
$scope.dataTestSingleSensor = [];
$scope.historyList=[];
$scope.compareStationArray=[];
$scope.stationMetricListShowStatus = [];
//********************************Function to Match Strings********************************
$scope.multiSearch= function(text, searchWordsArray){
        return assetsFactory.checkAssetMetricType(text, searchWordsArray);
}
//********************************Navigation Functions********************************
$scope.gotoBackFromSensorCompare=function(){
		$state.transitionTo("compareview");
}
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
//*************Function to show/Hide Station's Metric on Click of up/down Arrow button
$scope.toggleStationList=function(index) {
          $scope.stationMetricListShowStatus[index] = !$scope.stationMetricListShowStatus[index];
}
//********************************* get Selected Station  Detail from Service**************************
if(flagService.flagList.stationDetailpgFlag == 'true'){
		$scope.assetsDetail=markerDetailService.markerDetail.asset;  //
}else{
		$scope.assetsDetail=assetsDetailService.assetsDetail;
}

//**************************************Function for Metric Name Text Color**************************************
function getChartColorForSensorTitle(){
					var getSensorDataClassList = document.getElementsByClassName("sensorDataLiClass");
					var counterForSensorClass;
					counterForSensorClass=0;
					for (counterForSensorClass; counterForSensorClass < getSensorDataClassList.length; counterForSensorClass++) {
						if(counterForSensorClass == 0){
							getSensorDataClassList[counterForSensorClass].style.color = "#C1AF65"; //"yellow";
						}else if(counterForSensorClass == 1){
							getSensorDataClassList[counterForSensorClass].style.color = "#93d637"; //"green";
						}else if(counterForSensorClass == 2){
							getSensorDataClassList[counterForSensorClass].style.color = "#7FA4BE"; //"blue";
						}else if(counterForSensorClass == 3){
							getSensorDataClassList[counterForSensorClass].style.color = "#737254"; //"gray";
						}

					  }

}
setTimeout(function(){
	getChartColorForSensorTitle();//Function Call
 },1000);
function getPreviousDaysdate(previous){
		   	var  date=new Date();
			var previousDate=date.setDate(date.getDate() - previous);
			previousDate=new Date(previousDate)
			return  previousDate;
}
//********************************Fuction for Calculating the data to plot in the graph*********************************
$scope.makeData3 = function () {
					$scope.compareStationArray=stationCompareService.stationCompareList;
					$scope.compareSensorArray=sensorCompareService.sensorCompareList;
										var x={},y={};
                    					$scope.setmessage=[]
                    					$scope.time=new Date()
                    					//To get the alert message for Events
                    					for (x in $scope.evnets_list) {
                    						for(y in $scope.evnets_list[x].resultLog.app.appArguments){
                    						    if($scope.evnets_list[x].resultLog.app.appArguments[y].code=='system.log.event.message'){
                    								$scope.setmessage[x]=$scope.evnets_list[x].resultLog.app.appArguments[y].value;
                    							}
                    						}
                    					}
					console.log($scope.compareSensorArray);
					var looplength = sensorCompareService.sensorCompareList.length;
					for(var i=0; sensorCompareService.sensorCompareList.length > i; i++){
								$scope.dataTestArray.push(sensorCompareService.sensorCompareList[i].sensorArray[0])
								$ionicLoading.show({
									template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
								});
								looplength = looplength-1;
								if(looplength == 0){
									InitChart($scope.dataTestArray);// Function Call to Create Chart
								}
								$ionicLoading.hide();

				    	} //close of sensor loop
 }
//#***************************FFuction Call for Calculating the data to plot in the graph************

$scope.makeData3();

//**************************Function to Create Compare Chart**************************
function InitChart(arrayData) {
					var minY=0;
					var maxY=0;
					var minY2=0;
					var maxY2=0;
					var d3Extent=[];
					var chartSerialNum=0
					var isTemp=false;
					//Calculating Min And Max Range for Chart Axis
					for(var i in arrayData){
						var maxSoil;
						var minSoil
						var minTemp;
						var maxTemp;
						if(arrayData[i].length == 0){
						}
						else if(assetsFactory.checkAssetMetricType(arrayData[i][0].metricCode, ['t1','t2','temp'])){
							isTemp=true;
							 maxTemp=d3.max(arrayData[i], function (d) {
								return +d.metricValue;
							});
							 minTemp=d3.min(arrayData[i], function (d) {
								return +d.metricValue;
							});
						  if (minTemp<minY){
								minY=minTemp;
							}
							if(maxTemp>maxY){
								maxY=maxTemp;
							}
						}else{
							 maxSoil=d3.max(arrayData[i], function (d) {
								return +d.metricValue;
							});
							 minSoil=d3.min(arrayData[i], function (d) {
								return +d.metricValue;
							});

							if(minSoil<minY2){
								minY2=minSoil;
							}
							if(maxSoil>maxY2){
								maxY2=maxSoil;
							}
						}
						var minD=d3.min(arrayData[i], function(d) { return new Date(d.detectionTime); });
						var maxD=d3.max(arrayData[i], function(d) { return new Date(d.detectionTime); });
						if(!(undefined === minD))
							d3Extent.push(minD);
						if(!(undefined === maxD))
							d3Extent.push(maxD);


/*						var localMiny= d3.min(arrayData[i], function (d) {
							return +d.metricValue;
						});

						var localMaxy= d3.max(arrayData[i], function (d) {
							return +d.metricValue;
						});*/
						/*if(localMiny<minY){
							minY=localMiny;
						}
						if(localMaxy>maxY){
							maxY=localMaxy;
						} */
					}
				    if (minY<-55){
				    	minY=-55;
				    }
				    if (maxY>70){
				    	maxY=70;
					    }
				    if (minY2<0){
						 minY2=0;
					    }
				    if (maxY2>100){
						 maxY2=100;
					   }
				    d3Extent.sort(function(a, b){return a-b}) //Sorting Date in Assending Order
					var minDateSensor = d3Extent[0];
					var maxDateSensor = d3Extent[d3Extent.length-1];
					var formateddatemin= new Date(minDateSensor);
					var formateddatemax= new Date(maxDateSensor);
					var date1 = new Date(minDateSensor);
					var date2 = new Date(maxDateSensor);
					var timeDiff = Math.abs(date2.getTime() - date1.getTime());

			        var vis =   d3.select("#compareChartDiv"),
								WIDTH = (98 * window.innerWidth)/100,
								HEIGHT = (36 * window.innerHeight)/100, //250,
								MARGINS = { top: 20,right: 15,bottom: 20,left: 25},
						//Adding Scale ,Range,Domain of Axes
					   xRange = d3.time.scale()
								.range([MARGINS.left, WIDTH - MARGINS.right-10 ])
								.domain([getPreviousDaysdate(7),new Date()]),
					   yRange = d3.scale.linear()
								.range([HEIGHT - MARGINS.top, MARGINS.bottom])
								.domain([minY,maxY]),
					  yRange2 = d3.scale.linear()//add
								.range([HEIGHT - MARGINS.top, MARGINS.bottom])
								.domain([minY2, maxY2]),
					yAxisRight= d3.svg.axis()//add
								.scale(yRange2)
								.orient("right")
								.ticks(6)
								.tickSize(1),
					    yAxis = d3.svg.axis()
								.scale(yRange)
								.orient("left")
								.ticks(6)
								.tickSize(1);
				    if(!isTemp){
				    	yRange.domain([minY2, maxY2]);
				    }
				    //Calculating Tickformat for Date Axis(X-Axis)
					// if(timeDiff < 86400000){
					// 	 var xAxis = d3.svg.axis()
					// 					.scale(xRange)
					// 					.orient("bottom")
					// 					.ticks(7)
					// 					.tickFormat(d3.time.format("%I:%M %p"))
					// 					.tickSize(1);
          //
					// }else{
						var xAxis = d3.svg.axis()
										.scale(xRange)
										.orient("bottom")
										.ticks(7)
										//.tickValues(newData.map(function(d) { return d.Date; }));
										.tickFormat(d3.time.format("%b %d"))
										.tickSize(1);
					    //  }

					//Line Function for Y1 Axis
					var lineFunc = d3.svg.line()
										.interpolate("monotone")
										.x(function (d) {return xRange(new Date(d.detectionTime));})
										.y(function (d) {return yRange(+d.metricValue); })
										.defined(function(d) {  return !isNaN(d.metricValue) });

					//Line Function for Y2 Axis
					var lineFunc2 = d3.svg.line()//add....................................
										.interpolate("monotone")
										.x(function (d) {return xRange(new Date(d.detectionTime));})
										.y(function (d) {return yRange2(+d.metricValue); })
										.defined(function(d) {return !isNaN(d.metricValue)});
					//Adding backgorud image to chart
					vis.append("svg:rect")
                        .attr("width", "84%")
                        .attr("height", "75%")
                        .attr("fill", "#000")
                        .attr("fill-opacity","0.2")
                        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");;

					//Rotation of x-axis Date
					vis.append("svg:g")
									.attr("class", "x axis")
									.attr("transform", "translate(0," + (HEIGHT - (MARGINS.bottom)) + ")")
									.call(xAxis)
									.selectAll("text")
									.style("text-anchor", "end")
									.style("font-size","8px")
									.style("font-family","Halvetica_light_neue")
									.attr("dx", "0.4em")
									.attr("dy", "1em")
									.attr("transform", function(d) {
									return "rotate(-40)"
									});

/*					vis.append("svg:g")
									.attr("class", "y axis")
									.attr("transform", "translate(" + (MARGINS.left) + ",0)")
									.call(yAxis)
									.selectAll("text")
									.style("text-anchor", "end")
									.style("font-size","8px")
									.style("font-family","Halvetica_light_neue");
																						*/
					for (var k in arrayData){
									if(arrayData[k].length == 0){
										vis.append("svg:g")
										.attr("class", "y axis")
										.attr("transform", "translate(" + (MARGINS.left) + ",0)")
										.call(yAxis)
										.selectAll("text")
										.style("text-anchor", "end")
										.style("font-size","8px")
										.style("font-family","Halvetica_light_neue");
									}
									else{
											if(assetsFactory.checkAssetMetricType(arrayData[k][0].metricCode, ['sm','hum','soil'])){
												if(!isTemp){
															//Adding Group
													vis.append("svg:g")
													.attr("class", "y axis")
													.attr("transform", "translate(" + (MARGINS.left) + ",0)")
													.call(yAxis)
													.append("text")
													.attr("class", "label")
													.attr("y", 15)
													.attr("x",0)
													.style("text-anchor", "end")
													.style("fill", "white")
													.text("%")
													//.text(function (d){if(assetsFactory.checkAssetMetricType(arrayData[k][0].metricCode, ['temp','t1','t2']))  return "ºC";else  return "%";})
													.selectAll("text")
													.style("font-size","8px")
													.style("font-family","Halvetica_light_neue");
												}else{
													vis.append("svg:g")
													.attr("class", "y axis")
													.attr("transform", "translate(" + (WIDTH - (MARGINS.right + 10)) + ",0)")
													.call(yAxisRight)
													.append("text")
													.attr("class", "label")
													.attr("y", 15)
													.attr("x",8)
													.style("text-anchor", "end")
													.style("fill", "white")
													.text("%")
													.selectAll("text")
													.style("font-size","8px")
													.style("font-family","Halvetica_light_neue");
												}
												vis.append("svg:path")
																.attr('stroke',function (d){
                                    if (chartSerialNum==0)  {
                                        return "#C1AF65";}
                                    else if(chartSerialNum==1){
                                        return "#93d637";}
                                    else if(chartSerialNum==2){
                                        return "#7FA4BE";}
                                    else if(chartSerialNum==3){
                                        return "#737254";} //'blue'
																	})
																.attr('stroke-width', 1)
																.attr('fill', 'none')
																.attr("d", function(d){	if(isTemp)
																	return lineFunc2(arrayData[k]);
																	else
																	return lineFunc(arrayData[k]);

																	});
												chartSerialNum = chartSerialNum + 1;
											}
											else{
												vis.append("svg:g")
																.attr("class", "y axis")
																.attr("transform", "translate(" + (MARGINS.left) + ",0)")
																.call(yAxis)
																.append("text")
																.attr("class", "label")
																.attr("y", 15)
																.attr("x",0)
																.style("text-anchor", "end")
																.style("fill", "white")
																//.text("ºC");
																.text(function (d){if(assetsFactory.checkAssetMetricType(arrayData[k][0].metricCode, ['temp','t1','t2']))  return "ºC";else  return "%";})
																.selectAll("text")
																.style("font-size","8px")
																.style("font-family","Halvetica_light_neue");
												vis.append("svg:path")
																.attr('stroke',function (d){
                                    if (chartSerialNum==0) {
                                        return "#C1AF65";}
                                    else if(chartSerialNum==1) {
                                        return "#93d637";}
                                    else if(chartSerialNum==2) {
                                        return "#7FA4BE";}
                                    else if(chartSerialNum==3) {
                                        return "#737254";}
																	}) //'blue'
																.attr('stroke-width', 1)
																.attr('fill', 'none')
																.attr("d",lineFunc(arrayData[k]));
												chartSerialNum = chartSerialNum + 1;
											}
									}

					} //for loop
					$ionicLoading.hide();
}//Create Chart function Closed

}); //controller close here
