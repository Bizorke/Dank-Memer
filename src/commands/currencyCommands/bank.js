const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let { bank } = await Memer.db.getUser(msg.author.id)
    console.log(msg.args.args)
    if (msg.args.args[0]) {
      if (msg.args.args[0].toLowerCase() === 'deposit') {
        return 'deposit'
      } else if (msg.args.args[0].toLowerCase() === 'withdraw') {
        return 'withdraw'
      } else {
        return 'Hm, thats not how this command works, second argument should be deposit or withdraw'
      }
    } else {
      const db = await Memer.db.getGuild(msg.channel.guild.id)
      const prefix = db ? db.prefix : Memer.config.defaultPrefix
      await addCD()
      return {
        title: `Current Balance: ${bank}`,
        description: `You can deposit coins with \`${prefix} bank deposit #\`\nYou can withdraw coins with \`${prefix} bank withdraw #\``,
        footer: { text: 'You can earn more vault space by buying upgrades!' }
      }
    }
  },
  {
    triggers: ['bank'],
    description: 'Check your account balance and make deposits or withdraws',
    perms: ['embedLinks']
  }
)
