var app = angular.module("LibreInversion", []);

app.controller('LibreInversionController', ['$scope', '$window', function ($scope, $window) {

    // Set the configuration for your app
    var config = {
        apiKey: "AIzaSyC8vrdhMCthhxAw7CwEfN3OnVWPbHNFVpk",
        authDomain: "simuladores-75631.firebaseapp.com.firebaseapp.com",
        databaseURL: "https://simuladores-75631.firebaseio.com",
        storageBucket: "simuladores-75631.appspot.com.appspot.com"
    };
    firebase.initializeApp(config);

    $scope.data = {
        //VARIABLES PARA CALCULO Simulador LIBRE INVERSION
        cuotaMensual: 0,
        planPago: [],

        destino: '',
        ingresos: '',
        dineronecesito: '',
        tasaNVM: '',
        plazo: '',
        email: '',

        sendOK: false,
        minMonto: 3000000,
        maxMonto: 100000000,
        erroringresos: '',
        errornecesito: '',
        errorplazo: '',

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

            default:
                $scope.data.cuotaMensual = 0;
                $scope.data.plazo = '';
                break;
        }
        //calcular MONTO FINANCIAR y CUOTA MENSUAL si cambia el plazo
        if ($scope.validaciones()) {
            $scope.calcularTasaxIngresos();
        }


    };



    /**************CALCULO LIBRE INVERSION *****************/
    $scope.validaciones = function () {
        $scope.data.erroringresos = '';
        $scope.data.errornecesito = '';
        $scope.data.errorplazo = '';

        if ($scope.data.ingresos == "") {
            $scope.data.erroringresos = "Indica tus ingresos mensuales";
            return false;
        }
        if ($scope.data.dineronecesito == "") {
            $scope.data.errornecesito = "Indica el monto del dinero que necesitas";
            return false;
        }
        if ($scope.data.plazo == "") {
            $scope.data.errorplazo = "Indica el plazo";
            return false;
        }

        _dineronecesito = $scope.data.dineronecesito.replace(/\,/g, '');
        _ingresos = $scope.data.ingresos.replace(/\,/g, '');

        if (_dineronecesito < $scope.data.minMonto) {
            $scope.data.errornecesito = "El monto m�nimo que te prestamos es de $" + $scope.data.minMonto;
            return false;
        }
        if (_dineronecesito > $scope.data.maxMonto) {
            $scope.data.errornecesito = "El monto m�ximo que te prestamos es de $" + $scope.data.maxMonto;
            return false;
        }

        var prestamoTotal = _ingresos * 10;
        if (_dineronecesito > prestamoTotal) {
            $scope.data.errornecesito = "El monto que intentas solicitar es superior a tu capacidad de endeudamiento, el valor m�ximo que te podemos prestar es $" + $scope.data.maxMonto;
            return false;
        }


        return true;
    }

    $scope.calcularTasaxIngresos = function () {
        if (!$scope.validaciones()) {
            return false;
        }
        //se quita separcion para trabajar con el dato en numero
        _ingresos = $scope.data.ingresos.replace(/\,/g, '');
        _dineronecesito = $scope.data.dineronecesito.replace(/\,/g, '');

        var prestamoTotal = _ingresos * 10;
        $scope.data.tasaNVM = $scope.calcularTasa(_ingresos);

        if ($scope.data.plazo != '') {
            var tasaEA = Math.round((1 + $scope.data.tasaNVM) ** $scope.data.plazo - 1).toFixed(4);
            $scope.data.cuotaMensual = $scope.calculoCuota(_dineronecesito, $scope.data.tasaNVM, $scope.data.plazo);
        }
    };

    $scope.calculoCuota = function (_dineronecesito, _tasaNVM, _plazo) {
        var tasa = _tasaNVM / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = (1 + tasa) ** - _plazo;
        var calculo2 = (1 - calculo) / tasa;

        var result = Math.round(_dineronecesito / calculo2);
        return result;

    };

    $scope.obtenerPlan = function () {

        var json = JSON.parse(localStorage.getItem('simulacion'));

        $scope.data.ingresos = json.ingresos;
        $scope.data.dineronecesito = json.dineronecesito;
        $scope.data.tasaNVM = json.tasaNVM;
        $scope.data.plazo = json.plazo;
        $scope.data.cuotaMensual = json.cuotaMensual;

        if ($scope.data.dineronecesito == "" || $scope.data.tasaNVM == "" || $scope.data.plazo == "")
            return false;

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
        if (!$scope.validaciones()) {
            return false;
        }

        $scope.showPlanPagos();
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

    $scope.guardarInfo = function (paso) {

        if (paso == 2 && $scope.data.sendOK) { //desde btn solicitar credito
            localStorage.removeItem('simulacion');
            $scope.data.ShowModal = true;
        }
        else if (paso == 2 && !$scope.data.sendOK) {
            if ($scope.writeFirebase()) {
                $scope.data.ShowModal = true;
            }
        }
        else if (paso == 1) {
            $scope.writeFirebase();
        }
    }

    $scope.writeFirebase = function () {

        var datos = localStorage.getItem('simulacion');
        var credito = JSON.parse(datos);

        var result = false;
        try {
            var libreInversion = {
                'DatosPersonales': {
                    'email': $scope.data.email != undefined ? $scope.data.email : '',
                },
                'Simulacion': credito,
            };
            result = firebase.database().ref("libreInversion").push(libreInversion);
        } catch (error) {
            console.log(error);
        }

        $scope.data.sendOK = result;
        return result;
    }

    //***************************** REDIRECCION *****************************//
    $scope.showPlanPagos = function () {

        _dineronecesito = $scope.data.dineronecesito.replace(/\,/g, '');
        _ingresos = $scope.data.ingresos.replace(/\,/g, '');

        var simulacion = {

            'ingresos': _ingresos,
            'dineronecesito': _dineronecesito,
            'tasaNVM': $scope.data.tasaNVM,
            'plazo': $scope.data.plazo,
            'cuotaMensual': $scope.data.cuotaMensual,

        };
        localStorage.setItem('simulacion', JSON.stringify(simulacion));


        $window.location.href = 'planPagos.html';
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
})