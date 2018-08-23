const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let perms = msg.channel.permissionsOf(msg.author.id)
    if (!perms.has('manageGuild')) {
      return 'lol you do not have manage server perms and you know it'
    }

    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || {
      prefix: Memer.config.defaultPrefix,
      disabledCommands: [],
      disabledCategories: [],
      enabledCommands: [],
      dadMode: false
    }

    if (msg.args.args.length < 1) {
      if (!gConfig.dadMode) {
        gConfig.dadMode = true
        await Memer.db.updateGuild(gConfig)
        return 'Dad mode has been enabled on this server. Try it out by saying "I\'m stupid".'
      } else {
        gConfig.dadMode = false
        await Memer.db.updateGuild(gConfig)
        return 'Dad mode has been disabled on this server. Thanks for nothing, stupid.'
      }
    }

    switch (msg.args.args[0].toLowerCase()) {
      case 'enable':
        if (gConfig.dadMode) return 'Dad mode is already enabled on this server, stupid'
        gConfig.dadMode = true
        await Memer.db.updateGuild(gConfig)
        return 'Dad mode has been enabled on this server. Try it out by saying "I\'m stupid".'

      case 'disable':
        if (!gConfig.dadMode) return 'Dad mode is already disabled on this server, stupid'
        gConfig.dadMode = false
        await Memer.db.updateGuild(gConfig)
        return 'Dad mode has been disabled on this server. Thanks for nothing, stupid.'

      default:
        return 'You need to specify disable or enable'
    }
  }, {
    triggers: ['dadmode', 'dad'],
    usage: '{command} [enable/disable]',
    description: 'Decide whether to enable or disable "dad mode" on this server'
  }
)
