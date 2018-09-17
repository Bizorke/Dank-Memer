module.exports = {
  help: 'do stuff',
  fn: async ({ Memer, args, msg }) => {
    const exploitingUserAmount = await Memer.r.table('users').filter(Memer.r.row('pocket').gt(6e5))
    const ids = []
    msg.channel.createMessage('okay this will take a little while')
    for (const user of exploitingUserAmount) {
      ids.push(user.id)
      await Memer.r.table('users')
        .get(user.id)
        .update({
          pocket: 0
        })
        .run()
    }
    await Memer.redis.setAsync('exploiting-users-ids', JSON.stringify(ids))
    return 'ok done'
  }
}
