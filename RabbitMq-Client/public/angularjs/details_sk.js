var app = angular.module("detailsk", []);

app.controller('detsk',function ($scope, $http) {



    $scope.Book = function(propertycode,checkin, checkout, guests) {
        console.log("I am booking");
        $scope.value = propertycode;
        $scope.checkin1 = checkin;
        $scope.checkout1 = checkout;
        $scope.guests1 = guests;
        console.log("date"+  $scope.value);
        console.log("date"+ $scope.checkin1);
        console.log("data" + $scope.checkout1);
        console.log("Guest" + $scope.guests1);
        $http({
            method: "POST",
            url: '/confirmbook_sk',
            data: {
                "propertyId": $scope.value,
                "checkin": $scope.checkin1,
                "checkout": $scope.checkout1,
                "guest":$scope.guests1,


            }
        }).success(function (data) {
            console.log(data.statuscode);
            if (data.statuscode == 200) {
                console.log("in angular homepage");
                //console.log(data.results.result);
                //newResult = data.results.result;
                window.location.assign("/confirmPage_sk");
            }
            else if (data.statuscode == 401) {
                console.log("in angular location does not exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }
});





