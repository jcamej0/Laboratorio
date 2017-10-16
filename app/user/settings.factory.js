(function() {
  'use strict';

  angular.module('app.user')
  .factory('Settings', Settings);

  function Settings($rootScope, $animate, Restangular, Oauth, UserCrud) {
    var Settings = {
      animation: animation,
      setSettings: setSettings
    };

    var apiCalls = {
      updateSettings: updateSettings
    };

    return Settings;

    function updateSettings(settings) {
      Oauth.getUserData()
      .then(function userData(data) {
        UserCrud.updateSetting(data._id, settings);
      });
    }

    function setSettings() {
      Oauth.getUserData()
      .then(function userData(data) {
        var settings = data.settings;
        _setAnimation(settings.animations);
      });
    }

    function _setAnimation(value) {
      $animate.enabled(value);
      $rootScope.animations = value;
    }

    function animation(value) {
      _setAnimation(value);
      return apiCalls.updateSettings({
        animations: !!value
      });
    }
  }
})();
