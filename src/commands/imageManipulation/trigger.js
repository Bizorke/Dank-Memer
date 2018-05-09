const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['trigger', 'triggered'],
  description: 'UR SO TRIGGERED BRO',
  format: 'gif',
  reqURL: 'http://127.0.0.1:5000/api/trigger'
})
