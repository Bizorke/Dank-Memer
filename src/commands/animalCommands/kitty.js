const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['kitty', 'pussy', 'cat', 'meow'],
  description: 'Lets see some pretty kitties!',

  title: '😻',
  reqURL: 'https://nekos.life/api/v2/img/meow',
  JSONKey: 'url'
})
