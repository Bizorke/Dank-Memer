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
        description: 'We want to be able to upgrade our server for better performance. If you\'re able and willing to donate, you can do so on [patreon](https://www.patreon.com/dankmemerbot) or [paypal](https://www.paypal.me/melmsie). It will help out a ton, and all money goes towards the bot!',
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
