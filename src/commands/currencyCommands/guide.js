const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD()
    return {
      title: `Read all about meme coins:`,
      description: `For ease of use, our currency guide is on google docs.\n**[Click Here](https://docs.google.com/document/d/1jI8PvRW15W920JTDXtNIt0HQTpuaVZ5SULl-7wmtMzY/edit?usp=sharing) to read it!**`,
      footer: {text: 'If you have any questions, feel free to ask in the support server!'}
    }
  },
  {
    triggers: ['guide', 'coinhelp', 'thesecoinsmakenosense'],
    description: 'read about our currency!'
  }
)
