
/*
**************************** Creation Log********************************************************************************************************
File Name               :assetsService.js
Module Name             :Used to Locally Store  list of all aAssets & it's Attributes ,Metric, & Shared Function used in Controllers
Project Name            :Connected cropes
Description             :Will return data of all assets
Version                 :1.0
Name of Developer       :Root Info Solutions
Creation Date           :14 Jun 2016
******************************************************************************************************************************************
*/

concrops.factory('flagService', function () {
    return {
    	//Flags Used in the App
        flagList:{
                  dashboardAssetFlag:'',
                  dashboardAssetMetricFlag:'',
                  dashboardSensorListFlag:'',
                  stationDetailpgFlag:'',
                  sensorDetailpgFlag:'',
                  settingTempToggle:'',
                  goToStationCongigPg:'',
              	  dataListForOneDayFlag:'false',
                  daySelectedFlag:'#1' ,
                  Is_No_OfStationOne:false,
                  soilType:"",
                  Is_FrendlyNameChanged:false,
                  stationIndex:-1,
                  collapseHistory:[],
                  fromSetLocation:false,
                  needSensorSwap:0,
                  srNo:'',
                  stationTypeId:0,
                  barCodeValue:'',
                  tempdiff:-1,
                  stationTypeId:-1,


        },
        orgList:[]
    }
});

concrops.factory('assetsListService', function () {
    return {
        assetsList: []//Store Station List
    }
});

concrops.factory('graphService', function () {
    return {

        sensorGraph: {}
    }
});

concrops.factory('assetsDetailService', function () {
    return {

        assetsDetail: {} //Store Station's Details
    }
});

concrops.factory('allAssetsDetailService', function () {
    return {

        allAssetsDetail: [] //Store Station list as well as their coresponding Details
    }
});

concrops.factory('markerDetailService', function () {
    return {

        markerDetail: {}
    }
});

concrops.factory('assetsSensorService', function () {
    return {

    	assetsSensorDetail: {}
    }
});

concrops.factory('sensorDetailService', function () {
    return {

    	sensorDetail: []
    }
});

concrops.factory('stationCompareService', function () {
    return {

    	stationCompareList: []  //Store the Which needds to be compared
    }
});

concrops.factory('sensorCompareService', function () {
    return {

    	sensorCompareList: []  //store Sensors List Which needs to be compared
    }
});


concrops.factory('configureStaionService', function () {
    return {

    	configStationDetail: {}
    }
});
//****************************************Function For Checking Internet Connectivity***************************************
concrops.factory('checkConnectionService', function (api) {
    return {
        checkConnection: function () {
        // var NWStatus = true;
        // var networkState = navigator.connection.type;
        // ***********
        // var states = {};
        // states[Connection.UNKNOWN] = 'Unknown';
        // states[Connection.ETHERNET] = 'Ethernet';
        // states[Connection.WIFI] = 'WiFi';
        // states[Connection.CELL_2G] = 'Cell 2G';
        // states[Connection.CELL_3G] = 'Cell 3G';
        // states[Connection.CELL_4G] = 'Cell 4G';
        // states[Connection.CELL] = 'Cell generic';
        // states[Connection.NONE] = 'No network';
        // console.log(states);
        // if ((states[networkState] == 'No network') || (states[networkState] == 'Unknown' || networkState=="none")) {
      	 //  NWStatus = false;
        // }
        // *****
        // if(networkState=="none"||networkState=="unknown"||networkState=="Unknown"){
        //   NWStatus = false;
        // }
        return api.networkStatus;
       }
    }
});
//*************************** Function For Native  Alert Pop up******************************************************************
concrops.factory('showAlertService', function ($ionicPopup) {
    return {

        showAlert: function (Alertmessage) {
           var alertPopup = $ionicPopup.alert({
             title: 'Alert',
             template: Alertmessage
           });

           alertPopup.then(function(res) {
             // console.log('Thank you for not eating my delicious ice cream cone');
           });
        },
        showAlertCallback: function (Alertmessage,callback) {
            var alertPopup = $ionicPopup.alert({
             title: 'Alert',
             template: Alertmessage
           });
           alertPopup.then(function(res) {
            callback();             // console.log('Thank you for not eating my delicious ice cream cone');
           });
        }
    }
});

//*******************************Function For Email Validation*************************** ***************************************
concrops.factory('emailService', function () {
    return {
    	checkEmail: function (mail)
	      {
            if(/^((\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)\s*[,]{0,1}\s*)+$/.test(mail))

	         //  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
	      {
	        return (true)
	       }
	     return (false)
	    }
    }
});

//*******************************Function For Phone No Validation***************************
concrops.factory('cellService', function () {
    return {
    	checkPhoneNo: function (num){
    		if(num==undefined||num==null){
    			 return false
              }
        // var phoneno=/^\+?\d{8,15}$/;  
       // var phoneno =/^(\+?\d{10}(,\+?\d{10})*)?$/;
       var phoneno=/^(\+?\d{8,15}(,\+?\d{8,15})*)?$/;
		  if((num.match(phoneno)))  {
		        return true
		   }else{
		        return false
		      }
	    }
    }
});
