const GenericCommand = require('../../models/GenericCommand');
const memes = require('../../assets/arrays/memes.json');

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let meme;
    if (memes.map(m => m.toLowerCase()).includes(args.join(' '))) {
      meme = memes.find(m => m.toLowerCase() === args.join(' ').toLowerCase());
    } else {
      msg.channel.createMessage({ embed: {
        title: 'Pick a meme!',
        color: Memer.randomColor(),
        description: 'I need you to tell me which meme you want to make. Pick from [this list](https://gist.github.com/melmsie/1b59c3fd389e49b62dc5b706c1ac6140) and reply with your answer.'
      }});

      const memeMsg = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3);
      if (!memeMsg) {
        return 'Prompt timed out.';
      } else if (!memes.map(r => r.toLowerCase()).includes(memeMsg.content.toLowerCase())) {
        return 'That is not a valid meme template.';
      }
      meme = memes.find(m => m.toLowerCase() === memeMsg.content.toLowerCase());
    }

    msg.channel.createMessage('What will your top line be?');
    const top = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3);
    if (!top) {
      return 'Prompt timed out.';
    } else if (!top.cleanContent) {
      return 'idk, whatever you say when someone sends an image/embed';
    }

    msg.channel.createMessage('What will your bottom line be?');
    const bottom = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3);
    if (!bottom) {
      return 'Prompt timed out.';
    } else if (!bottom.cleanContent) {
      return 'idk, whatever you say when someone sends an image/embed';
    }

    const maymay = await Memer.http.get('https://ronreiter-meme-generator.p.mashape.com/meme')
      .query({ bottom: encodeURIComponent(bottom.cleanContent), font: 'Impact', font_size: 35, meme, top: encodeURIComponent(top.cleanContent) })
      .set('X-Mashape-Key', Memer.secrets.extServices.mashape);

    await addCD();
    return { content: '', file: { file: maymay.body, name: 'mymeme.png' } };
  }, {
    triggers: ['memegen', 'makememe'],
    description: 'Make some hot new memes on your own!',
    perms: ['attachFiles']
  }
);
