const { get } = require('snekfetch')
const { GenericCommand } = require('.')

class GenericImageCommand {
  constructor (commandProps, URLParseFN) {
    this.cmdProps = commandProps
    this.URLParseFN = URLParseFN || this.defaultURLParseFN
    this.requestURL = `http://127.0.0.1:5000/api/${commandProps.triggers[0]}` // commandProps.reqURL || 'http://www.dank-memer-is-lots-of.fun/api/$ENDPOINT'
  }

  async run ({ Memer, msg, addCD }) {
    const datasrc = this.URLParseFN(msg)
    if (!datasrc) {
      return
    }

    const data = await get(this.requestURL.replace('$ENDPOINT', this.cmdProps.triggers[0]))
      .query(datasrc)

    // TODO: Check response content-type, set Authorization header
    if (data.status === 200) {
      await addCD()
      msg.channel.createMessage('', { file: data.body, name: `${this.cmdProps.triggers[0]}.${this.cmdProps.format || 'png'}` })
    } else {
      msg.channel.createMessage(`Error: ${data.text}`)
    }
  }

  defaultURLParseFN (msg) {
    if (this.cmdProps.requiredArgs) {
      if (msg.args.isEmpty()) {
        msg.channel.createMessage(this.cmdProps.requiredArgs)
        return false
      }

      if (msg.args.textLength() > this.cmdProps.textLimit) {
        msg.channel.createMessage(`Too long. You're ${msg.args.textLength() - this.cmdProps.textLimit} characters over the limit!`)
        return false
      }
    }

    let ret = {}

    if (this.cmdProps.textOnly) {
      ret.text = msg.args.cleanContent(true)
    } else {
      const argIsUrl = (msg.args.getArgument(0) || '').replace(/<|>/g, '').match(/^https?:\/\/.+\.(?:jpg|jpeg|gif|png|webp)$/i)

      if (argIsUrl) {
        ret.avatar1 = argIsUrl[0]
        msg.args.drop(0)
      } else {
        const user = msg.args.resolveUser() || msg.author
        ret.avatar1 = user.dynamicAvatarURL('png', 1024)
        ret.username1 = user.username
      }

      if (this.cmdProps.requiredArgs) {
        ret.text = msg.args.cleanContent(true)
      } else if (this.cmdProps.doubleAvatar) {
        const user2 = msg.args.resolveUser() || msg.channel.guild.shard.client.user
        ret.avatar2 = user2.dynamicAvatarURL('png', 1024)
        ret.username2 = user2.username
      }
    }

    return ret
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 6000,
        donorCD: 2000,
        perms: ['embedLinks', 'attachFiles']
      }, this.cmdProps)
    ).props
  }
}

module.exports = GenericImageCommand
