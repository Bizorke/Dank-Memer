const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
      return 'I\'m not even playing anything in this server'
    }

    if (!msg.member.voiceState.channelID) {
      return 'You\'re not even in a voice channel'
    }

    if (msg.member.voiceState.channelID !== Memer.bot.voiceConnections.get(msg.channel.guild.id).channelID) {
      return 'You\'re not even in my voice channel'
    }

    if (!Memer.bot.voiceConnections.get(msg.channel.guild.id).ready) {
      return 'Smh you can\'t stop when I\'m not connected'
    }

    Memer.log(`[stop] Leaving voicechannel ${Memer.bot.voiceConnections.get(msg.channel.guild.id).channelID}`)
    await Memer.bot.leaveVoiceChannel(Memer.bot.voiceConnections.get(msg.channel.guild.id).channelID)
    msg.addReaction('❌').catch(() => {}) // Usually if the user deletes the message before the bot can react
  }, {
    triggers: ['stop'],
    description: 'STOP FARTING'
  }
)
