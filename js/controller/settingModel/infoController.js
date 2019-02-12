(function(){
    angular.module('stationModule').controller('InfoController',InfoController);
    InfoController.$inject=['$state','flagService','$rootScope']
    function InfoController($state,flagService,$rootScope) {
                    var vm=this;
                    vm.gotoConfigPage=gotoConfigPage;
                    vm.gotoDashboard=gotoDashboard;
                    vm.gotoAlertview=gotoAlertview;
                    vm.gotoCompareview=gotoCompareview;
                    vm.gotoSettingview=gotoSettingview;
                    function gotoDashboard(){
                             $state.transitionTo("dashboardview");
                             flagService.flagList.goToStationCongigPg='';
                       }

                    function gotoAlertview(){
                             $state.transitionTo("alertview");
                             flagService.flagList.goToStationCongigPg='';
                       }

                    function gotoCompareview(){
                             $state.transitionTo("compareview");
                             flagService.flagList.goToStationCongigPg='';
                        }
                    function gotoSettingview(){
                          $state.transitionTo("settingview");
                    }
                    function gotoConfigPage(){
                      $state.transitionTo('thresholdSM')
                    }

     }
})();
