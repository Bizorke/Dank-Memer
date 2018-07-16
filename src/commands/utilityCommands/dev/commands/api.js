module.exports = {
  help: 'see api server data',
  fn: async ({ Memer, msg, args }) => {
    let user = msg.author
    let userDB = await Memer.db.getUser(user.id)
    let donor = await Memer.db.checkDonor(user.id)
    let test = await Memer.getMultiplier(Memer, user, userDB, donor, msg)
  }
}
