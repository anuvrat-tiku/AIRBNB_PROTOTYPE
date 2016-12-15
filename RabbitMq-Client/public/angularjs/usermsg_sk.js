var app= angular.module('airbnbapp_sk',[]);

app.controller('messagectrl_sk', function ($scope,$http,$window) {
    $scope.messages=null;
    console.log("in message angular");
    $http.get('/getusermessage').then( function (response) {

        $scope.messages= response.data;
        console.log("messages="+$scope.messages[0]);
    });

    $scope.deny_ng= function (message_id) {
        var url_link= "/setusermessagedenied?message_id="+message_id;
        $http.get(url_link).then( function (response) {
            $window.location.reload();
        });
    }

    $scope.accept_ng= function (message_id) {
        var url_link= "/setusermessageaccept?message_id="+message_id;
        $http.get(url_link).then( function (response) {
            $window.location.reload();
        });
    }


});

