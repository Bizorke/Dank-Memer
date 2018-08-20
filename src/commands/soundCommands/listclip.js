const { GenericCommand } = require('../../models/')
const { getFiles } = require('../../utils/audioUtils.js')
const basePath = `${process.cwd()}/assets/audio/custom`

module.exports = new GenericCommand(
  async ({ msg }) => {
    const files = await getFiles(`${basePath}/${msg.author.id}/`)
      .catch(() => [])

    return files.length > 0
      ? `**${files.length} clips**\n${files.map(f => `\`${f.split('.')[0]}\``).join(', ')}`
      : 'You don\'t have any clips.'
  },
  {
    triggers: ['listclip', 'listclips', 'clips'],
    usage: '{command}',
    description: 'Lists your custom soundclips'
  }
)
