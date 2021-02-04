const Employee = require('./Employee.js');

class Engineer extends Employee {
      constructor (name, id, email, github) {
            super (name, id, email);
            this.github = github;
            this.role = 'Engineer';
      }

      getGithub() {
            return this.github;
      }
}

// const engineerQuestions = [
//       {type: 'input', message: `Enter Engineer's Name`, name: 'name'}, 
//       {type: 'input', message: `Enter Engineer's Employee ID`, name: 'id'},
//       {type: 'input', message: `Enter Engineer's Email Address`, name: 'email'},
//       {type: 'input', message: `Enter Engineer's GitHub User Name`, name: 'github'},
//       {type: 'list', message: `Would would like to add a team member?`, name: 'addTeamMemberChoice', choices: ['Yes', 'No']},
// ];


module.exports = Engineer
