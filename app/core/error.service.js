(function() {
  'use strict';

  angular.module('app.core').factory('errorService', errorService);
  function errorService (){
    var vm={
      generatemsg: generatemsg
    };
    function generatemsg (errorCode){
      var msg = 'Ha ocurrido un error inesperado';
      if (errorCode===400) {
        msg='Usuario Invalido';
      } else if (errorCode===500) {
        msg='Temporalmente fuera de servicio';
      } else if (errorCode===409) {
        msg='Ya se encuentra registrado';
      }
      return msg;
    };
    return vm;
  }
})();
