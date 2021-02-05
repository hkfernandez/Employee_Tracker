
const boilerplate =[
      {type: 'list', message: `What would you like to do?`, name: 'boilerplateChoice', choices: ['View of list of departments, roles or employees','Create a new department', 'Add a new role', 'Add a new employee', `Change an employee's manager`]},
]

const addEmployee = [
      {type: 'input', message: `Enter first name`, name: 'firstName'}, 
      {type: 'input', message: `Enter enter last name`, name: 'lastName'},
      {type: 'input', message: `Enter enter employee role`, name: 'employeeRole'},
      {type: 'input', message: `Enter employee manager's name`, name: 'managerName'},
];


const addRole = [
      {type: 'input', message: `Enter new role title`, name: 'roleName'}, 
      {type: 'input', message: `Enter what department does this fall under`, name: 'roleDept'},
      {type: 'input', message: `What is the salary for this postiion`, name: 'roleSalary'},
];


const addDept = [
      {type: 'input', message: `What is the name of the new department?`, name: 'name'}, 
];

const selectList =[
      {type: 'list', message: `What would you like to see a list of?`, name: 'listTypeChoice', choices: ['Departments','Roles', 'Employees']},
]

const changeManager =[
      {type: 'list', message: `Select the employee`, name: 'employee', choices: ['Departments','Roles', 'Employees']},//address
      {type: 'list', message: `Select the manager`, name: 'manager', choices: ['Departments','Roles', 'Employees']}//address
]


module.exports = {boilerplate, addEmployee, addRole, addDept, selectList, changeManager}