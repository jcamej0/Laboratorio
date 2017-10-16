//=require ../core/app.module.js

(function() {
  'use strict';

  angular.module('app.user', ['app.core'])
  .run(initUser);

  function initUser(Oauth, Settings) {
    Oauth.getLoggedUser();
    Settings.setSettings();
  }
})();

//=require ./user.routes.js
//=require ./user.factory.js
//=require ./oauth.factory.js
//=require ./login.controller.js
//=require ./settings.controller.js
//=require ./settings.factory.js
//=require ./home.controller.js
//=require ./editUser.controller.js
//=require ./changePassword.controller.js
//=require ./invite.controller.js
//=require ./resetPassword.controller.js
