const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let user = msg.author
    let userDB = await Memer.db.getUser(user.id)
    let donor = await Memer.db.checkDonor(user.id)
    let total = await Memer.calcMultiplier(Memer, user, userDB, donor, msg)
    let show = await Memer.showMultiplier(Memer, user, userDB, donor, msg)
    console.log(total)
    await addCD()
    return {
      title: `Here is some info about your Multipliers, ${user.username}`,
      description: `__Current Total Multiplier__: **${total}%**\n__Multiplier Upgrades Bought__: **${show.bought}** (+${show.bought * 0.005}%)\n__Secret Multipliers__: *See below*`,
      fields: [
        { name: `${show.unlocked.total} Unlocked`, value: show.unlocked.list.join('\n'), inline: true },
        { name: `${show.locked} Locked`, value: show.locked < 8 ? 'UNKNOWN\n'.repeat(show.locked) : `UNKNOWN x${show.locked}`, inline: true }
      ]
    }
  },
  {
    triggers: ['multiplier', 'multi'],
    description: 'Check your multiplier amount',
    perms: ['embedLinks']
  }
)
