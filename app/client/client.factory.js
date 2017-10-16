(function() {
  'use strict';

  angular.module('app.client')
  .factory('ClientCrud', RestangularClientCrud);

  function RestangularClientCrud(Restangular) {
    var Client = {
      newClient: newClient,
      modifyClient: modifyClient,
      getAllClients: getAllClients,
      getClient: getClient,
      deleteClient: deleteClient
    };

    function newClient(data) {
      return Restangular.one('clients').customPOST(data);
    }

    function modifyClient(data, id) {
      return Restangular.one('clients', id).customPUT(data);
    }

    function getAllClients(){
      return Restangular.one('clients').customGETLIST();
    }

    function getClient(id) {
      return Restangular.one('clients', id).customGET();
    }

    function deleteClient(id){
      return Restangular.one('clients', id).customDELETE();
    }

    return Client;
  }
})();
