(function(){
  'use strict';

  angular.module('app.core').directive('formValidation', formValidation);

  function formValidation(){

    return {
      scope: {
        errors: '=',
        invalidPattern: '@invalidpattern',
      },
      template:
        '<div ng-messages="errors">'+
        '<p ng-message=minlength>Este campo es muy corto.</p>'+
        '<p ng-message=maxlength>Este campo es muy largo.</p>'+
        '<p ng-message=required>Este campo es requerido.</p>'+
        '<p ng-message="email">Ingresa una dirección de correo valida</p>'+
        '<p ng-message="pattern">{{invalidPattern||"Campo invalido"}}</p>'+
        '</div>'
    };
  };
})();
