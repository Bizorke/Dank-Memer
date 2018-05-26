module.exports = {
  help: 'Show user info',
  fn: async ({ Memer, msg, args }) => {
    let id
    if (msg.mentions[0]) {
      id = msg.mentions[0].id
    } else {
      id = args[0]
    }
    let db = await Memer.db.getUser(id)
    let donor = await Memer.db.isDonor(id)
    let user = await Memer.ipc.fetchUser(id)
    return {
      title: `${user.username}#${user.discriminator}`,
      description: `Usage: ${db.pls}\nLast Cmd: ${new Date(db.lastCmd).toUTCString()}\nSpam: ${db.spam}\nCoins: ${db.coin}\nStreak: ${db.streak.streak}\nUpvoted: ${db.upvoted}\nDonor: ${!donor ? 'false' : `$${donor}`}`
    }
  }
}
