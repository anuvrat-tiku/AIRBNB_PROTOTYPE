var app= angular.module('airbnbapp_ng',[]);

app.controller('homectrl_ng', function ($scope, $http) {
	console.log("in angular");
	
	$http.get("/propertylist")
    .then(function(response) {
    	$scope.listings= response.data;
    	console.log($scope.listings);
    	console.log("name="+$scope.listings[0].coverimgname);
    	if($scope.listings[0].message_num>0){
    		console.log("inside if");
    		document.getElementById("message_num").innerHTML=" ";
    	}

    });

    $scope.deletelisting_ng= function (listing){
    	console.log(listing);
    	var url_link= "/deleteproperty?property_id="+listing.property_id;
    	$http.get(url_link).then(function (response) {
    		$scope.listings= response.data;
    		console.log($scope.listings);
    	});
    }

});

app.controller('profilectrl_ng', function ($scope, $http) {
	
	console.log("in angular");
	$http.get('/loadprofile').then(function (response) {
		$scope.profiledata= response.data[0];
    	console.log($scope.profiledata);
	});

	$scope.updateprofile_ng= function(){
		console.log($scope.profiledata);
		var url_link= "/updatehostprofile?fname="+$scope.profiledata.fname+"&lname="+$scope.profiledata.lname+"&phone="+$scope.profiledata.phone+"&dob="+$scope.profiledata.dob+"&gender="+$scope.profiledata.gender+"&email="+$scope.profiledata.email;
		$http.get(url_link).then(function (response) {
    		$scope.listings= response.data;
    		console.log($scope.listings);
    	});

	}
});

app.controller('mediactrl_ng', function ($scope,$http) {
	console.log("in host media");
});

app.controller('messagectrl_ng', function ($scope,$http,$window) {
	$scope.messages=null;
	console.log("in message angular");
	$http.get('/gethostmessage').then( function (response) {
		
		$scope.messages= response.data;
		console.log("messages="+$scope.messages[0]);
	});

	$scope.deny_ng= function (message_id) {
		var url_link= "/sethostmessagedenied?message_id="+message_id;
		$http.get(url_link).then( function (response) {
		$window.location.reload();
	});
	}

	$scope.accept_ng= function (message_id) {
		var url_link= "/sethostmessageaccept?message_id="+message_id;
		$http.get(url_link).then( function (response) {
		$window.location.reload();
	});
	}


});

// app.controller('dashboardctrl_ng',function ($scope,$http,$window) {
// 	console.log("in dashboard angular");
// 	$http.get('/gethostdash').then( function (response) {
// 		console.log(response.data.property_result);
// 		$scope.properties= response.data.property_result;
//         var i=0;
//         for(property in $scope.properties){
//             console.log("property");
//             $window.data.labels[i]= property.placename;
//             $window.data.series[i]= property.visit_count;
//             i++;
//         }
// 		$scope.bids= response.data.bid_result;
// 		console.log(response.data.bid_result);
// 	});
// });

app.controller('hosttripctrl_ng', function ($scope,$http,$window) {
    $scope.messages=null;
    console.log("in message angular");
    $http.get('/gethosttrips').then( function (response) {
        console.log('response.data.length='+response.data.length);
        if(response.data.length==0){
            $scope.messages= 'no';
        }
        else{
            $scope.messages= response.data;
        }

        console.log("messages="+$scope.messages[0]);
    });

    $scope.review_ng= function (trip_id,user_id) {
        var url_link= "/host_rating_ng?trip_id="+trip_id+"&user_id="+user_id;
            $window.location.assign(url_link);
        
    }


});

app.controller('hostupcomtripctrl_ng', function ($scope,$http,$window) {
    // $scope.messages=null;
    // $scope.runn = false;
    // $scope.funn = true;
  
  
    console.log("in message angular");
    $http.get('/gethostcommingtrips').then( function (response) {
        console.log('response.data.length='+response.data.length);
        // $scope.messages= response.data;
        if(response.data.length==0){
            $scope.messages= 'no';
        }
        else{
            $scope.messages= response.data;
            console.log(response.data[0]);
        }

        console.log("messages="+$scope.messages[0]);
    });
});

app.controller('hostratingsctrl_ng',function($scope,$http) {

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
        console.log("iserid="+$scope.user_id);
        console.log("tripid="+$scope.trip_id);

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
                url: '/saveguestRating',
                data: {
                    "propertyFeedback": $scope.describeProperty,
                    "hostFeedback" : $scope.describeHost,
                    "cleanliness" : cleanliness,
                    "communication" : communication,
                    "houserules" : houserules,
                    "recommend" : reco,
                    "user_id": $scope.user_id,
                    "trip_id": $scope.trip_id

                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success rating save");
                    window.location.assign("/host_trips");
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

app.controller('hostforreviewsctrl_ng', function ($scope,$http,$window) {
    // $scope.messages=null;
    // $scope.runn = false;
    // $scope.funn = true;
  
  
    console.log("in host for angular");
    $http.get('/gethostreviewsforyou').then( function (response) {
        console.log('response.data.length='+response.data.length);
        // $scope.messages= response.data;
        if(response.data.length==0){
            $scope.reviews= 'no';
        }
        else{
            $scope.reviews= response.data;
            console.log("reviews="+$scope.reviews);
        }

        console.log("messages="+$scope.reviews[0]);
    });

});

app.controller('hostbyreviewsctrl_ng', function ($scope,$http,$window) {
   
    console.log("in host by angular");
    $http.get('/gethostreviewsbyyou').then( function (response) {
        console.log('response.data.length='+response.data.length);
        // $scope.messages= response.data;
        if(response.data.length==0){
            $scope.reviews= 'no';
        }
        else{
            console.log('')
            $scope.reviews= response.data;
            console.log("reviews="+response.data);
        }

        console.log("messages="+$scope.reviews[0]);
    });

});