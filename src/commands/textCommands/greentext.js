const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ args }) => {
    return '```css\n>' + args.join(' ') + '\n```'
  }, {
    triggers: ['greentext', '>', 'gt'],
    description: 'Make the bot say whatever you want with greentext',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'Give me something to greentext and try again'
  }
)
