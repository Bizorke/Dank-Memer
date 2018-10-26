const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['bongocat', 'bongo'],
  description: 'smack smack...'
});
