var app = angular.module("SimuladorVehiculos", []);
app.controller('SimuladorController', ['$scope', '$window', '$filter', function ($scope, $window, $filter) {
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
        tasa: 1.22, //valor de la tasa activa
        minMonto: 3000000,
        maxAnioCarro: 14,
        maxAnioMoto: 4,


        //Datos basicos del simulador
        montoFinanciar: '',
        cuotaMensual: '',
        precioVehiculo: '',
        cuotaInicial: '',
        plazo: "",

        anioModelo: '',
        marcaVehiculo: '',
        errorPrecio: '',
        errorCuota: '',
        errorMonto: '',

        ShowMonto72Meses: true,
        ShowMonto72MesesCuota: false,
        ShowMonto60Meses: true,
        ShowMonto60MesesCuota: false,
        ShowMonto48Meses: true,
        ShowMonto48MesesCuota: false,
        ShowMonto36Meses: true,
        ShowMonto36MesesCuota: false,
        ShowMonto24Meses: true,
        ShowMonto24MesesCuota: false,
        ShowMonto12Meses: true,
        ShowMonto12MesesCuota: false,
        ShowImgCarro: true,
        ShowImgMoto: false,
        ShowTextoPorcentaje: false,
        ShowForm: true,
        ShowTerminos: false,
        ShowTextoUsado: false,
        ShowTextoNuevo: true,
        ShowErrorValor: false,
        ShowModeloCarroMoto: true,
        ShowModeloCarroUsado: false,
        ShowModal: false,
        //Variables de Contactenos
        nombre: '',
        celular: '',
        email: '',

    }

    $scope.MostrarCuota = function (id) {
        $scope.data.ShowMonto72Meses = true;
        $scope.data.ShowMonto72MesesCuota = false;
        $scope.data.ShowMonto60Meses = true;
        $scope.data.ShowMonto60MesesCuota = false;
        $scope.data.ShowMonto48Meses = true;
        $scope.data.ShowMonto48MesesCuota = false;
        $scope.data.ShowMonto36Meses = true;
        $scope.data.ShowMonto36MesesCuota = false;
        $scope.data.ShowMonto24Meses = true;
        $scope.data.ShowMonto24MesesCuota = false;
        $scope.data.ShowMonto12Meses = true;
        $scope.data.ShowMonto12MesesCuota = false;

        switch (id) {
            case 1:
                $scope.data.ShowMonto72Meses = false;
                $scope.data.ShowMonto72MesesCuota = true;
                $scope.data.plazo = 72;
                break;
            case 2:
                $scope.data.ShowMonto60Meses = false;
                $scope.data.ShowMonto60MesesCuota = true;
                $scope.data.plazo = 60;
                break;
            case 3:
                $scope.data.ShowMonto48Meses = false;
                $scope.data.ShowMonto48MesesCuota = true;
                $scope.data.plazo = 48;
                break;
            case 4:
                $scope.data.ShowMonto36Meses = false;
                $scope.data.ShowMonto36MesesCuota = true;
                $scope.data.plazo = 36;
                break;
            case 5:
                $scope.data.ShowMonto24Meses = false;
                $scope.data.ShowMonto24MesesCuota = true;
                $scope.data.plazo = 24;
                break;
            case 6:
                $scope.data.ShowMonto12Meses = false;
                $scope.data.ShowMonto12MesesCuota = true;
                $scope.data.plazo = 12;
                break;
        }

        //calcular MONTO FINANCIAR y CUOTA MENSUAL si cambia el plazo
        $scope.calcularDatos();

        if ($scope.data.ShowImgCarro == false) {
            $scope.data.ShowMonto72Meses = false;
            $scope.data.ShowMonto72MesesCuota = false;
        }

    };

    $scope.CambiarVehiculo = function () {
        if ($scope.data.ShowImgCarro == true) {
            $scope.data.ShowImgCarro = false;
            $scope.data.ShowImgMoto = true;
            $scope.data.ShowMonto72Meses = false;
            $scope.data.ShowMonto72MesesCuota = false;
            $scope.data.ShowModeloCarroMoto = true;
            $scope.data.ShowModeloCarroUsado = false;
        } else {
            $scope.data.ShowImgCarro = true;
            $scope.data.ShowImgMoto = false;
            $scope.data.ShowMonto72Meses = true;
            $scope.data.ShowMonto72MesesCuota = false;
        }
        $scope.data.anioModelo = '';
        $scope.data.marcaVehiculo = '';
        $scope.calcularDatos();
    };


    $scope.CambiarEstadoVehiculo = function () {
        if ($scope.data.ShowTextoNuevo == true) {
            $scope.data.ShowTextoUsado = true;
            $scope.data.ShowTextoNuevo = false;
            $scope.data.ShowModeloCarroMoto = false;
            $scope.data.ShowModeloCarroUsado = true;
        } else {
            $scope.data.ShowTextoUsado = false;
            $scope.data.ShowTextoNuevo = true;
            $scope.data.ShowModeloCarroMoto = true;
            $scope.data.ShowModeloCarroUsado = false;
        }
        $scope.data.anioModelo = '';
        $scope.calcularDatos();
    }

    //$scope.mostrarTerminos = function () {
    //    $scope.data.ShowForm = false;
    //    $scope.data.ShowTerminos = true;
    //}

    //$scope.ocultarTerminos = function () {
    //    $scope.data.ShowForm = true;
    //    $scope.data.ShowTerminos = false;
    //}

    $scope.calcularDatos = function () {
        $scope.data.errorPrecio = '';
        $scope.data.errorCuota = '';
        $scope.data.errorMonto = '';
        $scope.data.errorModelo = '';

        if ($scope.data.anioModelo == '') {
            $scope.data.errorModelo = "ingrese el a\u00F1o del modelo del veh\u00CDculo";
            $scope.data.montoFinanciar = '';
            $scope.data.cuotaMensual = '';
            return false;
        }


        if ($scope.data.precioVehiculo == '') {
            $scope.data.errorPrecio = "ingrese precio del veh\u00CDculo";
            return false;
        }

        /*if ($scope.data.cuotaInicial == '') {
            $scope.data.errorCuota = "ingrese cuota Inicial del veh\u00CDculo";
            //return false;
        }*/

        //se quita separcion para trabajar con el dato en numero
        _precioVehiculo = $scope.data.precioVehiculo.replace(/\,/g, '');
        _cuotaInicial = parseInt($scope.data.cuotaInicial.replace(/\,/g, ''));

        if (isNaN(_cuotaInicial))
            _cuotaInicial = 0;


        var _antiguedad = (new Date().getFullYear()) - $scope.data.anioModelo;
        if ($scope.data.ShowImgCarro && _antiguedad > $scope.data.maxAnioCarro) {
            $scope.data.errorModelo = "El modelo del veh\u00CDculo no es factible";
            $scope.data.montoFinanciar = '';
            $scope.data.cuotaMensual = '';
            return false;
        }
        else if ($scope.data.ShowImgMoto && _antiguedad > $scope.data.maxAnioMoto) {
            $scope.data.errorModelo = "El modelo del veh\u00CDculo no es factible";
            $scope.data.montoFinanciar = '';
            $scope.data.cuotaMensual = '';
            return false;
        }


        /*var porcentaje = $scope.calculoPorcentajeFinanciacion();
        if (porcentaje == 100)
            $scope.data.errorCuota = 'Aplica financiaci\u00F3n del ' + porcentaje + '% del precio del veh\u00CDculo';
        else {
            var cuota = (_precioVehiculo * porcentaje) / 100;
            if (_cuotaInicial != cuota)
                $scope.data.errorCuota = 'Debe ser del ' + porcentaje + '% del precio del veh\u00CDculo';
        }*/

        //CALCULO MONTO FINANCIAR A PARTIR DE LOS DATOS RECOLECTADOS
        _montoFinanciar = _precioVehiculo - _cuotaInicial;
        $scope.data.montoFinanciar = _montoFinanciar >= 0 ? _montoFinanciar : 0;

        if ($scope.data.montoFinanciar < $scope.data.minMonto) {
            $scope.data.errorMonto = "El monto m\u00CDnimo a financiar debe ser mayor que $" + $filter('currency')($scope.data.minMonto, '$', 0);
        }

        if ($scope.data.plazo != '')
            $scope.data.cuotaMensual = $scope.calculoCuotaMensual($scope.data.tasa, $scope.data.plazo, $scope.data.montoFinanciar);

    };

    $scope.calculoPorcentajeFinanciacion = function () {
        var porcentaje = 20;

        if ($scope.data.ShowImgMoto) {
            if ($scope.data.ShowTextoNuevo && $scope.data.plazo >= 12 && $scope.data.plazo <= 60) {
                porcentaje = 100;
            }
            else if ($scope.data.ShowTextoUsado && $scope.data.plazo >= 12 && $scope.data.plazo <= 48) {
                porcentaje = 100;
            }
        }

        if ($scope.data.ShowImgCarro) {
            if ($scope.data.ShowTextoNuevo && $scope.data.plazo >= 12 && $scope.data.plazo <= 60) {
                porcentaje = 100;
            }
            else if ($scope.data.ShowTextoUsado && $scope.data.plazo >= 12 && $scope.data.plazo <= 60) {
                porcentaje = 30;
            }
        }

        return porcentaje;
    }

    $scope.calculoCuotaMensual = function (tasa, plazo, monto) {
        //Formula Pago de excel es: (Tasa * [(1 + Tasa) ^ Plazo] * Monto Financiar) / ([(1 + Tasa) ^ Plazo] - 1)
        tasa = tasa / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = (1 + tasa) ** plazo;
        var _cuotamensual = (tasa * calculo * monto) / (calculo - 1);
        return Math.round(_cuotamensual);
    };

    //***************************** CONTACTENOS *****************************//

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
            var vehiculo = {
                'DatosPersonales': {
                    'nombre': $scope.data.nombre,
                    'celular': $scope.data.celular,
                    'email': $scope.data.email,
                },
                'Simulacion': credito,
            };
            result = firebase.database().ref("vehiculo").push(vehiculo);
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem('simulacion');
        return result;
    }

    //***************************** REDIRECCION *****************************//
    $scope.contactenos = function () {
        if ($scope.data.anioModelo != '' && $scope.data.precioVehiculo != '' && $scope.data.cuotaInicial != '') {
            _cuotaInicial = parseInt($scope.data.cuotaInicial.replace(/\,/g, ''));
            _precioVehiculo = parseInt($scope.data.precioVehiculo.replace(/\,/g, ''));

            var simulacion = {
                'tipoVehiculo': $scope.data.ShowImgCarro ? 'Carro' : 'Moto',
                'estadoVehiculo': $scope.data.ShowTextoNuevo ? 'Nuevo' : 'Usado',
                'marcaVehiculo': $scope.data.marcaVehiculo,
                'anioModelo': $scope.data.anioModelo,
                'periodoPago': 'Meses',
                'tasa': $scope.data.tasa,
                'precioVehiculo': _precioVehiculo,
                'cuotaInicial': _cuotaInicial,
                'montoFinanciar': $scope.data.montoFinanciar,
                'cuotaMensual': $scope.data.cuotaMensual,
                'plazo': $scope.data.plazo,
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

