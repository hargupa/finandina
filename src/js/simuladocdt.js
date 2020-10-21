var app = angular.module("simuladorCDT", []);
app.controller('CdtController', ['$scope', function ($scope) {

    $scope.Math = window.Math;
    $scope.data = {

        //Datos basicos del simulador
        montoInversion: "",
        tasaEA: 4.7437, //valor de la tasa efectiva anual
        tasaEA_texto: '4.74% EA',
        plazoDias: "",

        //Retenciones
        fuente: 4,
        ica: 0,
        modalidad: "V",

        montoInteresNeto: 0,

    }

    $scope.calculos = function () {
        $scope.data.mensaje = "";

        if ($scope.data.montoInversion == "") {
            $scope.data.mensaje = "Debe ingresar el monto de la inversión";
            return;
        }
        if ($scope.data.plazoDias == "") {
            $scope.data.mensaje = "Debe ingresar el plazo en días";
            return;
        }
        if ($scope.data.montoInteresNeto < 1000000) {
            $scope.data.mensaje = "La inversion mínima es de $1.000.000";
            return;
        }


        var netoTotal = 0;
        netoTotal = $scope.cdtNormal();
        //netoTotal = $scope.cdtDesmaterializado();


        $scope.data.montoInteresNeto = Math.round(netoTotal);
        $scope.data.totalInversion = parseInt($scope.data.montoInversion) + parseInt($scope.data.montoInteresNeto);

        var fecha = new Date();
        $scope.data.fechaFinal = fecha.setDate(fecha.getDate() + parseInt($scope.data.plazoDias));
    }

    $scope.cdtNormal = function () {

        var tasaEA = ($scope.data.tasaEA / 100);//se divide en 100 para sacar el equivalente a porcentaje

        var intTotal = ($scope.data.montoInversion * tasaEA) / (360 / $scope.data.plazoDias);

        var reteFuente = intTotal * ($scope.data.fuente / 100);
        var reteIca = intTotal * ($scope.data.ica / 100);
        var reteTotal = (reteFuente + reteIca);

        var netoTotal = (intTotal - reteTotal);

        return netoTotal;


    }



    $scope.cdtDesmaterializado = function () {
        var tasaEA = ($scope.data.tasaEA / 100);//se divide en 100 para sacar el equivalente a porcentaje

        var periodoPago = Math.round(($scope.data.tasaEA / 360) * $scope.data.plazoDias).toFixed(6);

        var intTotal = Math.round(periodoPago * $scope.data.montoInversion);

        var reteFuente = Math.round(intTotal * ($scope.data.fuente / 100));
        var reteIca = Math.round(intTotal * ($scope.data.ica / 100));
        var reteTotal = (reteFuente + reteIca);

        var netoTotal = (intTotal - reteTotal);

        $scope.data.montoInteresNeto = netoTotal;
        return netoTotal;
    }
}]);

//SERCCION DE DIRECTIVAS
app.directive('mileskeypress', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            var validateNumber = function (inputValue) {
                if (inputValue === undefined) {
                    return '';
                }
                inputValue = inputValue.replace(/\,/g, "");
                var transformedInput = inputValue.replace(/[^0-9,]/g, '');
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                else {
                    if (transformedInput > 999) {
                        var transformedInputTemp = parseInt(transformedInput).toString().split("");
                        var count = 0;
                        var result = [];
                        var length = transformedInputTemp.length - 1;
                        for (var i = length; i >= 0; i--) {
                            var temp = transformedInputTemp[i].replace(/\,/g, "");
                            if (temp != "") {
                                if (length >= 3) {
                                    if (count == 2 && i != 0) {
                                        result[i] = "," + temp;
                                        count = 0;
                                    }
                                    else {
                                        result[i] = temp;
                                        count += 1;
                                    }
                                }
                                else {
                                    result[i] = temp;
                                }
                            }
                        }
                        transformedInput = result.join("");
                    }
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                    ctrl.$setValidity('onlyNumbers', true);
                }
                return transformedInput;
            };
            ctrl.$parsers.unshift(validateNumber);
            ctrl.$parsers.push(validateNumber);
            attr.$observe('onlyNumbers', function () {
                validateNumber(ctrl.$ViewValue)
            });
        }
    };
})