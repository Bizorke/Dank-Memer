const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['memeeconomy', 'memeecon'],
  description: 'See what memes are being invested in the most today',

  endpoint: '/r/surrealmemes/top/.json?sort=top&t=day&limit=100',
  type: 'image'
})
