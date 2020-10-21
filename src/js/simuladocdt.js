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
        totalInversion: 0,
        errormonto: '',
        errordias: '',
        mindias: 90,
        maxdias: 540,
        minMontoInversion: 1000000,
    }

    $scope.calculos = function () {
        $scope.data.errormonto = '';
        $scope.data.errordias = '';

        if ($scope.data.montoInversion == "") {
            $scope.data.errormonto = "Debe ingresar el monto de la inversi\u00F3n";
            return false;
        }
        if ($scope.data.plazoDias == "") {
            $scope.data.errordias = "Debe ingresar el plazo en d\u00EDas";
            return false;
        }

        _montoInversion = $scope.data.montoInversion.replace(/\,/g, '');
        if (_montoInversion < $scope.data.minMontoInversion) {
            $scope.data.errormonto = "El monto m\u00EDnimo para la inversi\u00F3n es de $" + $scope.data.minMontoInversion;
            return false;
        }
        if ($scope.data.plazoDias < $scope.data.mindias) {
            $scope.data.errordias = "El m\u00EDnimo de d\u00EDas es " + $scope.data.mindias + 'dias.';
            return false;
        }
        if ($scope.data.plazoDias > $scope.data.maxdias) {
            $scope.data.errordias = "El maximo de d\u00EDas es " + $scope.data.maxdias + 'dias.';
            return false;
        }

        var netoTotal = 0;
        netoTotal = $scope.cdtNormal(_montoInversion);
        //netoTotal = $scope.cdtDesmaterializado();

        $scope.data.montoInteresNeto = Math.round(netoTotal);
        $scope.data.totalInversion = parseInt(_montoInversion) + parseInt($scope.data.montoInteresNeto);

        var fecha = new Date();
        fecha.setDate(fecha.getDate() + parseInt($scope.data.plazoDias));
        $scope.data.fechaFinal = fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear();

    }

    $scope.cdtNormal = function (_montoInversion) {

        var tasaEA = ($scope.data.tasaEA / 100);//se divide en 100 para sacar el equivalente a porcentaje

        var intTotal = (_montoInversion * tasaEA) / (360 / $scope.data.plazoDias);

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