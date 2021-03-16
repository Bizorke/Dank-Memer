const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`));

module.exports = {
  commands,
  name: '😄 Fun',
  description: 'These commands are fun for even the most boring of your friends!'
};
