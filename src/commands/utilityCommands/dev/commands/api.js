const { get } = require('snekfetch')

module.exports = {
  help: 'see api server data',
  fn: async () => {
    const res = await get('http://www.dank-memer-is-lots-of.fun/stats')
    let stats = res.body
    let cmds = stats.apiCmds
    let topFive = Object.keys(cmds).sort(function (a, b) { return cmds[b] - cmds[a] })
    let bottomFive = Object.keys(cmds).sort(function (a, b) { return cmds[a] - cmds[b] })
    topFive = topFive.slice(0, 3).join(',\n')
    bottomFive = bottomFive.slice(4, 7).join(',\n')
    return {
      title: `**__Dank Memer API Statistics__**`,
      fields: [
        { name: 'Uptime', value: `${stats.uptime}`, inline: true },
        { name: 'Memory Usage', value: `${(stats.memUsage / 1024).toFixed(1)}gb`, inline: true },
        { name: 'Load Averages', value: `${stats.loadAverage.map(e => ' ' + e.toFixed(2))}`, inline: true },
        { name: 'Total Requests', value: `${stats.apiRequests}`, inline: true },
        { name: 'Top 3 Cmds', value: topFive, inline: true },
        { name: 'Least 3 Cmds', value: bottomFive, inline: true }
      ]
    }
  }
}
