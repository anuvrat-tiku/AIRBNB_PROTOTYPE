var index = angular.module('index',[]);

console.log("I am in angular");

index.controller('index',function($scope,$http) {

    $scope.guests = {
        options:[
            {id: '1', name: '1'},
            {id: '2', name: '2'},
            {id: '3', name: '3'},
            {id: '4', name: '4'},
            {id: '5', name: '5'}

        ],
        selectedCount:{id: '1', name: '1'}
    };

    $scope.month = {
        options:[
            {id: '1', name: 'January'},
            {id: '2', name: 'Febuary'},
            {id: '3', name: 'March'},
            {id: '4', name: 'April'},
            {id: '5', name: 'May'},
            {id: '6', name: 'June'},
            {id: '7', name: 'July'},
            {id: '8', name: 'August'},
            {id: '9', name: 'September'},
            {id: '10', name: 'October'},
            {id: '11', name: 'November'},
            {id: '12', name: 'December'}
        ],
        selectedMonth:{id: '0', name: 'Month'}
    };


    $scope.day = {
        options:[
            {id: '1', name: '1'},
            {id: '2', name: '2'},
            {id: '3', name: '3'},
            {id: '4', name: '4'},
            {id: '5', name: '5'},
            {id: '6', name: '6'},
            {id: '7', name: '7'},
            {id: '8', name: '8'},
            {id: '9', name: '9'},
            {id: '10', name: '10'},
            {id: '11', name: '11'},
            {id: '12', name: '12'},
            {id: '13', name: '13'},
            {id: '14', name: '14'},
            {id: '15', name: '15'},
            {id: '16', name: '16'},
            {id: '17', name: '17'},
            {id: '18', name: '18'},
            {id: '19', name: '19'},
            {id: '20', name: '20'},
            {id: '21', name: '21'},
            {id: '22', name: '22'},
            {id: '23', name: '23'},
            {id: '24', name: '24'},
            {id: '25', name: '25'},
            {id: '26', name: '26'},
            {id: '27', name: '27'},
            {id: '28', name: '28'},
            {id: '29', name: '29'},
            {id: '30', name: '30'},
            {id: '31', name: '31'}
        ],
        selectedDay:{id: '0', name: 'Day'}
    };


    $scope.year = {
        options:[
            {id: '1998', name: '1998'},
            {id: '1997', name: '1997'},
            {id: '1996', name: '1996'},
            {id: '1995', name: '1995'},
            {id: '1994', name: '1994'}
        ],
        selectedYear:{id: '0', name: 'Year'}
    };

    $scope.firstnamerequired = false;
    $scope.lastnamerequired = false;
    $scope.emailrequired = false;
    $scope.dobrequired = false;
    $scope.passwordrequired = false;
    $scope.emailexists = false;
    $scope.incorrectFormat = false;

    $scope.btn_signup=function() {
        console.log("just to check in sign up");

        var proceed = 1;

        if($scope.firstname == null)
        {
            $scope.firstnamerequired = true;
            proceed = 0;
        }else{
            $scope.firstnamerequired = false;
        }

        if($scope.lastname == null)
        {
            $scope.lastnamerequired = true;
            proceed = 0;
        }else{
            $scope.lastnamerequired = false;
        }

        if($scope.password == null)
        {
            $scope.passwordrequired = true;
            proceed = 0;
            console.log("in if")
        }else{
            var output = $scope.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
            if(output == null){
                $scope.passwordrequired = true;
                $scope.incorrectFormat = true;
                proceed = 0;
            }else{
                $scope.passwordrequired = false;
                $scope.incorrectFormat = false;
                proceed = 1;
            }
        }

        if($scope.email == null)
        {
            $scope.emailrequired = true;
            proceed = 0;
        }else{
            $scope.emailrequired = false;
        }

        if(proceed){

            $http({
                method: "POST",
                url: '/signup',
                data: {
                    "firstname": $scope.firstname,
                    "lastname": $scope.lastname,
                    "email": $scope.email,
                    "password": $scope.password,
                    "month": $scope.month.selectedMonth.id,
                    "day": $scope.day.selectedDay.id,
                    "year": $scope.year.selectedYear.id
                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success sign up");
                    window.location.assign("/signupsuccess");
                }
                else if (data.statuscode == 201) {
                    console.log("in angular Email exists");
                    $scope.emailexists = true;
                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });

        }

    }


   $scope.btn_search=function() {
        // localStorage.setItem('date' , $scope.destination);
        console.log("clicked search")

        $scope.invalidcheckout = false;
        $scope.invalidcheckin = false;
        $scope.noPropertyExists = false;
        $scope.checkinGreater = false;
        $scope.checkinCannotBeSame = false;
        $scope.checkinGreaterThanToday = false;

        var proceed = 1;

        localStorage.setItem('destination',$scope.destination);
        localStorage.setItem('checkin',$scope.checkin);
        localStorage.setItem('checkout',$scope.checkout);
        localStorage.setItem('guests',$scope.guests.selectedCount.id);
        console.log(localStorage.getItem('destination'));
        console.log(localStorage.getItem('checkin'));
        console.log(localStorage.getItem('checkout'));
        console.log(localStorage.getItem('guests'));

        var checkin = $scope.checkin;
        var checkout = $scope.checkout;
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

        if(proceed){
            $http({
                method: "POST",
                url: '/checkproperty_sk',
                data: {
                    "destination": $scope.destination,
                    "checkin": $scope.checkin,
                    "checkout": $scope.checkout,
                    "guest": $scope.guests.selectedCount.id

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
                    $scope.noPropertyExists = true;

                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });
        }
    }


    $scope.btn_signin=function() {
        $scope.emailrequired = false;
        $scope.passwordrequired = false;
        $scope.invalidpassword = false;

        if ($scope.emailSignin == null && $scope.passwordSignin == null) {
            $scope.emailrequired = true;
            $scope.passwordrequired = true;

        }else if($scope.emailSignin == null && $scope.passwordSignin != null) {
            $scope.emailrequired = true;
            $scope.passwordrequired = false;
        }else if($scope.emailSignin != null && $scope.passwordSignin == null) {
            $scope.emailrequired = false;
            $scope.passwordrequired = true;
        }else{

            $http({
                method: "POST",
                url: '/signin_ab',
                data: {
                    "email": $scope.emailSignin,
                    "password": $scope.passwordSignin
                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success signin");
                    window.location.assign("/homepage");
                }
                else if (data.statuscode == 201) {
                    console.log("in angular invalid login");
                    $scope.invalidpassword = true;
                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });

        }
    }

/**
    $scope.btn_check=function() {

        console.log("in check")
        console.log(localStorage.getItem('destination'));
        console.log(localStorage.getItem('checkin'));
        console.log(localStorage.getItem('checkout'));
        console.log(localStorage.getItem('guests'));

    }

 **/
});


index.controller('editProfile_ab',function($scope,$http) {

    $scope.updateSucces = false;
    $scope.phoneSaved = false;
    $scope.invalidNumber = false;
    $scope.nameblank = false;
    $scope.invalidZipcode = false;
    $scope.updateError = false;
    $scope.invalidDOB = false;

    $scope.btn_savePhone_ab=function() {

        var phone = $scope.phone;
        var reg = /^\d{10}$/;
        var output = phone.match(reg);
        if(output == null){
            $scope.invalidNumber = true;
            $scope.phoneSaved = false;
        }else{
            $http({
                method: "POST",
                url: '/savePhone_ab',
                data: {
                    "phone": $scope.phone
                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success phone save");
                    $scope.phoneSaved = true;
                    $scope.invalidNumber = false;
                }
                else if (data.statuscode == 201) {
                    console.log("in angular invalid phone save");

                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });
        }

    }

    $scope.btn_saveProfile_ab=function(data) {

        console.log("reached here - sav profile - angular")

        var throw_error = 0

        var proceed = 1;

        if($scope.firstname.length < 1 || $scope.lastname.length < 1 || $scope.email.length < 1){
            $scope.nameblank = true;
        }else {

            if ($scope.phone != null) {
                var phone = $scope.phone;
                var regPhone = /^\d{10}$/;
                var outputPhone = phone.match(regPhone);

                if (outputPhone != null) {
                    $scope.invalidNumber = false;

                    proceed = 1;
                }else{
                    $scope.invalidNumber = true;
                    proceed = 0;
                }
            }

            if ($scope.zipcode != null) {
                var zipcode = $scope.zipcode;
                var reg = /^\d{5}$/;
                var reg1 = /^([0-9]{5}-){1}[0-9]{4}$/
                var output = zipcode.match(reg);
                var output1 = zipcode.match(reg1);

                if (output != null || output1 != null) {
                    $scope.invalidZipcode = false;

                    proceed = 1;
                }else{
                    $scope.invalidZipcode = true;
                    proceed = 0;
                }
            }

            if($scope.dob != null){

                var dob = $scope.dob;
                var month = ""+dob[0]+dob[1];
                var date = ""+dob[3]+dob[4];
                var year = ""+dob[6]+dob[7]+dob[8]+dob[9];


                if(Number(date) > 31 || Number(date) < 1){
                    console.log("invalid date")
                    proceed = 0
                }
                if(Number(month) > 12 || Number(month) < 1){
                    $scope.invalidDOB = true;
                    proceed = 0

                }
                if(Number(year) > 2016 || Number(year) < 1900){
                    $scope.invalidDOB = true;
                    proceed = 0
                }

            }

            if(proceed){

            $scope.nameblank = false

            $http({
                method: "POST",
                url: '/saveProfile_ab',
                data: {
                    "firstname": $scope.firstname,
                    "lastname": $scope.lastname,
                    "email": $scope.email,
                    "gender": $scope.gender,
                    "dob": $scope.dob,
                    "address": $scope.address,
                    "city": $scope.city,
                    "state": $scope.state,
                    "zipcode": $scope.zipcode,
                    "description" : $scope.description,
                    "phone" : $scope.phone
                }
            }).success(function (data) {
                if (data.statuscode == 200) {
                    console.log("in angular success save profile");

                    $scope.updateSucces = true;
                }
                else if (data.statuscode == 201) {
                    console.log("in angular failure to save");
                    //         $scope.invalidpassword = true;
                }else if(data.statuscode == 300){
                    console.log("in angular nothing to save");
                    $scope.updateError = true;
                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });

        }
        }
    }

});

index.controller('editProfilePhoto_ab',function($scope,$http) {

});

index.controller('changePassword_ab',function($scope,$http) {

    $scope.oldpasswordIncorrect = false;
    $scope.notmatch = false;
    $scope.required = false;
    $scope.bothsame = false;

    $scope.btn_resetPassword_ab = function() {

        console.log("clicked reset")

        var proceed = 1;

        console.log($scope.oldpassword)
        console.log($scope.password)
        console.log($scope.newpassword1)

        if($scope.oldpassword==null || $scope.password==null || $scope.newpassword1==null ){
            console.log("here")
            $scope.required = true;
            proceed = 0;
        }else{
            $scope.required = false;
        }

        if($scope.password != $scope.newpassword1){
            $scope.notmatch = true;
            proceed = 0;
        }else{
            $scope.notmatch = false;
        }

        if($scope.oldpassword == $scope.password){
            console.log("both same")
            $scope.bothsame = true;
            proceed = 0;

            console.log("proceed is "+proceed)
        }else{
            $scope.bothsame = false;
        }

        var output = $scope.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
        if(output == null){
            $scope.incorrectFormat = true;
            proceed = 0;
        }else{
            $scope.incorrectFormat = false;
         //   proceed = 1;
        }

        console.log("proceed is "+proceed)

        if(proceed){
console.log("proceeded")
            $scope.incorrectFormat = false;
            $scope.notmatch = false;
            $scope.required = false;
            $scope.bothsame = false;

            $http({
                method: "POST",
                url: '/updatePassword_ab',
                data: {
                    "oldpassword" : $scope.oldpassword,
                    "newpassword" : $scope.password
                }
            }).success(function (data) {
                if(data.statuscode == 200){
                    console.log("in angular success save new password");
                    window.location.assign("/userPasswordChangeSuccess_ab");

                }else if (data.statuscode == 201) {
                    console.log("in angular failure to save new password");
                    //         $scope.invalidpassword = true;
                }else if(data.statuscode == 300){
                    console.log("in angular nothing to save");
                    $scope.oldpasswordIncorrect = true;
                }
            }).error(function (error) {
                console.log("In angular - error to process request");
            });


        }else{
            console.log("proceeded not")
        }

    };

});

