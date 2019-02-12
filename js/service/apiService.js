
/*
**************************** Creation Log********************************************************************************************************
File Name               :apiService.js
Module Name             :Used in all services
Project Name            :Connected crops
Description             :apiServie.js  will have all service and required key for access service.
Version                 :1.0
Name of Developer       :Root Info Solutions
Creation Date           :14 Jun 2016
******************************************************************************************************************************************
*/

concrops.service("api",function(){
  // All service urls.
  this.verificationCode='NotPresent'
  // this.baseUrl               =     'http://sandbox.liveintersect.com:8080';
   this.baseUrl=                   'https://prod.connectedcrops.ca';
  this.showPopUp=true;
  this.networkStatus=true;
  // this.baseUrl            =      'http://intdoc.esprida.com:8580';
  this.username           =       '';
	this.authtoken          =     	'';
  this.getAllEvent        =       '/userapi/results?maxRecordCount=200&appCode=system.log.event';
	this.login 				      = 		  '/userapi/login';
  this.signup             =       '/userapi/accounts?apiKey=70ceb3e5-60cb-4f37-bee2-2fe611bb24fd';
  // +'{apiKey}';
	this.logout             =       '/userapi/logout' ;
	this.listAssets 	    	=		    '/userapi/assets';
  this.organization       =       '/userapi/organizations';
	this.forgotPass         =       '/userapi/forgotpassword?email='+'{email_id}';
	this.listAssetsInfo    	=		    '/userapi/assets/'+'{asset_id}';
	this.assetsMetricLCOM   =       '/userapi/assets/'+'{asset_id}'+'/'+'{metric_code}'
  this.assetsMetricApi    =       '/userapi/assetmetrics/time-series?assetId='+'{asset_id}'+'&metricCode=Status&metricCode=Reading&metricCode=errorMsg&detectionTimeStart='+'YYYY-MM-DDThh:mm:ssTZDStart'+'&detectionTimeEnd='+'YYYY-MM-DDThh:mm:ssTZDEnd';
  // this.assetsMetricApi    =       '/userapi/assets/'+'{asset_id}'+'/'+'Reading?detectionTimeStart='+'YYYY-MM-DDThh:mm:ssTZDStart'+'&detectionTimeEnd='+'YYYY-MM-DDThh:mm:ssTZDEnd';
	this.assetattributesApiGet  =   '/userapi/assetattributes/'+'{asset_id}';
	this.assetattributesApiPost =   '/userapi/assetattributes/'+'{asset_id}';
  this.checkMetricActivation  =   '/userapi/assetmetrics/'+'{asset_id}'+'/'+'{metric_code}';
  this.exportStationRecord    =   '/userapi/assignment/remotejobs';
  //*************************************
  this.apiKeyList={
    intdoc:'70ceb3e5-60cb-4f37-bee2-2fe611bb24fd',//docker
    sandbox:'70ceb3e5-60cb-4f37-bee2-2fe611bb24fd',//sandbox
    prod:'70ceb3e5-60cb-4f37-bee2-2fe611bb24fd'//production
   }
   this.errorMsg="Not able to connect, please check the connection or try again later."
   this.key={
        unit_classTemp:'Temperature',
        unit_classSoil:'Volumetric Water Content' ,      
        temp:"CC.SENSOR.TEMP",
        soil:"CC.SENSOR.SM",
        none:"CC.SENSOR.NONE",
        ICCID:"ICCID",
        InitFWversion:'InitFWversion',
        MFGdate:"MFGdate",
        HWversion:'HWversion',
        BLversion:'BLversion',
        FWversion:'FWversion',
        OSversion:'PhoneOSversion',
        NewFW:"NewFW",
        TransFreq:"TransFreq",
        email:"alert.email",
        emailOn:"alert.email.enable",
        sms:"alert.sms#",
        smsOn:"alert.sms.enable",
        highTemp:"high-temp-threshold",
        lowTemp:"low-temp-threshold",
        reset:"reset",
        resurrect:'resurrect',
        latitude:'station.latitude',
        location:'station.location',
        longitude:'station.longitude',
        tempDifference:"temp-difference-threshold",
        inversion:"inversion-threshold",
        sensorBottom:"sensor-at-the-bottom",
        sensorTop:"sensor-on-top",
        soilType:'soil-type',
        wilting:'wilting-point',
        fieldCapacity:'field-capacity',
        highSm:"high-sm-threshold",
        lowSm:"low-sm-threshold",
        unit:"metric",
        maxInversioninF:69.0,
        maxInversioninC:19.0,
        maxTempinF:157,
        maxTempinC:69,
        minTempinF:-65,
        minTempinC:-54,
        batLvl:"BatLvl",
        eventTypes:['Inversion','high_frequency','FW_update_success','FW_update_scheduled','FW_update_failure','Bad_connection','Low_battery','Low_temp','High_temp','reached_FC','reached_WP','close_to_WP','close_to_FC','dry_soil','wet_soil']
        
    }
    /******************************************************/
    console.log("Local Storage BaseUrl:"+window.localStorage.getItem("baseUrlLclstrg"));
   if(window.localStorage.getItem("baseUrlLclstrg")==null){
    //  this.baseUrl='http://intdoc.esprida.com:8580';
       // this.baseUrl='http://sandbox.liveintersect.com:8080';
       this.baseUrl='https://prod.connectedcrops.ca';
   }else{
     this.baseUrl=window.localStorage.getItem("baseUrlLclstrg");
   }
/****************************************************************************/

});