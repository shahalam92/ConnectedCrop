

stationModule.controller('stationlocation', function($scope,$location ,flagService,$ionicModal,$filter, $timeout,$state, $ionicLoading,
		$ionicHistory,allAssetsDetailService,markerDetailService,$rootScope,showAlertService,assetsFactory,api) {

// var initiallat;
// var initiallong;

var GOOGLELTNG = new plugin.google.maps.LatLng($rootScope.stationToLocate.lat,$rootScope.stationToLocate.lng);
var map = '';
var myLatlng = '';
var animatedZoom = 13;
var mapDiv = document.getElementById("map");
$scope.stationPostDataAttributes=[];
$scope.station={
	lat:$rootScope.stationToLocate.lat,
	long:$rootScope.stationToLocate.lng
}
$scope.stationDetail=$rootScope.stationToLocate.stationDetail;//get the station name
$scope.stationPostDataAttributes[0]={
    'attributeCode': api.key.latitude,
    'attributeValue': ""
    };
$scope.stationPostDataAttributes[1]={
	'attributeCode': api.key.longitude,
	'attributeValue': ""
    };

//Go back from map
$scope.gotoConfigSetting=function(){
	flagService.flagList.fromSetLocation=true;
  map.clear();
  map.off();
  $state.transitionTo("config");
}

map = plugin.google.maps.Map.getMap(mapDiv,{'zoom': 13,'mapType' :plugin.google.maps.MapTypeId.HYBRID,'controls': {
    'compass': false
  }});
map.on(plugin.google.maps.event.CAMERA_CHANGE, onMapCameraChanged);
map.on(plugin.google.maps.event.MAP_READY, onMapInit);

//Camera change callback function
function onMapCameraChanged(position) {
                 map = this;
                  $scope.station={
                          lat:position.target.lat,
                          long:position.target.lng
                }
								$scope.$apply();
}
//function callback on map initialization
function onMapInit(){
	console.log($rootScope.stationToLocate);
	        if(($rootScope.stationToLocate.lat==0&&$rootScope.stationToLocate.lng==0)||($rootScope.stationToLocate.lat=="(Not Specified)"&&$rootScope.stationToLocate.lng=="(Not Specified)")||($rootScope.stationToLocate.lat==undefined&&$rootScope.stationToLocate.lng==undefined)){
							$scope.CurrentLoct();
					}else{
  				map.setCenter(GOOGLELTNG);
					map.animateCamera({
				  'target': GOOGLELTNG,
				  'tilt': 30,
				  'zoom': 13,
				  'bearing': 140,
				  'duration': 5000 // = 5 sec.
				}, function() {
				  //console.log("The animation is done");
				});
			}
			console.log(GOOGLELTNG);

}



//**************current location function Start
$scope.CurrentLoct = function(){
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

 											 // ***************Current location success callback function********************
 											 function onSuccess(position) {
																	var latitude = position.coords.latitude;
																	var longitude = position.coords.longitude;
																	$scope.station={
																	lat:latitude,
																	long:longitude
																	};
																	myLatlng = new plugin.google.maps.LatLng(latitude,longitude);
																	//animate position
																	map.setCenter(myLatlng);
																	// map.addCircle({
																	// 	  'center': myLatlng,
																	// 	  'radius': 300,
																	// 	  'strokeColor' : '#3085EF',
																	// 	  'strokeWidth': 2,
																	// 	  'fillColor' : '#A3C5D9'
																	// 		});
																	map.animateCamera({'target': myLatlng,'zoom': animatedZoom,'duration': 2000});
																	// current locaton marker
																	map.addMarker({
																	'position':myLatlng,
																	'icon':{'url': 'www/img/locationMarker.png',
																	'size':{
																	'width':50,
																	'height':50
																	}
																	}
																	});

 											 }
 											 // currrent Loation Callback onError  ,receives a PositionError object
 											 function onError(error) {
 											 	    showAlertService.showAlert('To continue, please turn on location from Settings');
 											 }
}
//.*********************************************current location function ends**************************************************


//Saves Staion Location
$scope.saveLocation=function (location) {
                  $scope.stationPostDataAttributes[0].attributeValue =  location.lat	;
                  $scope.stationPostDataAttributes[1].attributeValue = location.long;
									$rootScope.stationToLocate.lat=location.lat;
									$rootScope.stationToLocate.lng=location.long;
                  //console.log(location)
              /* ***************Update Asset Attributes Service Call***************** */
                assetsFactory.assetattributesPost($scope.stationDetail.assetId,$scope.stationPostDataAttributes).success(function(data){
                    $ionicLoading.hide();
                    showAlertService.showAlert("Location Saved successfully");
										flagService.flagList.fromSetLocation=true;
										map.clear();
										map.off();
										$state.transitionTo("config");									
                }).error(function(error){
                  	showAlertService.showAlert("Error Saving Location");
                    $ionicLoading.hide();
                }).finally(function(){
                    $ionicLoading.hide();
                });
}
});
