const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let target = !args[0] || args[0].toLowerCase() === 'me'
      ? 'You are'
      : (
        msg.mentions[0]
          ? `${msg.mentions[0].nick || msg.mentions[0].username} is`
          : `${args.join(' ')} is`
      );
    const rating = Memer.randomNumber(1, 100);
    return {
      title: 'gay r8 machine',
      description: `${target} ${rating}% gay :gay_pride_flag:`
    };
  },
  {
    triggers: ['howgay', 'gayrate'],
    description: 'See how gay you are'
  }
);
