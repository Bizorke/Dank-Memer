const { GenericCommand } = require('../../models/')
const isOpus = require('../../utils/isOpus.js')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!msg.attachments[0]) {
      return 'You gotta give me a sound clip smh'
    }

    const opus = await isOpus(msg.attachments[0].url)

    if (!opus) {
      return 'gotta gimme a sound clip in opus format :triumph:'
    } else {
      return 'gucci, thx bb'
    }
  },
  {
    triggers: ['addclip'],
    usage: '{command}',
    description: 'Add a soundboard clip!',
    perms: ['embedLinks']
  }
)
