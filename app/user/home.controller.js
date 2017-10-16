(function() {
  'use strict';

  angular.module('app.user')
  .controller('HomeController', HomeController);

  function HomeController($mdSidenav, $mdBottomSheet, $location, Oauth) {
    var vm = this;
    vm.openMenu = openMenu;
    vm.logout = logout;
    vm.openBottomSheet = openBottomSheet;
    vm.toggleLeft = buildToggler('left');
    vm.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    function openMenu($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    function logout() {
      Oauth.logout('Has cerrado  tu sesión');
    };

    function openBottomSheet() {
      $mdBottomSheet.show({
        templateUrl: '/template/user/settings.template.ejs',
        controller: 'SettingsController as settingsCtrl'
      });
    }
  }
})();
