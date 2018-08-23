const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    // nothing at all
  }, {
    triggers: ['biggay', 'gayrole'],
    usage: '{command} ???',
    description: 'melmsie stinks'
  }
)
