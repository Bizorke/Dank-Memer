const { GenericMusicCommand } = require('../../models/')

module.exports = new GenericMusicCommand(
  async ({ Memer, music, args, msg }) => {
    if (!msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID) {
      return 'I\'m not even in a voice channel?'
    }

    if (!music.player) {
      await music.reset()
      return 'hm, ok I\'ll stop.'
    }

    if (!msg.member.voiceState.channelID) {
      return 'You\'re not even in a voice channel, why should I listen to you'
    }

    if (msg.member.voiceState.channelID !== music.channel.id) {
      return 'You\'re not even in my voice channel, why should I listen to you'
    }

    await music.stop()
    await msg.channel.createMessage('okokok im leaving now, no need to be rude')
  }, {
    triggers: ['stop'],
    description: 'stop the music!!!!!'
  }
)
