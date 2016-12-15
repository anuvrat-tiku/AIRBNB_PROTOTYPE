var app = angular.module("propertysk", []);

app.controller('propsk',function ($scope, $http) {


    $scope.btn_find = function () {

        console.log($scope.checkin2);
        console.log($scope.checkout2);
        console.log($scope.guest2);
        console.log($scope.check);
        console.log($scope.check1);
        console.log($scope.check2);
        console.log($scope.Search);

        $scope.invalidcheckout = false;
        $scope.invalidcheckin = false;
        $scope.noPropertyExists = false;
        $scope.checkinGreater = false;
        $scope.checkinCannotBeSame = false;
        $scope.checkinGreaterThanToday = false;

        var proceed = 1;
        var checkin = $scope.checkin2;
        var checkout = $scope.checkout2;
        var reg = /^(2016|2017)(-)(0[1-9]|1[012])(-)(0[1-9]|[12][0-9]|3[01])$/;
        var output = checkin.match(reg);
        var output1 = checkout.match(reg);

        if(output == null){
            //$scope.invalidcheckout = false;
            $scope.invalidcheckin = true;
            proceed = 0
        }

        if(output1 == null){
            $scope.invalidcheckout = true;
            //    $scope.invalidcheckin = false;
            proceed = 0
        }

        if(output != null && output1 != null){
            var checkin_date = new Date(checkin)
            var checkout_date = new Date(checkout)

            var difference = checkin_date - checkout_date;
            console.log("difference is ")
            console.log(difference)

            if(checkin_date < new Date()){
                $scope.checkinGreaterThanToday = true;
                proceed = 0;
            }

            if(difference > 0){
                $scope.checkinGreater = true
                proceed = 0;
            }else if(difference == 0){
                console.log("same dates")
                $scope.checkinCannotBeSame = true;
                proceed = 0;
            }else{
                console.log("checking")
            }
         }


        if (proceed){

            $http({
                method: "POST",
                url: '/checknewproperty_sk',
                data: {
                    "destination": $scope.Search,
                    "checkin": $scope.checkin2,
                    "checkout": $scope.checkout2,
                    "guest": $scope.guest2,
                    "room1": $scope.check,
                    "room2": $scope.check1,
                    "room3": $scope.check2

                }
            }).success(function (data) {
                console.log(data.statuscode);
                if (data.statuscode == 200) {
                    console.log("in angular homepage");
                    //console.log(data.results.result);
                    //newResult = data.results.result;
                    window.location.assign("/homepage_sk");
                }
                else if (data.statuscode == 401) {
                    console.log("in angular location does not exists");
                       //anvita change
                    $scope.noPropertyExists=true;
                    //anvita change end
                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });
    }


    }

    //
    $scope.bidDetail = function(propertycode) {
        console.log("I am bidding");
        $scope.value = propertycode;
        console.log($scope.Search);
        console.log($scope.checkin2);
        console.log($scope.checkout2);
        $http({
            method: "POST",
            url: '/bidDesc_sk',
            data: {
                "propertyId": $scope.value,
                "checkin": $scope.checkin2,
                "checkout": $scope.checkout2,
                "guest":$scope.guest2,
                "destination": $scope.Search

            }
        }).success(function (data) {
            console.log(data.statuscode);
            if (data.statuscode == 200) {
                console.log("in angular homepage");
                //console.log(data.results.result);
                //newResult = data.results.result;
                window.location.assign("/biddetail_sk");
            }
            else if (data.statuscode == 401) {
                console.log("in angular location does not exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }
    //


    $scope.showDetail = function(propertycode) {
        console.log("I am SAHIL");
        $scope.value = propertycode;
        console.log($scope.value);
        console.log($scope.Search);
        console.log($scope.checkin2);
        console.log($scope.checkout2);
        $http({
            method: "POST",
            url: '/propertydesc_sk',
            data: {
                "propertyId": $scope.value,
                "checkin": $scope.checkin2,
                "checkout": $scope.checkout2,
                "guest":$scope.guest2,
                "destination": $scope.Search

            }
        }).success(function (data) {
            console.log(data.statuscode);
            if (data.statuscode == 200) {
                console.log("in angular homepage");
                //console.log(data.results.result);
                //newResult = data.results.result;
                window.location.assign("/propdetail_sk");
            }
            else if (data.statuscode == 401) {
                console.log("in angular location does not exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }
});





