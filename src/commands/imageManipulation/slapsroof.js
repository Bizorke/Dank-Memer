const GenericImageCommand = require('../../models/GenericImageCommand.js');

module.exports = new GenericImageCommand({
  triggers: ['slapsroof', 'carsalesman'],
  description: 'this bad boy can fit so many memes...',
  usage: '{command} <something that will fit in this car>',

  requiredArgs: 'You need to say what fits in this car, try again.',
  textLimit: 19,
  textOnly: true
});
