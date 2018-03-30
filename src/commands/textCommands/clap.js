const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ args }) => {
    if (args.length === 1) {
      return args[0].split('').join(' 👏 ')
    } else {
      return args.join(' 👏 ')
    }
  }, {
    triggers: ['clap', 'clapify'],
    description: 'Make the bot say whatever you want with sass!',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say?'
  }
)
