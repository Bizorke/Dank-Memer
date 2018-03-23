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
        description: 'We have just added a ton of new currency commands, fun commands, meme commands, **and** pls hoppyboi for easter!',
        fields: Object.keys(categories).map(category => ({ name: category, value: categories[category].join(', ') })),
        footer: { text: 'Hello darkness my old friend...' }
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
