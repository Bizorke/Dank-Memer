const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async () => ({
    title: 'Donate to Dank Memer',
    description: 'Help fund Dank Memer to keep it alive and performing well, as well as earning some sweet perks!\n\n[Paypal](https://www.paypal.me/melmsie) - One time donation\n[Patreon](https://www.patreon.com/dankmemerbot) - Monthly support\n\nIf you donate please remember to join [this server](https://discord.gg/ngy5hz9) or you will not be able to get perks for donating.',
    footer: { text: 'hi mom!' }
  }), {
    triggers: ['donate', 'patreon', 'donut'],
    description: 'See how you can donate to the bot to support the development and get some sweet perks!',
    perms: ['embedLinks']
  }
)
