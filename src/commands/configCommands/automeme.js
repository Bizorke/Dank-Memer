
const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (!await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This feature is only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot';
    }
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` permissions.';
    }
    let channel = msg.args.resolveChannel();
    if (!channel) {
      return 'come on you gotta give me a channel name or id to autopost memes to';
    }

    let check = await Memer.db.getAutomemeChannel(msg.channel.guild.id);
    if (check.channel === channel.id) {
      await Memer.db.removeAutomemeChannel(msg.channel.guild.id);
      return `I'll no longer autopost memes in <#${channel.id}>.`;
    }

    let interval = Number(msg.args.gather());
    if (!interval || !Number.isInteger(interval) || Number.isNaN(interval) || interval < 5) {
      interval = 5;
    }

    if (interval % 5 !== 0) {
      return 'You need to provide an interval that is a multiple of 5 (ie. `5`, `10`, `25`)';
    }
    await Memer.db.addAutomemeChannel(msg.channel.guild.id, channel.id, interval);
    await addCD();

    return check ? `Changed automeme channel from <#${check.channel}> to **<#${channel.id}>**` : `<#${channel.id}> will now post memes every **${interval} minutes**`;
  },
  {
    triggers: ['automeme'],
    usage: '{command} [channel] [interval in minutes]',
    cooldown: 1e4,
    donorBlocked: true,
    description: 'Set up a channel to automatically post memes to every 5 minutes'
  }
);
