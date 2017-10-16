(function() {
  'use strict';

  angular
  .module('app.core').config(function($locationProvider, RestangularProvider, BASE_PATH) {

    RestangularProvider.setBaseUrl(BASE_PATH);

    RestangularProvider.setDefaultHeaders({
      'Content-Type': 'application/json'
    });

    $locationProvider.html5Mode(true);
  });
})();
