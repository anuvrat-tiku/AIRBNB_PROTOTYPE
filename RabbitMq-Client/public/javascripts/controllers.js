 var app = angular.module("signin", []);
    app.controller('loginCtrl', function ($scope, $http) {
    console.log("SAHIL");
        $scope.submit = function () {
       
            $http({
                method: "POST",
                url: '/checksignin',
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            }).success(function (res) {
                if (res.check === true) {
                   // window.location = '/page';
                   console.log("SAHIL");
                }
            }).error(function (err) {
              console.log("not found");
            });
        };
    });