<<<<<<< Updated upstream
const GenericCommand = require('../../models/GenericCommand')
=======
const { GenericCommand } = require('../../models/');
>>>>>>> Stashed changes

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
<<<<<<< Updated upstream
      return 'Tags are only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot'
=======
      return 'Tags are only available on **Premium** guilds.\nTo learn more about how to redeem a premium guild, visit our Patreon https://www.patreon.com/dankmemerbot';
>>>>>>> Stashed changes
    }
    if (!Memer.bot.getChannel(msg.channel.id).permissionsOf(msg.author.id).has('banMembers')) {
      return 'Only people with `Ban Members` can add tags.';
    }
    let [ tagName, ...tagText ] = msg.args.args;
    if (!tagName) {
      return 'You need to give a name for this new tag smh';
    }
    if (!tagText[0]) {
      return 'You have the wrong syntax for this command.\nExample: `pls addtag henlo u stink`\nYou: `pls tag henlo`\nDank Memer: u stink';
    }
    let allTags = await Memer.db.getAllTags(msg.channel.guild.id);
    let two = allTags.filter(tag => tag.name === tagName);
    if (two[0]) {
      return 'There is already a tag with that name';
    }
    Memer.db.addTag(msg.channel.guild.id, tagName, tagText.join(' '));
    return `Successfully created tag **${tagName}**`;
  }, {
    triggers: ['addtag', 'createtag'],
    description: 'Creates a new tag',
    usage: '{command} [tag name] [content]'
  }
);
