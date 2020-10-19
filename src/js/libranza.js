var app = angular.module("Libranza", []);
app.controller('LibranzaController', ['$scope', function ($scope) {

    $scope.data = {
        //VARIABLES PARA CALCULO Simulador LIBRANZA
        porcentajeDescuentos: "",
        descuento: "",
        maxCuota: "",
        plazo: "",
        tasa: 1.20,


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
        singleSelect: "0",
        ShowCuota: false,
        ShowMonto: true,
        ShowForm: true,
        ShowAviso: false

    }

    $scope.Cambiar = function () {
        if ($scope.data.ShowCuota == true) {
            $scope.data.ShowCuota = false;
            $scope.data.ShowMonto = true;
        } else {
            $scope.data.ShowCuota = true;
            $scope.data.ShowMonto = false;
        }
    };

    $scope.CambiarActividad = function () {
        $scope.data.ShowImgDefault = false;
        $scope.data.ShowImgSectorPublico = false;
        $scope.data.ShowImgDocente = false;
        $scope.data.ShowImgFuerzas = false;
        $scope.data.ShowImgPensionado = false;

        if ($scope.data.singleSelect == "0") {
            $scope.data.porcentajeDescuentos = 0;
        }
        else if ($scope.data.singleSelect == "4") {
            $scope.data.porcentajeDescuentos = (12 / 100);
        }
        else {
            $scope.data.porcentajeDescuentos = (8 / 100);
        }

        switch ($scope.data.singleSelect) {
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
        $scope.data.mensaje = "";

        if ($scope.data.ingresos == "") {
            $scope.data.mensaje = "Debe indicar sus ingresos";
            return;
        }


    }

    $scope.calcularDatos = function () {
        if ($scope.data.porcentajeDescuentos == "") {

            if ($scope.data.singleSelect == "4") {
                $scope.data.porcentajeDescuentos = (12 / 100);
            }
            else {
                $scope.data.porcentajeDescuentos = (8 / 100);
            }
        }

        //Campos Calculos
        $scope.data.descuento = $scope.data.ingresos * $scope.data.porcentajeDescuentos;
        $scope.data.maxCuota = (($scope.data.ingresos - $scope.data.descuento) / 2) - $scope.data.descuentoNomina;

        if ($scope.data.ShowMonto) {
            //Segun funcion excel:  Pago 
            $scope.data.AproxCalculada = $scope.calculoCuotaAprox($scope.data.tasa, $scope.data.plazo, $scope.data.montoAprox);
            console.log("cuotaAproxCalculada", $scope.data.cuotaAproxCalculada);
        }
        else if ($scope.data.ShowCuota) {
            var montoAprox = $scope.calculoMontoAprox($scope.data.tasa, $scope.data.plazo, $scope.data.cuotaAprox);
            //Segun funcion excel:  Redondear.menos (valor, -5)
            $scope.data.AproxCalculada = $scope.calculoRedondearMenos(montoAprox, 5);
            console.log("montoAproxCalculada", $scope.data.montoAproxCalculada);
        }

        console.log("descuento", $scope.data.descuento);
        console.log("maxCuota", $scope.data.maxCuota);
    };


    $scope.calculoCuotaAprox = function (tasa, plazo, monto) {
        //Formula Pago de excel es: (Tasa * [(1 + Tasa) ^ Plazo] * Monto Financiar) / ([(1 + Tasa) ^ Plazo] - 1)
        tasa = tasa / 100; //Se combierte el valor de la tasa en porcentaje %

        var calculo = (1 + tasa) ** plazo;
        var cuotamensual = (tasa * calculo * monto) / (calculo - 1);

        var result = Math.round(cuotamensual);

        if (isNaN(result)) {
            result = 0;
        }

        return result;
    };

    $scope.calculoMontoAprox = function (tasa, plazo, cuota) {
        //Formula VA de excel es: cuota * ((1 + tasa) ^ plazo – 1) / (tasa*(1 + tasa) ^ plazo)
        tasa = tasa / 100; //Se combierte el valor de la tasa en porcentaje %
        var calculo = (1 + tasa) ** plazo;
        var VA = cuota * ((calculo - 1) / (tasa * calculo));
        VA = Math.round(VA);

        var _min = Math.min(VA, 100000000);

        if (isNaN(_min)) {
            result = 0;
        }
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


}]);
