(function() {
  'use strict';

  angular.module('app.client')
  .controller('indexClientController', indexClientController);

  function indexClientController(ClientCrud, $state, $mdToast, errorService, clientsData){
    var vm = this;
    vm.clients=clientsData;
    vm.deleteClient=deleteClient;

    function deleteClient(id){
      ClientCrud.deleteClient(id)
      .then(function() {
        $state.go('home');
        $mdToast.showSimple('Cliente eliminado');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();

