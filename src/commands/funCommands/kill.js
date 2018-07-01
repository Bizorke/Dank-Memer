const kill = require('../../assets/arrays/kill.json')
const { GenericCommand } = require('../../models/')

const youAreDead = 'Ok you\'re dead. Please tag someone else to kill.'

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let user = msg.args.resolveUser(true)

    if (!user || args[0] === 'me' || user.id === msg.author.id) return youAreDead

    return Memer.randomInArray(kill)
      .replace(/\$mention/g, user.username)
      .replace(/\$author/g, msg.author.username)
  }, {
    triggers: ['kill', 'murder', 'takecareof'],
    usage: '{command} @user',
    description: 'Sick of someone? Easy! Just kill them!'
  }
)
