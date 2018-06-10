module.exports = {
  help: 'change bot avatar',
  fn: async ({ Memer, args }) => {
    await setAvatar(Memer, args.join(' '))
    return `avatar was updated: ${args.join(' ')}`
  }
}

async function setAvatar (Memer, url) {
  require('snekfetch').get(url).end((err, res) => {
    if (err) {
      throw err
    }
    console.log(JSON.stringify(res.body))
    Memer.bot.editSelf({ avatar: `data:${res.header['content-type']};base64,${res.body.toString('base64')}` })
  })
}
