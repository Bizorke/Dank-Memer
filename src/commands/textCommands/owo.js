<<<<<<< Updated upstream
const GenericCommand = require('../../models/GenericCommand')
=======
const { GenericCommand } = require('../../models/');
>>>>>>> Stashed changes

module.exports = new GenericCommand(
  () => 'OwO',
  {
    triggers: ['owo'],
    description: 'owo whats this',
    perms: []
  }
);
