<<<<<<< Updated upstream
const GenericCommand = require('../../models/GenericCommand')
=======
const { GenericCommand } = require('../../models/');
>>>>>>> Stashed changes

module.exports = new GenericCommand(
  () => 'http://dankmemer.lol/',
  {
    triggers: ['website', 'site'],
    description: 'Come check out our website!',
    perms: ['embedLinks']
  }
);
