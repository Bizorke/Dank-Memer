const { GenericCommand } = require('../../models/')
const gifs = [
  'https://cdn.discordapp.com/attachments/424848288823640066/427360898706046976/a2f4_154.gif',
  'https://cdn.discordapp.com/attachments/424848288823640066/427359422096867328/4fc4_152.gif'
]
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
      title: 'Hentai in it\'s best form.',
      image: { url: Memer.randomInArray(gifs) },
      footer: { text: 'best porn 10/10' }
    }
  },
  {
    triggers: ['hentai', 'weebporn'],
    description: 'This is some good stuff, trust me'
  }
)
