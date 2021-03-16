const GenericImageCommand = require('../../models/GenericImageCommand.js');

module.exports = new GenericImageCommand({
  triggers: ['bongocat', 'bongo'],
  description: 'smack smack...'
});
