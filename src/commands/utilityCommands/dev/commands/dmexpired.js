module.exports = {
  help: 'DM recently expired donors',
  fn: async ({ Memer, msg }) => {
    let donors = await Memer.db.findExpiredDonors()
    let promises = []
    for (let user of donors) {
      const channel = await Memer.bot.getDMChannel(user.id)
      promises.push(
        await channel.createMessage({ embed: {
          color: 15022389,
          title: 'Your donor status is at risk',
          description: 'There\'s been an issue when trying to process your payment on Patreon, and because we haven\'t been able to receive your payment, you may lose your donor perks!\n\n' +
          '**If you don\'t update your payment information or don\'t have sufficient money on your preferred payment method, your donor status will be removed in 1 month.**\n' +
          'If you no longer want to pay for donor perks, you can always [remove your pledge at any time](https://patreon.zendesk.com/hc/en-us/articles/360005502572).\n\n' +
          'Thanks for donating, and we hope that you\'ll stay with us!\n' +
          '-- The Dank Memer Team'
        }})
      )
    }

    await Promise.all(promises).then(async () => {
      msg.channel.createMessage(`I've successfully messaged ${promises.length} users about expired payments`)
    })
  }
}
