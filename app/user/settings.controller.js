(function() {
  'use strict';

  angular.module('app.user')
  .controller('SettingsController', SettingsController);

  function SettingsController(Settings, $rootScope) {
    var vm = this;
    vm.animations = !!$rootScope.animations;
    vm.onChangeAnimation = onChangeAnimation;

    function onChangeAnimation() {
      Settings.animation(vm.animations);
    };
  }
})();
