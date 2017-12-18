/*********************************************************************************
*
*  WEB322 – Assignment 06 
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this 
*  assignment has been copied manually or electronically from any other source (including web sites) or  
*  distributed to other students.  
*  
* Name: Kyuyoung Shim   Student ID: 102562162   Date: 2017-12-17
* 
*  Online (Heroku) Link: https://immense-hamlet-93628.herokuapp.com/
* 
********************************************************************************/
const dataServiceComments = require("./data-service-comments.js");
var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

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
    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status).then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employeeList", { data: data, title: "Employees"});
        }).catch((err) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    } else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    } else {
        dataService.getAllEmployees().then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
});

app.get("/employee/:empNum", (req, res) => {
    let viewData = {};

    dataService.getEmployeeByNum(req.params.empNum)
    .then((data) => {
        viewData.data = data;
    }).catch(() => {
        viewData.data = null;
    }).then(dataService.getDepartments)
    .then((data) => {
        viewData.departments = data;
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = [];
    }).then(() => {
        if (viewData.data == null) {
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData });
        }
    });
});

app.get("/employee/delete/:empNum", (req,res) => {
    dataService.deleteEmployeeByNum(req.params.empNum).then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee Not Found");
    });
});

app.get("/managers", (req, res) => {
    dataService.getManagers().then((data) => {
        res.render("employeeList", { data: data, title: "Employee (Managers)" });
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
    dataService.getDepartments().then((data) => {
        res.render("addEmployee", {departments: data});
    }).catch((err) => {
       res.render("addEmployee", {departments: [] });
    });
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    });
});


app.get("/departments/add", (req,res) => {
    res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then((data) => {
        res.redirect("/employees");
    });
});

app.post("/department/update", (req, res) => {
    dataService.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

app.get("/department/:departmentId", (req, res) => {
    dataService.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", { data: data });
    }).catch((err) => {
        res.status(404).send("Department Not Found");
    });
});

app.post("/about/addComment", (req, res) => {
    dataServiceComments.addComment(req.body).then((data) => {
        res.redirect("/about");
    }).catch(() => {
        res.reject("error");
        res.redirect("/about");
    });
});

app.post("/about/addReply", (req, res) => {
    dataServiceComments.addReply(req.body).then((data) => {
        res.redirect("/about");
    }).catch((err) => {
        reject("error");
        redirect("/about");
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

dataService.initialize().then(() => {     
    app.listen(HTTP_PORT, onHttpStart);   
}).catch(() => {     
    console.log("unable to start dataService");   
});