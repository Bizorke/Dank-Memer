const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
<<<<<<< HEAD
    const biggay = msg.channel.guild.roles.find(r => r.name === 'big gay')
    const reason = `\`biggay\` - ran by ${msg.author.username}#${msg.author.discriminator}`
    let member = Memer.randomInArray(msg.channel.guild.members.filter(member => member.id !== Memer.bot.user.id && member.id !== msg.channel.guild.ownerID && (biggay ? !member.roles.includes(biggay.id) : true)))
    if (!member) {
      return 'There\'s nobody that I can give the big gay to!'
    }
    if (biggay) {
      member.addRole(biggay.id, reason)
    } else {
      msg.channel.guild.createRole({ name: 'big gay', hoist: true, color: '16056407' }, reason)
        .then(async (role) => {
          await Memer.sleep(100)
          let botRole = msg.channel.guild.members.get(Memer.bot.user.id).roles.sort((a, b) => a.position - b.position)[0] || msg.channel.guild.id
          botRole = msg.channel.guild.roles.get(botRole)
          await role.editPosition(botRole.position - 1)
          await member.addRole(role.id, reason)
        })
        .catch(() => {
          return `I wasn't able to add the big gay role to ${member}. Check that I have the correct permissions to add and edit roles and try again.`
        })
    }
    return `${member.user.username}#${member.user.discriminator} now has the **big gay**`
  }, {
    triggers: ['biggay'],
    usage: '{command} <id> <shit>',
    description: 'melmsie stinks',
    perms: ['manageRoles'],
    modPerms: ['manageRoles']
=======
    // nothing at all
  }, {
    triggers: ['biggay', 'gayrole'],
    usage: '{command} ???',
    description: 'melmsie stinks'
>>>>>>> b73152b7b5c30e67960d96c47cd60873d7768630
  }
)
