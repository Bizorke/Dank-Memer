<<<<<<< Updated upstream
const GenericCommand = require('../../models/GenericCommand')
=======
const { GenericCommand } = require('../../models/');
>>>>>>> Stashed changes

module.exports = new GenericCommand(
  () => '( ͡° ͜ʖ ͡°)',
  {
    triggers: ['lenny'],
    description: 'you know what lenny is, everyone does.',
    perms: []
  }
);
