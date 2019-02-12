
/*
**************************** Creation Log********************************************************************************************************
File Name               :assetsFactory.js
Module Name             :Used to show list of all assets and detail
Project Name            :Connected cropes
Description             :Will return data of all assets
Version                 :1.0
Name of Developer       :Root Info Solutions
Creation Date           :14 Jun 2016
******************************************************************************************************************************************
*/



concrops.factory("assetsFactory",['$http','$location','api',function($http,$location,api){
  return {loginWithLink:loginWithLink,
					getLoginAuth:getLoginAuth,
					logoutUser:logoutUser,
					signUp:signUp,
					getAllEvent:getAllEvent,
					exportStationRecord:exportStationRecord,
					forgotPass:forgotPass,
					checkAssetMetricType:checkAssetMetricType,
					assetsList:assetsList,
					registerAsset:registerAsset,
					getOrganization:getOrganization,
					setOrgName:setOrgName,
					assetsDetailInfo:assetsDetailInfo,
					updateAssets:updateAssets,
					assetattributesGet:assetattributesGet,
					getAssetsMetricInfo:getAssetsMetricInfo,
					assetsMetricLCOM:assetsMetricLCOM,
					assetattributesPost:assetattributesPost,
					  checkMetric:checkMetric,
					  deleteAsset:deleteAsset,
					default_Attribute_Value:default_Attribute_Value
	       }
	        //*********************************Function For  Login ****************

        function loginWithLink(){
          var currenBaseurl=api.baseUrl;
          var serviceurl = api.login+'?v='+api.verificationCode;;
          var finalUrl=encodeURI(currenBaseurl+serviceurl);
          return $http({
                   headers: {
                   'Content-Type': 'application/json'},
                    method: 'GET',
                    dataType: 'jsonp',
                    url: finalUrl,
                    timeout:60000
                }).success(function (data) {
                      return data;
                }).error(function (error) {
                      return error;
                });
        }
		    function getLoginAuth(encodedUserAuth){
            //  cookieMaster.clear();
				     var currenBaseurl=api.baseUrl;
					   var serviceurl = api.login;
             var finalUrl=encodeURI(currenBaseurl+serviceurl);
             return $http({
					   					headers: {
                      'Authorization':'Basic ' + encodedUserAuth,
                      'Content-Type': 'application/json'},
	                    method: 'GET',
	                    dataType: 'jsonp',
	                    url: finalUrl,
	                    timeout:60000
	                 }).success(function (data) {
	                       return data;
	                 }).error(function (error) {
	       		    	       return error;
	                 });

			  }
			  //****************Logout Api Call*********************
			  function logoutUser(){
				     var currenBaseurl=api.baseUrl;
					   var serviceurl = api.logout;
             var finalUrl=encodeURI(currenBaseurl+serviceurl);
             return $http({
					   					headers: { 'Authorization':'Basic ' + api.authtoken,'Content-Type': 'application/json'},
	                    method: 'GET',
	                    dataType: 'jsonp',
	                    url: finalUrl,
	                    timeout:30000
	                 }).success(function (data) {
	                       return data;
	                 }).error(function (error) {
	       		    	   return error;
	                 });

			  }
			  //********SignUp Api Call************
			  function signUp(userDetails){
					     var currenBaseurl=api.baseUrl;
               			 var serviceurl=api.signup;
               // if(checkAssetMetricType(currenBaseurl,['intdoc'])){
               //    	  serviceurl=api.signup.replace('{apiKey}',api.apiKeyList.intdoc);
               // }else if(checkAssetMetricType(currenBaseurl,['sandbox'])){
               //    	  serviceurl=api.signup.replace('{apiKey}',api.apiKeyList.sandbox);
               // }else if (checkAssetMetricType(currenBaseurl,['prod'])) {
               //    	  serviceurl=api.signup.replace('{apiKey}',api.apiKeyList.prod);
               // }else{
               //   serviceurl=api.signup.replace('{apiKey}',undefined);
               // }
	             var finalUrl=encodeURI(currenBaseurl+serviceurl);
	             return $http({
					   headers: {'Content-Type': 'application/json'},
	                   method: 'POST',
	                   dataType: 'jsonp',
	                   url: finalUrl,
	                   data:userDetails,
	                   timeout:30000
	                 }).success(function (data) {
	                        return data;
	                 }).error(function (error) {
	       		    	   return error;
	                 });

			  }
			//*********************************Function Returns List of Events ***************
			   function getAllEvent(param) {
							 var authtokencode=api.authtoken;
							 var requireauthTokenFormat='Basic ' + api.authtoken;
							 var currenBaseurl=api.baseUrl;
							 var serviceurl = api.getAllEvent+param;
							 var finalUrl=encodeURI(currenBaseurl+serviceurl);
							 return $http({
						   				headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
		                   method: 'GET',
		                   dataType: 'jsonp',
		                   url: finalUrl,
		                   timeout:60000
		                 }).success(function (data) {
		                       return data;
		                 }).error(function (status) {
		       		    	  	return status;

		                 });


		      }
		    //*********************************Function to Reset Password ***************
			  function forgotPass(email){
								 var currenBaseurl=api.baseUrl;
								 var serviceurl = api.forgotPass.replace('{email_id}',email);
								 var finalUrl=encodeURI(currenBaseurl+serviceurl);
								 return $http({
					 		   				 headers: {'Content-Type': 'application/json'},
			                   method: 'GET',
			                   dataType: 'jsonp',
			                   url: finalUrl,
			                   timeout:60000
			                 }).success(function (data) {
			                       return data;
			                 }).error(function (status) {
			       		    	  	return status;

			                 });


		      }
		    //*********************************Function to Match AttributeCode ,metricCode ***************
			   function checkAssetMetricType(text, searchWords){
			    	   var currTest;
			    	   var status=false;
			    	   while (currTest = searchWords.pop()){
			    		  if(text.toLowerCase().search(currTest)>=0){
			    			  status=true;
			                  break;
			    		 }
			    	  }
			    	  return status;
		     }
         //*********************************Function Resister the New Station ***************
          function registerAsset(post_dto){
                   var authtokencode=api.authtoken;
                   var requireauthTokenFormat='Basic ' + api.authtoken;
                   var currenBaseurl=api.baseUrl;
                   var serviceurl = api.listAssets;
                   var finalUrl=encodeURI(currenBaseurl+serviceurl);
                   return $http({
                           headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
                           method: 'POST',
                           dataType: 'jsonp',
                           url: finalUrl,
                           data:JSON.stringify(post_dto),
                           timeout:60000
                         }).success(function (data) {
                               return data;
                         }).error(function (error) {
                               return error;

                         });

          }
          //*********************************Function Returns List of Station ***************
   			  function getOrganization(){
   								 var authtokencode=api.authtoken;
   								 var requireauthTokenFormat='Basic ' + api.authtoken;
   				         var currenBaseurl=api.baseUrl;
   								 var serviceurl = api.organization;
   								 var finalUrl=encodeURI(currenBaseurl+serviceurl);
   								 return $http({
   							   				 headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
   			                   method: 'GET',
   			                   dataType: 'jsonp',
   			                   url: finalUrl,
   			                   timeout:60000
   			                 }).success(function (data) {
   			                       return data;
   			                 }).error(function (error) {
   			       		    	  	return error;

   			                 });

				 }
			//**************************
				function setOrgName(orgCode,orgName){
							var authtokencode=api.authtoken;
							var requireauthTokenFormat='Basic ' + api.authtoken;
							var currenBaseurl=api.baseUrl;
							var serviceurl = api.organization+'/'+orgCode;
							var finalUrl=encodeURI(currenBaseurl+serviceurl);
							return $http({
								headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
							method: 'PUT',
							dataType: 'jsonp',
							url: finalUrl,
							data:JSON.stringify(orgName),
							timeout:60000
							}).success(function (data) {
							return data;
							}).error(function (error) {
							return error;

				});

				}  
		   //*********************************Function Returns List of Station ***************
			  function assetsList(){
								 var authtokencode=api.authtoken;
								 var requireauthTokenFormat='Basic ' + api.authtoken;
				         var currenBaseurl=api.baseUrl;
								 var serviceurl = api.listAssets;
								 var finalUrl=encodeURI(currenBaseurl+serviceurl);
								 return $http({
							   				 headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
			                   method: 'GET',
			                   dataType: 'jsonp',
			                   url: finalUrl,
			                   timeout:60000
			                 }).success(function (data) {
			                       return data;
			                 }).error(function (error) {
			       		    	  	return error;

			                 });

			  }
			//*********************************Function to get the Selected Assets Detail ***************
			  function assetsDetailInfo(assetsid){
							  var requireauthTokenFormat='Basic '+api.authtoken;
							  var currenBaseurl=api.baseUrl;
							  var serviceurl = api.listAssetsInfo.replace('{asset_id}',assetsid);
			                   var finalUrl=encodeURI(currenBaseurl+serviceurl);
							  return $http({
							        headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
						          method: 'GET',
						          dataType: 'jsonp',
						          url: finalUrl,
						          timeout:60000
						      }).success(function (data) {
						    	  return data;
						      }).error(function (error) {
						    	  return error;
						      });
			}
			//*********************************Function to delete Assets  ***************
			function deleteAsset(assetsid){
				var requireauthTokenFormat='Basic '+api.authtoken;
				var currenBaseurl=api.baseUrl;
				var serviceurl = api.listAssetsInfo.replace('{asset_id}',assetsid);
				var finalUrl=encodeURI(currenBaseurl+serviceurl);
				return $http({
					  headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
					method: 'DELETE',
					url: finalUrl,
					timeout:60000
				}).success(function (data) {
					return data;
				}).error(function (error) {
					return error;
				});
}
			//*********************************Function to Update the Station's Friendly name ***************
			  function updateAssets(assetsid,assetUpdateObject){
							  var requireauthTokenFormat='Basic '+api.authtoken;
							  var currenBaseurl=api.baseUrl;
							  var serviceurl = api.listAssetsInfo.replace('{asset_id}',assetsid);
			          var finalUrl=encodeURI(currenBaseurl+serviceurl);
							  return $http({
									  	  headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
								          method: 'PUT',
								          dataType: 'jsonp',
								          url: finalUrl,
								          data:JSON.stringify(assetUpdateObject),
								          timeout:60000
								      }).success(function (data) {
								    	  return data;
								      }).error(function (error) {
								    	  return error;
								      });
			  }
			//*********************************Functionto get the Perticular  Sensor Details ***************
			function assetsMetricLCOM(sensor,assets){
							  var requireauthTokenFormat='Basic '+api.authtoken;
		            var currenBaseurl=api.baseUrl;
							  var serviceurl = api.assetsMetricLCOM.replace('{asset_id}',assets.assetId);
							  serviceurl = serviceurl.replace('{metric_code}',sensor.metricCode);
							  var finalUrl=encodeURI(currenBaseurl+serviceurl);
							  return  $http({headers: {'Authorization':requireauthTokenFormat, 'Content-Type': 'application/json'},
							          method: 'GET',
							          dataType: 'jsonp',
							          url: finalUrl,
							          timeout:60000
							      }).success(function (data) {
							    	  return data;
							      }).error(function (error) {
							    	  return error;

							      });
				}
			//*********************************Function to get the maetric history value From Api ***************
			function getAssetsMetricInfo(sensor,assets,currentdayformat,maxdayformat){
							   	var requireauthTokenFormat='Basic '+api.authtoken;
					 			var currenBaseurl=api.baseUrl;
								// console.log(sensor);
								 var serviceurl = api.assetsMetricApi.replace('{asset_id}',sensor.assetId);
								//  serviceurl = serviceurl.replace('{metric_code}',sensor.assetType.assetTypeCode);
							  //  serviceurl = serviceurl.replace('MAX_RETURN_NUM',1000);
								 serviceurl = serviceurl.replace('YYYY-MM-DDThh:mm:ssTZDStart',maxdayformat);
								 serviceurl = serviceurl.replace('YYYY-MM-DDThh:mm:ssTZDEnd',currentdayformat);
								 var finalUrl=encodeURI(currenBaseurl+serviceurl);;
							     return  $http({headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
							          method: 'GET',
							          dataType: 'jsonp',
							          url: finalUrl,
							          timeout:60000

							      }).success(function (data) {
							    	  return data;
							      }).error(function (error) {
							    	  return error;
							      });
				}
				//*********************************Function  To get The Station Attribute ***************
				function assetattributesGet(assetsid,attributes){
		             var requireauthTokenFormat='Basic '+api.authtoken;
							   var currenBaseurl=api.baseUrl;
								 var serviceurl = api.assetattributesApiGet.replace('{asset_id}',assetsid);
								 var finalUrl=encodeURI(currenBaseurl+serviceurl);
								 return  $http({
									  headers: { 'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
							          method: 'GET',
							          dataType: 'jsonp',
							          url: finalUrl,
							          data: attributes,
							          timeout:60000
							      }).success(function (data) {
							    	  return data;
							      }).error(function (error) {
							    	  return error;
							      });
				}
	//*********************************Function to Update the Assets Attributes Values **********************************
				function assetattributesPost(assetsid,attributes) {
	  		 		     var requiredData=[];
	  		 		     requiredData = JSON.stringify(attributes);
					       var requireauthTokenFormat='Basic '+api.authtoken;
                 var currenBaseurl=api.baseUrl;
						     var serviceurl = api.assetattributesApiPost.replace('{asset_id}',assetsid);
                 var finalUrl=encodeURI(currenBaseurl+serviceurl);
						     return  $http({
										  	    headers: {'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
									          method: 'POST',
                            url: finalUrl,
									          data: requiredData,
									          timeout:60000
						      }).success(function (data) {
	                    return data;
						      }).error(function (error) {
						    	   return error;

						      });
				}
    //**********************************Function to check metric connection status for activate station feature*******************
    function checkMetric(assetId,metricCode){

             var requireauthTokenFormat='Basic '+api.authtoken;
             var currenBaseurl=api.baseUrl;
             var serviceurl = api.checkMetricActivation.replace('{asset_id}',assetId);
             serviceurl = serviceurl.replace('{metric_code}',metricCode);
             var finalUrl=encodeURI(currenBaseurl+serviceurl);
             return  $http({
                headers: { 'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
                    method: 'GET',
                    dataType: 'jsonp',
                    url: finalUrl,
                    timeout:60000
                }).success(function (data) {
                  return data;
                }).error(function (error) {

                  return error;
                });
    }
	// Send station record to user email api 
	function exportStationRecord(detail){
				var requireauthTokenFormat='Basic '+api.authtoken;
                var finalUrl=encodeURI(api.baseUrl+api.exportStationRecord);
                return  $http({
	                    headers: { 'Authorization':requireauthTokenFormat,'Content-Type': 'application/json'},
	                    method: 'POST',
	                    data:JSON.stringify(detail),
	                    url: finalUrl,
	                    timeout:60000
	                }).success(function (data) {
	                  return data;
	                }).error(function (error) {

	                  return error;
	                });
	} 
	//*********************************Function Returns List of SoilType and Its Default Attributes Values ****************
			 function default_Attribute_Value(){
				var values={
						"friendly_name" : {
									"T_friendly_name":"Temperature",
									"SM_friendly_name":"Soil Moisture (VWC%)",
									"T1_friendly_name":"Temperature (top)",
									"T2_friendly_name":"Temperature (bottom)",
									"SM1_friendly_name":"VWC% (top)",
									"SM2_friendly_name":"VWC% (bottom)",
									"high_temp_threshold":25,
									"low_temp_threshold":3
									},
							"soilType": [
							{
									 "soilType":"Clay",
									 "wiltingPoint":30,
									 "fieldcapacity":42,
									 "lowThreshold":33,
									 "highThreshold":39
							},
							{
							 "soilType":"Clay Loam" ,
									 "wiltingPoint":22,
									 "fieldcapacity":36,
									 "lowThreshold":25,
									 "highThreshold":33
							},
							{
							"soilType":"Loam" ,
									 "wiltingPoint":14,
									 "fieldcapacity":28,
									 "lowThreshold":17,
									 "highThreshold":25
							},
							{
							"soilType":"Loamy Sand",
									 "wiltingPoint":5,
									 "fieldcapacity":12,
									 "lowThreshold":7,
									 "highThreshold":10
							},
							{
							"soilType":"Sand",
									 "wiltingPoint":5,
									 "fieldcapacity":10,
									 "lowThreshold":7,
									 "highThreshold":8.5
							},

							{
							 "soilType":"Sandy Clay",
									 "wiltingPoint":25,
									 "fieldcapacity":36,
									 "lowThreshold":28,
									 "highThreshold":33
							},
							{
							 "soilType":"Sandy Clay Loam" ,
									 "wiltingPoint":17,
									 "fieldcapacity":27,
									 "lowThreshold":20,
									 "highThreshold":25
							},
							{
							 "soilType":"Sandy Loam" ,
									 "wiltingPoint":8,
									 "fieldcapacity":18,
									 "lowThreshold":11.5,
									 "highThreshold":15.5
							},
							{
							 "soilType":"Silt",
									 "wiltingPoint":6,
									 "fieldcapacity":30,
									 "lowThreshold":9,
									 "highThreshold":27
							},
							{
								"soilType":"Silty Clay",
									 "wiltingPoint":27,
									 "fieldcapacity":41,
									 "lowThreshold":30,
									 "highThreshold":38
							},
							{
							 "soilType":"Silty Clay Loam",
									 "wiltingPoint":22	,
									 "fieldcapacity":38,
									 "lowThreshold":25,
									 "highThreshold":35
							},
							{
							 "soilType":"Silt Loam",
									 "wiltingPoint":11,
									 "fieldcapacity":31,
									 "lowThreshold":14,
									 "highThreshold":28
							}]
							}

						return values;

						}

}]);
