(function() {
  'use strict';

  angular.module('app.client')
  .controller('ModifyClientController', ModifyClientController);

  function ModifyClientController(ClientCrud, $state, $mdToast, errorService, $stateParams, getClient){
    var vm = this;
    vm.data=getClient.client;
    vm.updateClient=updateClient;

    function updateClient(){
      ClientCrud.modifyClient(vm.data, vm.data._id)
      .then(function() {
        $state.go('home');
        $mdToast.showSimple('Cliente modificado');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();
