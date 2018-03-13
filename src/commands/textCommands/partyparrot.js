const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ args }) => {
    if (args.length === 1) {
      return args[0].split('').join(' <a:party:422909953737490432> ')
    } else {
      return args.join(' <a:party:422909953737490432> ')
    }
  }, {
    triggers: ['partyparrot', 'party'],
    description: 'Make the bot say whatever you want in party form!',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say?'
  }
)
