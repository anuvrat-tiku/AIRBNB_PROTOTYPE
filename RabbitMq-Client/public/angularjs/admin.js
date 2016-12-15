var admin = angular.module('admin',[]);

console.log("I am in angular");

admin.controller('admin',function($scope,$http) {

    $scope.viewHost = function(data){
        $http({
            method: "POST",
            url: '/fetchHost_ab',
            data: {
                "hostid" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                console.log("in angular success rating save");
                window.location.assign("/displayHostDetails_ab");
            }
            else if (data.statuscode == 201) {
                console.log("in angular Email exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }

    $scope.btn_openUser = function(data){
        $http({
            method: "POST",
            url: '/fetchUser_ab',
            data: {
                "userid" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                console.log("in angular success fetch user");
                window.location.assign("/viewUserDetails_ab");
            }
            else if (data.statuscode == 201) {
                console.log("in angular Email exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });

    }

    var cities_ang_ab = [];

    $scope.btn_filter_ab = function(data) {

        cities_ang_ab.push(data)

    }

    $scope.btn_appplyFilter_ab = function(){

        $http({
            method: "POST",
            url: '/filterHostCity_ab',
            data: {
                "cities" : cities_ang_ab
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                console.log("in angular success filter");
                   window.location.assign("/search_Hosts_ab");
            }
            else if (data.statuscode == 201) {
                console.log("in angular Email exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });

    }

    $scope.invalidadmin = false;

    $scope.btn_adminLogin = function(req,res){

        var proceed = 1;

        if($scope.username != 'admin' || $scope.password != 'admin'){
            proceed = 0;
        }

        if(proceed){
            $scope.invalidadmin = false;

            window.location.assign("/success_Admin_ab");

        }else{
            $scope.invalidadmin = true
        }


    }

});

var bills = [];

admin.controller('billSearch_ab',function($scope,$http) {

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
                url: '/searchBills_ab',
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

                   window.location.assign("/bills_Page_ab");
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

admin.controller('bills_ab',function($scope,$http) {

    $scope.btn_openBill = function(data){

        console.log("open bill for "+data)

        $http({
            method: "POST",
            url: '/openBill_ab',
            data: {
                "bill_id" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                console.log("in angular success bill open");
                window.location.assign("/billDetails_ab");
            }
            else if (data.statuscode == 201) {
                console.log("in angular Email exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });


    }

});


admin.controller('inactiveUsers_ab',function($scope,$http) {

    $scope.declinedDone = false;
    $scope.acceptedDone = false;

    $scope.btn_acceptHost_ab = function(data){
        $http({
            method: "POST",
            url: '/acceptHost_ab',
            data: {
                "hostid" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                $scope.declinedDone = false;
                $scope.acceptedDone = true;
                window.location.assign('/checkInactiveHosts_ab')
            }
            else if (data.statuscode == 201) {
                console.log("in angular failure accept");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }

    $scope.btn_declineHost_ab = function(data){
        $http({
            method: "POST",
            url: '/declineHost_ab',
            data: {
                "hostid" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                $scope.declinedDone = true;
                $scope.acceptedDone = false;
                window.location.assign('/checkInactiveHosts_ab')
            }
            else if (data.statuscode == 201) {
                console.log("in angular Email exists");

            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }

});


admin.controller('biddingAnalytics',function($scope,$http) {


    $scope.bidProperties = null;

    $scope.btn_getBidAnalytics_ab = function(req,res){

        console.log("button pressed")
        $http({
            method: "POST",
            url: '/get_BiddingProperties_ab'
        }).success(function (data) {
            if (data.statuscode == 200) {
                $scope.bidProperties = data.properties;
            }
        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }

    $scope.btn_getBidDetails_ab = function(data){

        $http({
            method: "POST",
            url: '/get_BiddingAnalytics_ab',
            data: {
                "propertyID" : data
            }
        }).success(function (data) {
            if (data.statuscode == 200) {
                window.location.assign('/BidGraph_ab')
            }

        }).error(function (error) {
            console.log("In angular - error to process request");
        });
    }


});