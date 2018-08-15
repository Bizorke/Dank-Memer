exports.handle = function (packet) {
  if (packet.guild_id) {
    this.bot.voiceConnections.voiceServerUpdate(packet)
  }
}
