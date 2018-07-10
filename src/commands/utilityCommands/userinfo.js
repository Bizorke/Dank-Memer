const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let user = msg.args.resolveUser(true)
    if (!user) {
      user = msg.author
    }
    let db = await Memer.db.getUser(user.id)
    const creation = new Date(user.createdAt)
    return {
      title: `${user.username}#${user.discriminator} - ${user.id}`,
      thumbnail: { url: user.avatarURL },
      fields: [
        { name: 'Created at', value: creation.toDateString(), inline: true },
        { name: 'Commands run', value: db.pls, inline: true }
      ]
    }
  }, {
    triggers: ['userinfo', 'ui'],
    usage: '{command} <person>',
    description: 'See info about some'
  }
)
