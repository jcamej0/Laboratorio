(function() {
  'use strict';

  angular.module('app.user')
  .controller('InviteController', InviteController);

  function InviteController(UserCrud, $state, $mdToast, errorService){
    var vm = this;
    vm.newUser={};
    vm.enviar=enviar;

    function enviar(){
      UserCrud.invite(vm.newUser)
      .then(function() {
        $state.go('home');
        $mdToast.showSimple('La invitación ha sido enviada con exito');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();
