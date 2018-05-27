const { GenericCommand } = require('../../models/')
const idEncode = require('../../utils/idencode.js')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!msg.attachments[0]) {
      return 'You gotta give me a sound clip smh'
    }

    const format = await idEncode(msg.attachments[0].url)
      .catch(err => '') // eslint-disable-line
      // technically i am handling the error by providing a default format

    if (format !== 'opus') {
      return 'gotta gimme a sound clip in opus format :triumph:'
    } else {
      return 'gucci, thx bb'
    }
  },
  {
    triggers: ['addclip'],
    usage: '{command} <question>',
    description: 'Add a soundboard clip!!',
    perms: ['embedLinks']
  }
)
