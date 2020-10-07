var app=angular.module("SimuladorVehiculos",[]);
app.controller("SimuladorController",function($scope){

    $scope.data = {
        ShowMonto72Meses:true,
        ShowMonto72MesesCuota:false,
        ShowMonto60Meses:true,
        ShowMonto60MesesCuota:false,
        ShowMonto48Meses:true,
        ShowMonto48MesesCuota:false,
        ShowMonto36Meses:true,
        ShowMonto36MesesCuota:false,
        ShowMonto24Meses:true,
        ShowMonto24MesesCuota:false,
        ShowImgCarro:true,
        ShowImgMoto:true,
        ShowTextoPorcentaje:false,
        ShowForm:true,
        ShowTerminos:false
    }

    $scope.MostrarCuota= function (id) {
        $scope.data.ShowMonto72Meses=true;
        $scope.data.ShowMonto72MesesCuota=false;
        $scope.data.ShowMonto60Meses=true;
        $scope.data.ShowMonto60MesesCuota=false;
        $scope.data.ShowMonto48Meses=true;
        $scope.data.ShowMonto48MesesCuota=false;
        $scope.data.ShowMonto36Meses=true;
        $scope.data.ShowMonto36MesesCuota=false;
        $scope.data.ShowMonto24Meses=true;
        $scope.data.ShowMonto24MesesCuota=false;

        switch (id){
            case 1:
                    $scope.data.ShowMonto72Meses=false;
                    $scope.data.ShowMonto72MesesCuota=true;                    
                    break;
            case 2:
                    $scope.data.ShowMonto60Meses=false;
                    $scope.data.ShowMonto60MesesCuota=true;                    
                    break;
            case 3:
                    $scope.data.ShowMonto48Meses=false;
                    $scope.data.ShowMonto48MesesCuota=true;                    
                    break;
            case 4:
                    $scope.data.ShowMonto36Meses=false;
                    $scope.data.ShowMonto36MesesCuota=true;                    
                    break;
            case 5:
                    $scope.data.ShowMonto24Meses=false;
                    $scope.data.ShowMonto24MesesCuota=true;                    
                    break;                                                                              
        }
 
        if ($scope.data.ShowImgCarro==false){
            $scope.data.ShowMonto72Meses=false;
            $scope.data.ShowMonto72MesesCuota=false; 
        }

    };


    $scope.CambiarVehiculo=function(){
        if ($scope.data.ShowImgCarro==true){
            $scope.data.ShowImgCarro=false;
            $scope.data.ShowImgMoto=true;
            $scope.data.ShowMonto72Meses=false;
            $scope.data.ShowMonto72MesesCuota=false;             
        }else{
            $scope.data.ShowImgCarro=true;
            $scope.data.ShowImgMoto=false;
            $scope.data.ShowMonto72Meses=true;
            $scope.data.ShowMonto72MesesCuota=false;     
        }
    };

   $scope.mostrarTerminos=function(){
        $scope.data.ShowForm=false;
        $scope.data.ShowTerminos=true;
    }

   $scope.ocultarTerminos=function(){
        $scope.data.ShowForm=true;
        $scope.data.ShowTerminos=false;
    }



});
    