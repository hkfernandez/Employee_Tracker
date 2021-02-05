// MODULES
// builtin
// const fs = require ('fs');
// 3rd party
const inquirer = require ('inquirer');
const cTable = require('console.table');
var mysql = require("mysql");
var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "rootroot",
      database: "company_info"
    });
// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, {
//     name: 'bar',
//     age: 20
//   }
// ]);

// custom 
const Employee = require ('./lib/Employee.js');
const Dept = require ('./lib/Dept.js');
const Role = require ('./lib/Role.js');
const questions = require ('./lib/Questions.js');


//on database connection
connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId + "\n");
      beginPrompts();
    });

// FUNCTIONS

function beginPrompts() {
      inquirer.prompt (questions.boilerplate)
            .then 
            (({boilerplateChoice})=>{
                  if (boilerplateChoice === 'Create a new department') {
                        addDept();
                  } else if (boilerplateChoice === 'Add a new role') {
                        addRole();
                  } else if (boilerplateChoice === 'Add a new employee'){
                        addEmployee();
                  } else if (BoilerplateChoice === 'View of list of departments, roles or employees'){
                        selectList();
                  }else if (BoilerplateChoice === `Change an employee's manager`){
                        changeManager();
                  }
            })
}     

function addEmployee () {
      inquirer.prompt (questions.addEmployee)
            .then 
            (({firstName, lastName, employeeRole, managerName})=>{
                  let newEmployee = new Employee (firstName, lastName, employeeRole, managerName);
                  insertNewRecord(newEmployee, 'employees');
            })
}

function addRole () {
      inquirer.prompt (questions.addRole)
            .then 
            (({name, salary, dept})=>{
                  let newRole = new Role (name, salary, dept);
                  insertNewRecord(newRole, 'roles');
            })
}

function addDept () {
      inquirer.prompt (questions.addDept)
            .then 
            (({name})=>{
                  let newDept = new Dept (name);
                  insertNewRecord(newDept, 'dept');
            })
}

function insertNewRecord (newObject, tableName){
      console.log(`Inserting a new record in ${tableName}...\n`);
      var query = connection.query(
        `INSERT INTO ${tableName} SET ?`,
        newObject,
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + ` record inserted!\n`);
          beginPrompts();
        }
      );
    
      // logs the actual query being run
      console.log(query.sql);
    }


// function pushNewDept (){}


// function pushNewRole (){}


// function selectList () {
//       inquirer.prompt (questions.selectList)
//             .then 
//             (({listTypeChoice})=>{
//                   if (listTypeChoice === "Departments") {

//                   } else if (listTypeChoice === "Roles") {

//                   } else if (listTypeChoice === "employees") {

//                   }
//             })
// }

// function changeManager () {
//       inquirer.prompt (questions.changeManager)
//             .then 
//             (({employee, manager})=>{

//             })
// }



// function init () {
//       beginPrompts()
// }

//  init ();

//=======================CRUD FUNCTIONS=========================================
// function addDept() {
//       console.log("Inserting a new product...\n");
//       var query = connection.query(
//         "INSERT INTO products SET ?",
//         {
//           flavor: "Rocky Road",
//           price: 3.0,
//           quantity: 50
//         },
//         function(err, res) {
//           if (err) throw err;
//           console.log(res.affectedRows + " product inserted!\n");
//           // Call updateProduct AFTER the INSERT completes
//           updateProduct();
//         }
//       );
    
//       // logs the actual query being run
//       console.log(query.sql);
//     }
    
//     function updateEmployee() {
//       console.log("Updating all Rocky Road quantities...\n");
//       var query = connection.query(
//         "UPDATE products SET ? WHERE ?",
//         [
//           {
//             quantity: 100
//           },
//           {
//             flavor: "Rocky Road"
//           }
//         ],
//         function(err, res) {
//           if (err) throw err;
//           console.log(res.affectedRows + " products updated!\n");
//           // Call deleteProduct AFTER the UPDATE completes
//           deleteProduct();
//         }
//       );
    
//       // logs the actual query being run
//       console.log(query.sql);
//     }
    
//     function deleteemployee() {
//       console.log("Deleting all strawberry icecream...\n");
//       connection.query(
//         "DELETE FROM products WHERE ?",
//         {
//           flavor: "strawberry"
//         },
//         function(err, res) {
//           if (err) throw err;
//           console.log(res.affectedRows + " products deleted!\n");
//           // Call readProducts AFTER the DELETE completes
//           readProducts();
//         }
//       );
//     }
    
//     function readProducts() {
//       console.log("Selecting all products...\n");
//       connection.query("SELECT * FROM products", function(err, res) {
//         if (err) throw err;
//         // Log all results of the SELECT statement
//         console.log(res);
//         connection.end();
//       });
//     }
    

