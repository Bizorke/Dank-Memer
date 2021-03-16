const GenericCommand = require('../../models/GenericCommand');
const { redpandas } = require('../../assets/arrays/animals.json');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => ({
    title: 'dawwwwwwww 🐼',
    image: { url: Memer.randomInArray(redpandas) },
    footer: { text: `Requested by ${msg.author.username}#${msg.author.discriminator}` }
  }), {
    triggers: ['redpanda', 'redboi'],
    description: 'See some cute red pandas!',
    perms: ['embedLinks']
  }
);
