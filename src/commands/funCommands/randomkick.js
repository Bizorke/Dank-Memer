const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let perms = msg.channel.permissionsOf(msg.author.id)
    let random = msg.channel.guild.members.random()
    if (random.id === Memer.bot.user.id) {
      return 'wait, I can\'t kick myself, try again.'
    }
    if (!perms.has('kickMembers')) {
      return 'lol you do not have kick members perms and you know it'
    }
    await addCD()
    random.kick().catch(e => { return msg.channel.createMessage(`looks like I dont have perms to kick ${random.username}, try putting my role above everyone else to make this real fun..`) }).then(() => {
      return `lmfao ${random.username} was kicked.`
    })
  },
  {
    triggers: ['randomkick', 'kickroulette'],
    usage: '{command}',
    description: 'Warning, this will kick a random person.',
    perms: ['kickMembers', 'embedLinks']
  }
)
