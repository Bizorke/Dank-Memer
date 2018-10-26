const GenericImageCommand = require('../../models/GenericImageCommand.js');

module.exports = new GenericImageCommand({
  triggers: ['youtube', 'comment'],
  description: 'saying first is still funny...',
  usage: '{command} <something to put in your comment>',

  requiredArgs: 'You need to put some text in your comment, try again.',
  textLimit: 58
});
