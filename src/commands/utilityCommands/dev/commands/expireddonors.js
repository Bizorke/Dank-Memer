module.exports = {
  help: 'Wipe expired donors',
  fn: async ({ Memer, args }) => {
    await Memer.db.wipeExpiredDonors()
    return 'I\'ve gotten rid of those expired/declined donors'
  }
}
