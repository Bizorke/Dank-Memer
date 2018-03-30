module.exports = {
  help: 'Show message time vs system time.',
  fn: async ({ Memer, msg, args }) => {
    let message = new Date(msg.timestamp).toTimeString()
    let now = new Date(Date.now())
    let system = now.toTimeString()
    return `Message Time: ${message}\nSystem Time: ${system}`
  }
}
