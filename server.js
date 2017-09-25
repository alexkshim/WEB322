/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Kyuyoung Shim   Student ID: 102562162   Date: 2017-09-18
*
* Online (Heroku) Link:  https://immense-hamlet-93628.herokuapp.com/
********************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.port || 8080;

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}
app.use(express.static('public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.listen(HTTP_PORT, onHttpStart);
