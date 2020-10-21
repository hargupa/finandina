var app = angular.module("simuladorCDT", []);
app.controller('CdtController', ['$scope', '$window', function ($scope, $window) {

    $scope.Math = window.Math;
    $scope.data = {

        //Datos basicos del simulador
        montoInversion: "",
        tasaEA: 4.7437, //valor de la tasa efectiva anual
        tasaEA_texto: '4.74% EA',
        plazoDias: '',

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

        ShowModal: false,
        //Variables de Contactenos
        nombre: '',
        celular: '',
        email: '',
    }

    $scope.calculos = function () {
        $scope.data.errormonto = '';
        $scope.data.errordias = '';
        $scope.data.montoInteresNeto = 0
        $scope.data.totalInversion = 0

        if ($scope.data.montoInversion == "") {
            $scope.data.errormonto = "Debe ingresar el monto de la inversi\u00F3n";
            return false;
        }
        if ($scope.data.plazoDias == "" || $scope.data.plazoDias == null) {
            $scope.data.errordias = "Debe ingresar el plazo en d\u00EDas";
            return false;
        }

        _montoInversion = $scope.data.montoInversion.replace(/\,/g, '');
        if (_montoInversion < $scope.data.minMontoInversion) {
            $scope.data.errormonto = "El monto m\u00EDnimo para la inversi\u00F3n es de $" + $scope.data.minMontoInversion;
            return false;
        }
        if ($scope.data.plazoDias < $scope.data.mindias) {
            $scope.data.errordias = "El m\u00EDnimo de d\u00EDas es " + $scope.data.mindias + ' d\u00EDas.';
            return false;
        }
        if ($scope.data.plazoDias > $scope.data.maxdias) {
            $scope.data.errordias = "El m\u00E1ximo de d\u00EDas es " + $scope.data.maxdias + ' d\u00EDas.';
            return false;
        }

        var netoTotal = 0;
        netoTotal = $scope.cdtNormal(_montoInversion);
        //netoTotal = $scope.cdtDesmaterializado();

        $scope.data.montoInteresNeto = Math.round(netoTotal);
        $scope.data.totalInversion = parseInt(_montoInversion) + parseInt($scope.data.montoInteresNeto);

        var fecha = new Date();
        fecha.setDate(fecha.getDate() + parseInt($scope.data.plazoDias));

        var anio = fecha.getFullYear();
        var mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
        var dia = fecha.getDate().toString().padStart(2, "0")

        $scope.data.fechaFinal = dia + '/' + mes + '/' + anio;


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

    $scope.guardarInfo = function () {
        $scope.data.errornombre = '';
        $scope.data.errorcel = '';
        $scope.data.erroremail = '';

        if ($scope.data.nombre == '') {
            $scope.data.errornombre = 'Debe ingresar su nombre y apellido';
            return false;
        }
        if ($scope.data.celular == '') {
            $scope.data.errorcel = 'Debe ingresar su numero de celular';
            return false;
        }
        if ($scope.data.email == '') {
            $scope.data.erroremail = 'Debe ingresar su correo electronico';
            return false;
        }

        //TODO guardar info en firebase
        if (true) {
            console.log("guardar Data");
            $scope.data.ShowModal = true;
        }
    }

    $scope.contactenos = function () {
        $window.location.href = 'formContacto.html';
    }
    $scope.showindex = function () {
        $window.location.href = 'index.html';
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
}).directive('letterkeypress', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            var validateletter = function (inputValue) {
                if (inputValue === undefined) {
                    return '';
                }
                var transformedInput = inputValue.replace(/[^A-Za-z ]/g, '');
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                else {
                    ctrl.$setValidity('onlyLetters', true);
                }
                return transformedInput;
            }

            ctrl.$parsers.unshift(validateletter);
            ctrl.$parsers.push(validateletter);
            attr.$observe('onlyLetters', function () {
                validateletter(ctrl.$ViewValue)
            });
        }
    };
}).directive('numberkeypress', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            var validateNumber = function (inputValue) {
                if (inputValue === undefined) {
                    return '';
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                else {
                    ctrl.$setValidity('onlyNumbers', true);
                }
                return transformedInput;
            }

            ctrl.$parsers.unshift(validateNumber);
            ctrl.$parsers.push(validateNumber);
            attr.$observe('onlyLetters', function () {
                validateNumber(ctrl.$ViewValue)
            });
        }
    };
});

