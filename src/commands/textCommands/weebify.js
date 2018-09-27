<<<<<<< Updated upstream
const GenericCommand = require('../../models/GenericCommand')

module.exports = new GenericCommand(
  async ({ Memer, msg, cleanArgs }) => {
    let args = msg.args.gather()
    await Memer.http.get(`https://dev.anidiots.guide/text/owoify?text=${encodeURIComponent(args)}`, {
      headers: {
        Authorization: Memer.secrets.extServices.idiot
      }
    })
      .then(res => msg.channel.createMessage(res.body.text))
      .catch(() => msg.channel.createMessage('There was an error whilst trying to weebify your text (T_T)'))
=======
const { GenericCommand } = require('../../models/');

module.exports = new GenericCommand(
  async ({ cleanArgs }) => {
    let args = cleanArgs;
    let faces = ['(・`ω´・)', ';w;', 'owo', 'UwU', '>w<', '^w^'];
    let v = args.join(' ');
    v = v.replace(/(?:r|l)/g, 'w');
    v = v.replace(/(?:R|L)/g, 'W');
    v = v.replace(/n([aeiou])/g, 'ny$1');
    v = v.replace(/N([aeiou])/g, 'Ny$1');
    v = v.replace(/N([AEIOU])/g, 'Ny$1');
    v = v.replace(/ove/g, 'uv');
    v = v.replace(/!+/g, ' ' + faces[Math.floor(Math.random() * faces.length)] + ' ');
    return v;
>>>>>>> Stashed changes
  }, {
    triggers: ['weebify', 'owoify'],
    description: 'Make the bot say whatever you want with a bit of weeb',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say in weeb speak?'
  }
);
