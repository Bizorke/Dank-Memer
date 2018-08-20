const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let nickname = msg.args.gather()

    if (!nickname) {
      msg.channel.createMessage('what name do you want to give to everyone? You can type `reset` to remove everyone\'s nickname if they have one. (respond in 30s)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        nickname = prompt.content
      } else {
        return 'Ok I guess we\'re not renaming anyone then'
      }
    }

    if (nickname.toLowerCase() === 'reset') {
      nickname = ''
    }

    await addCD()
    let members = msg.channel.guild.members.filter(m => m.nick || m.user.username !== nickname)
    const next = Number(500 * members.length)
    const hours = Math.floor(next / 3600000)
    const minutes = Math.floor((next / 60000) - (hours * 60))
    const seconds = Math.floor((next / 1000) - ((hours * 3600) + (minutes * 60)))
    const timeArr = [ { type: {singular: 'hour', plural: 'hours'}, amount: hours }, { type: {singular: 'minute', plural: 'minutes'}, amount: minutes }, { type: {singular: 'second', plural: 'seconds'}, amount: seconds } ]
    let properArr = []
    for (let i in timeArr) {
      if (timeArr[i].amount < 1) continue
      properArr.push(`${timeArr[i].amount} ${timeArr[i].amount === 1 ? timeArr[i].type.singular : timeArr[i].type.plural}`)
    }
    const timeLeft = properArr.slice(0, -2).join(', ') + (properArr.slice(0, -2).length ? ', ' : '') + properArr.slice(-2).join(' and ')

    msg.channel.createMessage(`Now starting to mass nickname all members to **${nickname || 'their username'}**\n**ETA**: ${timeLeft}`)
    const promises = []
    let failed = 0
    for (const member of members) {
      promises.push(
        member.edit({ nick: nickname }).catch(() => {
          failed++
        })
      )
    }

    await Promise.all(promises)
    msg.channel.createMessage(`Finished renaming ${members.length - failed} people to ${!nickname ? 'their stinky username' : `**${nickname}**`}.`)
    if (failed) {
      return `I failed to rename ${failed} people, possibly due to permissions.`
    }
  },
  {
    triggers: ['massnick', 'massname'],
    usage: '{command} [nickname | reset]',
    description: 'Warning, this will rename everyone on the server (or everyone with a specific role when provided) if the bot has the correct permissions',
    modPerms: ['manageGuild']
  }
)
