const { GenericCommand } = require('../../models')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const commands = Memer.cmds.filter(cmd => !cmd.props.ownerOnly && !cmd.props.hide)
    const db = await Memer.db.getGuild(msg.channel.guild.id)
    const prefix = db ? db.prefix : Memer.config.defaultPrefix
    let help = Memer.config.help

    if (msg.args.isEmpty) {
      let categories = {}
      let description = {}
      for (const command of commands) {
        let category = categories[command.category] = (categories[command.category] || [])
        description[command.category] = description[command.category] || command.description
        category.push(command.props.triggers[0])
      }
      return {
        title: help.title,
        description: help.message,
        fields: Object.keys(categories).sort((a, b) => categories[b].length - categories[a].length).map(category => ({ name: `${category}`, value: `\`${prefix} help ${category.split(' ')[1].toLowerCase()}\`\n[Hover for info](https://gist.github.com/melmsie/e36d102e7871a0bf6d007198b0d0ae05 "${description[category]}\n${categories[category].length} total commands")`, inline: true })),
        footer: { text: help.footer }
      }
    }

    const command = Memer.cmds.find(c => c.props.triggers.includes(args[0].toLowerCase()))
    const categorySearch = Memer.cmds.find(c => c.category.split(' ')[1].toLowerCase() === args[0].toLowerCase())

    await addCD()
    if (command) {
      return {
        fields: [
          { 'name': 'Description:', 'value': command.props.description },
          { 'name': 'Usage:', 'value': `\`${command.props.usage.replace('{command}', `${prefix} ${command.props.triggers[0]}`)}\`` },
          { 'name': 'Aliases:', 'value': command.props.triggers.join(', ') }
        ]
      }
    } else if (categorySearch) {
      let categories = {}
      let donorCommands = []
      for (const command of commands) {
        let category = categories[command.category] = (categories[command.category] || [])
        if (!command.props.donorOnly) {
          category.push(command.props.triggers[0])
        } else {
          donorCommands.push(command.props.triggers[0])
        }
      }
      const categoryName = Object.keys(categories).find(c => c.split(' ')[1].toLowerCase() === args[0].toLowerCase())
      const categoryCommands = categories[categoryName]

      if (!categoryCommands) {
        return 'that\'s not a valid category smh'
      }

      return {
        title: categoryName,
        description: categoryCommands.join(', ') + (donorCommands ? `\n\n**[Premium Only](https://www.patreon.com/dankmemerbot)**\n${donorCommands.join(' ')}` : ''),
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
