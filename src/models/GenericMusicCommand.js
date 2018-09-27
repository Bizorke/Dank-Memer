<<<<<<< Updated upstream
/** @typedef {import('./GenericCommand').FunctionParams} GenericFunctionParams
 * @typedef {import('./GenericCommand').CommandProps} CommandProps
 */

/** @typedef {Object} MusicFunctionParams
 * @prop {import('./Music')} music
 */

/** @typedef {GenericFunctionParams & MusicFunctionParams} FunctionParams */

const { GenericCommand } = require('.')
=======
const { GenericCommand } = require('.');
>>>>>>> Stashed changes

module.exports = class GenericMusicCommand {
  /**
   * Creates a new instance of GenericMusicCommand
   * @param {MusicCommandCallback} fn The function
   * @param {CommandProps} cmdProps - The props
   */
  constructor (fn, cmdProps) {
    this.fn = fn;
    this.cmdProps = cmdProps;
  }

<<<<<<< Updated upstream
  async run ({ Memer, msg, addCD, args, cleanArgs, isGlobalPremiumGuild }) {
    if (this.props.requiresPremium && !await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This command is only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot'
=======
  async run ({ Memer, msg, addCD, args, cleanArgs }) {
    if (this.cmdProps.requiresPremium && !await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This command is only available on **Premium** guilds.\nTo learn more about how to redeem a premium guild, visit our Patreon https://www.patreon.com/dankmemerbot';
>>>>>>> Stashed changes
    }
    if (msg.member.voiceState.channelID) {
      const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id);

      if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
        return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif');
      }
    }

    await addCD();

    const music = Memer.musicManager.get(msg.channel.guild.id);
    await music.ready;
    music.channel = msg.channel.id;

<<<<<<< Updated upstream
    return this.fn({ Memer, msg, args, addCD, cleanArgs, isGlobalPremiumGuild, music })
=======
    return this.fn({ Memer, msg, args, addCD, cleanArgs, music });
>>>>>>> Stashed changes
  }

  get props () {
    return new GenericCommand(
      this.fn,
      Object.assign({
        cooldown: 2000,
        donorCD: 500
      }, this.cmdProps)
    ).props;
  }
<<<<<<< Updated upstream
}

/**
 * @callback MusicCommandCallback
 * @param {FunctionParams} params
 */
=======
};
>>>>>>> Stashed changes
