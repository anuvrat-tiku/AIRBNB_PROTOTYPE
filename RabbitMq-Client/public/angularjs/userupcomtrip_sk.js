var app= angular.module('comingTrip_sk',[]);

app.controller('upcomtripctrl_sk', function ($scope,$http,$window) {
    // $scope.messages=null;
    // $scope.runn = false;
    // $scope.funn = true;
    $scope.funb = function(trip_id){
        // $scope.runn=true;
        // $scope.funn = false;
        console.log(trip_id);
        for(var i=0;i<$scope.messages.length;i++){
            if($scope.messages[i].Trip_id==trip_id) {
                $scope.messages[i].runn = true;
                $scope.messages[i].funn = false;
            }
        }

    }
    $scope.tunbb = function(trip_id){
        // $scope.runn=false;
        // $scope.funn = true;
        for(var i=0;i<$scope.messages.length;i++){
            if($scope.messages[i].Trip_id==trip_id) {
                $scope.messages[i].runn = false;
                $scope.messages[i].funn = true;
            }
        }
    }
    console.log("in message angular");
    $http.get('/getusercommingtrips').then( function (response) {
        console.log('response.data.length='+response.data.length);
        // $scope.messages= response.data;
        if(response.data.length==0){
            $scope.messages= 'no';
        }
        else{
            $scope.messages= response.data;
            for(var i=0;i<$scope.messages.length;i++){
                $scope.messages[i].runn=false;
                $scope.messages[i].funn=true;
                // $scope.checkin = $scope.messages[i].Checkin;
                // $scope.checkout = $scope.messages[i].Checkout;
            }

            console.log(response.data[0]);
        }

        console.log("messages="+$scope.messages[0]);
    });

    $scope.deny_sk= function (property_id,bill_id,Trip_id) {
        console.log(property_id + bill_id + Trip_id);
        $scope.property = property_id;
        $scope.bill = bill_id;
        $scope.trip = Trip_id;


        console.log($scope.property);
        console.log($scope.bill);
        console.log($scope.trip);


        var data = {
            "property": $scope.property,
            "bill": $scope.bill,
            "trip": $scope.trip
        }

        //console.log("Values to be passed are " + checkin + checkout + guests + property_id + $scope.proplace1 + $scope.hostid);

        $http({
            method: "POST",
            url: "/delTripsMessage",
            data: data
        }).success(function (response) {
            if (response.statusCode == 200) {
                console.log("Message Successfully deleted from user message db");
                window.location.assign("/user_futuretrips_sk");
            } else {
                console.log("Some issue in DB insert");
            }
        });

    }


$scope.edit_sk= function (Trip, Bill,checkin, checkout,property_id) {

    console.log(Trip + " " + Bill + " " + checkin + " "+ checkout + " "+property_id );

    //$scope.property = property_id;
    $scope.bill = Bill;
    $scope.trip = Trip;
    $scope.checkin = checkin;
    $scope.checkout = checkout;
    $scope.property_id = property_id;



    console.log($scope.bill);
    console.log($scope.trip);


    var data = {

        "bill": $scope.bill,
        "trip": $scope.trip,
        "checkin": $scope.checkin,
        "checkout":$scope.checkout,
        "property":property_id
    }

    //console.log("Values to be passed are " + checkin + checkout + guests + property_id + $scope.proplace1 + $scope.hostid);

    $http({
        method: "POST",
        url: "/editTripsMessage",
        data: data
    }).success(function (response) {
        if (response.statusCode == 200) {
            console.log("Message Successfully deleted from user message db");
            window.location.assign("/finalConfirmation");
        } else {
            console.log("Some issue in DB insert");
        }
    });

}


    //user_futuretrips_sk
});