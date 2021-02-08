

const boilerplate = 
[
      {
            type: 'list', 
            message: `What would you like to do?`, 
            name: 'boilerplateChoice', 
            choices: 
            [
                  'View of list of departments, roles or employees',
                  'Create a new department', 
                  'Add a new role', 
                  'Add a new employee', 
                  `Change an employee's position`,
                  'Exit the program'
            ]
      },
]

const addEmployee = [
      {type: 'input', message: `Enter first name`, name: 'firstName'}, 
      {type: 'input', message: `Enter enter last name`, name: 'lastName'},
];

const addRole = [
      {type: 'input', message: `Enter new role title`, name: 'name'}, 
      {type: 'input', message: `What is the salary for this postiion`, name: 'salary'},
];

const selectDept =[
      {type: 'input', message: `Enter what department does this fall under`, name: 'dept'},
]

const addDept = [
      {type: 'input', message: `What is the name of the new department?`, name: 'name'}, 
];

const selectList =[
      {type: 'list', message: `What would you like to see a list of?`, name: 'listTypeChoice', choices: ['Departments','Roles', 'Employees']},
]

const continueOrMain =[
      {type: 'list', message: `Would you like to continue?`, name: 'choice', choices: ['Continue', 'Return to Main Menu', 'Exit']},
]




module.exports = {boilerplate, addEmployee, addRole, addDept, selectList, continueOrMain, selectDept}
