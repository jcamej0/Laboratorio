(function() {
  'use strict';

  angular.module('app.user')
  .controller('LoginController', LoginController);

  function LoginController(Oauth, UserCrud, $rootScope, $mdToast, errorService) {
    var vm = this;
    vm.login = login;
    vm.remindUser = remindUser;

    function login(){
      UserCrud.login({username: vm.user, password: vm.password})
        .then(function(tokenData) {
          Oauth.setToken(tokenData);
          $mdToast.showSimple('Bienvenido(a) de nuevo '+tokenData.attributes.firstName);
        }, function(error){
          $mdToast.showSimple(errorService.generatemsg(error.status));
        });
    }

    function remindUser(){
      $rootScope.remindUser = vm.remind;
    }
  }
})();
