const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const target = msg.args.gather().toLowerCase() === 'me' ? msg.author : (msg.args.resolveUser(true) || msg.author)
    const name = target.nick || target.username
    return {
      description: `This kitty was created uniquely to ${name}'s Discord ID.\nIt is highly unlikely that you will ever see two users with the same kitty!`,
      image: { url: `https://robohash.org/${target.id}?set=set4` },
      footer: { text: 'https://robohash.org/' }
    }
  }, {
    triggers: ['spiritkitten', 'spiritkitty'],
    usage: '{command}',
    description: 'See your spirit kitty'
  }
)
