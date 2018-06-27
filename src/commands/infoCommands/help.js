const { GenericCommand } = require('../../models')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const db = await Memer.db.getGuild(msg.channel.guild.id)
    const prefix = db ? db.prefix : Memer.config.defaultPrefix
    let help = Memer.config.help
    if (!args[0]) {
      let categories = {}
      let description = {}
      let disabled = []
      for (const command of Memer.cmds) {
        if (command.props.ownerOnly || command.props.hide) {
          continue
        }
        if (db) {
          if (db.disabledCommands.includes(command.props.triggers[0])) {
            disabled.push(command.props.triggers[0])
            continue
          }
        }

        let category = categories[command.category]
        if (!category) {
          category = categories[command.category] = []
        }
        category.push(command.props.triggers[0])

        let desc = description[command.category]
        if (!desc) {
          desc = description[command.category] = command.description
        }
      }
      if (disabled.length === 0) {
        return {
          title: help.title,
          description: help.message,
          fields: Object.keys(categories).sort((a, b) => categories[b].length - categories[a].length).map(category => ({ name: `${category}`, value: `\`${prefix} help ${category.split(' ')[1].toLowerCase()}\`\n[Hover for info](http://your-stupidity.needs-to-s.top/5dbd46.png "${description[category]}\n${categories[category].length} total commands")`, inline: true })),
          footer: { text: help.footer }
        }
      }
      return {
        title: help.title,
        description: help.message,
        fields: Object.keys(categories).sort((a, b) => categories[b].length - categories[a].length).map(category => ({ name: category, value: `${categories[category].length} commands\n\`${prefix} help ${category.split(' ')[1].toLowerCase()}\``, inline: true })).concat({ name: 'Disabled Commands', value: disabled.join(', ') }),
        footer: { text: help.footer }
      }
    }

    const command = Memer.cmds.find(c => c.props.triggers.includes(args[0]))
    const categorySearch = Memer.cmds.find(c => c.category.split(' ')[1].toLowerCase() === args[0].toLowerCase())

    if (command) {
      await addCD()
      return {
        fields: [
          { 'name': 'Description:', 'value': command.props.description },
          { 'name': 'Usage:', 'value': `\`${command.props.usage.replace('{command}', `${prefix} ${command.props.triggers[0]}`)}\`` },
          { 'name': 'Aliases:', 'value': command.props.triggers.join(', ') }
        ]
      }
    } else if (categorySearch || args[0].toLowerCase() === 'disabled') {
      await addCD()
      let categories = {}
      for (const command of Memer.cmds) {
        if (command.props.ownerOnly || command.props.hide) {
          continue
        }
        if (db) {
          if (db.disabledCommands.includes(command.props.triggers[0])) {
            let category = categories['❌ Disabled Commands']
            if (!category) {
              category = categories['❌ Disabled Commands'] = []
            }
            category.push(command.props.triggers[0])
            continue
          }
        }

        let category = categories[command.category]
        if (!category) {
          category = categories[command.category] = []
        }
        category.push(command.props.triggers[0])
      }
      const categoryName = Object.keys(categories).find(c => c.split(' ')[1].toLowerCase() === args[0])
      const commands = categories[categoryName]

      if (!commands) {
        return 'that\'s not a valid category smh'
      }

      let footy = categoryName === '❌ Disabled Commands' ? `use ${prefix} enable to add these back` : `use ${prefix} before each command!`
      return {
        title: categoryName,
        description: commands.join(', '),
        footer: { text: footy }
      }
    }
  },
  {
    triggers: ['help', 'cmds', 'commands'],
    description: 'See a list of commands available.',
    perms: ['embedLinks']
  }
)
