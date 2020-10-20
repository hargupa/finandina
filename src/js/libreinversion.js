var app = angular.module("LibreInversion", []);

app.controller('LibreInversionController', ['$scope', '$window', function ($scope, $window) {

    $scope.data = {
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
        ShowImgMoto: true,
        ShowTextoPorcentaje: false,
        ShowForm: true,
        ShowTerminos: false,

        //VARIABLES PARA CALCULO Simulador LIBRE INVERSION
        cuotaMensual: 0,
        planPago: [],

        ingresos: "",
        dineronecesito: "",
        tasaNVM: "",
        plazo: "",

    }

    $scope.MostrarCuota = function (id) {

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

            case 2:
                $scope.data.ShowMonto60Meses = false;
                $scope.data.ShowMonto60MesesCuota = true;
                $scope.data.plazo = 60;
                $scope.data.cuotaMensual = $scope.calculoCuota($scope.data.dineronecesito, $scope.data.tasaNVM, $scope.data.plazo);
                break;
            case 3:
                $scope.data.ShowMonto48Meses = false;
                $scope.data.ShowMonto48MesesCuota = true;
                $scope.data.plazo = 48;
                $scope.data.cuotaMensual = $scope.calculoCuota($scope.data.dineronecesito, $scope.data.tasaNVM, $scope.data.plazo);
                break;
            case 4:
                $scope.data.ShowMonto36Meses = false;
                $scope.data.ShowMonto36MesesCuota = true;
                $scope.data.plazo = 36;
                $scope.data.cuotaMensual = $scope.calculoCuota($scope.data.dineronecesito, $scope.data.tasaNVM, $scope.data.plazo);
                break;
            case 5:
                $scope.data.ShowMonto24Meses = false;
                $scope.data.ShowMonto24MesesCuota = true;
                $scope.data.plazo = 24;
                $scope.data.cuotaMensual = $scope.calculoCuota($scope.data.dineronecesito, $scope.data.tasaNVM, $scope.data.plazo);
                break;

            case 6:
                $scope.data.ShowMonto12Meses = false;
                $scope.data.ShowMonto12MesesCuota = true;
                $scope.data.plazo = 12;
                $scope.data.cuotaMensual = $scope.calculoCuota($scope.data.dineronecesito, $scope.data.tasaNVM, $scope.data.plazo);
                break;

            default:
                $scope.data.cuotaMensual = "";
                break;
        }

    };



    /**************CALCULO LIBRE INVERSION *****************/
    $scope.calcularDatosLibreInversion = function () {
    }

    $scope.calcularTasaxIngresos = function () {
        if ($scope.data.ingresos == "") {
            return
        }

        var prestamoTotal = $scope.data.ingresos * 10;
        $scope.data.tasaNVM = $scope.calcularTasa($scope.data.ingresos);

        //var tasaEA = Math.round((1 + $scope.data.tasaNVM) ** plazo - 1).toFixed(4);
    };

    $scope.calculoCuota = function () {
        if ($scope.data.dineronecesito == "" || $scope.data.tasaNVM == "" || $scope.data.plazo == "") {
            return;
        }

        var tasa = $scope.data.tasaNVM / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = (1 + tasa) ** -$scope.data.plazo;
        var calculo2 = (1 - calculo) / tasa;

        var result = Math.round($scope.data.dineronecesito / calculo2);
        return result;

    };

    $scope.obtenerPlan = function () {

        $scope.data.dineronecesito = localStorage.getItem('dineronecesito');
        $scope.data.tasaNVM = localStorage.getItem('tasaNVM');
        $scope.data.plazo = localStorage.getItem('plazo');
        $scope.data.cuotaMensual = localStorage.getItem('cuotaMensual');


        if ($scope.data.dineronecesito == "" || $scope.data.tasaNVM == "" || $scope.data.plazo == "")
            return;

        var tasa = $scope.data.tasaNVM / 100;
        $scope.data.planPago = [];


        var _cuota = parseInt($scope.data.cuotaMensual);
        var _saldoAnterior = parseInt($scope.data.dineronecesito);

        for (var i = 0; i < $scope.data.plazo; i++) {

            var _mes, _interes, _abonoCapital, _saldoNuevo;
            _mes = i + 1;

            _interes = Math.round(_saldoAnterior * tasa);
            _abonoCapital = _cuota - _interes;
            _saldoNuevo = _saldoAnterior - _abonoCapital;

            if ((_mes % 2) == 0) {
                _estilo = 'celda-2';
            }
            else {
                _estilo = 'celda-1';
            }

            $scope.data.planPago.push(
                {
                    'estilo': _estilo,
                    'mes': _mes,
                    'cuota': _cuota,
                    'interes': _interes,
                    'abonoCapital': _abonoCapital,
                    'saldo': _saldoNuevo
                }
            );

            _saldoAnterior = _saldoNuevo;
        }
    }

    $scope.calculoPlanPago = function () {

        localStorage.setItem('dineronecesito', $scope.data.dineronecesito);
        localStorage.setItem('tasaNVM', $scope.data.tasaNVM);
        localStorage.setItem('plazo', $scope.data.plazo);
        localStorage.setItem('cuotaMensual', $scope.data.cuotaMensual);

        $window.location.href = 'planPagos.html';

    };

    $scope.calcularTasa = function (salario) {

        var tasa = 0;
        var millon = 1000000;
        if (salario <= (millon * 2))//entre 1 y 2 millones
            tasa = 1.89;
        else if (salario > (millon * 2) && salario <= (millon * 3))//entre 2 y 3 millones
            tasa = 1.89;
        else if (salario > (millon * 3) && salario <= (millon * 5))//entre 3 y 5 millones
            tasa = 1.69;
        else if (salario > (millon * 5) && salario <= (millon * 7))//entre 5 y 7 millones
            tasa = 1.59;
        else if (salario > (millon * 7) && salario <= (millon * 10))//entre 7 y 10 millones
            tasa = 1.39;
        else if (salario > (millon * 10)) //mas de 10 millones
            tasa = 1.29;

        return tasa;
    };



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