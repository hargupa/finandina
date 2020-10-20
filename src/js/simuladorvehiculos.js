var app = angular.module("SimuladorVehiculos", []);
app.controller('SimuladorController', ['$scope', '$window', function ($scope, $window) {

    $scope.Math = window.Math;
    $scope.data = {
        //Datos basicos del simulador
        montoFinanciar: 0,
        precioVehiculo: '',
        cuotaInicial: '',
        tasa: 1.22, //valor de la tasa activa
        plazo: "",

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
        ShowImgCarro: true,
        ShowImgMoto: true,
        ShowTextoPorcentaje: false,
        ShowForm: true,
        ShowTerminos: false,
        ShowTextoUsado:false,
        ShowTextoNuevo:true,
        ShowErrorValor:false,
        ShowModeloCarroMoto:true,
        ShowModeloCarroUsado:false,
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


        $scope.data.cuotaMensual = $scope.calculoCuotaMensual($scope.data.tasa, $scope.data.plazo, $scope.data.montoFinanciar);

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
            $scope.data.ShowModeloCarroMoto=true;
            $scope.data.ShowModeloCarroUsado=false;            
        } else {
            $scope.data.ShowImgCarro = true;
            $scope.data.ShowImgMoto = false;
            $scope.data.ShowMonto72Meses = true;
            $scope.data.ShowMonto72MesesCuota = false;

        }
    };


    $scope.CambiarEstadoVehiculo=function(){
        if($scope.data.ShowTextoNuevo==true){
            $scope.data.ShowTextoUsado=true;
            $scope.data.ShowTextoNuevo=false;
            $scope.data.ShowModeloCarroMoto=false;
            $scope.data.ShowModeloCarroUsado=true;             
        }else{
            $scope.data.ShowTextoUsado=false;
            $scope.data.ShowTextoNuevo=true;
            $scope.data.ShowModeloCarroMoto=true;
            $scope.data.ShowModeloCarroUsado=false;             
        }
    }


    $scope.mostrarTerminos = function () {
        $scope.data.ShowForm = false;
        $scope.data.ShowTerminos = true;
    }

    $scope.ocultarTerminos = function () {
        $scope.data.ShowForm = true;
        $scope.data.ShowTerminos = false;
    }



    $scope.validaciones = function () {
        $scope.data.mensajes = ""

        if ($scope.data.precioVehiculo == '') {
            $scope.data.mensajes = "ingrese precio del vehiculo";
            return false;
        }

        if ($scope.data.cuotaInicial == '') {
            $scope.data.mensajes = "ingrese cuota Inicial del vehiculo";
            return false;
        }
        if ($scope.data.plazo == '') {
            $scope.data.mensajes = "ingrese plazo del vehiculo";
            return false;
        }


        return true;
    };

    $scope.calcularDatos = function () {

        if ($scope.validaciones()) {

            var cuota = ($scope.data.precioVehiculo * 20) / 100;
            if (parseInt($scope.data.cuotaInicial) == cuota) {
                $scope.data.ShowTextoPorcentaje = false;
            }
            else {
                $scope.data.ShowTextoPorcentaje = true;
            }

            $scope.data.montoFinanciar = $scope.data.precioVehiculo - $scope.data.cuotaInicial;
            $scope.data.cuotaMensual = $scope.calculoCuotaMensual($scope.data.tasa, $scope.data.plazo, $scope.data.montoFinanciar);
        }
        else {
            $scope.data.montoFinanciar = 0;
        }

    };
    $scope.calculoCuotaMensual = function (tasa, plazo, monto) {

        //Formula Pago de excel es: (Tasa * [(1 + Tasa) ^ Plazo] * Monto Financiar) / ([(1 + Tasa) ^ Plazo] - 1)
        tasa = tasa / 100; //Se combierte el valor de la tasa en porcentaje %

        var calculo = (1 + tasa) ** plazo;
        var cuotamensual = (tasa * calculo * monto) / (calculo - 1);

        var result = Math.round(cuotamensual);
        return result;
    };

    $scope.contactenos = function () {
        $window.location.href = 'formContacto.html'
    }

}]);
