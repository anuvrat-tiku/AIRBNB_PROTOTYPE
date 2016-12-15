var app = angular.module("bilsrch", []);

var bills = [];

app.controller('billSearch_sk',function($scope,$http) {

    console.log("in bill search angular")
    $scope.invalidDate = false;
    $scope.invalidMonth = false;
    $scope.invalidYear = false;

    $scope.searchCriteria = [
        {model : "Date", id : "Date"},
        {model : "Month", id : "Month"},
        {model : "Year", id : "Year"}
    ];

    $scope.search = "Date";

    //  $scope.displayTable = "false";

    $scope.btn_searchBills_ab = function(){

        var value = $scope.billSearch;
        var searchType = $scope.search;
        var proceed = 1;

        if(searchType == 'Date'){
            if(value < 1 || value > 32){
                $scope.invalidDate = true;
                $scope.invalidMonth = false;
                $scope.invalidYear = false;
                proceed = 0;
            }
        }

        if(searchType == 'Month'){
            if(value < 1 || value > 12){
                $scope.invalidMonth = true;
                $scope.invalidDate = false;
                $scope.invalidYear = false;
                proceed = 0;
            }
        }

        if(searchType == 'Year'){
            if(value < 2015 || value > 2016){
                $scope.invalidYear = true;
                $scope.invalidMonth = false;
                $scope.invalidDate = false;
                proceed = 0;
            }
        }

        if(proceed){

            $scope.invalidDate = false;
            $scope.invalidMonth = false;
            $scope.invalidYear = false;

            $http({
                method: "POST",
                url: '/searchBills_sk',
                data: {
                    "criteria" : searchType,
                    "value" : value
                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success search bill");
                    console.log(data)
                    console.log(data.billResults)

                    bills.push(data.billResults)

                    window.location.assign("/bills_Page_sk");
                }
                else if (data.statuscode == 201) {
                    console.log("in angular Email exists");

                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });


        }
    }



});

app.controller('bills_sk',function($scope,$http) {

    $scope.btn_openBill = function(data){

        console.log("open bill for "+data)

        $http({
            method: "POST",
            url: '/openBill_sk',
            data: {
                "bill_id" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                console.log("in angular success bill open");
                window.location.assign("/billDetails_sk");
            }
            else if (data.statuscode == 201) {
                console.log("in angular Email exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });


    }

});