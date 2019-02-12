

stationModule.controller('mapController', function($scope,$location ,$ionicModal,$filter, $timeout,$state, $ionicLoading,
		$ionicHistory,allAssetsDetailService,markerDetailService,$rootScope,showAlertService,flagService) {
// var initiallat=43.65865;
// var initiallong=-79.6059;
var initiallat='';
var initiallong='';
var call=true;
var GOOGLELTNG = '';
var map = '';
var myLatlng = '';
var animatedZoom = 16;
var mapp ='';
var javascriptGoogleMaps = '';
var data = [];
var boundsArray=[]
var boundsLatLng={"lat":null,"lng":null}
var latlngbounds = new plugin.google.maps.LatLngBounds();
$scope.hasLocation=0
var No_OfStations=allAssetsDetailService.allAssetsDetail.length;
console.log(allAssetsDetailService.allAssetsDetail)
$scope.gotoAlertview=function(){
				$state.transitionTo("alertview");
}
$scope.gotoCompareview=function(){
				$state.transitionTo("compareview");
}
$scope.gotoSettingview=function(){
		  	gotosetting();
}
//Map to List Toggle button
$scope.gotoDashboard=function(){
			map.clear();
			map.off();
			$state.transitionTo("dashboardview");
}
// **************************************ZOOM FUNCTIONS STARTS *********************

$scope.zoomOut = function(){
			animatedZoom++;
			map.setZoom(animatedZoom);
}
$scope.zoomIn = function(){
			animatedZoom--;
			map.setZoom(animatedZoom);
}

function gotosetting(){
		$state.transitionTo("settingview");
}
function gotoconfig(){
            $state.go("configStationListView");
}
//	**************************************ZOOM FUNCTIONS Ends *********************
	for(var i=0;i<No_OfStations;i++){
			      var No_OfAttr=allAssetsDetailService.allAssetsDetail[i].attributes.length;
					  for(var j=0; j <No_OfAttr; j++){
								if(allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeCode.toLowerCase() == 'station.latitude')
											initiallat=allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeValue;
								else if(allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeCode.toLowerCase() == 'station.longitude')
											initiallong=allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeValue;
						}
						if(!isNaN(initiallat)&&!isNaN(initiallong))
						   {
							 $scope.hasLocation=$scope.hasLocation+1;
							 latlngbounds.extend(new plugin.google.maps.LatLng(initiallat,initiallong));
							 initiallat='';
							 initiallong='';
						}


	}

var mapDiv = document.getElementById("map_canvas");
//map initialization
map = plugin.google.maps.Map.getMap(mapDiv,{'mapType' :plugin.google.maps.MapTypeId.HYBRID});

	if(No_OfStations<=0){
		showAlertService.showAlertCallback("You don't have any active stations yet. To activate a station, please go to Settings then click \"Activate Station\".",gotosetting)
		return false;
	}
	else if($scope.hasLocation==0){
		showAlertService.showAlertCallback('You have not located any station(s). You can add a station location from  Settings > Configure Station > {choose the station you would like to locate} then from the Basic Mode > "Station Location", drop a pin on the map to show the location of that station.',gotoconfig )
		return false;
	}else{
		//Map ready Event Listener
		map.addEventListener(plugin.google.maps.event.MAP_READY, onMapInit);
	}

//map Ready Callback
function onMapInit(map){
							GOOGLELTNG = new plugin.google.maps.LatLng(initiallat,initiallong);
							//map.setCenter(GOOGLELTNG);
							map.animateCamera({
								'target':latlngbounds,
								'tilt': 30,
								'zoom': 13,
								'bearing': 140,
								'duration': 5000 // = 5 sec.
						   	}, function() {
									//	console.log("The animation is done");
								});
							data=[];
							for(var i=0;i<No_OfStations;i++)
							    {
														$scope.metricList='';
														if(typeof(allAssetsDetailService.allAssetsDetail[i].metrics) === "undefined")
														 {}
														else    
														 {	 	$scope.metricList ='Last Communication : ' + allAssetsDetailService.allAssetsDetail[i].asset.relative_time+'\n';
															     for (var k in allAssetsDetailService.allAssetsDetail[i].metrics)
																 { 
																   	 if(allAssetsDetailService.allAssetsDetail[i].metrics[k].active){
																		var reading =allAssetsDetailService.allAssetsDetail[i].metrics[k].status!='sensor-status-error'?parseInt(allAssetsDetailService.allAssetsDetail[i].metrics[k].reading).toFixed(1)+' '+allAssetsDetailService.allAssetsDetail[i].metrics[k].unit : allAssetsDetailService.allAssetsDetail[i].metrics[k].ErrorMsg; 		  
																  		$scope.metricList+=allAssetsDetailService.allAssetsDetail[i].metrics[k].assetName +' : '+reading+' | '
																		}
																//  console.log(allAssetsDetailService.allAssetsDetail[i].metrics)
																 
																 }
														 }														
														data[i]={};
														data[i].title=allAssetsDetailService.allAssetsDetail[i].asset.organization.organizationName+' > '+allAssetsDetailService.allAssetsDetail[i].asset.assetName;
														data[i].snippet= $scope.metricList + '\n' +'MORE INFO-->';
														var No_OfMetric=allAssetsDetailService.allAssetsDetail[i].metrics.length
														if(device.platform == 'Android'){
																					if( No_OfMetric> 0){
																					data[i].styles ={
																								'position':'absolute',
																								'text-align':'center',
																								'font-style':'italic',
																								'font-weight':'bold',
																								'color': '#bfad6a',
																								'border':'1px solid yellow !important',
																								'background-color':'gray',
																								'background':'gray !important',
																								'width':'90%',
																								'margin-left':'5%'
																					 };
																					data[i].icon='www/img/pushpinG.png';
																					}else{
																						 data[i].styles ={
																								'position':'absolute',
																								'text-align':'center',
																								'font-style':'italic',
																								'font-weight':'bold',
																								'color': 'red',
																								'border':'1px solid yellow !important',
																								'background-color':'red',
																								'background':'red !important',
																								'width':'90%',
																								'margin-left':'5%'
																								};
																				  	data[i].icon='www/img/pushpinR.png';
																					}
																		}else{
																					if(No_OfMetric > 0){
																						data[i].styles ={
																									'position':'absolute',
																									'text-align':'center',
																									'font-style':'italic',
																									'font-weight':'bold',
																									'color': '#bfad6a',
																									'border':'1px solid yellow !important',
																									'background-color':'gray',
																									'background':'gray !important',
																									'width':'90%',
																									'margin-left':'5%'
																						   };
																						// console.log('iOS if block for add marker green color allAssetsDetailService.allAssetsDetail[i].metrics');
																							data[i].icon='http://prod.liveintersect.com/ccmobileimages/green_map_pin.png';

																					 }else{
																							data[i].styles ={
																									'position':'absolute',
																									'text-align':'center',
																									'font-style':'italic',
																									'font-weight':'bold',
																									'color': 'red',
																									'border':'1px solid yellow !important',
																									'background-color':'red',
																									'background':'red !important',
																									'width':'90%'
																									};
																								data[i].icon='http://prod.liveintersect.com/ccmobileimages/red_map_pin.png';
																				  	}
																						// if(allAssetsDetailService.allAssetsDetail[i].metricsColor == 'red'){
																						// 	data[i].styles ={
																						// 			'position':'absolute',
																						// 			'text-align':'center',
																						// 			'font-style':'italic',
																						// 			'font-weight':'bold',
																						// 			'color': 'red',
																						// 			'border':'1px solid yellow !important',
																						// 			'background-color':'red',
																						// 			'background':'red !important',
																						// 			'width':'90%'
																						// 		};
																						// data[i].icon='http://prod.liveintersect.com/ccmobileimages/red_map_pin.png';//'http://www.rootinfosol.com/sites/default/files/2017-04/map_pin_charry.png';
																						// }
																		}
																		//metrics
																		data[i].animation = plugin.google.maps.Animation.DROP;
																		data[i].assetDetail=allAssetsDetailService.allAssetsDetail[i];
																		// Info window Click event
																		data[i].infoClick=function(marker){
																				map.clear();
																				map.off();
																				markerDetailService.markerDetail=marker.get("assetDetail");
																				$state.transitionTo("stationdetailview");
																		};
																		$rootScope.getdata = markerDetailService.markerDetail;
																		function ConvertDMSToDD(degrees, minutes, seconds, direction) {
																				degrees=  parseInt(degrees) + parseInt(i);
																				var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);
																				if (direction == "S" || direction == "W") {
																				dd = dd * -1; }
																				return dd;
																		}
																		function ParseDMS(input) {
																				var parts = input.split(/[^\d\w\.]+/);
																				var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
																				return lat
																		}
																	 var stationLatitude='';
										 							 var stationLongitude='';
																	 var No_OfAttr=allAssetsDetailService.allAssetsDetail[i].attributes.length;
																	/*
								                    For loop Extracts staion's location if specified
																	*/
																		var No_OfAttr=allAssetsDetailService.allAssetsDetail[i].attributes.length;
										 							  for(var j=0; j< No_OfAttr; j++){
										 										 if(allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeCode.toLowerCase() == 'station.latitude')
										 										 stationLatitude = allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeValue;
										 									   else if(allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeCode.toLowerCase() == 'station.longitude')
										 										 stationLongitude = allAssetsDetailService.allAssetsDetail[i].attributes[j].attributeValue;
										 								 }
								                    //  if('(Not Specified)')
																		if(!isNaN(stationLatitude)&&!isNaN(stationLongitude)){
																			  data[i].position=new plugin.google.maps.LatLng(stationLatitude,stationLongitude);
																			  stationLatitude='';
																			  stationLongitude='';
																		}else{
																			data.splice(i,1);
																		}



					       }
								//  console.log(data)
								 //.................................for loop ends here*********************************

							//Adding markers to map
				setTimeout(function(){
								addMarkers(data, function(markers) {
										markers[markers.length - 1];
								});
								function addMarkers(data, callback) {
										var markers = [];
										function onMarkerAdded(marker) {
										markers.push(marker);
										if (markers.length === data.length) {
											callback(markers);
									  	}
										}
										data.forEach(function(markerOptions) {
												map.addMarker(markerOptions, onMarkerAdded);
										});
								}

			 	},2000);


  }
$scope.CurrentLoct = function(){    //**************current location function Start
												animatedZoom=16;
					  // Current location success callback function
											  var onSuccess = function(position) {
															var lat = position.coords.latitude;
															var long = position.coords.longitude;
															myLatlng = new plugin.google.maps.LatLng(lat,long);
															 // current locaton marker
															map.addMarker({
																	'position':myLatlng,
																	'title': 'You are Here!',
																	'icon':{'url': 'www/img/locationMarker.png',
																				    'size':{
																					'width':40,
																					'height':40
																				}
																			}
															},function(marker) {
																marker.showInfoWindow();
															});
															map.setCenter(myLatlng);
															//animate position
															map.animateCamera({
															'target': myLatlng,
															'tilt': 30,
														  'zoom': animatedZoom,
														  'bearing': 140,
														  'duration': 5000});
											  } // Current location success callback function  Ends Here
												// currrent Loation Callback onError  ,receives a PositionError object
													function onError(error) {
															showAlertService.showAlert('To continue, please turn on location from Settings');
													}
													if (device.platform == "Android") {
																  cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
																  if (status == "GRANTED") {
																	cordova.plugins.diagnostic.isLocationEnabled(function (result) {
																			if(result == false){
																			showAlertService.showAlert('To continue, please turn on location from Settings');
																			}else{
																			navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });
																			}
																	});
																 }
																});
													}else{
																navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });
													}

}
//.*********************************************current location function ends**************************************************

//Map Called  ****************************************************
//****************************************************Map ADD Event Listener Ends here******************************************************************* */
});
