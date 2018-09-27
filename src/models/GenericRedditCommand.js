<<<<<<< Updated upstream
/** @typedef {import('./GenericCommand').CommandProps} CommandProps */

const GenericCommand = require('./GenericCommand')
=======
const { GenericCommand } = require('../models/');
>>>>>>> Stashed changes

const filters = {
  image: post => post.data.post_hint === 'image',
  text: post => post.data.post_hint !== 'image' && post.data.selftext.length <= 2000 && post.data.title.length <= 256
};

module.exports = class GenericRedditCommand {
  /**
   * @param {CommandProps} cmdProps
   */
  constructor (cmdProps) {
    this.cmdProps = cmdProps;
  }

  async run ({ Memer, msg, addCD }) {
    let res;

<<<<<<< Updated upstream
    const cachedEntry = await Memer.redis.get(this.cmdProps.endpoint)
      .then(res => JSON.parse(res))
=======
    const cachedEntry = await Memer.redis.getAsync(this.cmdProps.endpoint)
      .then(res => JSON.parse(res));
>>>>>>> Stashed changes

    if (cachedEntry) {
      res = cachedEntry;
    } else {
      res = await Memer.http.get(`https://www.reddit.com${this.cmdProps.endpoint}`)
        .then(res => res.body)
<<<<<<< Updated upstream
        .catch(() => null)
      Memer.redis.set(this.cmdProps.endpoint, JSON.stringify(res), 'EX', 15 * 60)
=======
        .catch(() => null);
      Memer.redis.setAsync(this.cmdProps.endpoint, JSON.stringify(res), 'EX', 15 * 60);
>>>>>>> Stashed changes
    }

    if (!res) {
      await addCD();
      return 'meme machine 🅱roke';
    }

    const posts = res.data.children.filter(filters[this.cmdProps.type]);

    const indexes = Memer.indexes[this.cmdProps.triggers[0]];
    let index = indexes[msg.channel.guild.id];
    if (!index || index >= posts.length) {
      indexes[msg.channel.guild.id] = index = 1;
    }

    const post = posts[index];
    indexes[msg.channel.guild.id]++;

    const postTitle = post.data.title.length > 256 ? `${post.data.title.slice(0, 253)}...` : post.data.title;

    await addCD();
    if (this.cmdProps.type === 'text') {
      return {
        title: postTitle,
        url: `https://www.reddit.com${post.data.permalink}`,
        description: post.data.selftext,
        image: { url: this.cmdProps.type === 'image' ? post.data.url : '' },
        footer: { text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` }
      };
    }

    return {
      title: postTitle,
      url: `https://www.reddit.com${post.data.permalink}`,
      image: { url: this.cmdProps.type === 'image' ? post.data.url : '' },
      footer: { text: this.cmdProps.footer || `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` }
    };
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000,
        perms: ['embedLinks']
      }, this.cmdProps)
    ).props;
  }
};
