const { inspect } = require('util')
const { createContext, runInContext } = require('vm')

module.exports = {
  help: 'repl',
  fn: async ({ Memer, msg, args }) => {
    let ctx = { Memer }
    createContext(ctx)

    let lastRanCommandOutput
    let statementQueue = []

    const runCommand = async () => {
      const commandMsg = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 60e3)
      if (!commandMsg) {
        return msg.channel.createMessage('Timed out, automatically exiting REPL...')
      }

      let { content } = commandMsg

      if (content.startsWith('//')) {
        return runCommand()
      }
      if (content === '.exit') {
        return msg.channel.createMessage('Successfully exited.')
      }
      if (content === '.clear') {
        ctx = { Memer }
        createContext(ctx)
        statementQueue = []
        msg.channel.createMessage('Successfully cleared variables.')
        return runCommand()
      }

      ctx.msg = commandMsg
      ctx._ = lastRanCommandOutput

      if (content.endsWith('}') && statementQueue[0]) {
        // Closing bracket - we consume the statement queue
        statementQueue.push(content)
        content = statementQueue.join('\n')
        statementQueue = []
      } else if (content.endsWith('{') || statementQueue[0]) {
        // Opening bracket - we either open the statement queue or append to it
        statementQueue.push(content.endsWith('{')
          ? content
          : '  ' + content) // Indentation for appended statements
        msg.channel.createMessage(`\`\`\`js\n${statementQueue.join('\n')}\n  ...\n\`\`\``)
        return runCommand()
      }

      let result
      try {
        result = await runInContext(content, ctx, {
          filename: 'dank.repl'
        })

        lastRanCommandOutput = result

        if (typeof result !== 'string') {
          result = inspect(result, {
            depth: +!(inspect(result, { depth: 1 }).length > 1990) // Results in either 0 or 1
          })
        }
      } catch (e) {
        const error = e.stack || e
        result = `ERROR:\n${typeof error === 'string' ? error : inspect(error, { depth: 1 })}`
      }

      const tokenRegex = new RegExp(Memer.config.token, 'gi')

      msg.channel.createMessage('```js\n' + result.replace(tokenRegex, 'i think the fuck not, you trick ass bitch') + '\n```')

      runCommand()
    }

    runCommand()
    return 'REPL started. Available commands:\n```\n.exit\n.clear\n_\n```'
  }
}
