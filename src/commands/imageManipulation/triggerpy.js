const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['triggerpy'],
  description: 'UR SO TRIGGERED BRO',
  format: 'gif',
  reqURL: 'http://127.0.0.1:5000/api/trigger'
})
