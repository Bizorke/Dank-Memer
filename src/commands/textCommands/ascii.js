const { GenericCommand } = require('../../models/')
const ascii = require('asciiart-logo')

module.exports = new GenericCommand(
  async ({ Memer, msg, cleanArgs }) => {
    let args = cleanArgs
    if (args.join(' ').length > 24) {
      return 'That is too long mate'
    }
    return '```\n' + ascii({
      name: args.join(' '),
      font: 'Standard',
      lineChars: 10,
      padding: 1,
      margin: 1
    })
      .emptyLine()
      .right(`-${msg.author.username}`)
      .emptyLine()
      .render() + '\n```'
  }, {
    triggers: ['ascii'],
    description: 'Write in ascii via the bot',
    usage: '{command} <what you want the bot to ascii>',
    missingArgs: 'What do you want me to ascii?'
  }
)
