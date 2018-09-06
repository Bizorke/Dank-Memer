
const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const argument = msg.args.gather()
    if (!argument) {
      return 'You need to provide either `add` to add this server as a premium server, `remove` to remove this server\'s premium status or `list` to list the current premium servers you have redeemed.'
    }

    await addCD()
    const donor = await Memer.db.getDonor(msg.author.id)
    let guilds = donor.guilds
    if (argument === 'add') {
      if (donor.guilds.includes(msg.channel.guild.id)) {
        return 'This server is already a premium server!'
      }

      guilds.push(msg.channel.guild.id)
      let guildRedeems = donor.guildRedeems++
      await Memer.db.updateDonorGuild(msg.author.id, guilds, guildRedeems)
      return `Successfully added **${msg.channel.guild.name}** as a premium server!`
    } else if (argument === 'remove' || argument === 'delete') {
      if (!donor.guilds.includes(msg.channel.guild.id)) {
        return 'This server hasn\'t been added as a premium server'
      }

      guilds.splice(guilds.indexOf(msg.channel.guild.id), 1)
      let guildRedeems = donor.guildRedeems--
      await Memer.db.updateDonorGuild(msg.author.id, guilds, guildRedeems)
      return `**${msg.channel.guild.name}** is no longer a premium server.`
    } else {
      return {
        title: `Premium servers redeemed by ${msg.author.username}`,
        description: guilds.map((id, index) => `\`${index + 1}.\` **${Memer.bot.guilds.find(g => g.id === id).name}** (${id})\n`).join(', ') || 'You have redeemed no premium servers'
      }
    }
  },
  {
    triggers: ['premiumserver', 'pserver', 'premium', 'donorserver'],
    usage: '{command} [add | remove]',
    donorBlocked: true,
    description: 'Add or remove the current guild as a premium server, or leave the arguments blank to list all of your premium servers'
  }
)
