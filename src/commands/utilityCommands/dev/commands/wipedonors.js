module.exports = {
  help: 'Wipe expired donors',
  fn: async ({ Memer, msg }) => {
    let donors = await Memer.db.wipeExpiredDonors();

    let promises = [];
    for (let user of donors) {
      const channel = await Memer.bot.getDMChannel(user.id);
      promises.push(
        await channel.createMessage({ embed: {
          color: 12000284,
          title: 'Your donor status has been removed',
          description: 'We were unable to process your payment more than once, and sadly we\'ve had to remove your donor perks.\n\n' +
          'If you feel that this was a mistake, please update and validate your payment information and pledge the tier you previously had. You\'ll be back where you were in no time!\n\n' +
          'We appreciate your donations and time, thank you very much!\n' +
          '-- The Dank Memer Team'
        }})
      );
    }

    await Promise.all(promises).then(async () => {
      msg.channel.createMessage(`I've successfully messaged ${promises.length} users about expired payments`);
    });
  }
};
