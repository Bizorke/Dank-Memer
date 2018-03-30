const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['lizzyboi', 'lizard', 'scales'],
  description: 'See some cute lizzybois!',

  title: '🦎',
  reqURL: 'https://testy.nekos.life/api/v2/img/lizard',
  JSONKey: 'url'
})
