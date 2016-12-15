var app= angular.module('tripapp_sk',[]);

app.controller('tripctrl_sk', function ($scope,$http,$window) {
    $scope.messages=null;
    console.log("in message angular");
    $http.get('/getusertrips').then( function (response) {
        console.log('response.data.length='+response.data.length);
        if(response.data.length==0){
            $scope.messages= 'no';
        }
        else{
            $scope.messages= response.data;
            //Anvita changes Friday
            if(response.data[0].user_reviewed == 0){
                console.log("its 0 hence show button")
                $scope.reviewButton_ab = true;
            }else{
                console.log("dont show button")
            }

            //End
        }

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

    //Anvita Friday changes
    $scope.btn_reviewProperty_ab = function(propID, tripID){

        var propertyID_review_ab = propID;

        localStorage.setItem('propertyID_Review_ab',propID);
        localStorage.setItem('tripID_Review_ab',tripID);

        window.location.assign('/ratings')
    }

    // end


});

//Anvita Friday changes

app.controller('ratings_ab',function($scope,$http) {

    console.log("check here")

    console.log(localStorage.getItem('propertyID_Review_ab'));
    console.log(localStorage.getItem('tripID_Review_ab'));

    $scope.recommendYes = false;
    $scope.recommendNo = false;
    $scope.cleanlinessShow = false;
    $scope.communicationShow = false;
    $scope.houserulesShow = false;
    $scope.recoShow = false;

    var cleanliness = 0;
    var communication = 0;
    var reco = 0;
    var houserules = 0;

    $('#cleanliness-rating-value').on('rating.change', function() {
        cleanliness = $('#cleanliness-rating-value').val();
    });
    $('#communication-rating-value').on('rating.change', function() {
        communication = $('#communication-rating-value').val();
    });
    $('#houserules-rating-value').on('rating.change', function() {
        houserules = $('#houserules-rating-value').val();
    });

    $scope.btn_rate = function(req,res){

        if(reco == 2){
            console.log("do not recommended")
        }else if(reco == 1){
            console.log(" recommend")
        }else{
            console.log("not yet recommended")
        }

        var submit = 0;

        if(cleanliness == 0){
            submit = 1
            $scope.cleanlinessShow = true;
        }

        if(communication == 0){
            submit = 1
            $scope.communicationShow = true;
        }

        if(houserules == 0){
            submit = 1
            $scope.houserulesShow = true;
        }

        if(submit == 0){
            $http({
                method: "POST",
                url: '/savePropertyRating_ab',
                data: {
                    "propertyFeedback": $scope.describeProperty,
                    "hostFeedback" : $scope.describeHost,
                    "cleanliness" : cleanliness,
                    "communication" : communication,
                    "houserules" : houserules,
                    "recommend" : reco,
                    "propertyID" : localStorage.getItem('propertyID_Review_ab'),
                    "tripID" : localStorage.getItem('tripID_Review_ab')

                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success rating save");
                    window.location.assign("/pRatingSuccess");
                }
                else if (data.statuscode == 201) {
                    console.log("in angular Email exists");
                    $scope.emailexists = true;
                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });
        }else{
            console.log("complete mandatory fields")
        }

    }

    $scope.btn_rec_no = function(req,res){
        reco = 2;
        $scope.recommendYes = false;
        $scope.recommendNo = true;
    }

    $scope.btn_rec_yes = function(req,res){
        reco = 1;
        $scope.recommendYes = true;
        $scope.recommendNo = false;
    }

});

//End

