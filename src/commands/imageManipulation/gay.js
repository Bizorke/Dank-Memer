const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['gay', 'gaypride', 'pride'],
  description: 'Show your gay pride!',
  reqURL: 'http://127.0.0.1:5000/api/gay'
})
