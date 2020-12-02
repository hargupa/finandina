var app = angular.module("simuladorCDT", []);
app.controller('CdtController', ['$scope', '$window', '$filter', function ($scope, $window, $filter) {
    // Set the configuration for your app
    var config = {
        apiKey: "AIzaSyC8vrdhMCthhxAw7CwEfN3OnVWPbHNFVpk",
        authDomain: "simuladores-75631.firebaseapp.com.firebaseapp.com",
        databaseURL: "https://simuladores-75631.firebaseio.com",
        storageBucket: "simuladores-75631.appspot.com.appspot.com"
    };
    firebase.initializeApp(config);

    $scope.Math = window.Math;
    $scope.data = {

        //Datos basicos del simulador
        montoInversion: "",
        tasaEA: '', //valor de la tasa efectiva anual
        tasaEA_texto: '',
        plazoDias: '',

        //Retenciones
        fuente: 4,
        ica: 0,
        modalidad: "V",


        montoInteresNeto: '',
        totalInversion: '',
        errormonto: '',
        errordias: '',
        mindias: 90,
        maxdias: 540,
        minMontoInversion: 1000000,

        lstTasas: [
            //tasas para monto de inversion entre 1 millon y 100 millones 
            { plazo: '90', plazoHasta: '179', tasa: '2.25', monto: 1000000, montoHasta: 100000000 },
            { plazo: '180', plazoHasta: '359', tasa: '2.40', monto: 1000000, montoHasta: 100000000 },
            { plazo: '360', plazoHasta: '539', tasa: '2.50', monto: 1000000, montoHasta: 100000000 },
            { plazo: '540', plazoHasta: '540', tasa: '2.70', monto: 1000000, montoHasta: 100000000 },
            //tasas para monto de inversion entre 100 millones y 500 millones 
            { plazo: '90', plazoHasta: '179', tasa: '2.35', monto: 100000000, montoHasta: 500000000 },
            { plazo: '180', plazoHasta: '359', tasa: '2.50', monto: 100000000, montoHasta: 500000000 },
            { plazo: '360', plazoHasta: '539', tasa: '2.60', monto: 100000000, montoHasta: 500000000 },
            { plazo: '540', plazoHasta: '540', tasa: '2.80', monto: 100000000, montoHasta: 500000000 }
        ],

        ShowModal: false,
        //Variables de Contactenos
        nombre: '',
        celular: '',
        email: '',
    }


    $scope.CalcularTasaEA = function (p, m) {

        var obj = $scope.data.lstTasas.find(x =>
            p >= x.plazo && p <= x.plazoHasta &&
            m >= x.monto && m <= x.montoHasta
        );

        if (obj != null) {
            $scope.data.tasaEA = obj.tasa;
            $scope.data.tasaEA_texto = obj.tasa + '% EA';
        }
        else {
            $scope.data.tasaEA = '';
            $scope.data.tasaEA_texto = '';
        }

    }

    $scope.calculos = function () {
        $scope.data.tasaEA = '';
        $scope.data.tasaEA_texto = '';

        $scope.data.errormonto = '';
        $scope.data.errordias = '';
        $scope.data.montoInteresNeto = '';
        $scope.data.totalInversion = '';

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
            $scope.data.errormonto = "El monto m\u00EDnimo para la inversi\u00F3n es de $" + $filter('currency')($scope.data.minMontoInversion, '$', 0);
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

        $scope.CalcularTasaEA($scope.data.plazoDias, _montoInversion);

        if ($scope.data.tasaEA == '') {
            $scope.data.errordias = 'La tasa esta vacia';
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
        var dia = fecha.getDate().toString().padStart(2, "0");

        var diaFormat360 = (fecha.getDate() + 2).toString().padStart(2, "0");

        $scope.data.fechaFinal = diaFormat360 + '/' + mes + '/' + anio;

    }

    $scope.TasaCalculaNominal = function (tasa, plazo) {
        var div = Math.round(360 / plazo);
        var result = div * (Math.pow((1 + tasa), (1 / div)) - 1);
        //result2 = Math.round(360 / plazo) * (Math.pow((1 + tasa), (1 / Math.round(360 / plazo))) - 1);

        if (isNaN(result))
            result = 0;

        return result.toFixed(6);
    }

    $scope.cdtNormal = function (_montoInversion) {

        var porcentaje = ($scope.data.tasaEA / 100); //se divide en 100 para sacar el equivalente a porcentaje
        var tasaEANominal = $scope.TasaCalculaNominal(porcentaje, $scope.data.plazoDias);

        var intTotal = (_montoInversion * tasaEANominal) / (360 / $scope.data.plazoDias);

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
        if ($scope.writeFirebase()) {
            $scope.data.ShowModal = true;
        }
    }

    $scope.writeFirebase = function () {

        var datos = localStorage.getItem('simulacion');
        var credito = JSON.parse(datos);

        var result = false;
        try {
            var cdt = {
                'DatosPersonales': {
                    'nombre': $scope.data.nombre,
                    'celular': $scope.data.celular,
                    'email': $scope.data.email,
                },
                'Simulacion': credito,
            };
            result = firebase.database().ref("cdt").push(cdt);
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem('simulacion');
        return result;
    }


    //***************************** REDIRECCION *****************************//
    $scope.contactenos = function () {

        if ($scope.data.montoInversion != '' && $scope.data.plazoDias != '') {
            _montoInversion = $scope.data.montoInversion.replace(/\,/g, '');
            var simulacion = {
                'montoInversion': _montoInversion,
                'tasaEA': $scope.data.tasaEA,
                'periodo': 'dias',
                'plazoDias': $scope.data.plazoDias,
                'retencionFuente': $scope.data.fuente,
                'retencionIca': $scope.data.ica,
                'montoInteresNeto': $scope.data.montoInteresNeto,
                'totalInversion': $scope.data.totalInversion,
                'fechaFinal': $scope.fechaFinal
            };
            localStorage.setItem('simulacion', JSON.stringify(simulacion));
        }

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

