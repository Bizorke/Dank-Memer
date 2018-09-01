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
    let oldNicknames = {}
    if (nickname.toLowerCase() === 'reset') {
      nickname = ''
      oldNicknames = await Memer.redis.getAsync(`massnick-${msg.channel.guild.id}`).then(res => res ? JSON.parse(res) : {})
    }

    await addCD()
    let members = msg.channel.guild.members.filter(m => ((m.nick || m.user.username) !== nickname) &&
      getHighestRolePos(msg.channel.guild.members.get(Memer.bot.user.id), msg.channel.guild) > getHighestRolePos(m, msg.channel.guild) &&
      (m.nick ? m.nick !== oldNicknames[m.id] : true))
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
    let action = !nickname
      ? 'Now starting to reset the nickname of all members. Any members who previously had a nickname set and was mass-nicked within the last 6 hours will have their name reset back to their old nickname.'
      : `Now starting to mass nickname all members to **${nickname}**`
    msg.channel.createMessage(`${action}\n**ETA**: ${timeLeft}`)
    const promises = []
    let failed = 0
    let nicknames = {}
    // Cache the members who had the given nickname already as well so they won't be reset to their username on massnick reset
    if (nickname) {
      for (const member of msg.channel.guild.members.filter(m => m.nick === nickname)) {
        nicknames[member.id] = member.nick
      }
    }
    for (const member of members) {
      if (nickname && member.nick) {
        nicknames[member.id] = member.nick
      }
      if (getHighestRolePos(msg.channel.guild.members.get(Memer.bot.user.id), msg.channel.guild) > getHighestRolePos(member, msg.channel.guild)) {
        promises.push(
          member.edit({ nick: nickname || (oldNicknames[member.id] || nickname) }).catch(() => {
            failed++
          })
        )
      } else {
        failed++
      }
    }

    await Promise.all(promises)
    if (nickname) {
      await Memer.redis.setAsync(`massnick-${msg.channel.guild.id}`, JSON.stringify(nicknames), 'EX', 60 * 60 * 6)
    } else {
      await Memer.redis.delAsync(`massnick-${msg.channel.guild.id}`)
    }
    msg.channel.createMessage(`Finished renaming ${members.length - failed} people to ${!nickname ? 'their stinky username' : `**${nickname}**`}.`)
    if (failed) {
      return `I failed to rename ${failed} people, possibly due to permissions.`
    }
  },
  {
    triggers: ['massnick', 'massname'],
    cooldown: 72e5,
    usage: '{command} [nickname | reset]',
    description: 'Warning, this will rename everyone on the server (or everyone with a specific role when provided) if the bot has the correct permissions',
    modPerms: ['manageGuild'],
    perms: ['manageNicknames']
  }
)

function getHighestRolePos (member, guild) {
  return member.roles[0] ? guild.roles.filter(r => member.roles.includes(r.id)).sort((a, b) => b.position - a.position)[0].position : 0
}
