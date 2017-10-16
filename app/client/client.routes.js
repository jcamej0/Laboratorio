(function() {
  'use strict';

  angular
  .module('app.client')
  .config(function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('newClient', {
        url: '/client',
        parent: 'home',
        controller: 'NewClientController as newClientCtrl',
        templateUrl: '/template/client/newClient.template.ejs'
      })
      .state('modifyClient', {
        url: '/client/{id}/update',
        parent: 'home',
        resolve: {
          getClient: getClient
        },
        controller: 'ModifyClientController as modClientCtrl',
        templateUrl: '/template/client/modifyClient.template.ejs',
      })
      .state('getAllClients', {
        url: '/clients',
        resolve: {
          clientsData: clientsData
        },
        parent: 'home',
        controller: 'indexClientController as indxClientCtrl',
        templateUrl: '/template/client/indexClient.template.ejs',
      });

    function clientsData(ClientCrud, $mdToast, errorService){
      return ClientCrud.getAllClients()
      .then(function(data) {
        return data;
      }, function(error){
        $mdToast.showSimple(errorService.generatemsg(error.status));
      });
    }

    function getClient($stateParams, ClientCrud, $mdToast, errorService){
      return ClientCrud.getClient($stateParams.id)
        .then(function(data) {
          return {client: data};
        }, function(error){
          $mdToast.showSimple(errorService.generatemsg(error.status));
        });
    }
  });
})();
