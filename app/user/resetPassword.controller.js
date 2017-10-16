(function() {
  'use strict';

  angular.module('app.user')
  .controller('ResetPasswordController', ResetPasswordController);

  function ResetPasswordController(UserCrud, $state, $mdToast, token, errorService) {
    var vm = this;
    vm.password;
    vm.enviar=enviar;
    vm.token=token.token;

    function enviar(){
      UserCrud.setPassword(vm.password, vm.token)
      .then(function() {
        $state.go('login');
        $mdToast.showSimple('Password guardado, inicia sesión para continuar');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();
