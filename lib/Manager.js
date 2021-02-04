const Employee = require('./Employee.js');

class Manager extends Employee {
      constructor (name, id, email, officeNumber) {
            super (name, id, email);
            this.officeNumber = officeNumber;
            this.role = 'Manager';
      }

      getOfficeNumber() {
            return this.officeNumber;
      }
}

// const managerQuestions = [
//       {type: 'input', message: `Enter Manager's Name`, name: 'name'}, 
//       {type: 'input', message: `Enter Manager's Employee ID`, name: 'id'},
//       {type: 'input', message: `Enter Manager's Email Address`, name: 'email'},
//       {type: 'input', message: `Enter Manager's Office Number`, name: 'officeNumber'},
//       {type: 'list', message: `Would would like to add a team member?`, name: 'addTeamMemberChoice', choices: ['Yes', 'No']},
// ];


module.exports = Manager
