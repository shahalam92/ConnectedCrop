(function(){
    angular.module('stationModule').controller('StepTwoConnectionController',StepTwoConnectionController);
    StepTwoConnectionController.$inject=['$state','flagService','$rootScope','$ionicLoading','checkConnectionService','showAlertService']
    function StepTwoConnectionController($state,flagService,$rootScope,$ionicLoading,checkConnectionService,showAlertService) {
                    var vm=this;
                    var stations=[];
                    var stationDetail={};
                    vm.goBack=goBack;
                    vm.next=next;
                    function goBack(){
                      $state.transitionTo("step2_portB");
                     }
                     function next() {
                      $state.transitionTo("waitingToConnect");
                     }
                    
   
     }
})();
