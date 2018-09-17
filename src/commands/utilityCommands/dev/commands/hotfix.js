module.exports = {
  help: 'do stuff',
  fn: async ({ Memer, args }) => {
    const exploitingUserAmount = await Memer.r.table('users').filter(Memer.r.row('pocket').gt(6e5)).count()
    console.log(exploitingUserAmount)
    return exploitingUserAmount
  }
}
