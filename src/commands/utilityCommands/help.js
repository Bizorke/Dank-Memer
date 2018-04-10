const { GenericCommand } = require('../../models')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!args[0]) {
      let categories = {}
      for (const command of Memer.cmds) {
        if (command.props.ownerOnly) {
          continue
        }

        let category = categories[command.category]
        if (!category) {
          category = categories[command.category] = []
        }
        category.push(command.props.triggers[0])
      }

      return {
        title: 'Available Commands',
        description: 'Want 750 meme coins? Spend 1 minute [voting here](https://discordbots.org/bot/270904126974590976/vote) and it will get automatically added to your account!\nThis can be ran every 24 hours!',
        fields: Object.keys(categories).map(category => ({ name: category, value: categories[category].join(', ') })),
        footer: { text: 'twitter.com/dankmemerbot' }
      }
    }

    const command = Memer.cmds.find(c => c.props.triggers.includes(args[0]))
    if (!command) {
      return
    }

    const db = await Memer.db.getGuild(msg.channel.guild.id)
    const prefix = db ? db.prefix : Memer.config.defaultPrefix

    await addCD()
    return {
      fields: [
        { 'name': 'Description:', 'value': command.props.description },
        { 'name': 'Usage:', 'value': Memer.codeblock(command.props.usage.replace('{command}', `${prefix} ${command.props.triggers[0]}`)) },
        { 'name': 'Triggers:', 'value': command.props.triggers.join(', ') }
      ]
    }
  },
  {
    triggers: ['help', 'cmds', 'commands'],
    description: 'See a list of commands available.',
    perms: ['embedLinks']
  }
)
