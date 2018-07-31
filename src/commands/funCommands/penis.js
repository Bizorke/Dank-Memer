const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let config = Memer.config
    let args = msg.args.args
    let target = !args[0] || args[0].toLowerCase() === 'me'
      ? msg.author.username
      : (
        msg.mentions[0]
          ? msg.mentions[0].nick || msg.mentions[0].username
          : args.join(' ')
      )
    return {
      title: 'peepee size machine',
      description: `${target}'s penis\n8${'='.repeat(Math.floor(Math.random() * (config.developers.includes(msg.author.id) ? 0 : 10)) + 1)}D`
    }
  },
  {
    triggers: ['penis', 'howbig', 'peepee'],
    description: 'See how dank you are'
  }
)
