module.exports = {
  help: 'Announces an update to all subscribed servers.',
  fn: async ({ Memer, args, msg }) => {
    const response = await Memer.db.getDevSubscribers()
    let promises = []
    for (const [channelID, guildID] of response) {
      promises.push(
        Memer.bot.createMessage(channelID, args.join())
          .catch(() => Memer.ipc.fetchGuild(guildID)
            .then(guild => Memer.bot.createMessage(guild.ownerID, `The Update Channel is deleted or i dont have permissions to talk in the update channel you idiot anyway here is the update info\n\n ${args.join()}`)
              .catch(() => Memer.db.deleteDevSubscriber(guildID))
            )
          )
      )
    }
    await Promise.all(promises)
    return msg.channel.createMessage('Succesfully send update to all subscribers!')
  }
}
