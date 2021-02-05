// MODULES
// builtin
// const fs = require ('fs');
// 3rd party
const inquirer = require ('inquirer');
const cTable = require('console.table');
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


// GLOBAL VARIABLES


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
                  let employee = new Employee (firstName, lastName, employeeRole, managerName);
                  pushNewEmployee(employee);

            })
}

function pushNewEmployee (){}

function addDept () {
      inquirer.prompt (questions.addDept)
            .then 
            (({name})=>{
                  let dept = new Dept (name);
                  pushNewDept(dept);

            })
}

function pushNewDept (){}

function addRole () {
      inquirer.prompt (questions.addRole)
            .then 
            (({roleName, roleDept, roleSalary})=>{
                  let role = new Role (roleName, roleDept, roleSalary);
                  pushNewRole(role);
            })
}

function pushNewRole (){}


function selectList () {
      inquirer.prompt (questions.selectList)
            .then 
            (({listTypeChoice})=>{
                  if (listTypeChoice === "Departments") {

                  } else if (listTypeChoice === "Roles") {

                  } else if (listTypeChoice === "employees") {

                  }
            })
}

function changeManager () {
      inquirer.prompt (questions.changeManager)
            .then 
            (({employee, manager})=>{

            })
}



function init () {
      beginPrompts()
}

 init ();

