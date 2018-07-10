const { GenericCommand } = require('../../models/')
const snek = require('snekfetch')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let data = await snek.get('http://api.yomomma.info/')
    data = JSON.parse(data.text)
    return data.joke
  },
  {
    triggers: ['yomomma', 'momma', 'ym'],
    description: 'Yo momma so fat..'
  }
)
