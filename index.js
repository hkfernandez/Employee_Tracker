// MODULES
// builtin
// const fs = require ('fs');
// 3rd party
const inquirer = require ('inquirer');
const cTable = require('console.table');
var mysql = require("mysql");
var connection = mysql.createConnection(
      {host: "localhost",
            port: 3306,
            user: "root",
            password: "rootroot",
            database: "company_info"
      }
);

// custom 
const Employee = require ('./lib/Employee.js');
const Dept = require ('./lib/Dept.js');
const Role = require ('./lib/Role.js');
const questions = require ('./lib/Questions.js');

//database connection and begin prompts
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
                  console.log(`==========================================================\n`)

            })
}     

function addEmployee () {
      inquirer.prompt (questions.addEmployee)
            .then 
            (({firstName, lastName, employeeRole, managerName})=>{
                  let newEmployee = new Employee (firstName, lastName);
                  insertNewRecord(newEmployee, 'employees');
                  console.log(`==========================================================\n${firstName} ${lastName} has been added as an employee\n==========================================================\n`);
            })
}

function addRole () {
      inquirer.prompt (questions.addRole)
      .then (
            ({name, salary})=>{
                  let positionName = name;
                  let positionSalary = salary;
                  connection.query(
                        `SELECT * FROM dept`, function(err, res) {
                              if (err) throw err;
                              selectionList = [];
                              for (let i = 0; i < res.length; i++) {
                                    let item = {
                                          name: res[i].name,
                                          value: res[i].id
                                    }
                                    selectionList.push(item);
                              }
                              inquirer.prompt (
                                    [{type: 'list', 
                                          message: `Select the department`, 
                                          choices: selectionList,
                                          name: 'id'
                                    }]
                              ).then (
                                    ({id}) => {
                                          let deptId = id;
                                          let newRole = new Role (positionName, positionSalary, deptId);
                                          insertNewRecord(newRole, 'roles');
                                          console.log(`\n==========================================================\nThe postion of ${name} has been added the company profile\n==========================================================\n`);
                                    }
                              )
                        }
                  )
            }
      )
}

function addDept () {      
      inquirer.prompt (questions.addDept)
      .then (
            ({name})=>{
                  let newDept = new Dept (name);
                  insertNewRecord(newDept, 'dept');
                  console.log(`==========================================================\n${name} has been added to the company profile\n==========================================================\n`);
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

function displayList (listName, cb) {   //can take an argument specifying which table to use to make a list or select a list via prompts - takes callback
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
            if (listName === 'roles') {
                  connection.query(
                        `SELECT title as POSITION, salary as SALARY 
                        FROM roles 
                        ORDER BY POSITION`, 
                        function(err, res) {
                              if (err) throw err;
                              console.table('\n',res);
                              console.log(`==========================================================\nList of current company positions above.\n==========================================================`);               
                              cbOrMainOrExit(cb);    
                        }
                  )
            } else if (listName === 'dept') {
                  connection.query(
                        `SELECT name as DEPARTMENT 
                        FROM dept;`, 
                        function(err, res) {
                              if (err) throw err;
                              console.table('\n',res);
                              console.log(`==========================================================\n
List of current company departments above.\n
==========================================================`);                             
                              cbOrMainOrExit(cb);    
                        }
                  )
            } else {
                  connection.query(
                        `SELECT E.first_name AS FIRST, E.last_name AS LAST, 
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
                              console.log(`==========================================================\n
List of current employees above.\n
==========================================================`);               
                              cbOrMainOrExit(cb);    
                        }
                  )
            }
      }    
}

function displayRoles (){
      connection.query(
            `SELECT title as POSITION FROM roles`, 
            function(err, res) {
                  if (err) throw err;
                  console.table('\n',res);
                  console.log(`==========================================================\nCurrent company postions listed above.\n==========================================================`);
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
                  console.log(`==========================================================\nCurrent company departments listed above.\n==========================================================`);
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
                  console.log(`==========================================================\nCurrent company employees listed above.\n==========================================================`);
                  beginPrompts();
            }
      );
} 

function cbOrMainOrExit (cb) { 
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

 function selectDept () {
      connection.query(
            `SELECT * FROM roles`, function(err, res) {
                  if (err) throw err;
                  selectionList = [];
                  for (let i = 0; i < res.length; i++) {
                        let item = {
                              name: res[i].name,
                              value: res[i].id
                        }
                        selectionList.push(item);
                  }
                  console.log(selectionList);
                  inquirer.prompt (
                        [{type: 'list', 
                              message: `Select the department`, 
                              choices: selectionList,
                              name: 'id'
                        }]
                  ).then (
                        ({id}) => {
                              let deptId = id;
                              // console.log('ROLEID ', roleId);
                              assignNewRole (employeeId, deptId);
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
                  console.log(`==========================================================\n${res[0].FIRST} ${res[0].LAST} has been assigned the postion of ${res[0].POSITION}\n==========================================================`);
                  beginPrompts();
            }
      )
 }

 function exit () {
       console.log(`==========================================================\nYou have ended your session\nEnter 'npm start' on the command line start a new session\n==========================================================\n`
      );
       return process.exit (0)
 }
