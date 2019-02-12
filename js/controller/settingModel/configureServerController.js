
stationModule.controller('configureServerController', function($scope,$location ,$ionicModal, $timeout,$state,api,showAlertService,assetsFactory) {
		var isfound=false;
		if(api.baseUrl == null || api.baseUrl == "" || api.baseUrl == undefined){
		 $scope.baseurl = '';
	    }else{
		 $scope.baseurl=api.baseUrl;
	    }
		
		$scope.settingsList = [
            {text: "http://intdoc.esprida.com:8580", checked: false},
            {text: "http://sandbox.liveintersect.com:8080", checked: false},
            {text: "https://prod.connectedcrops.ca", checked: false},
            {text: "Others", custom_url:'', checked: false}
        ];
        angular.forEach($scope.settingsList, function(value, key){
        	if(value.text==$scope.baseurl){
        		value.checked=true;
        		isfound=true;
        	}else{
        		value.checked=false;
        	}       	
        	if(value.text=='Others'&&!isfound){
        		value.checked=true;
        		value.custom_url=$scope.baseurl;
        	}
        	
        	
        });
        $scope.toggleChange = function(item) {
				if(item.checked == true) {
				        for(var index = 0; index < $scope.settingsList.length; ++index)
				        $scope.settingsList[index].checked = false;
				        item.checked = true;
				        $scope.baseurl=item.text;
				    }else {
				        item.checked = false
				    }
		}
	    $scope.multiSearch= function(text, searchWordsArray){
	            return assetsFactory.checkAssetMetricType(text, searchWordsArray);
	    }
	    $scope.go = function (path) {
	      $location.path(path);
	    }

	    $scope.gotoLoginView=function(){
			 $state.transitionTo("loginview");
		}
		$scope.custom_urll=function(url){

			 $scope.settingsList[3].custom_url=url;
		}

	// Function toSet Base Url
	  $scope.setBaseUrl=function(bsurl){
	  		
		  	console.log($scope.settingsList[3].custom_url);
		  	if(bsurl=='Others'){
		  	  $scope.bsurl= $scope.settingsList[3].custom_url;
		  	}else{
		  	  $scope.bsurl=bsurl;
		  	}
		 
		  console.log($scope.bsurl);
		  if($scope.bsurl == "" || $scope.bsurl == undefined || $scope.bsurl == null){
				  showAlertService.showAlert("Please enter the Valid URL");
			  // window.localStorage.setItem("baseUrlLclstrg",'');
			  // window.localStorage.setItem("authTokenLclstrg",null);
			  // api.authtoken  = '';
			  // api.baseUrl='';
			  // $scope.baseurl='';
			  return false;
		  }else{
			    var finalBaseurl=$scope.bsurl.replace(/ /g,'');
        		window.localStorage.setItem("authTokenLclstrg",null);
        		window.localStorage.setItem("loginUserLclstrg",null);
        		window.localStorage.setItem("loginPassLclstrg",null);
				api.authtoken  = '';
				api.baseUrl= finalBaseurl;
				window.localStorage.setItem("baseUrlLclstrg",api.baseUrl);
				$state.transitionTo("loginview");
                // console.log(api.baseUrl);
                // console.log(api.signup);
		  }



	  }

});
