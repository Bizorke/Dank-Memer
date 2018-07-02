module.exports = {
  help: 'reload [command | all]',
  fn: async ({ Memer }) => {
    try {
      for (const path in require.cache) {
        if (path.includes('commands')) {
          delete require.cache[path]
        }
      }

      Memer.cmds = []
      Memer.loadCommands()
      return 'Successfully reloaded all commands.'
    } catch (err) {
      return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``
    }
  }
}
