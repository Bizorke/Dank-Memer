const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['madlads', 'madlad', 'cantbestopped', '2mad4me', 'madwoman', 'madwomen'],
  description: 'THESE LADS ARE OFF THEIR WALKERS',

  endpoint: '/r/madlads/top/.json?sort=top&t=week&limit=300',
  type: 'image'
})
