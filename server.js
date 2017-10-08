/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Kyuyoung Shim   Student ID: 102562162   Date: 2017-10-08
*
* Online (Heroku) Link:  https://immense-hamlet-93628.herokuapp.com/
*
********************************************************************************/ 
var dataService = require("./data-service.js");
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.port || 8080;

console.log(1);

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

console.log(2);

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

console.log(3);

app.get("/employees", (req, res) => {
    if (req.query.status == "Full Time" || req.query.status == "Part Time") {
        var stat = req.query.status;
        dataService.getEmployeesByStatus(stat).then((data) => {
          res.json(data);
        }).catch(() => {
          res.json({ message: "no results returned" });
        });
    }
      else if (req.query.manager) {
        var mng = req.query.manager;
        dataService.getEmployeesByManager(mng).then((data) => {
          res.json(data);
        }).catch(() => {
          res.json({ message: "no results returned" });
        });
      }
      else if (req.query.department) {
        var depart = req.query.department;
        dataService.getEmployeesByDepartment(depart).then((data) => {
          res.json(data);
        }).catch(() => {
          res.json({ message: "no results returned" });
        });
      }
      else {
        dataService.getAllEmployees().then((data) => {
              res.json(data);
            }).catch(() => {
              res.json({ message: "no results returned" });
            });
        }
    });

    console.log(4);

    app.get("/employee/:empNum", (req, res) => {
        var num = req.params.empNum;
        dataService.getEmployeeByNum(num).then((data) => {
            res.json(data);
        }).catch(() => {
            res.json({ message: "no results returned" });
        });
    });
    
    console.log(5);

    app.get("/managers", (req, res) => {
        dataService.getManagers().then((data) => {
            res.json(data);
        }).catch(() => {
            res.json({ message: "no results returned" });
        });
    });

    console.log(6);

    app.get("/departments", (req, res) => {
        dataService.getDepartments().then((data) => {
            res.json(data);
        }).catch(() => {
            res.json({ message: "no results returned" });
        });
    });

    console.log(7);

    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    dataService.initialize().then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    }).catch((err) => {
        console.log("Error: " + err);
    });

    app.listen(HTTP_PORT, onHttpStart);
    app.use(express.static('public'));