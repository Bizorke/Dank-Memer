const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let user = msg.args.resolveUser(true)
    if (!user) {
      user = msg.author
    }
    let member = msg.channel.guild.members.get(user.id)
    let db = await Memer.db.getUser(user.id)
    let black = await Memer.db.checkBlocked(user.id)
    let donor = await Memer.db.checkDonor(user.id)
    const creation = new Date(user.createdAt)
    const join = new Date(member.joinedAt)
    return {
      title: `${user.username}#${user.discriminator} - ${user.id}`,
      thumbnail: { url: user.avatarURL },
      fields: [
        { name: 'Created at', value: creation.toDateString(), inline: true },
        { name: 'Joined at', value: join.toDateString(), inline: true },
        { name: 'Commands run', value: db.pls, inline: true },
        { name: 'Avatar URL', value: `[Click Here](${user.avatarURL})`, inline: true },
        { name: 'Nickname', value: member.nick ? member.nick : 'No Nickname here', inline: true },
        { name: 'Game Status', value: member.game ? member.game.name : 'No game status', inline: true },
        { name: 'Blacklisted', value: black ? 'Currently blacklisted' : 'Not blacklisted', inline: true },
        { name: 'Donor Status', value: donor ? `$${donor}/mo` : 'No donor status', inline: true },
        { name: 'Server Roles', value: member.roles.map(r => `<@&${r}>`).join(', '), inline: true }
      ]
    }
  }, {
    triggers: ['userinfo', 'ui'],
    usage: '{command} <person>',
    description: 'See info about someone'
  }
)
