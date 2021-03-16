const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['hoppyboi', 'rabbit', 'bunny'],
  description: 'See some cute bunnies!',
  footer: 'Hop right into my heart please',
  perms: ['embedLinks'],
  endpoint: '/r/Rabbits/top/.json?sort=top&t=day&limit=100',
  type: 'image'
});
