(function() {
  'use strict';

  angular
  .module('app.user')
  .config(function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/',
        resolve: {
          UserData: loginCheck
        },
        controller: 'LoginController as loginCtrl',
        templateUrl: '/template/user/login.template.ejs',
      })
      .state('home', {
        url: '/home',
        resolve: {
          UserData: isUserLogged
        },
        controller: 'HomeController as homeCtrl',
        templateUrl: '/template/user/home.template.ejs'
      })
      .state('editUser', {
        url: '/editUser',
        parent: 'home',
        controller: 'EditUserController as editUserCtrl',
        templateUrl: '/template/user/editUser.template.ejs'
      })
      .state('changePassword', {
        url: '/changePassword',
        parent: 'home',
        controller: 'ChangePasswordController as changePassCtrl',
        templateUrl: '/template/user/changePassword.template.ejs'
      })
      .state('invite', {
        url: '/invite',
        parent: 'home',
        controller: 'InviteController as inviteCtrl',
        templateUrl: '/template/user/invite.template.ejs'
      })
      .state('reset-password', {
        url: '/reset-password',
        controller: 'ResetPasswordController as resetPassCtrl',
        resolve: {
          token: isToken
        },
        templateUrl: '/template/user/resetPassword.template.ejs'
      });

    function isUserLogged($q, $state, Oauth) {
      return Oauth.getUserData()
        .catch(function goToLogin() {
          $state.go('login');
          return $q.reject();
        });
    }

    function isToken($location){
      var data = $location.search();
      return data;
    }

    function loginCheck($q, $state, Oauth) {
      return Oauth.getUserData()
        .then(function goToHome() {
          $state.go('home');
          return $q.reject();
        })
        .catch(function continueOnLogin() {
          return;
        });
    }
  });
})();
