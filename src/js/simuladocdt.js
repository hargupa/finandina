var app = angular.module("simuladorCDT", []);
app.controller('simuladorCdtController', ['$scope', function ($scope) {

    $scope.Math = window.Math;
    $scope.data = {

        //Datos basicos del simulador
        monto: 0,
        tasaEA: 1.22, //valor de la tasa efectiva anual
        plazo: 12,

    }



}]);
