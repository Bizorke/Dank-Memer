const { GenericCommand } = require('../../models/')
const VENT_CID = '424848288823640066'

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    msg.channel.createMessage({ embed: {
      title: 'Welcome to the meme coins grant department',
      color: Memer.randomColor(),
      description: 'The purpose of this command is to request a Meme Government grant. (A loan that does not need paid back.\n\n**Would you like to start the application process?**\nPlease respond with "yes" or "no"'
    }})

    const agree = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
    if (!agree) {
      return 'Prompt timed out, I\'ll take that as a no..'
    } else if (agree.content.includes('no')) {
      return 'Application Canceled.'
    } else if (agree.content.includes('yes')) {
      msg.channel.createMessage('How any meme coins would you like to request?')
      const amount = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (!amount) {
        return 'Prompt timed out, canceling your application.'
      } else if (!amount.cleanContent) {
        return 'hmmmm'
      }

      msg.channel.createMessage('Why do you need coins? Make this a good reason!')
      const reason = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 12e4)
      if (!reason) {
        return 'Prompt timed out, canceling your application.'
      } else if (!reason.cleanContent) {
        return 'hmmmmmmm'
      }
      await addCD()

      await Memer.bot.createMessage(VENT_CID, { embed: {
        title: `${msg.author.username}#${msg.author.discriminator} | ${msg.author.id}`,
        author: { name: 'Meme Coin Grant Application' },
        description: reason.content,
        fields: [{ name: 'Amount Requested', value: amount.content }],
        color: Memer.randomColor(),
        footer: { text: `Guild ID: ${msg.channel.guild.id}` },
        timestamp: new Date()
      }})

      return {
        title: 'Your application has been submitted!',
        color: Memer.randomColor(),
        description: 'You application is now in the waiting queue!\nCurrent average response time: **420 hours**\n\nYou can send one application every week, if you do not hear back within a week, try again next week!'
      }
    }
    return 'Application Canceled, respond with **yes** or **no** next time.'
  }, {
    triggers: ['grantapply', 'coingrant'],
    description: 'Make some hot new memes on your own!',
    perms: ['attachFiles']
  }
)
