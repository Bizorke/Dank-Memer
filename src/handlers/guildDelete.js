exports.handle = function (guild) {
  if (guild.unavailable) return;

  this.db.deleteGuild(guild.id);
  this.db.deleteDevSubscriber(guild.id);
};
