(function() {
  'use strict';

  angular.module('app.user')
  .controller('ChangePasswordController', ChangePasswordController);

  function ChangePasswordController(UserCrud, $state, $mdToast, errorService){
    var vm = this;
    vm.confirmpassword;
    vm.newData={};
    vm.saveChanges=saveChanges;

    function saveChanges(){
      UserCrud.changePassword(vm.newData)
      .then(function() {
        $state.go('home');
        $mdToast.showSimple('Cambios realizados con exito');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();
