
var mq_client = require('../rpc/client');
var ejs = require('ejs');
var winston=require('winston');

exports.getHomepage = function(req, res){

    if(req.session.user_ab) {

        ejs.renderFile('./views/userIndex_ab.ejs', {title: 'Welcome to Airbnb'}, function (err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });
    }else{
        res.redirect('/')
    }
}
exports.signUpSuccess = function(req, res){
    console.log("in sign up success")

    if(req.session.userid_ab) {

        ejs.renderFile('./views/userIndex_ab.ejs', {title: 'Welcome to Airbnb'}, function (err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });
    }else{
        res.redirect('/')
    }
}


exports.savePhone_ab = function(req,res){
     winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on update button to update phone number');

    if(req.session.user_ab){

    var phone = req.param('phone')

    var msg_payload = {"userid": req.session.userid_ab, "phone": phone};
    console.log("In POST Request = userid"+ req.session.userid_ab + "phone "+phone);

    mq_client.make_request('updatePhone_queue_ab', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                res.send({"statuscode":200});

            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });

    }else{
        res.redirect('/')
    }

}

exports.changePassword_ab = function(req,res){
winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on change password');
    if(req.session.user_ab){
        ejs.renderFile('./views/changePassword_ab.ejs', { title: 'Welcome to Airbnb', user: req.session.user_ab } , function(err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });

    }else{
        res.redirect('/')
    }
}

exports.editProfile_ab = function(req, res) {
    winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on edit profile');

    if(req.session.user_ab){

    var msg_payload = {"userid": req.session.userid_ab};
    console.log("In POST Request = userid" + req.session.userid_ab);

    mq_client.make_request('checkProfile_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                ejs.renderFile('./views/editProfile_ab.ejs', {
                    title: 'Profile - Airbnb',
                    user: results.user
                }, function (err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });

            } else if (results.code == 201) {
                console.log("user details not found")
                res.redirect('/');

            }

        }
    });
    }else
    {
        res.redirect('/')
    }
}

exports.upload_file_ab = function(req,res){
    winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on upload file');


    var image = req.app.get('imageid');
    var file = req.app.get('file');

    req.session.user_ab.image = image;

    var msg_payload = {"imageid": image, "file": file, "userid":req.session.userid_ab};

    mq_client.make_request('profileImage_Update_queue_ab', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                res.redirect('/profilePhoto_ab');
            }
            else if (results.code == 201) {

                console.log("in update failure")
            }
        }
    });
}

exports.editPhotoPage_ab = function(req,res){
    winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on edit photo');


    if(req.session.user_ab){

        console.log("photo page")
        console.log(req.session.userid_ab)
        ejs.renderFile('./views/profilePhoto_ab.ejs', { title: 'Welcome to Airbnb', user: req.session.user_ab } , function(err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });

    }else{
        res.redirect('/');
    }
}

exports.saveProfile_ab = function(req, res){
    winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on save profile');

    if(req.session.userid_ab) {

        var firstname_ep = req.param('firstname')
        var lastname_ep = req.param('lastname')
        var email_ep = req.param('email')
        var gender_ep = req.param('gender')
        var dob_ep = req.param('dob')
        var address_ep = req.param('address')
        var city_ep = req.param('city')
        var state_ep = req.param('state')
        var zipcode_ep = req.param('zipcode')
        var description_ep = req.param('description')
        var phone_ep = req.param('phone')

        var change = 0;

        var updateUser = "Update users set ";


        if (req.session.user_ab.firstname != firstname_ep) {
            change = 1;
            updateUser = updateUser + "firstname='" + firstname_ep + "', "
            updateUser = updateUser + "firstname='" + firstname_ep + "', "
        }
        if (req.session.user_ab.lastname != lastname_ep) {
            change = 1;
            updateUser = updateUser + "lastname='" + lastname_ep + "', "
        }
        if (req.session.user_ab.email != email_ep) {
            change = 1;
            updateUser = updateUser + "email='" + email_ep + "', "
        }
        if (req.session.user_ab.gender != gender_ep) {
            change = 1;
            updateUser = updateUser + "gender='" + gender_ep + "', "
        }
        if (req.session.user_ab.dob != dob_ep) {
            change = 1;
            updateUser = updateUser + "dob='" + dob_ep + "', "
        }
        if (req.session.user_ab.address != address_ep) {
            change = 1;
            updateUser = updateUser + "address='" + address_ep + "', "
        }
        if (req.session.user_ab.city != city_ep) {
            change = 1;
            updateUser = updateUser + "city='" + city_ep + "', "
        }
        if (req.session.user_ab.state != state_ep) {
            change = 1;
            updateUser = updateUser + "state='" + state_ep + "', "
        }
        if (req.session.user_ab.zipcode != zipcode_ep) {
            change = 1;
            updateUser = updateUser + "zipcode='" + zipcode_ep + "', "
        }
        if (req.session.user_ab.description != description_ep) {
            change = 1;
            updateUser = updateUser + "description='" + description_ep + "', "
        }
        if (req.session.user_ab.phone != phone_ep) {
            change = 1;
            updateUser = updateUser + "phone='" + phone_ep + "', "
        }

        console.log("update user")
        console.log(updateUser)

        var len = updateUser.length;

        var updateQuery;

        if (change == 1 || len > 17) {
            updateQuery = updateUser.substring(0, len - 2);
        }

        console.log("update query")
        console.log(updateQuery)

        updateQuery = updateQuery + " where userid = '" + req.session.userid_ab + "'";

        if(change){
        var msg_payload = {"query": updateQuery};
        // console.log("In POST Request = email" + email + "password" + password);

        mq_client.make_request('profile_Update_queue_ab', msg_payload, function (err, results) {
            console.log(results);
            if (err) {
                throw err;
            }
            else {
                if (results.code == 200) {

                    console.log("in update success")
                     res.send({"statuscode": 200});
                }
                else if (results.code == 201) {

                    console.log("in update failure")

                     res.send({"statuscode": 201});
                }
            }
        });
    }else{
            console.log("no changes to be done")
            res.send({"statuscode": 300});
        }

    }

}



exports.loginCheck = function(req, res) {
    var email = req.param("email");
    var password = req.param("password");

    console.log("in sign in")

    var msg_payload = {"email": email, "password": password};
  //  console.log("In POST Request = email" + email + "password" + password);

    mq_client.make_request('login_queue_ab', msg_payload, function (err, results) {
   //     console.log(results);
        if (err) {
            throw err;
        }
        else {

            console.log("got back")
            console.log(results.code)

            if (results.code == 200) {

                console.log("here")

                if (req.session.firstname_ab) {
                    // req.session.destroy();
                }

                console.log("got back")

                req.session.firstname_ab = results.firstname;
                req.session.userid_ab = results.userid;
                req.session.user_ab = results.user;
                req.session.lastname_ab = results.user.lastname;
                // req.session.email_ab = results.user.email;⁠⁠⁠⁠

                console.log("session user id set is ")
                console.log(req.session.userid)

                res.send({"statuscode": 200});
            }
            else if (results.code == 201) {
                res.send({"statuscode": 201});
            }
        }
    });
}

exports.load_ratings_ab = function(req,res){
    if(req.session.user_ab) {

        console.log("in test rating")

        console.log("user is ")
        console.log(req.session.userid_ab)

        ejs.renderFile('./views/property_ratings_ab.ejs', {
            title: 'Welcome to Airbnb',
            user: req.session.user_ab
        }, function (err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });

    }else{
        res.redirect('/');
    }


}

exports.submitSignup = function(req, res){

    var firstname = req.param("firstname");
    var lastname = req.param("lastname");
    var email = req.param("email");
    var password = req.param("password");
    var day = req.param("day");
    var month = req.param("month");
    var year = req.param("year");
    var dob = month+"/"+day+"/"+year;

    var msg_payload = {"firstname": firstname,"lastname":lastname,"email": email,"password": password,"day":day,"month":month,"year":year,"dob":dob};
    console.log("In POST Request = firstname:" + firstname+ "lastname" + lastname+"email"+ email +"password" + password+"day" + day+ "month" +month +"year"+ year +"dob"+dob);

    mq_client.make_request('signup_queue_ab', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                // req.session.destroy()


                req.session.userid_ab = results.userid;
                req.session.firstname_ab = firstname;
                console.log("in success signup "+req.session.userid_ab);

                res.send({"statuscode":200});




            }
            else if (results.code == 201) {
                res.send({"statuscode":201});
            }
        }
    });
}


exports.addPropertyImage_ab = function(req,res){

    var images = req.app.get('images');

    var msg_payload = {"images": images,
        //"propertyid":req.session.propertyid_ab
        "ratingID": req.session.ratingID_ab
    };

    console.log("images here")

    mq_client.make_request('addProperty_Images_queue_ab', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                res.redirect('/pRatingSuccess');
            }
            else if (results.code == 201) {

                console.log("in update failure")
            }
        }
    });
}


exports.savePropertyRating_ab = function(req, res){
    var hostFeedback = req.param("hostFeedback");
    var propertyFeedback = req.param("propertyFeedback");
    var cleanliness = req.param("cleanliness");
    var communication = req.param("communication");
    var houserules = req.param("houserules");
    var recommend = req.param("recommend");
    var propertyid = req.param("propertyID");
    var tripid = req.param("tripID");
    var username = req.session.user_ab.firstname;

    var msg_payload = {"userid": req.session.userid_ab, "hostFeedback": hostFeedback,"propertyFeedback":propertyFeedback,
        "cleanliness": cleanliness,"communication": communication,"houserules":houserules,"recommend":recommend,
        "propertyid": propertyid, "tripid": tripid,"username":username };

    mq_client.make_request('propertyRating_queue_ab', msg_payload, function (err, results) {
        console.log("getting back")
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                console.log("back in save property ratings success")
                console.log(results.code)
                req.session.ratingID_ab = results.propRatingID;
                res.send({"statuscode":200});

            }
            else if (results.code == 201) {

                console.log("back in save property ratings failure")
                res.send({"statuscode":201});
            }
        }
    });
}

exports.propertyRating_success = function(req,res){
    console.log("here")
    console.log(req.session.ratingID_ab);

    ejs.renderFile('./views/ratingSuccess_ab.ejs', { title: 'Thank You', ratingID: req.session.ratingID_ab } , function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

exports.logout_ab = function(req,res){
    winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on logout');



    if(req.session.user_ab){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        req.session.destroy();
        user = [];

        res.redirect('/');

    }else{
        res.redirect('/');
    }

}

exports.deleteUser_ab = function(req,res){
winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on delete user');

    if(req.session.user_ab){

        console.log("want to delete")
        console.log(req.session.userid_ab)

        var msg_payload = {"userid":req.session.userid_ab};

        mq_client.make_request('delete_queue_ab', msg_payload, function (err, results) {
            if (err) {
                throw err;
            }
            else {

                if (results.code == 200) {
                    ejs.renderFile('./views/AccountDeleted.ejs', { title: 'Thank You', ratingID: req.session.ratingID_ab } , function(err, result) {
                        if (!err) {
                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    });

                }
                else if (results.code == 201) {

                }
            }
        });
    }else{
        res.redirect('/');
    }
}

exports.updatePassword_ab = function(req,res){
    winston.log('info',req.session.userid_ab+' is the user.',new Date(), 'User has clicked on change password');


    if(req.session.user_ab){

        var newPassword = req.param("newpassword")
        var oldPassword = req.param("oldpassword")

        var msg_payload = {"userid":req.session.userid_ab, "oldpassword" : oldPassword, "newpassword" : newPassword};

        mq_client.make_request('changePassword_queue_ab', msg_payload, function (err, results) {
            if (err) {
                throw err;
            }
            else {

                if (results.code == 200) {
                    res.send({"statuscode":200});
                }
                else if (results.code == 201) {
                    res.send({"statuscode":201});

                }else if(results.code == 300){
                    res.send({"statuscode":300});
                }
            }
        });


    }else{
        res.redirect('/')
    }

}


exports.userPasswordChangeSuccess_ab = function(req,res){
    if(req.session.user_ab){

        ejs.renderFile('./views/passwordChange_success_ab.ejs', { title: 'Thank You' } , function(err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });

    }else{
        res.redirect('/')
    }
}

exports.user_reviews_ab = function(req,res){

    var msg_payload = {"userid":req.session.userid_ab };

    mq_client.make_request('user_reviews_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                ejs.renderFile('./views/user_review_ab.ejs', { title: 'User Reviews', reviews : results.userReviews } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });
            }
        }
    });
}

exports.user_reviews_by_you_ab = function(req,res){

    console.log("user clicked for reviews by user himself ")

    var msg_payload = {"userid":req.session.userid_ab };

    mq_client.make_request('user_by_reviews_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                ejs.renderFile('./views/user_review_by_you_ab.ejs', { title: 'User Reviews', reviews: results.propertyReviews } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });

            }

        }
    });


}
