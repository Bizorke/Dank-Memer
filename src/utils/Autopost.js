module.exports = class Autopost {
  constructor (client) {
    this.client = client
  }

  async getRedditPost () {
    let subs = [
      'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/dank_meme/top/.json?sort=top&t=day&limit=40',
      'https://www.reddit.com/r/memes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/meirl/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/MemeEconomy/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/2meirl4meirl/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/PrequelMemes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/surrealmemes/top/.json?sort=top&t=week&limit=100',
      'https://www.reddit.com/r/DeepFriedMemes/top/.json?sort=top&t=day&limit=100'
    ]

    let sub = this.client.randomInArray(subs)
    let limit = sub.split('limit=')[1]
    const res = await this.client.http.get(sub)
    const posts = res.body.data.children.filter(post => post.data.post_hint === 'image')
    return posts[Math.floor(Math.random() * Number(limit) - 1)]
  }

  async automeme () {
    const post = await this.getRedditPost()
    let check = await this.client.db.allAutomemeChannels()
    if (!post) {
      return this.automeme()
    }
    for (const { channel } of check) {
      this.client.bot.createMessage(channel, { embed: {
        title: post.data.title,
        url: `https://www.reddit.com${post.data.permalink}`,
        description: post.data.selftext,
        image: { url: post.data.url },
        footer: { text: `👍 ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}` }
      }})
        .catch((err) => {
          if (err.message.toString() === 'DiscordRESTError [10003]: Unknown Channel') {
            // Remove this channel from the database if it's not valid/not found
            this.client.db.removeAutomemeChannel(channel)
          }
        })
    }
  }

  async autonsfw () {
    let check = await this.client.db.allAutonsfwChannels()
    for (const { channel, type } of check) {
      const data = await this.client.http.get(`https://boob.bot/api/v2/img/${type}`, {
        headers: {
          Authorization: this.client.secrets.extServices.boobbot,
          Key: this.client.secrets.extServices.boobbot
        }
      })
        .then(res => res.body.url)
      if (!this.client.bot.getChannel(channel).nsfw) {
        return
      }
      this.client.bot.createMessage(channel, { embed: {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        image: { url: data },
        footer: { text: 'Free nudes thanks to boobbot & tom <3' }
      }})
    }
  }

  async post () {
    await this.automeme()
    await this.autonsfw()
  }
}
