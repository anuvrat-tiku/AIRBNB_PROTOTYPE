var ejs = require('ejs');


exports.index = function(req, res){


    var message;
    if(req.param('message')){
        console.log("in message");
        message= req.param('message');
        res.render('index.ejs',{title: 'Welcome to Airbnb',message:message});
    }
    else{
        console.log("in message else");
        message="";
        res.render('index.ejs',{title: 'Welcome to Airbnb',message:message});
    }
    
};




// var express = require('express');
// var nodemailer = require("nodemailer");
// var smtpTransport = require("nodemailer-smtp-transport")
// var app = express();

// var smtpTransport = nodemailer.createTransport(smtpTransport({
//     host : "YOUR SMTP SERVER ADDRESS",
//     secureConnection : false,
//     port: 587,
//     auth : {
//         user : "YourEmail",
//         pass : "YourEmailPassword"
//     }
// }));
// app.get('/send',function(req,res){
//     var mailOptions={
//         from : "YourEmail",
//         to : "Recipient'sEmail",
//         subject : "Your Subject",
//         text : "Your Text",
//         html : "HTML GENERATED",
//         attachments : [
//             {   // file on disk as an attachment
//                 filename: 'text3.txt',
//                 path: 'Your File path' // stream this file
//             }
//         ]
//     }
//     console.log(mailOptions);
//     smtpTransport.sendMail(mailOptions, function(error, response){
//         if(error){
//             console.log(error);
//             res.end("error");
//         }else{
//             console.log(response.response.toString());
//             console.log("Message sent: " + response.message);
//             res.end("sent");
//         }
//     });
// });

// app.listen(3000,function(){
//     console.log("Express Started on Port 3000");
// });