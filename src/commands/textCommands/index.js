const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`));

module.exports = {
  commands,
  name: '🆗 Text',
  description: 'MaNiPuLaTe TeXt HaHa YeS'
};
