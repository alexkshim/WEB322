const fs = require('fs');

var employees = [];
var department = [];
var empCount = 0;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err, data) => {
            if (err) {
                reject("unable to read file");
            } else {
                employees = JSON.parse(data);
                fs.readFile('./data/departments.json', (err, data) => {
                    if (err) {
                        reject("unable to read file");
                    } else {
                        department = JSON.parse(data);
                        empCount = employees.length;
                        resolve(employees);
                        resolve(department);
                    }
                });
            }
        });
    });
};

module.exports.getAllEmployees = () => {    
    return new Promise((resolve,reject) => {
        if(employees.length > 0){
            resolve(employees);
        }else{
            reject("no results returned");
        }
    });
};

module.exports.getEmployeesByStatus = (stat) => {
    return new Promise((resolve, reject) => {
        if(employees.length > 0){
            var i;
            var temp = [];
            for (i = 0; i < employees.length; i++){
                if(employees[i].status == stat){
                    temp.push(employees[i]);
                }
            }
            if(temp.length > 0){resolve(temp)};
        }else{
            reject("no results returned");
        }
    });
};

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve,reject)=>{
        if(employees.length > 0){
            var i ;
            var temp = [];
            for (i = 0; i < employees.length; i++){
                if( employees[i].department == department){
                temp.push(employees[i]);
                }
            }
            if(temp.length > 0) {resolve(temp);}
        }else{
            reject("no results returned");
        }
    });
};

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve,reject)=>{
        if(employees.length > 0){
           var i;
           var temp = [];
           for(i = 0; i < employees.length; i++){
               if(employees[i].employeeManagerNum == manager){
                   temp.push(employees[i]);
                }
            }
            if(temp.length > 0) {resolve(temp);}
        }else{
            reject("no results returned");
        }
    });
};

module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve,reject) => {
        if(employees.length > 0){
            resolve(employees[num - 1]);
        }else{
           reject("no results returned");
        }
    });
};

module.exports.getManagers = () => {
    return new Promise((resolve,reject) => {
        if(employees.length > 0){
            var i;
            var temp = [];
            for(i = 0; i < employees.length; i++){
                if(employees[i].isManager == true){
                    temp.push(employees[i]);
                }
            }
            if(temp.length> 0) {resolve(temp);}
        }else{
            reject("no results returned");
        }
    });
};

module.exports.getDepartments = () => {
    return new Promise((resolve,reject)=>{
        if(department.length > 0){
            resolve(department);
        }else{
            reject("no results returned");
        }
    });
};

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        if (employees.length > 0) {
            empCount = employees.length;
            empCount++;
            employeeData["employeeNum"] = empCount;
            console.log(employeeData["employeeNum"]);
            employees.push(employeeData);
            resolve();
        } else {
            reject("no results returned");
        }
    });
};

module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        if (employees.length > 0) {
            var i;
            for (i = 0; i < employees.length; i++) {
                if (employees[i].employeeNum == employeeData.employeeNum) {
                    employees[i].firstName = employeeData.firstName;
                    employees[i].last_name = employeeData.last_name;
                    employees[i].email = employeeData.email;
                    employees[i].addressStreet = employeeData.addressStreet;
                    employees[i].addresCity = employeeData.addresCity;
                    employees[i].addressState = employeeData.addressState;
                    employees[i].addressPostal = employeeData.addressPostal;
                    employees[i].isManager = employeeData.isManager;
                    employees[i].employeeManagerNum = employeeData.employeeManagerNum;
                    employees[i].status = employeeData.status;
                    employees[i].department = employeeData.department;
                }
            }
            resolve();
        } else {
            reject("no results returned");
        }
    });
};