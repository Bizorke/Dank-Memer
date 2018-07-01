const os = require('os')
const { GenericCommand } = require('../../models/')

const getCPUUsage = async () => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  let [timeUsed0, timeIdle0, timeUsed1, timeIdle1] = new Array(4).fill(0)

  const cpu0 = os.cpus()
  await sleep(1000)
  const cpu1 = os.cpus()

  for (const cpu of cpu1) {
    timeUsed1 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    )
    timeIdle1 += cpu.times.idle
  }
  for (const cpu of cpu0) {
    timeUsed0 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    )
    timeIdle0 += cpu.times.idle
  }

  const totalUsed = timeUsed1 - timeUsed0
  const totalIdle = timeIdle1 - timeIdle0
  return (totalUsed / (totalUsed + totalIdle)) * 100
}

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const stats = await Memer.db.getStats()
    const CPUUsage = await getCPUUsage()
    return {
      footer: { text: `Version ${Memer.package.droneVersion}` },
      fields: [
        {
          name: 'Server Statistics',
          value: [
            `${stats.guilds.toLocaleString()} servers`,
            `${(stats.users / stats.guilds).toFixed()} average server size`,
            `${stats.largeGuilds.toLocaleString()} large servers`,
            `${stats.exclusiveGuilds.toLocaleString()} exclusive servers`,
            `${(300000 - stats.guilds).toLocaleString()} until 300k`
          ].join('\n'),
          inline: true
        },
        {
          name: 'Bot Statistics',
          value: [
            `${Memer.parseTime(process.uptime())} uptime`,
            `${stats.users.toLocaleString()} users`,
            `${msg.channel.guild.shard.latency.toFixed()}ms (((ping)))`,
            `${stats.voice} VCs`,
            `${(stats.totalRam / 1000).toFixed(1)}gb/${(os.totalmem() / 1073741824).toFixed(1)}gb memory`
          ].join('\n'),
          inline: true
        },
        {
          name: 'System Statistics',
          value: [
            `${CPUUsage.toFixed(1)}% CPU usage`,
            `${((os.totalmem() - os.freemem()) / 1073741824).toFixed(1)}gb/${(os.totalmem() / 1073741824).toFixed(1)}gb memory`,
            `${Memer.parseTime(os.uptime())} uptime`,
            `${os.platform} based server`,
            `Node ${process.version}`
          ].join('\n'),
          inline: true
        }
      ]
    }
  }, {
    triggers: ['stats', 'info'],
    description: 'Returns information and statistics about Dank Memer.',
    perms: ['embedLinks']
  }
)
