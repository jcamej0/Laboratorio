(function() {
  'use strict';

  angular.module('app.client')
  .controller('NewClientController', NewClientController);

  function NewClientController(ClientCrud, $state, $mdToast, errorService){
    var vm = this;
    vm.newClient={};
    vm.enviar=enviar;

    function enviar(){
      ClientCrud.newClient(vm.newClient)
      .then(function() {
        $state.go('home');
        $mdToast.showSimple('Cliente agregado');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();
