const Employee = require('./Employee.js');

class Intern extends Employee {
      constructor (name, id, email, school) {
            super (name, id, email);
            this.school = school;
            this.role = 'Intern';
      }

      getSchool() {
            return this.school;
      }
}

// const internQuestions = [
//       {type: 'input', message: `Enter Intern's Name`, name: 'name'}, 
//       {type: 'input', message: `Enter Intern's Employee ID`, name: 'id'},
//       {type: 'input', message: `Enter Intern's Email Address`, name: 'email'},
//       {type: 'input', message: `Enter Intern's School They Attend`, name: 'school'},
//       {type: 'list', message: `Would would like to add a team member?`, name: 'addTeamMemberChoice', choices: ['Yes', 'No']},
// ];

module.exports = Intern

