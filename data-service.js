const Sequelize = require('sequelize');

var sequelize = new Sequelize('d3j5o0vsjimbog', 'iutytmqfwozvyh', 'bbb401775dfa1394cf9ef007b7e36ef36a36d297beb5688ced6745005cbd51fe', {     
    host: 'ec2-54-243-211-197.compute-1.amazonaws.com',     
    dialect: 'postgres',     
    port: 5432,     
    dialectOptions: {         
        ssl: true     
    } 
}); 

// Defining Employee Model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

// Defining Department Model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then( () => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};

module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("The query returned no result");
        });
    });
};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status: status
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("The query returned no result");
        });
    });
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department: department
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("The query returned no result");
        });
    });
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("The query returned no result");
        });
    });
};

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("The query returned no result");
        });
    });
};
module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("Unable to delete employee");
        });
    });
}

module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("The query returned no result");
        });
    });
};

module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("The query returned no result");
        });
    });
};

module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Department.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("The query returned no result");
        });
    });

};

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var i in employeeData) {
            if(employeeData[i] == '')
                employeeData[i] = null;
        }
        Employee.create(employeeData).then(() => {
            resolve();
        }).catch((e)=>{
            reject();
        });

    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var i in employeeData) {
            if (employeeData[i] == '')
                employeeData[i] = null;
        }
        Employee.update(employeeData, {
            where: { 
                employeeNum: employeeData.employeeNum 
            } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject();
        });
    });
};

module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (var i in departmentData) {
            if(departmentData[i] == '')
                departmentData[i] = null;
        }
        Department.create(departmentData).then(() => {
            resolve();
        }).catch((e)=>{
            reject();
        });
    });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (var i in departmentData) {
            if (departmentData[i] == '')
                departmentData[i] = null;
        }
        Department.update(departmentData, {
            where: { 
                departmentId: departmentData.departmentId 
            } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject();
        });
    });
};