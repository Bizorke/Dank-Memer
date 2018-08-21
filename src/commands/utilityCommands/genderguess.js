const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let content = msg.args.gather()
    if (msg.attachments.length) {
      if (!msg.attachments[0].width) {
        return 'this isn\'t an image dumbo'
      }
      content = msg.attachments[0].url
    }
    if (!msg.attachments.length && !content) {
      return 'You need to provide a name (text) or an image (either by attachment or URL)'
    }

    // If an image is provided
    if (/\S*www\.|http\S+/.test(content)) {
      let req = await Memer.http.get(`https://watson-api-explorer.ng.bluemix.net/visual-recognition/api/v3/detect_faces?url=${content}&version=2016-05-20`)
      if (!req.body.images) {
        return 'I couldn\'t find a face in that image'
      }
      let image = req.body.images[0]
      return `I think that this face belongs to a **${image.faces[0].gender.gender.toLowerCase()}** who is **${image.faces[0].age.min} to ${image.faces[0].age.max}** years old.`
    } else {
      let req = await Memer.http.get(`https://api.genderize.io/?name=${content}`)
      return `I am ${Number(req.body.probability) * 100}% sure that the name **${content}** belongs to a ${req.body.gender}`
    }
  }, {
    triggers: ['genderguess', 'genderg'],
    usage: '{command} [name or image]',
    description: 'Guesses gender based on name or an image when provided'
  }
)
