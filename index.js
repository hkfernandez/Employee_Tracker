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


// custom 
const Employee = require ('./lib/Employee.js');
const Dept = require ('./lib/Dept.js');
const Role = require ('./lib/Role.js');
const questions = require ('./lib/Questions.js');

// GLOBAL VARIABLES
const employeeListQuery = `SELECT E.first_name AS FIRST, E.last_name AS LAST, 
R.title AS POSITION, 
D.name AS DEPARTMENT
FROM employees AS E
LEFT JOIN roles AS R 
ON (R.id = E.role_id)
LEFT JOIN dept AS D
ON (D.id = R.dept_id)
ORDER BY LAST ASC;`;


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
                        displayList('dept', addDept);
                  } else if (boilerplateChoice === 'Add a new role') {
                        displayList('roles', addRole);
                  } else if (boilerplateChoice === 'Add a new employee'){
                        displayList('employees', addEmployee);
                  } else if (boilerplateChoice === 'View of list of departments, roles or employees'){
                        displayList();
                  }else if (boilerplateChoice === `Change an employee's position`){
                        selectEmployee();
                  }else if (boilerplateChoice === 'Exit the program'){
                        exit();
                  }
            })
}     

function addEmployee () {
      inquirer.prompt (questions.addEmployee)
            .then 
            (({firstName, lastName, employeeRole, managerName})=>{
                  let newEmployee = new Employee (firstName, lastName, employeeRole, managerName);
                  insertNewRecord(newEmployee, 'employees');
                  console.log(`${firstName} ${lastName} has been added as an employee`);
            })
}

function addRole () {
      inquirer.prompt (questions.addRole)
      .then (
            ({name, salary, dept})=>{
                  let newRole = new Role (name, salary, dept);
                  insertNewRecord(newRole, 'roles');
                  console.log(`The postion of ${name} has been added the company profile`);
            }
      )
}

function addDept () {      
      inquirer.prompt (questions.addDept)
      .then (
            ({name})=>{
                  let newDept = new Dept (name);
                  insertNewRecord(newDept, 'dept');
                  console.log(`${name} has been added to the company profile.`);
            }
      )
}

function insertNewRecord (newObject, tableName){
      var query = connection.query(
        `INSERT INTO ${tableName} SET ?`,
        newObject,
        function(err, res) {
            if (err) throw err;
            beginPrompts();
        }
      );
}

function displayList (listName, cb) {   //can take an argument or select a list via prompts - takes callback
      // console.log('LIST NAME ', listName);
      let tableToReturn = listName
      if (listName === undefined) {
            inquirer.prompt (questions.selectList)
            .then(
                  ({listTypeChoice})=>{
                        if (listTypeChoice === "Departments") {
                              displayDepts ();
                        } else if (listTypeChoice === "Roles") {
                              displayRoles();
                        } else if (listTypeChoice === "Employees") {
                              displayEmployees ();
                        }
                  }      
            )
      } else {
            connection.query(
                  `SELECT * FROM ${tableToReturn}`, 
                  function(err, res) {
                        if (err) throw err;
                        console.table('\n',res);
                        cbOrMainOrExit(cb);    
                  }
            )
      }    
}

function displayRoles (){
      connection.query(
            `SELECT title as POSITION FROM roles`, 
            function(err, res) {
                  if (err) throw err;
                  console.table('\n',res);
                  console.log(`==========================================================`);
                  console.log(`Current company postions listed above.\n`);
                  beginPrompts();
            }
      );
} 

function displayDepts (){
      connection.query(
            `SELECT name as DEPARTMENT FROM dept`, 
            function(err, res) {
                  if (err) throw err;
                  console.table('\n',res);
                  console.log(`==========================================================`);
                  console.log(`Current company departments listed above.\n`);
                  beginPrompts();
            }
      );
} 

function displayEmployees (){
      connection.query(`SELECT E.first_name AS FIRST, E.last_name AS LAST, 
      R.title AS POSITION, 
      D.name AS DEPARTMENT
      FROM employees AS E
      LEFT JOIN roles AS R 
      ON (R.id = E.role_id)
      LEFT JOIN dept AS D
      ON (D.id = R.dept_id)
      ORDER BY LAST ASC;`, 
            function(err, res) {
                  if (err) throw err;
                  console.table('\n',res);
                  console.log(`==========================================================`);
                  console.log(`Current company employees listed above.\n`);
                  beginPrompts();
            }
      );
} 



function cbOrMainOrExit () { 
      inquirer.prompt (questions.continueOrMain)
      .then (
            ({choice})=>{
                  if (choice === 'Return to Main Menu') {
                        console.log(`\n==========================================================\n`);
                        beginPrompts();
                  } else if (choice === 'Exit') {
                        exit();
                  } else {
                        cb ();
                  }
            }
      )
 }

function selectEmployee () {
      connection.query(
            // `SELECT * FROM employees`, function(err, res) {
                  `SELECT E.id AS ID, E.first_name AS FIRST, E.last_name AS LAST, 
                  R.title AS POSITION, 
                  D.name AS DEPARTMENT
                  FROM employees AS E
                  LEFT JOIN roles AS R 
                  ON (R.id = E.role_id)
                  LEFT JOIN dept AS D
                  ON (D.id = R.dept_id)
                  ORDER BY LAST ASC;`, function(err, res) {
                  if (err) throw err;
                  selectionList = [];
                  for (let i = 0; i < res.length; i++) {
                        let item = {
                              name: `${res[i].FIRST} ${res[i].LAST} - ${res[i].POSITION} in ${res[i].DEPARTMENT}`,
                              value: res[i].ID
                        }
                        selectionList.push(item);
                  }
                  // console.log(selectionList);
                  inquirer.prompt (
                        [{type: 'list', 
                              message: `Select the employee`, 
                              choices: selectionList,
                              name: 'id'
                        }]
                  ).then (
                        ({id}) => {
                              
                              let employeeId = id;
                              // console.log('EMPLOYEE ID ', employeeId);
                              selectRole (employeeId);
                        }
                  )
            }
      )
 };

 function selectRole (employeeId) {
      connection.query(
            `SELECT * FROM roles`, function(err, res) {
                  if (err) throw err;
                  selectionList = [];
                  for (let i = 0; i < res.length; i++) {
                        let item = {
                              name: res[i].title,
                              value: res[i].id
                        }
                        selectionList.push(item);
                  }
                  console.log(selectionList);
                  inquirer.prompt (
                        [{type: 'list', 
                              message: `Select the new role`, 
                              choices: selectionList,
                              name: 'id'
                        }]
                  ).then (
                        ({id}) => {
                              let roleId = id;
                              // console.log('ROLEID ', roleId);
                              assignNewRole (employeeId, roleId);
                        }
                  )
            }
      )
 };

 function assignNewRole (employeeId, roleId){
      connection.query(
            `UPDATE employees SET role_id = ${roleId} WHERE id = ${employeeId}`,
             function(err, res) {
            }
      )
      connection.query(` SELECT E.id as ID, E.first_name AS FIRST, E.last_name AS LAST, 
      R.title AS POSITION
      FROM employees AS E
      LEFT JOIN roles AS R 
      ON (R.id = E.role_id)
      WHERE E.id = ${employeeId};
            `,
             function(err, res) {
                  console.log(`==========================================================\n
${res[0].FIRST} ${res[0].LAST} has been assigned the postion of ${res[0].POSITION}\n
==========================================================`);
                  beginPrompts();
            }
      )
 }

 function exit () {
       console.log(`==========================================================\n
You have ended your session\n
Enter 'npm start' on the command line start a new session\n
==========================================================\n`
      );
       return process.exit (0)
 }
// function buildTableList (tableName) {
//       connection.query(
//             `SELECT * FROM ${tableName}`, function(err, res) {
//                   if (err) throw err;
//                   gSelectionList = []
//                   if (tableName ==='employees'){
//                         for (let i = 0; i < res.length; i++) {
//                               //create a new object whose name is the items's name and value is an object containing the highest bid and id of the items
//                               let item = {
//                                     display : `${res[i].first_name} ${res[i].last_name}`,
//                                     value: { id: res[i].id }
//                               }
//                               gSelectionList.push(item);
//                         }
//                   } else if (tableName ==='roles') {
//                         for (let i = 0; i < res.length; i++) {
//                               //create a new object whose name is the items's name and value is an object containing the highest bid and id of the items
//                               let item = {
//                                     display : res[i].title,
//                                     value: { id: res[i].id }
//                               }
//                               gSelectionList.push(item);
//                         }

//                   } else {
//                         for (let i = 0; i < res.length; i++) {
//                               //create a new object whose name is the items's name and value is an object containing the highest bid and id of the items
//                               let item = {
//                                     display : res[i].name,
//                                     value: { id: res[i].id }
//                               }
//                               gSelectionList.push(item);
//                         }

//                   }
//                   console.log('GSELCTIONLIST ', gSelectionList);
//             }
//       )
//  }

//  const buildTableListPromise = new Promise (
//        (resolve, reject) => {
//             resolve (buildTableList('employees'));
//        }
//  )
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
    
// const changeRoleSelectEmployee =[
//       {type: 'list', message: `Select the employee`, name: 'employee', choices: gSelectionList},//address
// ]

// const changeRoleSelectManager =[
//       {type: 'list', message: `Select the manager`, name: 'role', choices: gSelectionList}//address
// ]
