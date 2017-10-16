(function() {
  'use strict';

  angular.module('app.user')
  .factory('UserCrud', RestangularUserCrud);

  function RestangularUserCrud(Restangular) {
    var User = {
      login: login,
      getMe: getMe,
      updateMe: updateMe,
      getUser: getUser,
      invalidate: invalidate,
      verifyToken: verifyToken,
      updateSetting: updateSetting,
      changePassword: changePassword,
      invite: invite,
      setPassword: setPassword
    };

    function verifyToken(token) {
      return Restangular.one('verify').customPOST({
        token: token
      });
    }

    function invalidate(token) {
      return Restangular.one('invalidate').customPOST({
        token: token
      });
    }

    function updateSetting(id, settings) {
      return Restangular.one('users', id).customPOST(settings, 'settings');
    }

    function getMe() {
      return Restangular.one('users').customGET('me');
    }

    function updateMe(newData){
      return Restangular.one('users').customPUT(newData, 'me');
    }

    function changePassword(newData){
      return Restangular.one('users').customPUT(newData, 'password');
    }

    function login(data) {
      return Restangular.one('login').customPOST(data);
    }

    function getUser(id) {
      return Restangular.one('users', id);
    }

    function invite(data) {
      return Restangular.one('users').customPOST(data, 'invite');
    }

    function setPassword(data, token) {
      return Restangular.one('users')
      .customOperation('patch',
        'password',
        {},
        {'Authorization': 'Bearer ' + token},
        {'password': data}
      );
    }
    return User;
  }
})();
