const { GenericCommand } = require('../../models/')
const ascii = require('asciiart-logo')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    return '```\n' + ascii({
      name: 'HI!',
      font: 'Standard',
      lineChars: 10,
      padding: 2,
      margin: 2
    })
      .emptyLine()
      .right(`-${msg.author.username}`)
      .emptyLine()
      .render() + '\n```'
  }, {
    triggers: ['hi', 'ascii'],
    description: 'Write in ascii via the bot',
    usage: '{command}'
  }
)
