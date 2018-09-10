
const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const argument = msg.args.gather()
    const redeemValues = {
      3: 1,
      10: 3,
      20: 5
    }

    await addCD()
    const donor = await Memer.db.getDonor(msg.author.id)
    let guilds = donor.guilds
    let guildRedeems = donor.guildRedeems
    if (argument === 'add') {
      if (donor.guilds.includes(msg.channel.guild.id)) {
        return 'This server is already a premium server!'
      }
      for (let [dollar, value] in redeemValues) {
        if (value > guildRedeems && donor.donorAmount < dollar) {
          return 'You have reached the maximum amount of premium guilds for your paid tier!\nTo get more redeemable guilds, visit our Patreon (https://www.patreon.com/dankmemerbot)'
        }
      }

      guilds.push(msg.channel.guild.id)
      await Memer.db.updateDonorGuild(msg.author.id, guilds, guildRedeems++)
      return `Successfully added **${msg.channel.guild.name}** as a premium server!`
    } else if (argument === 'remove' || argument === 'delete') {
      if (!donor.guilds.includes(msg.channel.guild.id)) {
        return 'This server hasn\'t been added as a premium server'
      }

      guilds.splice(guilds.indexOf(msg.channel.guild.id), 1)
      await Memer.db.updateDonorGuild(msg.author.id, guilds, guildRedeems--)
      return `**${msg.channel.guild.name}** is no longer a premium server.`
    } else {
      return {
        title: `Premium servers redeemed by ${msg.author.username}`,
        description: guilds ? guilds.map((id, index) => `\`${index + 1}.\` **${Memer.bot.guilds.find(g => g.id === id).name}** (${id})\n`).join('') : 'You have redeemed no premium servers'
      }
    }
  },
  {
    triggers: ['premiumserver', 'pserver', 'premium', 'donorserver'],
    usage: '{command} [add | remove]',
    donorBlocked: true,
    donorOnly: true,
    description: 'Add or remove the current guild as a premium server, or leave the arguments blank to list all of your premium servers'
  }
)
