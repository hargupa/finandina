var app = angular.module("Libranza", []);
app.controller('LibranzaController', ['$scope', '$window', function ($scope, $window) {

    $scope.data = {
        //VARIABLES PARA CALCULO Simulador LIBRANZA
        porcentajeDescuentos: "",
        AproxCalculada: 0,
        descuento: "",
        maxCuota: "",
        plazo: "",
        tasa: 1.89,

        descuentoNomina: '',
        ingresos: '',
        selectActividad: '0',
        montoAprox: '',
        cuotaAprox: '',

        minMontoPerimitido: 3000000,
        minCuotaPerimitido: 3000000,
        maxMontoPerimitido: 100000000,
        maxCuotaPerimitido: 100000000,

        errorDescNomina: '',
        errorIngresos: '',
        errorActividad: '',
        errorMonto: '',
        errorCuota: '',
        errorplazo: '',

        ShowMonto108Meses: true,
        ShowMonto108MesesCuota: false,
        ShowMonto96Meses: true,
        ShowMonto96MesesCuota: false,
        ShowMonto84Meses: true,
        ShowMonto84MesesCuota: false,
        ShowMonto72Meses: true,
        ShowMonto72MesesCuota: false,
        ShowMonto60Meses: true,
        ShowMonto60MesesCuota: false,
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
        $scope.data.AproxCalculada = 0;
    };

    $scope.CambiarActividad = function () {
        $scope.data.ShowImgDefault = false;
        $scope.data.ShowImgSectorPublico = false;
        $scope.data.ShowImgDocente = false;
        $scope.data.ShowImgFuerzas = false;
        $scope.data.ShowImgPensionado = false;

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
        $scope.data.ShowMonto108Meses = true;
        $scope.data.ShowMonto108MesesCuota = false;
        $scope.data.ShowMonto96Meses = true;
        $scope.data.ShowMonto96MesesCuota = false;
        $scope.data.ShowMonto84Meses = true;
        $scope.data.ShowMonto84MesesCuota = false;
        $scope.data.ShowMonto72Meses = true;
        $scope.data.ShowMonto72MesesCuota = false;
        $scope.data.ShowMonto60Meses = true;
        $scope.data.ShowMonto60MesesCuota = false;

        switch (id) {
            case 1:
                $scope.data.plazo = 108;
                $scope.data.ShowMonto108Meses = false;
                $scope.data.ShowMonto108MesesCuota = true;
                break;
            case 2:
                $scope.data.plazo = 96;
                $scope.data.ShowMonto96Meses = false;
                $scope.data.ShowMonto96MesesCuota = true;
                break;
            case 3:
                $scope.data.plazo = 84;
                $scope.data.ShowMonto84Meses = false;
                $scope.data.ShowMonto84MesesCuota = true;
                break;
            case 4:
                $scope.data.plazo = 72;
                $scope.data.ShowMonto72Meses = false;
                $scope.data.ShowMonto72MesesCuota = true;
                break;
            case 5:
                $scope.data.plazo = 60;
                $scope.data.ShowMonto60Meses = false;
                $scope.data.ShowMonto60MesesCuota = true;
                break;
        }
        $scope.calcularDatos();
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


        if ($scope.data.selectActividad == '0') {
            $scope.data.errorActividad = "Debe indicar su actividad";
            return false;
        }
        if ($scope.data.ingresos == "") {
            $scope.data.errorIngresos = "Debe indicar sus ingresos";
            return false;
        }

        if ($scope.data.descuentoNomina == "") {
            $scope.data.errorDescNomina = 'Debe indicar sus descuentos por n\u00F3mina';
            return false;
        }
        if ($scope.data.ShowMonto) {
            if ($scope.data.montoAprox == '') {
                $scope.data.errorMonto = 'Debe indicar la cantidad de dinero que necesita';
                return false;
            }
            _montoAprox = $scope.data.montoAprox.replace(/\,/g, '');
            if (_montoAprox < $scope.data.minMontoPerimitido) {
                $scope.data.errorMonto = "El monto del dinero no puede ser inferior a $" + $scope.data.minMontoPerimitido;
                return false;
            }
            if (_montoAprox > $scope.data.maxMontoPerimitido) {
                $scope.data.errorMonto = "El monto del dinero no puede ser superior a $" + $scope.data.maxMontoPerimitido;
                return false;
            }
        }
        if ($scope.data.ShowCuota) {
            if ($scope.data.cuotaAprox == '') {
                $scope.data.errorCuota = 'Debe indicar la cantidad de cuota que quiere pagar';
                return false;
            }
        }

        if ($scope.data.plazo == '') {
            $scope.data.errorplazo = 'Debe indicar el plazo en el que quiere pagar';
            return false;
        }



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
        $scope.data.descuento = _ingresos * $scope.data.porcentajeDescuentos;
        $scope.data.maxCuota = ((_ingresos - $scope.data.descuento) / 2) - _descuentoNomina;

        if ($scope.data.ShowMonto) {
            _montoAprox = $scope.data.montoAprox.replace(/\,/g, '');
            //Segun funcion excel:  Pago 
            $scope.data.AproxCalculada = $scope.calculoCuotaAprox($scope.data.tasa, $scope.data.plazo, _montoAprox);
        }
        else if ($scope.data.ShowCuota) {
            _cuotaAprox = $scope.data.cuotaAprox.replace(/\,/g, '');
            var montoAprox = $scope.calculoMontoAprox($scope.data.tasa, $scope.data.plazo, _cuotaAprox);
            //Segun funcion excel:  Redondear.menos (valor, -5)
            $scope.data.AproxCalculada = $scope.calculoRedondearMenos(montoAprox, 5);
        }

    };


    $scope.calculoCuotaAprox = function (tasa, plazo, monto) {
        //Formula Pago de excel es: (Tasa * [(1 + Tasa) ^ Plazo] * Monto Financiar) / ([(1 + Tasa) ^ Plazo] - 1)

        tasa = tasa / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = (1 + tasa) ** plazo;
        var cuotamensual = (tasa * calculo * monto) / (calculo - 1);
        var result = Math.round(cuotamensual);

        if (isNaN(result))
            result = 0;

        return result;
    };

    $scope.calculoMontoAprox = function (tasa, plazo, cuota) {
        //Formula VA de excel es: cuota * ((1 + tasa) ^ plazo – 1) / (tasa*(1 + tasa) ^ plazo)
        tasa = tasa / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = (1 + tasa) ** plazo;
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


    $scope.obtenerDatos = function () {
        $scope.data.selectActividad = localStorage.getItem('selectActividad');
        $scope.CambiarActividad();
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
        localStorage.setItem('selectActividad', $scope.data.selectActividad)

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


