const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ msg }) => {
    let args = msg.args.args
    let target = !args[0] || args[0].toLowerCase() === 'me'
      ? msg.author.username
      : (
        msg.mentions[0]
          ? `${msg.mentions[0].nick || msg.mentions[0].username} is`
          : `${args.join(' ')} is`
      )
    return {
      title: 'peepee size machine',
      description: `${target}'s penis\n8${'='.repeat(Math.floor(Math.random() * 10) + 1)}D`
    }
  },
  {
    triggers: ['penis', 'howbig', 'peepee'],
    description: 'See how dank you are'
  }
)
