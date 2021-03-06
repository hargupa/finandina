var app = angular.module("Libranza", []);
app.controller('LibranzaController', ['$scope', '$window', '$filter', function ($scope, $window, $filter) {

    // Set the configuration for your app
    var config = {
        apiKey: "AIzaSyC8vrdhMCthhxAw7CwEfN3OnVWPbHNFVpk",
        authDomain: "simuladores-75631.firebaseapp.com.firebaseapp.com",
        databaseURL: "https://simuladores-75631.firebaseio.com",
        storageBucket: "simuladores-75631.appspot.com.appspot.com"
    };
    firebase.initializeApp(config);

    $scope.data = {
        tasa: 1.20,
        SMMLV: 877803,
        minMontoPerimitido: 3000000,
        minCuotaPerimitido: 3000000,
        maxMontoPerimitido: 120000000,
        maxCuotaPerimitido: 120000000,

        capacidadDescuentoMonto: 17800 * 3,
        capacidadDescuentoCuota: 180000,

        //VARIABLES PARA CALCULO Simulador LIBRANZA
        descuentoNomina: '',
        ingresos: '',
        selectActividad: '0',
        selectConvenio: '0',
        montoAprox: '',
        cuotaAprox: '',
        AproxCalculada: '',
        descuentoSalud: '',
        maxCuota: '',
        plazo: '',
        porcentajeDescuentos: '',


        //Variables para mensajes de error
        errorDescNomina: '',
        errorIngresos: '',
        errorActividad: '',
        errorMonto: '',
        errorCuota: '',
        errorplazo: '',
        errorexcede: '',

        Cuota120: '',
        Cuota108: '',
        Cuota96: '',
        Cuota84: '',
        Cuota72: '',
        Cuota60: '',

        Monto120: '',
        Monto108: '',
        Monto96: '',
        Monto84: '',
        Monto72: '',
        Monto60: '',

        Show120Meses: false,
        Show108Meses: false,
        Show96Meses: false,
        Show84Meses: false,
        Show72Meses: false,
        Show60Meses: false,

        ShowTextoPorcentaje: false,
        ShowImgDefault: true,
        ShowImgSectorPublico: false,
        ShowImgDocente: false,
        ShowImgFuerzas: false,
        ShowImgPensionado: false,
        ShowCuota: false,
        ShowMonto: true,
        ShowForm: true,
        ShowAviso: false,

        ShowModal: false,
        //Variables de Contactenos
        nombre: '',
        celular: '',
        email: '',
    }

    $scope.Cambiar = function () {
        if ($scope.data.ShowCuota == true) {
            $scope.data.ShowCuota = false;
            $scope.data.ShowMonto = true;
        } else {
            $scope.data.ShowCuota = true;
            $scope.data.ShowMonto = false;
        }

        $scope.data.montoAprox = '';
        $scope.data.cuotaAprox = '';
        $scope.data.AproxCalculada = '';
        $scope.data.errorDescNomina = '';
        $scope.data.errorIngresos = '';
        $scope.data.errorActividad = '';
        $scope.data.errorMonto = '';
        $scope.data.errorCuota = '';
        $scope.data.errorplazo = '';
        $scope.data.errorexcede = '';
    };

    $scope.limpiarPlazo = function () {
        $scope.data.plazo = '';

        $scope.data.Show120Meses = false;
        $scope.data.Show108Meses = false;
        $scope.data.Show96Meses = false;
        $scope.data.Show84Meses = false;
        $scope.data.Show72Meses = false;
        $scope.data.Show60Meses = false;

        $scope.data.Monto120 = '';
        $scope.data.Monto108 = '';
        $scope.data.Monto96 = '';
        $scope.data.Monto84 = '';
        $scope.data.Monto72 = '';
        $scope.data.Monto60 = '';

        $scope.data.Cuota120 = '';
        $scope.data.Cuota108 = '';
        $scope.data.Cuota96 = '';
        $scope.data.Cuota84 = '';
        $scope.data.Cuota72 = '';
        $scope.data.Cuota60 = '';
    }

    $scope.CambiarActividad = function () {
        $scope.data.ShowImgDefault = false;
        $scope.data.ShowImgSectorPublico = false;
        $scope.data.ShowImgDocente = false;
        $scope.data.ShowImgFuerzas = false;
        $scope.data.ShowImgPensionado = false;
        $scope.limpiarPlazo();

        switch ($scope.data.selectActividad) {
            case "0":
                $scope.data.ShowImgDefault = true;
                break;
            case "1":
                $scope.data.ShowImgSectorPublico = true;
                break;
            case "2":
                $scope.data.ShowImgDocente = true;
                break;
            case "3":
                $scope.data.ShowImgFuerzas = true;
                break;
            case "4"://pensionado
                $scope.data.ShowImgPensionado = true;
                break;
        }
        $scope.calcularDatos();
    };

    $scope.MostrarCuota = function (id) {
        $scope.data.plazo = '';

        $scope.data.Show120Meses = false;
        $scope.data.Show108Meses = false;
        $scope.data.Show96Meses = false;
        $scope.data.Show84Meses = false;
        $scope.data.Show72Meses = false;
        $scope.data.Show60Meses = false;

        switch (id) {
            case 1:
                $scope.data.plazo = 120;
                $scope.data.Show120Meses = true;
                $scope.data.AproxCalculada = $scope.data.ShowMonto ? $scope.data.Monto120 : $scope.data.Cuota120;
                break;
            case 2:
                $scope.data.plazo = 108;
                $scope.data.Show108Meses = true;
                $scope.data.AproxCalculada = $scope.data.ShowMonto ? $scope.data.Monto100 : $scope.data.Cuota108;
                break;
            case 3:
                $scope.data.plazo = 96;
                $scope.data.Show96Meses = true;
                $scope.data.AproxCalculada = $scope.data.ShowMonto ? $scope.data.Monto96 : $scope.data.Cuota96;
                break;
            case 4:
                $scope.data.plazo = 84;
                $scope.data.Show84Meses = true;
                $scope.data.AproxCalculada = $scope.data.ShowMonto ? $scope.data.Monto84 : $scope.data.Cuota84;
                break;
            case 5:
                $scope.data.plazo = 72;
                $scope.data.Show72Meses = true;
                $scope.data.AproxCalculada = $scope.data.ShowMonto ? $scope.data.Monto72 : $scope.data.Cuota72;
                break;
            case 6:
                $scope.data.plazo = 60;
                $scope.data.Show60Meses = true;
                $scope.data.AproxCalculada = $scope.data.ShowMonto ? $scope.data.Monto60 : $scope.data.Cuota60;
                break;
            default:
                $scope.data.AproxCalculada = '';
                $scope.data.plazo = '';
                break;
        }
        //$scope.calcularDatos();
    };


    $scope.mostrarTerminos = function () {
        $scope.data.ShowForm = false;
        $scope.data.ShowTerminos = true;
    }

    $scope.ocultarTerminos = function () {
        $scope.data.ShowForm = true;
        $scope.data.ShowTerminos = false;
    }


    /**************CALCULO LIBRANZA *****************/

    $scope.validaciones = function () {
        $scope.data.errorActividad = '';
        $scope.data.errorIngresos = '';
        $scope.data.errorDescNomina = '';
        $scope.data.errorMonto = '';
        $scope.data.errorCuota = '';
        $scope.data.errorplazo = '';
        $scope.data.errorexcede = '';
        $scope.data.AproxCalculada = '';

        $scope.limpiarPlazo();

        if ($scope.data.selectActividad == '0') {
            $scope.data.errorActividad = "Indica tu actividad";
            return false;
        }
        if ($scope.data.ingresos == "") {
            $scope.data.errorIngresos = "Indica tus ingresos mensuales";
            return false;
        }
        if (!$scope.data.ShowImgPensionado) {
            _ingresos = $scope.data.ingresos.replace(/\,/g, '');
            if (_ingresos < $scope.data.SMMLV) {
                $scope.data.errorIngresos = "Ingreso m\u00EDnimo 1 SMMLV";
                return false;
            }
        }

        if ($scope.data.descuentoNomina == "") {
            if ($scope.data.ShowImgPensionado)
                $scope.data.errorDescNomina = 'Indica tus descuentos';
            else
                $scope.data.errorDescNomina = 'Indica tus descuentos por n\u00F3mina';

            return false;
        }
        if ($scope.data.ShowMonto) {
            if ($scope.data.montoAprox == '') {
                $scope.data.errorMonto = 'Indica la cantidad de dinero que necesita';
                return false;
            }
            _montoAprox = $scope.data.montoAprox.replace(/\,/g, '');
            if (_montoAprox < $scope.data.minMontoPerimitido) {
                $scope.data.errorMonto = "El monto m\u00EDnimo que te prestamos es de " + $filter('currency')($scope.data.minMontoPerimitido, '$', 0);
                return false;
            }
            if (_montoAprox > $scope.data.maxMontoPerimitido) {
                $scope.data.errorMonto = "El monto que intentas solicitar es superior a tu capacidad de endeudamiento, el valor m\u00E1ximo que te podemos prestar es " + $filter('currency')($scope.data.maxMontoPerimitido, '$', 0);
                return false;
            }
        }
        if ($scope.data.ShowCuota) {
            if ($scope.data.cuotaAprox == '') {
                $scope.data.errorCuota = 'Indica la cuota que quieres pagar';
                return false;
            }
        }

        //if ($scope.data.plazo == '') {
        //    $scope.data.errorplazo = 'Indica el plazo en el que quieres pagar';
        //    return false;
        //}

        return true;
    }

    $scope.calcularDatos = function () {
        if (!$scope.validaciones())
            return false;

        if ($scope.data.porcentajeDescuentos == "") {
            if ($scope.data.ShowImgPensionado)
                $scope.data.porcentajeDescuentos = (12 / 100);
            else
                $scope.data.porcentajeDescuentos = (8 / 100);
        }

        _ingresos = $scope.data.ingresos.replace(/\,/g, '');
        _descuentoNomina = $scope.data.descuentoNomina.replace(/\,/g, '');

        //Campos Calculos
        $scope.data.descuentoSalud = _ingresos * $scope.data.porcentajeDescuentos;
        $scope.data.maxCuota = ((_ingresos - $scope.data.descuentoSalud) / 2) - _descuentoNomina;

        if ($scope.data.ShowMonto) {
            if ($scope.data.maxCuota < $scope.data.capacidadDescuentoMonto) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                return;
            }

            _montoAprox = $scope.data.montoAprox.replace(/\,/g, '');
            //Segun funcion excel:  Pago 
            $scope.data.Monto120 = $scope.calculoCuotaAprox($scope.data.tasa, 120, _montoAprox);
            if ($scope.data.Monto120 > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                $scope.data.Monto120 = '';
            }
            $scope.data.Monto108 = $scope.calculoCuotaAprox($scope.data.tasa, 108, _montoAprox);
            if ($scope.data.Monto108 > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                $scope.data.Monto108 = '';
            }
            $scope.data.Monto96 = $scope.calculoCuotaAprox($scope.data.tasa, 96, _montoAprox);
            if ($scope.data.Monto96 > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                $scope.data.Monto96 = '';
            }
            $scope.data.Monto84 = $scope.calculoCuotaAprox($scope.data.tasa, 84, _montoAprox);
            if ($scope.data.Monto84 > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                $scope.data.Monto84 = '';
            }
            $scope.data.Monto72 = $scope.calculoCuotaAprox($scope.data.tasa, 72, _montoAprox);
            if ($scope.data.Monto72 > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                $scope.data.Monto72 = '';
            }
            $scope.data.Monto60 = $scope.calculoCuotaAprox($scope.data.tasa, 60, _montoAprox);
            if ($scope.data.Monto60 > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota mensual excede tu capacidad de descuento";
                $scope.data.Monto60 = '';
            }

            //$scope.data.AproxCalculada = _AproxCalculada;
        }
        else if ($scope.data.ShowCuota) {
            if ($scope.data.maxCuota < $scope.data.capacidadDescuentoCuota) {
                $scope.data.errorexcede = "La cuota indicada excede tu capacidad de descuento, solicita un monto menor";
                return;
            }

            _cuotaAprox = $scope.data.cuotaAprox.replace(/\,/g, '');
            if (_cuotaAprox > $scope.data.maxCuota) {
                $scope.data.errorexcede = "La cuota indicada excede tu capacidad de descuento, solicita un monto menor";
                return;
            }

            //var montoAprox = $scope.calculoMontoAprox($scope.data.tasa, $scope.data.plazo, _cuotaAprox);
            //Segun funcion excel:  Redondear.menos (valor, -5)

            $scope.data.Cuota120 = $scope.calculoRedondearMenos($scope.calculoMontoAprox($scope.data.tasa, 120, _cuotaAprox), 5);
            $scope.data.Cuota108 = $scope.calculoRedondearMenos($scope.calculoMontoAprox($scope.data.tasa, 108, _cuotaAprox), 5);
            $scope.data.Cuota96 = $scope.calculoRedondearMenos($scope.calculoMontoAprox($scope.data.tasa, 96, _cuotaAprox), 5);
            $scope.data.Cuota84 = $scope.calculoRedondearMenos($scope.calculoMontoAprox($scope.data.tasa, 84, _cuotaAprox), 5);
            $scope.data.Cuota72 = $scope.calculoRedondearMenos($scope.calculoMontoAprox($scope.data.tasa, 72, _cuotaAprox), 5);
            $scope.data.Cuota60 = $scope.calculoRedondearMenos($scope.calculoMontoAprox($scope.data.tasa, 60, _cuotaAprox), 5);

        }
    };


    $scope.calculoCuotaAprox = function (t, plazo, monto) {
        //Formula Pago de excel es: (Tasa * [(1 + Tasa) ^ Plazo] * Monto Financiar) / ([(1 + Tasa) ^ Plazo] - 1)

        var tasa = t / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = Math.pow((1 + tasa), plazo);
        var result = (tasa * calculo * monto) / (calculo - 1);

        if (isNaN(result))
            result = 0;

        return Math.round(result);
    };

    $scope.calculoMontoAprox = function (t, plazo, cuota) {
        //Formula VA de excel es: cuota * ((1 + tasa) ^ plazo�� 1) / (tasa*(1 + tasa) ^ plazo)

        var tasa = t / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = Math.pow((1 + tasa), plazo);
        var VA = cuota * ((calculo - 1) / (tasa * calculo));
        VA = Math.round(VA);

        var _min = Math.min(VA, 100000000);

        if (isNaN(_min))
            result = 0;

        return _min;
    }

    $scope.calculoRedondearMenos = function (valor, numDecimas) {
        //La funcion de excel RedondearMenos asigna valor 0, al numero de caracteres indicados
        var num = valor.toString();
        var total = num.length;

        if (total > numDecimas) {

            var numero = total - numDecimas;
            var texto = num.slice(0, numero);

            for (var i = 0; i < numDecimas; i++) {
                texto = texto.concat("0");
            }

            return parseInt(texto);
        }
        else
            return 0;
    }

    //***************************** CONTACTENOS *****************************//
    $scope.obtenerDatos = function () {
        $scope.data.selectActividad = localStorage.getItem('selectActividad');
        $scope.CambiarActividad();
    }

    $scope.guardarInfo = function () {
        $scope.data.errornombre = '';
        $scope.data.errorcel = '';
        $scope.data.erroremail = '';

        if ($scope.data.nombre == '') {
            $scope.data.errornombre = 'Ingresa tu nombre y apellido';
            return false;
        }
        var expresion = /^3[\d]{9}$/;
        if (isNaN($scope.data.celular) || !expresion.test($scope.data.celular)) {
            $scope.data.errorcel = "Ingresa un n\u00FAmero con el formato correcto";
            return false;
        }
        if ($scope.data.email == '') {
            $scope.data.erroremail = 'Ingresa tu correo electr\u00F3nico';
            return false;
        }
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test($scope.data.email)) {
            $scope.data.erroremail = 'Ingresar una direcci\u00F3n de correo electr\u00F3nico con el formato correcto';
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
            var libranza = {
                'DatosPersonales': {
                    'nombre': $scope.data.nombre,
                    'celular': $scope.data.celular,
                    'email': $scope.data.email,
                },
                'Simulacion': credito,
            };
            result = firebase.database().ref("libranza").push(libranza);
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem('simulacion');
        return result;
    }

    //***************************** REDIRECCION *****************************//
    $scope.contactenos = function () {
        localStorage.setItem('selectActividad', $scope.data.selectActividad)

        if ($scope.data.ingresos != '' && $scope.data.descuentoNomina != '') {
            montoAprox = $scope.data.montoAprox.replace(/\,/g, '');
            cuotaAprox = $scope.data.cuotaAprox.replace(/\,/g, '');
            ingresos = $scope.data.ingresos.replace(/\,/g, '');
            descuentoNomina = $scope.data.descuentoNomina.replace(/\,/g, '');

            var simulacion = {
                'esMonto': $scope.data.ShowMonto,
                'esCuota': $scope.data.ShowCuota,
                'Actividad': $scope.data.selectActividad,
                'convenio': $scope.data.selectConvenio,
                'ingresos': ingresos,
                'descuentoNomina': descuentoNomina,
                'porcentajeDescuentoSalud': $scope.data.porcentajeDescuentos,
                'descuentoSalud': $scope.data.descuentoSalud,
                'montoFinanciar': montoAprox != '' ? montoAprox : 0,
                'cuotaFinanciar': cuotaAprox != '' ? cuotaAprox : 0,
                'plazo': $scope.data.plazo,
                'tasa': $scope.data.cuotaMensual,

            };
            localStorage.setItem('simulacion', JSON.stringify(simulacion));
        }
        $window.location.href = 'formContacto.html'
    }

    $scope.showindex = function () {
        $window.location.href = 'index.html'
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


