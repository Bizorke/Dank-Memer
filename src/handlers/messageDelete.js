exports.handle = async function (msg) {
<<<<<<< Updated upstream
  const cachedEntry = await this.redis.get(`msg-${msg.id}`)
    .then(res => res ? JSON.parse(res) : undefined)
=======
  const cachedEntry = await this.redis.getAsync(`msg-${msg.id}`)
    .then(res => res ? JSON.parse(res) : undefined);
>>>>>>> Stashed changes
  if (!cachedEntry) {
    return;
  }
<<<<<<< Updated upstream
  this.redis.set(`deletedmsg-${cachedEntry.guildID}-${cachedEntry.channelID}`, JSON.stringify({ userID: cachedEntry.userID, content: cachedEntry.content, timestamp: cachedEntry.timestamp }), 'EX', 60 * 60)
}
=======
  this.redis.setAsync(`deletedmsg-${cachedEntry.guildID}-${cachedEntry.channelID}`, JSON.stringify({ userID: cachedEntry.userID, content: cachedEntry.content, timestamp: cachedEntry.timestamp }), 'EX', 60 * 60);
};
>>>>>>> Stashed changes
