const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  () => 'dank meme merch best merch: https://goo.gl/4mKBgd',
  {
    triggers: ['merch', 'mememerch'],
    description: 'Come check out our sponsor!',
    perms: ['embedLinks']
  }
)
