const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    const campaignID = '' // replace this with Dank Memer's campaign ID
    let patrons = []

    const loopThroughPatrons = async () => {
      let res = await Memer.http.get(`https://www.patreon.com/api/oauth2/api/campaigns/${campaignID}/pledges?include=patron.null`, {headers: {'Authorization': `Bearer ${Memer.secrets.extServices.patreon}`}})
      if (!res.body) {
        return
      }
      res = JSON.parse(res.body)
      for (let i in res.included) {
        patrons.push({ attributes: res.included[i].attributes, payment_data: res.data[i].attributes })
      }
      if (res.links.next) {
        await loopThroughPatrons()
      } else {
        return patrons
      }
    }
    await loopThroughPatrons()

    if (!patrons) {
      return 'There was an error whilst trying to obtain patron data. Please try again later.'
    }

    for (let patron of patrons) {
      let discord = patron.attributes.social_connections.discord
      if (discord) {
        if (discord.user_id === msg.author.id) {
          Memer.db.addDonor(msg.author.id, patron.payment_data.amount_cents / 100, new Date(patron.payment_data.created_at), new Date(patron.payment_data.declined_since))
          const channel = await Memer.bot.getDMChannel(msg.author.id)
          await channel.createMessage({ embed: {
            color: 6732650,
            title: 'You now have donor perks',
            description: `Thanks for your donation!\nMost donor perks are automatic. If you want to redeem your coins, use \`pls redeem\`.\n`,
            fields: [
              patron.payment_data.amount_cents > 300 ? {
                name: 'You have access to Premium Memer!',
                value: 'Since you have donated above $3, you have access to premium features throughout the bot, including command tags, autoposting memes, and bonus coins!'
              } : null
            ]
          }})
          return 'You\'ve successfully linked your Discord account with Patreon. Enjoy your perks!\nFor more assistance, you can visit our support server (https://discord.gg/ebUqc7F)'
        } else {
          return 'You don\'t have your Discord account linked to your Patreon! If you need help linking your Discord account to Patreon, try looking at this article\nhttps://patreon.zendesk.com/hc/en-us/articles/212052266-How-do-I-receive-my-Discord-role-'
        }
      }
    }
  }, {
    triggers: ['link'],
    usage: '{command}',
    description: 'Link your Discord account with Patreon'
  }
)
