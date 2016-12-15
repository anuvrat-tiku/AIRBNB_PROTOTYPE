var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");

describe('http tests', function(){

    it('AIRBNB HOMEPAGE API', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('EDIT PROFILE API', function(done){
        http.get('http://localhost:3000/editProfile_ab', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('PROFILE PHOTO API', function(done){
        http.get('http://localhost:3000/profilePhoto_ab', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('LOGOUT API', function(done){
        http.get('http://localhost:3000/logout_ab', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('RATINGS API', function(done){
        http.get('http://localhost:3000/ratings', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('DELETE USER API', function(done){
        http.get('http://localhost:3000/deleteUser_ab', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('CHANGE PASSWORD API', function(done){
        http.get('http://localhost:3000/changePassword_ab', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('USER PASSWORD CHANGE API', function(done){
        http.get('http://localhost:3000/userPasswordChangeSuccess_ab', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('SIGN UP API', function(done){
        http.get('http://localhost:3000/signupsuccess', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

    it('HOME PAGE API', function(done){
        http.get('http://localhost:3000/homepage', function(res) {
            assert.equal(302, res.statusCode);
            done();
        })
    });

});