(function() {
  'use strict';

  angular.module('app.user')
  .controller('EditUserController', EditUserController);

  function EditUserController(Oauth, UserCrud, $state, $mdToast, errorService){
    var vm = this;
    vm.saveChanges=saveChanges;

    Oauth.getUserData()
    .then(function userData(user) {
      vm.user = user;
    });

    function saveChanges(){
      UserCrud.updateMe(vm.user)
      .then(function() {
        $state.go('home');
        $mdToast.showSimple('Cambios realizados con exito');
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }
  }
})();
