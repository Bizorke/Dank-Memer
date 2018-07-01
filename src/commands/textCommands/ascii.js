const { GenericCommand } = require('../../models/')
const ascii = require('asciiart-logo')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    return {
      title: `${msg.author.username} says...`,
      description: '```\n' + ascii({
        name: 'HI!',
        font: 'doh',
        lineChars: 1,
        padding: 1,
        margin: 1
      })
        .render() + '\n```'
    }
  }, {
    triggers: ['hi'],
    description: 'As seen on youtube, say hi!',
    usage: '{command} <what you want the bot to ascii>'
  }
)
