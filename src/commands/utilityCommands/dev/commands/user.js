module.exports = {
  help: 'Show user info',
  fn: async ({ Memer, args }) => {
    if (!args[0] && isNaN(args[0])) {
      return 'you need to give an id'
    }
    let id = args[0]

    let db = await Memer.db.getUser(id)
    let donor = await Memer.db.checkDonor(id)
    let user = await Memer.ipc.fetchUser(id)
    return {
      title: `${user.username}#${user.discriminator}`,
      description: `Usage: ${db.pls.toLocaleString()}\nLast Cmd: ${new Date(db.lastCmd).toUTCString()}\nSpam: ${db.spam.toLocaleString()}\nCoins: ${db.coin.toLocaleString()}\nStreak: ${db.streak.streak.toLocaleString()}\nUpvoted: ${db.upvoted}\nDonor: ${!donor ? 'false' : `$${donor}`}`
    }
  }
}
