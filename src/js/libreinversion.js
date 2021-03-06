var app = angular.module("LibreInversion", []);

app.controller('LibreInversionController', ['$scope', '$window', '$filter', function ($scope, $window, $filter) {

    // Set the configuration for your app
    var config = {
        apiKey: "AIzaSyC8vrdhMCthhxAw7CwEfN3OnVWPbHNFVpk",
        authDomain: "simuladores-75631.firebaseapp.com.firebaseapp.com",
        databaseURL: "https://simuladores-75631.firebaseio.com",
        storageBucket: "simuladores-75631.appspot.com.appspot.com"
    };
    firebase.initializeApp(config);

    $scope.data = {
        minMonto: 3000000,
        maxMonto: 100000000,
        SMMLV: 877803,
        minIngresos: 1000000,

        numPagina: 1,
        //VARIABLES PARA CALCULO Simulador LIBRE INVERSION
        cuotaMensual: '',
        planPago: [],
        planPago2: [],
        destino: '',
        ingresos: '',
        dineronecesito: '',
        tasaNVM: '',
        plazo: '',
        email: '',
        erroremail: '',
        envioOK: false,//variable para envio de correo

        sendOK: false,//Variable para envio de formulario
        erroringresos: false,
        erroringresosmin: false,
        errornecesito: false,
        errornecesitomin: false,
        errornecesitomax: false,
        errornecesitocomparado: false,
        ShowErrorValor: false,
        errorplazo: false,


        cuota60meses: '',
        cuota48meses: '',
        cuota36meses: '',
        cuota24meses: '',
        cuota12meses: '',

        ShowMonto60MesesCuota: false,
        ShowMonto48MesesCuota: false,
        ShowMonto36MesesCuota: false,
        ShowMonto24MesesCuota: false,
        ShowMonto12MesesCuota: false,


        ShowImgCarro: true,
        ShowImgMoto: true,
        ShowTextoPorcentaje: false,
        ShowForm: true,
        ShowTerminos: false,


        pag2: false,
        pag3: false,
        pag4: false,
        pag5: false,
    }

    $scope.MostrarCuota = function (id) {
        $scope.data.errorplazo = false;
        $scope.data.ShowMonto60MesesCuota = false;
        $scope.data.ShowMonto48MesesCuota = false;
        $scope.data.ShowMonto36MesesCuota = false;
        $scope.data.ShowMonto24MesesCuota = false;
        $scope.data.ShowMonto12MesesCuota = false;

        switch (id) {
            case 2:
                $scope.data.ShowMonto60MesesCuota = true;
                $scope.data.plazo = 60;
                $scope.data.cuotaMensual = $scope.data.cuota60meses;
                break;
            case 3:
                $scope.data.ShowMonto48MesesCuota = true;
                $scope.data.plazo = 48;
                $scope.data.cuotaMensual = $scope.data.cuota48meses;
                break;
            case 4:
                $scope.data.ShowMonto36MesesCuota = true;
                $scope.data.plazo = 36;
                $scope.data.cuotaMensual = $scope.data.cuota36meses;
                break;
            case 5:
                $scope.data.ShowMonto24MesesCuota = true;
                $scope.data.plazo = 24;
                $scope.data.cuotaMensual = $scope.data.cuota24meses;
                break;
            case 6:
                $scope.data.ShowMonto12MesesCuota = true;
                $scope.data.plazo = 12;
                $scope.data.cuotaMensual = $scope.data.cuota12meses;
                break;
            default:
                $scope.data.cuotaMensual = '';
                $scope.data.plazo = '';
                break;
        }
    };

    $scope.calcularDatos = function () {
        if (!$scope.validaciones()) {
            return false;
        }

        $scope.calcularTasaxIngresos();
    }

    $scope.limpiarlocalStorage = function () {
        localStorage.clear();
    }

    /**************CALCULO LIBRE INVERSION *****************/
    $scope.validaciones = function () {
        $scope.data.erroringresos = false;
        $scope.data.erroringresosmin = false;
        $scope.data.errornecesito = false;
        $scope.data.errornecesitomin = false;
        $scope.data.errornecesitomax = false;
        $scope.data.errornecesitocomparado = false
        $scope.data.errorplazo = false;

        $scope.data.cuotaMensual = '';
        $scope.data.cuota60meses = '';
        $scope.data.cuota48meses = '';
        $scope.data.cuota36meses = '';
        $scope.data.cuota24meses = '';
        $scope.data.cuota12meses = '';
        $scope.data.ShowErrorValor = false;

        if ($scope.data.ingresos == "" || $scope.data.ingresos == "0") {
            $scope.data.erroringresos = true;
            return false;
        }

        var _ingresos = $scope.data.ingresos.replace(/\,/g, '');
        if (_ingresos < $scope.data.minIngresos) {
            $scope.data.erroringresosmin = true;
            return false;
        }

        if ($scope.data.dineronecesito == "") {
            $scope.data.errornecesito = true;
            $scope.data.ShowErrorValor = true;
            return false;
        }
        if ($scope.data.dineronecesito != null) {
            _dineronecesito = $scope.data.dineronecesito.replace(/\,/g, '');
            _ingresos = $scope.data.ingresos.replace(/\,/g, '');

            if (_dineronecesito < $scope.data.minMonto) {
                $scope.data.errornecesitomin = true;
                $scope.data.ShowErrorValor = true;
                return false;
            }

            if (_dineronecesito > $scope.data.maxMonto) {
                $scope.data.errornecesitomax = true;
                $scope.data.ShowErrorValor = true;
                return false;
            }

            $scope.prestamoTotal = _ingresos * 10;
            if (_dineronecesito > $scope.prestamoTotal) {
                $scope.data.errornecesitocomparado = true;
                $scope.data.ShowErrorValor = true;
                return false;
            }
        }
        else {
            $scope.data.errornecesito = true;
            $scope.data.ShowErrorValor = true;
            return false;
        }

        return true;
    }

    $scope.redondeaSeisDecimas = function (valor) {
        return Math.round(valor * 1000000) / 1000000;
    }

    $scope.calcularTasaxIngresos = function () {

        //se quita separcion para trabajar con el dato en numero
        _ingresos = $scope.data.ingresos.replace(/\,/g, '');
        _dineronecesito = $scope.data.dineronecesito.replace(/\,/g, '');

        $scope.data.tasaNVM = $scope.calcularTasa(_ingresos);
        var tasaEA = (1 + ($scope.data.tasaNVM / 100)) ** 12 - 1;
        $scope.data.tasaEfectivaAnual = $scope.redondeaSeisDecimas(tasaEA);

        $scope.data.cuota60meses = $scope.calculoCuota(_dineronecesito, $scope.data.tasaNVM, 60);
        $scope.data.cuota48meses = $scope.calculoCuota(_dineronecesito, $scope.data.tasaNVM, 48);
        $scope.data.cuota36meses = $scope.calculoCuota(_dineronecesito, $scope.data.tasaNVM, 36);
        $scope.data.cuota24meses = $scope.calculoCuota(_dineronecesito, $scope.data.tasaNVM, 24);
        $scope.data.cuota12meses = $scope.calculoCuota(_dineronecesito, $scope.data.tasaNVM, 12);

        $scope.MostrarCuota();

        if ($scope.data.cuotaMensual == '') {
            $scope.data.errorplazo = true;
            //$scope.data.errorplazo = "Elige un plazo";
            return false;
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

            if (_mes == $scope.data.plazo) {
                _cuota = _cuota + _saldoNuevo;

                _abonoCapital = _cuota - _interes;
                _saldoNuevo = _saldoAnterior - _abonoCapital;
            }

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


        for (let i = 0; i <= 11; i++) {
            $scope.data.planPago2.push(
                {
                    'estilo': $scope.data.planPago[i].estilo,
                    'mes': $scope.data.planPago[i].mes,
                    'cuota': $scope.data.planPago[i].cuota,
                    'interes': $scope.data.planPago[i].interes,
                    'abonoCapital': $scope.data.planPago[i].abonoCapital,
                    'saldo': $scope.data.planPago[i].saldo
                }
            );
        }

        //habilitar paginas cada 12 registros
        var pag = $scope.data.plazo / 12;
        switch (pag) {
            case 5:
                $scope.data.pag2 = true;
                $scope.data.pag3 = true;
                $scope.data.pag4 = true;
                $scope.data.pag5 = true;
                break;
            case 4:
                $scope.data.pag2 = true;
                $scope.data.pag3 = true;
                $scope.data.pag4 = true;
                break;
            case 3:
                $scope.data.pag2 = true;
                $scope.data.pag3 = true;
                break;
            case 2:
                $scope.data.pag2 = true;
                break;
        }
        for (let i = 1; i <= pag; i++) {
            angular.element(document.querySelector('#num-' + i)).removeClass('caja-seleccionada');
            angular.element(document.querySelector('#num-' + i)).addClass('caja-pagina');
        }

        angular.element(document.querySelector('#num-1')).addClass('caja-seleccionada');

    }

    $scope.paginador = function (_numero) {
        var numero = 1;

        if (_numero == 'ant') {
            if ($scope.data.numPagina == 1) {
                $scope.data.numPagina = 1;
            }
            else {
                $scope.data.numPagina = $scope.data.numPagina - 1;
            }
        }
        else if (_numero == 'sig') {
            $scope.data.numPagina = $scope.data.numPagina + 1;

            var pag = $scope.data.plazo / 12;
            if ($scope.data.numPagina > pag)
                $scope.data.numPagina = pag;

        }
        else {
            $scope.data.numPagina = _numero;
        }

        numero = $scope.data.numPagina;


        var inicio = 0;
        var finaliza = 0;
        switch (numero) {
            case 1: {
                inicio = 0;
                numeroRegistros = 11;
                break;
            }
            case 2: {
                inicio = 12;
                numeroRegistros = 23;
                break;
            }
            case 3: {
                inicio = 24;
                numeroRegistros = 35;
                break;
            }
            case 4: {
                inicio = 36;
                numeroRegistros = 47;
                break;
            }
            case 5: {
                inicio = 48;
                numeroRegistros = 59;
                break;
            }
        }

        $scope.data.planPago2 = [];
        for (let i = inicio; i <= numeroRegistros; i++) {
            $scope.data.planPago2.push(
                {
                    'estilo': $scope.data.planPago[i].estilo,
                    'mes': $scope.data.planPago[i].mes,
                    'cuota': $scope.data.planPago[i].cuota,
                    'interes': $scope.data.planPago[i].interes,
                    'abonoCapital': $scope.data.planPago[i].abonoCapital,
                    'saldo': $scope.data.planPago[i].saldo
                }
            );
        }
        for (let i = 1; i <= 5; i++) {
            angular.element(document.querySelector('#num-' + i)).removeClass('caja-seleccionada');
            angular.element(document.querySelector('#num-' + i)).addClass('caja-pagina');
        }
        angular.element(document.querySelector('#num-' + numero)).addClass('caja-seleccionada');

    }

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

            var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!regex.test($scope.data.email)) {
                $scope.data.erroremail = 'Indica una direcci\u00F3n de correo electr\u00F3nico con el formato correcto';
                return false;
            }

            $scope.writeFirebase();
            $scope.data.envioOK = true;
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
    $scope.exportar = function () {
        var table = 'tablapagos', name = 'plan de pagos', filename = 'plan de pagos - simulacion credito libre inversion'

        let uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

        var link = document.createElement('a');
        link.download = filename;
        link.href = uri + base64(format(template, ctx));
        link.click();
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

    $scope.cargarslide = function () {

        $('.carrusel').slick({
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 1500,
            fade: true,
        });
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