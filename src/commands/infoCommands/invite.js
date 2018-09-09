const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async () => ({
    fields: [
      { name: 'Add Dank Memer', value: '\n[Here](https://goo.gl/HL3zBi)', inline: true },
      { name: 'Join a Dank Server', value: '\n[Here](https://discord.gg/ebUqc7F)', inline: true },
      { name: 'See a Dank Twitter', value: '\n[Here](https://twitter.com/dankmemerbot)', inline: true },
      { name: 'Use a Dank Subreddit', value: '\n[Here](https://www.reddit.com/r/dankmemer/)', inline: true },
      { name: 'Buy some Dank Premium', value: '\n[Here](https://www.patreon.com/dankmemerbot)', inline: true },
      { name: 'See some Dank Code', value: '\n[Here](https://github.com/Dank-Memer)', inline: true }

    ]
  }), {
    triggers: ['invite', 'support', 'server', 'links'],
    description: 'Get an invite for the bot or to the support server. Also some extra links to use.',
    perms: ['embedLinks']
  }
)
