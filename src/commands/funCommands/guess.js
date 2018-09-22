const GenericCommand = require('../../models/GenericCommand')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const number = Number(msg.args.gather()) || 10
    if (!number || !Number.isInteger(number)) {
      return 'It\'s gotta be a valid number above 10 come on'
    }
    if (number < 10) {
      return 'far out that\'s not really a challenge is it??'
    }
    if (number > 100) {
      return 'Let\'s try our best to keep the number under 100'
    }
    const random = Memer.randomNumber(1, number)
    let attempts = 2 + Math.round(number / 10)
    msg.reply(`Time to play the game of the year! You've got ${attempts} attempt${attempts === 1 ? '' : 's'} to try and guess my random number between **1 and ${number}**.\nType your answer in the chat as a valid number. You can type \`end\` at anytime to stop.`)

    const guess = async () => {
      let message = ''
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (!prompt || !prompt.content) {
        return msg.channel.createMessage('alright looks like we\'re not playing the game, whatever')
      }
      if (prompt.content.toLowerCase() === 'end') {
        return msg.channel.createMessage('You ended the game')
      }
      const picked = Number(prompt.content)

      if (picked === random) {
        return msg.channel.createMessage(`Good stuff, you got the number right. I was thinking of **${random}**`)
      }
      if (attempts <= 1) {
        return msg.channel.createMessage(`Unlucky, you ran out of attempts to guess the number. I was thinking of **${random}**`)
      }

      if (!picked || !Number.isInteger(picked)) {
        message = `SMH it's gotta be a **valid** number between \`1\` and \`${number}\``
      } else if (picked > number || picked < 1) {
        message = `Listen buddy, it's gotta be a number between \`1\` and \`${number}\`. No higher, no lower`
      } else {
        message = `not this time, too ${random - picked > 0 ? 'low' : 'high'}`
      }
      msg.channel.createMessage(`${message}\nYou've got ${attempts -= 1} attempt${attempts === 1 ? '' : 's'} left.`)
      await guess()
    }

    await guess()
  }, {
    triggers: ['guess', 'hol'], // hol = higher or lower
    usage: '{command} [number]',
    description: 'guessing game of the year 10/10'
  }
)
