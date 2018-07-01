const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer }) => {
    return {
      content: '',
      file: { file: Memer.sillyFace, name: 'mock.jpg' }
    }
  }, {
    triggers: ['sillyface'],
    description: 'As seen on youtube, sillyface!',
    perms: ['attachFiles']
  }
)
