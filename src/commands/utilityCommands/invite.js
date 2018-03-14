const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async () => ({
    fields: [
      { name: 'Add Dank Memer', value: '\n[Here](https://goo.gl/BPWvB9)', inline: true },
      { name: 'Join a Dank Server', value: '\n[Here](https://discord.gg/ebUqc7F)', inline: true },
      { name: 'Add Premium Memer', value: '\n[Here](https://discordapp.com/oauth2/authorize?client_id=419254454169108480&scope=bot&permissions=0)', inline: true }
    ]
  }), {
    triggers: ['invite', 'support', 'server'],
    description: 'Get an invite for the bot or to the support server.',
    perms: ['embedLinks']
  }
)
