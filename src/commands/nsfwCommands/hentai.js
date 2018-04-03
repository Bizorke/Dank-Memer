const { GenericCommand } = require('../../models/')
const gifs = [
  'https://cdn.discordapp.com/attachments/424848288823640066/427360898706046976/a2f4_154.gif',
  'https://cdn.discordapp.com/attachments/424848288823640066/427359422096867328/4fc4_152.gif'
]

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
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
