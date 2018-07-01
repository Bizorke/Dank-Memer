const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ cleanArgs }) => '```css\n>' + cleanArgs.join(' ') + '\n```', {
    triggers: ['greentext', '>', 'gt'],
    description: 'Make the bot say whatever you want with greentext',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'Give me something to greentext and try again'
  }
)
