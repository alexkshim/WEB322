const fs = require('fs');

var employees = [];
var department = [];

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
