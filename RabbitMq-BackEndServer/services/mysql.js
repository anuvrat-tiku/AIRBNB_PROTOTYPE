var ejs = require('ejs');
var mysql = require('mysql');

var pooling= require('./pooling');

var pool= pooling.getConnection();

function pushData(callback,sqlQuery){
    console.log("\nSQL Query::"+sqlQuery);
    pool.query( sqlQuery,  function(err, rows){
        if(err)	{
            console.log("ERROR: " + err.message);
        }
        else
        {
            console.log("DB Results:"+rows);
            callback(err, rows);
        }
    });
    pooling.returnConnection(pool);
}

exports.pushData=pushData;

function getConnection(){
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'test123',
        database : 'airbnb',
        port : 3306
    });
    return connection;
}

function insertRecord(callback, post, table){
    //console.log("Data to insert is : "+post);

    var connection = getConnection();

    connection.query('INSERT INTO '+table+' SET ?', post, function(err, result){
        if(err)
        {
            console.log("Error : "+err.message);
        }
        else
        {
            callback(err,result);
        }

    });
    console.log("SQL connection ended");
    connection.end();
}

function fetchData(callback, sqlQuery){

    console.log("Query to fetch : "+sqlQuery)

    var connection = getConnection();

    connection.query(sqlQuery, function(err,rows,fields){
        if(err)
        {
            console.log("in error")
            console.log("Error : "+err.message);
        }
        else
        {
            callback(err,rows);

        }
    });
    console.log("SQL connection ended");
    connection.end();
}

function deleteData(callback, sqlQuery){

    console.log("Query to delete : "+sqlQuery)

    var connection = getConnection();

    connection.query(sqlQuery, function(err,rows,fields){
        if(err)
        {
            console.log("Error : "+err.message);
        }
        else
        {
            callback(err,rows);
        }
    });
    console.log("SQL connection ended");
    connection.end();
}

function updateData(callback, sqlQuery){

    console.log("Query to update : "+sqlQuery)

    var connection = getConnection();

    connection.query(sqlQuery, function(err,rows,fields){
        if(err)
        {
            console.log("Error : "+err.message);
        }
        else
        {
            callback(err,rows);
        }
    });
    console.log("SQL connection ended");
    connection.end();
}


exports.insertRecord = insertRecord;
exports.fetchData = fetchData;
exports.deleteData = deleteData;
exports.updateData = updateData;
