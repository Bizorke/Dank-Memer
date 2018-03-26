module.exports = {
  help: 'donor <add | remove> <1 | 5 | 10> <id | @tag>',
  fn: async ({ Memer, msg, args }) => {
    let message = new Date(msg.timestamp).toTimeString()
    let now = new Date(Date.now())
    let system = now.toTimeString()
    return `Message Time: ${message}\nSystem Time: ${system}`
  }
}
