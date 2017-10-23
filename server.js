/*********************************************************************************
*
*  WEB322 – Assignment 04 
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this 
*  assignment has been copied manually or electronically from any other source (including web sites) or  
*  distributed to other students. 
*  
* Name: Kyuyoung Shim   Student ID: 102562162   Date: 2017-10-21
* 
*  Online (Heroku) Link: https://immense-hamlet-93628.herokuapp.com/
* 
********************************************************************************/
var dataService = require("./data-service.js");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");

function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/employees", (req, res) => {
    if (req.query.status == "Full Time" || req.query.status == "Part Time") {
        var stat = req.query.status;
        dataService.getEmployeesByStatus(stat).then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(() => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
    else if (req.query.manager) {
        var mng = req.query.manager;
        dataService.getEmployeesByManager(mng).then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(() => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
    else if (req.query.department) {
        var depart = req.query.department;
        dataService.getEmployeesByDepartment(depart).then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(() => {
            res.render("employeeList", { data: data, title: "Employees" });
        });
    }
    else {
        dataService.getAllEmployees().then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(() => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
});

app.get("/employee/:empNum", (req, res) => {
    var num = req.params.empNum;
    dataService.getEmployeeByNum(num).then((data) => {
        res.render("employee", { data: data, title: "Employees" });
    }).catch(() => {
        res.status(404).send("Employee Not Found");
    });
});

app.get("/managers", (req, res) => {
    dataService.getManagers().then((data) => {
        res.render("employeeList", { data: data, title: "Employees (Managers)" });
    }).catch(() => {
        res.render("employeeList", { data: {}, title: "Employees (Managers)" });
    });
});

app.get("/departments", (req, res) => {
    dataService.getDepartments().then((data) => {
        res.render("departmentList", { data: data, title: "Departments" });
    }).catch(() => {
        res.render("departmentList", { data: {}, title: "Departments" });
    });
});

app.get("/employees/add", (req, res) => {
    res.render("addEmployee");
});
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    });
});
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then((data) => {
        res.redirect("/employees");
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

dataService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log("Error: " + err);
}); 