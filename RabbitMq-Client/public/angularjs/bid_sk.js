var app = angular.module("bidsk", []);

app.controller('bisk',function ($scope, $http) {




    $scope.BidP = function(propertyCode,checkin, guests, bidPrice,hostfname,hostlname,hostId,type,city,state,apt,zip,street,guest_place,place,checkout,country ) {


        console.log("I am SAHIL");
        $scope.value = propertyCode;
        $scope.guests = guests;
        $scope.checkin = checkin;
        //$scope.checkout = checkout;
        $scope.bidPrice = bidPrice;
        $scope.hostfname = hostfname;
        $scope.hostlname = hostlname;
        $scope.hostId = hostId;
        $scope.type = type;
        $scope.city = city;
        $scope.state = state;
        $scope.apt = apt;
        $scope.zip = zip;
        $scope.street = street;
        $scope.guest_place = guest_place;
        $scope.place = place;
        $scope.checkout = checkout;
        $scope.country = country;

        console.log("Chech" + $scope.checkin);
        // console.log($scope.checkout);
        console.log("Guest" + $scope.guests);
        console.log("Bid" + $scope.bidPrice);
        console.log("fname" + $scope.hostfname);
        console.log("lname" + $scope.hostlname );
        console.log("hostid" + $scope.hostId);
        console.log("hostid" + $scope.hostId);
        console.log("type" + $scope.type);
        console.log($scope.city);
        console.log($scope.state);
        console.log($scope.apt);
        console.log($scope.zip);
        console.log($scope.street);
        console.log($scope.guest_place);

        console.log($scope.place);
        console.log($scope.checkout);
        console.log($scope.country);


        $http({
            method: "POST",
            url: '/putbid_sk',
            data: {
                "propertyId": $scope.value,
                "checkin": $scope.checkin,
                "guests":$scope.guests,
                "bidPrice":$scope.bidPrice,
                "hostfname":$scope.hostfname,
                "hostlname":$scope.hostlname,
                "hostId": $scope.hostId,
                "type":type,
                "city":city,
                "state":state,
                "apt":apt,
                "zip":zip,
                "street":street,
                "guest_place":guest_place,
                "place":place,
                "checkout":checkout,
                "country": country
            }
        }).success(function (data) {
            console.log(data.statuscode);
            if (data.statuscode == 200) {
                console.log("in angular homepage");
                //console.log(data.results.result);
                //newResult = data.results.result;
                window.location.assign("/bidsucc_sk");
            }
            else if (data.statuscode == 401) {
                console.log("in angular location does not exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }
});





