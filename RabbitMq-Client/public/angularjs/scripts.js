var x = angular.module('confirmBooking', []);

x.controller('divController', function ($scope, $http) {
    $scope.fff = false;
    $scope.aaa = false;

    $scope.trip = true;
    $scope.payment = false;


    $scope.showPaymentDiv = function() {
        $scope.trip = false;
        $scope.payment = true;
    };

    $scope.editTrip = function() {
        $scope.trip = true;
        $scope.payment = false;
    };

    $scope.toHost = function (checkin, checkout, guests, property_id) {
        $scope.checkin = checkin;
        $scope.checkout = checkout;
        $scope.guests = guests;
        $scope.property_id = property_id;
        //$scope.placename = proplace1;
       // $scope.hostid = hostid;

        console.log($scope.proplace1);
        console.log($scope.hostid);
        console.log($scope.prop_price);
        console.log($scope.prop_place);
        console.log($scope.prop_city);
        console.log($scope.prop_apt);
        console.log($scope.prop_zip);
        console.log($scope.prop_country);
        console.log($scope.prop_street);




        var data = {
            "checkin" : $scope.checkin,
            "checkout" : $scope.checkout,
            "guests" : $scope.guests,
            "property_id" : $scope.property_id,
            "proplace": $scope.proplace1,
            "hostid": $scope.hostid,
            "prop_price" : $scope.prop_price,
            "prop_place": $scope.prop_place,
            "prop_city":$scope.prop_city,
            "prop_apt":$scope.prop_apt,
            "prop_zip" :$scope.prop_zip,
            "prop_country": $scope.prop_country,
            "prop_street":$scope.prop_street,
            "prop_state":$scope.prop_state,
            "prop_type":$scope.prop_type,
            "prop_qty":$scope.prop_qty




        }

        console.log("Values to be passed are "+checkin+checkout+guests+property_id+$scope.proplace1+$scope.hostid);

        $http({
            method : "POST",
            url : "/addNewHostMessage",
            data : data
        }).success(function (response) {
            if (response.statusCode == 200) {
                console.log("Message Successfully inserted into host message db");
                window.location.assign("/finalConfirmation");
            } else {
                console.log("Some issue in DB insert");
            }
        });
    }
});
