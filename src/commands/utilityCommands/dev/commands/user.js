module.exports = {
  help: 'Show user info',
  fn: async ({ Memer, msg }) => {
    let id = await msg.args.resolveUser()
    if (!id) {
      return 'you need to mention a user or give an id'
    }
    id = id.id
    let db = await Memer.db.getUser(id)
    let donor = await Memer.db.isDonor(id)
    let user = await Memer.ipc.fetchUser(id)
    return {
      title: `${user.username}#${user.discriminator}`,
      description: `Usage: ${db.pls.toLocaleString()}\nLast Cmd: ${new Date(db.lastCmd).toUTCString()}\nSpam: ${db.spam.toLocaleString()}\nCoins: ${db.coin.toLocaleString()}\nStreak: ${db.streak.streak.toLocaleString()}\nUpvoted: ${db.upvoted}\nDonor: ${!donor ? 'false' : `$${donor}`}`
    }
  }
}
