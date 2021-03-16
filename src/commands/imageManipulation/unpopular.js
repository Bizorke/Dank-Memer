const GenericImageCommand = require('../../models/GenericImageCommand.js');

module.exports = new GenericImageCommand({
  triggers: ['unpopular', 'wrongopinion'],
  description: 'your opinion is bad and you should feel bad...',
  usage: '{command} <a bad opinion>',

  requiredArgs: 'You need to put some text in for your opinion, try again.',
  textLimit: 152
});