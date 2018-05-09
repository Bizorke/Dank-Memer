const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['disability', 'ken'],
  description: 'lol thanks ken.',
  reqURL: 'http://127.0.0.1:5000/api/disability'
})
