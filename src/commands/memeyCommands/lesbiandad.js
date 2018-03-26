const { GenericCommand } = require('../../models/')
const lockPlaceholder = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lock_font_awesome.svg/2000px-Lock_font_awesome.svg.png'

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let upvoteCheck = await Memer.db.isVoter(msg.author.id)
    if (!upvoteCheck) {
      return {
        title: 'Due to the high demand for this command...',
        description: 'You must [click here](https://discordbots.org/bot/270904126974590976/vote) and vote for Dank Memer!\nIt helps the bot grow a ton! and **you get 500 meme coins for it**',
        thumbnail: { url: lockPlaceholder },
        footer: { text: 'If you don\'t wanna vote, thats fine. (you are not missing much)' }
      }
    }
    return {
      title: '#ThanksForVoting #SaveMyDad',
      image: { url: 'https://cdn.discordapp.com/attachments/405833504702726144/427661334080126977/dad.png' },
      footer: { text: 'fr guys pls, my dad not lesbian' }
    }
  },
  {
    triggers: ['lesbiandad', 'dad'],
    description: 'This is some good stuff, trust me'
  }
)
