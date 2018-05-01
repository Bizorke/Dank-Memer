const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async () => ({
    title: 'Donate to Dank Memer <:giveSign:428024864775864331>',
    description: 'Help fund Dank Memer to keep it alive and performing well. We don\'t make any profit, and all proceeds go to server or API costs.\n\n[Paypal](https://www.paypal.me/melmsie) - One time donation\n[Patreon](https://www.patreon.com/dankmemerbot) - Monthly support\n\nIf you donate please remember to message Melmsie#0001 or you will not be able to get perks for donating.',
    footer: { text: 'Earn some sweet perks in the process!' }
  }), {
    triggers: ['donate', 'patreon', 'donut'],
    description: 'See how you can donate to the bot to support the development and get some sweet perks!',
    perms: ['embedLinks']
  }
)
