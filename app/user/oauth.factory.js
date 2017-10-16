(function() {
  'use strict';

  angular.module('app.user')
  .factory('Oauth', Oauth);

  function Oauth($rootScope, $q, _, Restangular, UserCrud, $state, $mdToast) {
    var _token = {};
    var _loggedUser;
    var _tokenData = [
      'issued_at',
      'access_token',
      'scope',
      'expires_in',
      'refresh_token'
    ];
    var Oauth = {
      logout: logout,
      setToken: setToken,
      isLogged: isLogged,
      getUserData: getUserData,
      setLoggedUser: setLoggedUser,
      getLoggedUser: getLoggedUser
    };

    Restangular.configuration.requestInterceptors.push(RequestInterceptor);
    Restangular.configuration.errorInterceptors.push(ErrorInterceptorLogout);

    return Oauth;

    function logout(msg) {
      _token = _getTokenData();
      if (!_token.access_token) {
        return $q.reject('User not logged in.');
      }
      return UserCrud.invalidate(_token.access_token)
        .then(function() {
          _removeToken();
          $mdToast.showSimple(msg);
          $state.go('login');
        });
    }

    function _removeToken() {
      _getContainer().clear();
      _loggedUser = $q.reject('User not logged');
    }

    function isLogged() {
      _token = _getTokenData();

      if (!_token.access_token) {
        return $q.reject('User not logged in.');
      }
      return UserCrud.verifyToken(_token.access_token);
    }

    function getUserData() {
      return _loggedUser;
    }

    function getLoggedUser() {
      _loggedUser = isLogged()
      .then(function tokenData() {
        return UserCrud.getMe();
      });
      return _loggedUser;
    }

    function setLoggedUser(user) {
      _loggedUser = $q.resolve(user);
    }

    function setToken(token) {
      _token = _.pick(token, _tokenData);
      _.assign(_getContainer(), _token);
      _loggedUser = $q.resolve(token.attributes);
      $state.go('home');
    }

    function _getTokenData() {
      return _.pick(_getContainer(), _tokenData);
    }

    function _getContainer() {
      return $rootScope.remindUser ? localStorage: sessionStorage;
    }

    function RequestInterceptor() {
      if (!!_token.access_token) {

        return {
          headers: {
            'Authorization': 'Bearer ' + _token.access_token
          }
        };
      }
    };

    function ErrorInterceptorLogout(response) {
      if (response.status === 401) {
        logout('Inicia sesión para continuar');
        return false;
      }
    }
  }
})();
