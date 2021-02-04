// MODULES
// builtin
const fs = require ('fs');
// 3rd party
const inquirer = require ('inquirer');
// custom 
const html = require ('./Develop/src/page-template.js');
const questions = require ('./lib/Questions.js');
const Manager = require ('./lib/Manager.js');
const Engineer = require ('./lib/Engineer.js');
const Intern = require ('./lib/Intern.js');

// GLOBAL VARIABLES
const employeesArrGV = [];

// FUNCTIONS
function buildManagerObj () {
      inquirer.prompt (questions.manager)
            .then (({name, id, email, officeNumber, addTeamMemberChoice})=>{
                  let manager = new Manager (name, id, email, officeNumber);
                  employeesArrGV.push(manager);
                  addNewEmployee();
            })
}

//called by all the buildEmployeeObj functions
function addNewEmployee () {
      inquirer.prompt (questions.addEmployee)
      .then (({addEmployeeChoice})=>{
            const addEmployee = addEmployeeChoice;
            if(addEmployee === "Yes") {
                  askEmployeeType()
            }else {
                  writeHtml();
            }
      })
}

// called by addNewEmployee 
function askEmployeeType () {
      inquirer.prompt (questions.employeeType)
            .then (({employeeTypeChoice})=>{
                  employeeTypeGV = employeeTypeChoice
                  if( employeeTypeGV === "Engineer") {
                        buildEngineerObj ();
                  } else {
                        buildInternObj ();
                  }
            })
}

function buildEngineerObj () {
      inquirer.prompt (questions.engineer)
            .then (({name, id, email, github, addTeamMemberChoice})=>{
                  let engineer = new Engineer (name, id, email, github);
                  employeesArrGV.push(engineer);
                  addNewEmployee();
            })
}

function buildInternObj () {
      inquirer.prompt (questions.intern)
            .then (({name, id, email, school, addTeamMemberChoice})=>{
                  let intern = new Intern (name, id, email, school);
                  employeesArrGV.push(intern);
                  addNewEmployee();
            })
}

// calledd by addNewEmployee
function writeHtml () {
      let htmlDoc = html(employeesArrGV);
      fs.writeFile ('./Dist/team.html', htmlDoc, () => {console.log('HTML File Written')});
}

function init () {
      buildManagerObj ()
}

 init ();

/* PSEUDO CODE
user is prompted to enter a managers information
manager object is built and passed to global variable
user prompted to add another emplyee
user selects type of employee to add
depending on type of employee chosen to enter user enters information for that employee
employee object is pushed to global variable
once user is done enetering employees an HTML file is written based on the global variable array
*/