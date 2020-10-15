var app = angular.module("Libranza", []);
app.controller('LibranzaController', ['$scope', function ($scope) {

    $scope.data = {
        ShowMonto108Meses:true,
        ShowMonto108MesesCuota:false,
        ShowMonto96Meses:true,
        ShowMonto96MesesCuota:false,
        ShowMonto84Meses:true,
        ShowMonto84MesesCuota:false,
        ShowMonto72Meses:true,
        ShowMonto72MesesCuota:false,
        ShowMonto60Meses:true,
        ShowMonto60MesesCuota:false,        
        ShowTextoPorcentaje:false,
        ShowImgDefault:true,
        ShowImgSectorPublico:false,
        ShowImgDocente:false,
        ShowImgFuerzas:false,
        ShowImgPensionado:false,
        singleSelect: "0",
        ShowCuota:false,
        ShowMonto:true,
        ShowForm:true,
        ShowAviso:false
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
        $scope.data.ShowImgDefault=false;
        $scope.data.ShowImgSectorPublico=false;
        $scope.data.ShowImgDocente=false;
        $scope.data.ShowImgFuerzas=false;
        $scope.data.ShowImgPensionado=false;

        switch($scope.data.singleSelect){
            case "0":
                    $scope.data.ShowImgDefault=true;
                    break;
            case "1":
                    $scope.data.ShowImgSectorPublico=true;
                    break;
            case "2":
                    $scope.data.ShowImgDocente=true;
                    break;
            case "3":
                    $scope.data.ShowImgFuerzas=true;
                    break;
            case "4":
                    $scope.data.ShowImgPensionado=true;
                    break;                                                                                
        }


    };

    $scope.MostrarCuota= function (id) {

        $scope.data.ShowMonto108Meses=true;
        $scope.data.ShowMonto108MesesCuota=false;
        $scope.data.ShowMonto96Meses=true;
        $scope.data.ShowMonto96MesesCuota=false;
        $scope.data.ShowMonto84Meses=true;
        $scope.data.ShowMonto84MesesCuota=false;
        $scope.data.ShowMonto72Meses=true;
        $scope.data.ShowMonto72MesesCuota=false;
        $scope.data.ShowMonto60Meses=true;
        $scope.data.ShowMonto60MesesCuota=false;        

        switch (id){

            case 1:
                    $scope.data.ShowMonto108Meses=false;
                    $scope.data.ShowMonto108MesesCuota=true;                    
                    break;
            case 2:
                    $scope.data.ShowMonto96Meses=false;
                    $scope.data.ShowMonto96MesesCuota=true;                    
                    break;
            case 3:
                    $scope.data.ShowMonto84Meses=false;
                    $scope.data.ShowMonto84MesesCuota=true;                    
                    break;
            case 4:
                    $scope.data.ShowMonto72Meses=false;
                    $scope.data.ShowMonto72MesesCuota=true;                    
                    break;  

            case 5:
                    $scope.data.ShowMonto60Meses=false;
                    $scope.data.ShowMonto60MesesCuota=true;                    
                    break;                                                                                                 
        }
 

    };


    $scope.mostrarTerminos = function () {
        $scope.data.ShowForm = false;
        $scope.data.ShowTerminos = true;
    }

    $scope.ocultarTerminos = function () {
        $scope.data.ShowForm = true;
        $scope.data.ShowTerminos = false;
    }







}]);
    