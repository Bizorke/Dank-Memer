const { GenericCommand } = require('../../models')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const db = await Memer.db.getGuild(msg.channel.guild.id)
    const prefix = db ? db.prefix : Memer.config.defaultPrefix
    let help = Memer.config.help
    if (!args[0]) {
      let categories = {}
      for (const command of Memer.cmds) {
        if (command.props.ownerOnly || command.props.hide) {
          continue
        }

        let category = categories[command.category]
        if (!category) {
          category = categories[command.category] = []
        }
        category.push(command.props.triggers[0])
      }

      return {
        title: help.title,
        description: help.message,
        fields: Object.keys(categories).map(category => ({ name: category, value: `${categories[category].length} commands\n\`${prefix} help ${category.split(' ')[1].toLowerCase()}\``, inline: true })),
        footer: { text: help.footer }
      }
    }

    const command = Memer.cmds.find(c => c.props.triggers.includes(args[0]))
    const categorySearch = Memer.cmds.find(c => c.category.split(' ')[1].toLowerCase().includes(args[0]))

    if (command) {
      await addCD()
      Memer.log(command)
      return {
        fields: [
          { 'name': 'Description:', 'value': command.props.description },
          { 'name': 'Usage:', 'value': `\`${command.props.usage.replace('{command}', `${prefix} ${command.props.triggers[0]}`)}\`` },
          { 'name': 'Aliases:', 'value': command.props.triggers.join(', ') }
        ]
      }
    } else if (categorySearch) {
      await addCD()
      let categories = {}
      for (const command of Memer.cmds) {
        if (command.props.ownerOnly || command.props.hide) {
          continue
        }

        let category = categories[command.category]
        if (!category) {
          category = categories[command.category] = []
        }
        category.push(command.props.triggers[0])
      }
      const categoryName = Object.keys(categories).find(c => c.split(' ')[1].toLowerCase() === args[0])
      const commands = categories[categoryName]
      return {
        title: categoryName,
        description: commands.join(', '),
        footer: { text: `use ${prefix} before each command!` }
      }
    }
  },
  {
    triggers: ['help', 'cmds', 'commands'],
    description: 'See a list of commands available.',
    perms: ['embedLinks']
  }
)
