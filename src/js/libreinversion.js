var app=angular.module("SimuladorVehiculos",[]);
app.controller("SimuladorController",function($scope){

    $scope.data = {
        ShowMonto60Meses:true,
        ShowMonto60MesesCuota:false,
        ShowMonto48Meses:true,
        ShowMonto48MesesCuota:false,
        ShowMonto36Meses:true,
        ShowMonto36MesesCuota:false,
        ShowMonto24Meses:true,
        ShowMonto24MesesCuota:false,
        ShowMonto12Meses:true,
        ShowMonto12MesesCuota:false,        
        ShowImgCarro:true,
        ShowImgMoto:true,
        ShowTextoPorcentaje:false,
        ShowForm:true,
        ShowTerminos:false
    }

    $scope.MostrarCuota= function (id) {

        $scope.data.ShowMonto60Meses=true;
        $scope.data.ShowMonto60MesesCuota=false;
        $scope.data.ShowMonto48Meses=true;
        $scope.data.ShowMonto48MesesCuota=false;
        $scope.data.ShowMonto36Meses=true;
        $scope.data.ShowMonto36MesesCuota=false;
        $scope.data.ShowMonto24Meses=true;
        $scope.data.ShowMonto24MesesCuota=false;
        $scope.data.ShowMonto12Meses=true;
        $scope.data.ShowMonto12MesesCuota=false;        

        switch (id){

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

            case 6:
                    $scope.data.ShowMonto12Meses=false;
                    $scope.data.ShowMonto12MesesCuota=true;                    
                    break;                                                                                                 
        }
 

    };










});
    