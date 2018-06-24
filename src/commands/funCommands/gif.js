const { GenericCommand } = require('../../models/')
const { get } = require('snekfetch')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let search = encodeURIComponent(msg.args.args.join(' '))
    const data = await get(`https://api.giphy.com/v1/gifs/search?api_key=${Memer.config.gif}&q=${search}&limit=25&offset=0&rating=PG-13&lang=en`)
    return {
      title: `${decodeURIComponent(search)} gif`,
      description: 'Powered by [Giphy](https://giphy.com/)',
      image: { url: data.body.data[0].images.original.url }
    }
  }, {
    triggers: ['gif', 'giphy'],
    usage: '{command} search terms',
    description: 'Get some sicc gifs to show how you feel',
    missingArgs: 'what gif lol'
  }
)
