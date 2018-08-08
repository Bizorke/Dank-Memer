const { GenericCommand } = require('.')

module.exports = class GenericModerationCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, addCD }) {
    // modPerms will be an array of permissions that are required by the user to run this command
    // If no permissions are passed, this code is never considered.
    for (const requiredPermission of this.cmdProps.modPerms) {
      if (!msg.channel.permissionsOf(msg.author.id).has(requiredPermission)) {
        return this.missingPermission('user', requiredPermission)
      } else if (!msg.channel.permissionsOf(Memer.bot.user.id).has(requiredPermission)) {
        return this.missingPermission('bot', requiredPermission)
      }
    }

    await addCD()
  }

  missingPermission (type, permission) {
    const permissionsFriendly = {
      'kickMembers': 'kick members',
      'banMembers': 'ban members',
      'manageChannels': 'manage and edit channels',
      'manageGuild': 'manage and edit server settings',
      'manageMessages': 'manage and remove messages',
      'manageNicknames': 'edit other people\'s nicknames',
      'manageRoles': 'manage the roles on this server'
    }
    return `heck, ${type === 'bot' ? 'i\'m' : 'you\'re'} missing the \`${permission}\` permission.\nMake sure ${type === 'bot' ? 'Dank Memer has' : 'you have'} access to **${permissionsFriendly[permission]}** and try again.`
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 2000,
        donorCD: 500
      }, this.cmdProps)
    ).props
  }
}
