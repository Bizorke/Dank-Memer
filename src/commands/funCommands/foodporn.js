const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['foodporn'],
  description: 'See some food that makes your mouth water',

  endpoint: '/r/FoodPorn/top/.json?sort=top&t=day&limit=75',
  type: 'image'
})
