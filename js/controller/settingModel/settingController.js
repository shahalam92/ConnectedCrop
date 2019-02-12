
stationModule.controller('settingsController', function($scope,$location ,$ionicModal,$ionicLoading, $timeout,$state,api,flagService,assetsListService,assetsFactory,
		checkConnectionService,	showAlertService,configureStaionService,$ionicHistory,api) {

            //Function to Unsbscribe From
function organizationService(){
    window.FirebasePlugin.unsubscribe(' CC-Global-'+api.baseUrl.split('.').shift().split('//').pop())
    for(var i in flagService.orgList){
     window.FirebasePlugin.unsubscribe(flagService.orgList[i].organizationCode);
     //  window.FirebasePlugin.subscribe("hw-dev-1482355524129");
    }
}
$scope.gotoDashboard=function(){
            $state.transitionTo("dashboardview");
            flagService.flagList.goToStationCongigPg='';
}

$scope.gotoAlertview=function(){
            $state.transitionTo("alertview");
            flagService.flagList.goToStationCongigPg='';
}

$scope.gotoCompareview=function(){
            $state.transitionTo("compareview");
            flagService.flagList.goToStationCongigPg='';
}

$scope.gotoSettingview=function(){
            $state.transitionTo("settingview");
}
$scope.gotoAccounts=function(){
    $state.transitionTo("accounts");
}

$scope.gotoSelectStationPg=function(){
            $state.go("configStationListView");
}
$scope.gotoStepOne=function(){
	          $state.go("stepOne");
					// $state.transitionTo("waitingToConnect");
}
// $scope.gotoChangePassword=function(){
//             // $state.go("changePassword");
//             var changePaasUrl=api.baseUrl+'/ui/faces/user/changePassword.xhtml?username='+window.localStorage.getItem("loginUserLclstrg");
//             window.open(changePaasUrl, '_system', 'location=yes');

// }
$scope.gotoHelp=function(){
            $state.transitionTo("helpview");
}

$scope.gotoAbout=function(){
            $state.go("aboutView");
}

$scope.gotoContact=function(){
            $state.go("contactView");
}
//Logout Function
$scope.gotoLogout=function(){
            if (checkConnectionService.checkConnection() == false) {
                showAlertService.showAlert("Please check Internet connection");
                return false;
            }
            $ionicLoading.show({
                 template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            });
            assetsFactory.logoutUser().success(function(succes){
				organizationService();
                showAlertService.showAlert('You are Logged Out');
                api.authtoken  = '';
                window.localStorage.clear(); //Clear Localstorage
                cookieMaster.clear();//Clear Cokie on logout
				api.showPopUp=true;
                window.localStorage.setItem("authTokenLclstrg",null);
                window.localStorage.setItem("loginUserLclstrg",null);
                window.localStorage.setItem("loginPassLclstrg",null);
                window.localStorage.setItem("logOutLclstrg",'true');
                window.localStorage.setItem("baseUrlLclstrg",api.baseUrl);
                window.localStorage.setItem("sliderVisitedStatus",'true');
                window.localStorage.setItem("user_emails","");
                $state.transitionTo("loginview");
            })
            .error(function(error){
                if(error==null)
                showAlertService.showAlert(api.errorMsg)
                else
                showAlertService.showAlert(error.message);
            }).finally(function() {
                $ionicLoading.hide();
            });



}

}).controller('accountsController', function($ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {
var orgCount=flagService.orgList.length;
var customTemplate='templates/popup-template.html';
$scope.orgName={organizationName:flagService.orgList[0].organizationName}
var popup;
function organizationService(){
    assetsFactory.getOrganization()
        .success(function (response) {
            flagService.orgList=[]
            flagService.orgList=response.result;
            $scope.orgName.organizationName=flagService.orgList[0].organizationName;
            })
        .error(function (error) {         
        });
}
// ****************************************************
function setOrgName(org_code,org_name){
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
   });
    assetsFactory.setOrgName(org_code,org_name).success(function(succes){
                // showAlertService.showAlert('Changed');
                organizationService();
                })
                .error(function(error){
                showAlertService.showAlert(error.status);
                }).finally(function() {
                $ionicLoading.hide();
                $scope.close();
                });
}

// *******************************************

$scope.close = function() {
    popup.close();
}
$scope.save=function(name){
    $scope.orgName.organizationName=name;
    setOrgName(flagService.orgList[0].organizationCode,$scope.orgName)
}
// *********************************************
$scope.gotoDashboard=function(){
    $state.transitionTo("dashboardview");
    flagService.flagList.goToStationCongigPg='';
}
$scope.gotoAlertview=function(){
            $state.transitionTo("alertview");
            flagService.flagList.goToStationCongigPg='';
}

$scope.gotoCompareview=function(){
            $state.transitionTo("compareview");
            flagService.flagList.goToStationCongigPg='';
}

$scope.gotoSettingview=function(){
            $state.transitionTo("settingview");
}
$scope.gotoChangePassword=function(){
            var changePaasUrl=api.baseUrl+'/ui/faces/user/changePassword.xhtml?username='+window.localStorage.getItem("loginUserLclstrg");
            window.open(changePaasUrl, '_system', 'location=yes');

}
$scope.changeFarmName=function(){
            if(orgCount==1){
                popup=$ionicPopup.show({
                    templateUrl: customTemplate,
                    scope: $scope,
                    cssClass:'custom-popup'
                });
            }else{
                $state.transitionTo('orgList');
            }
}
}).controller('orgListController', function($ionicPopup,$scope ,$ionicModal,$ionicLoading,$state,api,flagService,assetsListService,assetsFactory,
    checkConnectionService,	showAlertService,configureStaionService) {

var customTemplate='templates/popup-template.html';
var popup;
$scope.orgSelected=[];
$scope.orgName={organizationName:''}
$scope.pullToRefresh=function(){
    if (checkConnectionService.checkConnection() == false) { //chek for inernet connection
            $scope.$broadcast('scroll.refreshComplete');
            showAlertService.showAlert("Please check Internet connection");	//native alert
    }else{
       organizationService(); 
    }

}
function organizationService(){
    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
    });
    assetsFactory.getOrganization()
        .success(function (response) {
            flagService.orgList=[]
                flagService.orgList=response.result;
                $scope.orgList=response.result;
            })
        .error(function (error) {         
            $scope.orgList=flagService.orgList;
        }).finally(function() {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
}  

organizationService();    
function setOrgName(org_code,org_name){

    assetsFactory.setOrgName(org_code,org_name).success(function(succes){
                // showAlertService.showAlert('Changed');
                organizationService();  
                })
                .error(function(error){
                showAlertService.showAlert(error.status);
                }).finally(function() {
                popup.close();
                $scope.orgName.organizationName='';
                $scope.orgSelected[$scope.orgIndex] = !$scope.orgSelected[$scope.orgIndex];
               
                });
}

// *******************************************
$scope.changeFarmName=function(org,index){
        $scope.organizationCode=org.organizationCode;
        $scope.orgName.organizationName=org.organizationName;
        $scope.orgIndex=index;
        $scope.orgSelected[$scope.orgIndex] = !$scope.orgSelected[$scope.orgIndex];
        popup=$ionicPopup.show({
            templateUrl: customTemplate,
            scope: $scope,
            cssClass:'custom-popup'
        });
}
$scope.close = function() {
    $scope.orgSelected[$scope.orgIndex] = !$scope.orgSelected[$scope.orgIndex];
    $scope.orgName.organizationName=''
    popup.close();
}
$scope.save=function(org){
    $scope.orgName.organizationName=org;
    setOrgName($scope.organizationCode,$scope.orgName)
}


$scope.gotoAccounts=function(){
    $state.transitionTo("accounts");
}
$scope.gotoDashboard=function(){
    $state.transitionTo("dashboardview");
    flagService.flagList.goToStationCongigPg='';
}
$scope.gotoAlertview=function(){
    $state.transitionTo("alertview");
    flagService.flagList.goToStationCongigPg='';
}

$scope.gotoCompareview=function(){
    $state.transitionTo("compareview");
    flagService.flagList.goToStationCongigPg='';
}

$scope.gotoSettingview=function(){
    $state.transitionTo("settingview");
}
});
