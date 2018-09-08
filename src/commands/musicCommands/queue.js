const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ Memer, music, msg }) => {
  const page = Number(msg.args.gather()) || 1
  const pageLength = 10
  let embed = ''
  let data = music.queue.slice(1)

  if (music.queue.length < 2) {
    return 'There are no songs in the queue. Add more or get out'
  }
  if (music.queue.length > pageLength) {
    if (isNaN(page) || page < 1) return 'that\'s not a valid page you assbutt'
    if (Math.ceil(music.queue.length / pageLength) < page) return `That page doesn't exist, there's only ${Math.ceil(music.queue.length / pageLength)} pages`
    embed = `Page ${page} of ${Math.ceil(music.queue.length / pageLength)}`
    data = data.slice(pageLength * (page - 1), (pageLength * (page - 1)) + pageLength)
  }
  msg.channel.createMessage({
    embed: {
      title: 'Queue',
      color: Memer.randomColor(),
      description: data.map((song, index) => `\`${index + pageLength * (page - 1) + 1}.\` ${song.info.title}`).join('\n'),
      footer: {
        text: embed
      }
    }
  })
}, {
  triggers: ['queue', 'songs'],
  usage: '{command} [page]',
  description: 'Lists all of the songs currently in the queue'
})
