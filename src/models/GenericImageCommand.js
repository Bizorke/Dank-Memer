const { get } = require('snekfetch')
const { GenericCommand } = require('.')

class GenericImageCommand {
  constructor (commandProps, URLParseFN) {
    this.cmdProps = commandProps
    this.URLParseFN = URLParseFN || this.defaultURLParseFN
    this.requestURL = `http://127.0.0.1:5000/api/${commandProps.triggers[0]}` // commandProps.reqURL || 'http://www.dank-memer-is-lots-of.fun/api/$ENDPOINT'
  }

  async run ({ Memer, msg, cleanArgs, addCD }) {
    const datasrc = this.URLParseFN(msg, cleanArgs)
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

  defaultURLParseFN (msg, args) {
    if (this.cmdProps.requiredArgs) {
      if (!args[0]) {
        msg.channel.createMessage(this.cmdProps.requiredArgs)
        return false
      }

      if (args.join(' ').length > this.cmdProps.textLimit) {
        msg.channel.createMessage(`Too long. You're ${args.join(' ').length - this.cmdProps.textLimit} characters over the limit!`)
        return false
      }
    }

    let ret = {}

    if (this.cmdProps.textOnly) {
      ret.text = args.join(' ')
    } else {
      const argIsUrl = (args[0] || '').replace(/<|>/g, '').match(/https?:\/\/.+\.(?:jpg|jpeg|gif|png|webp)/gi)

      if (argIsUrl) {
        ret.avatar1 = argIsUrl[0]
        args.shift()
      } else {
        const user = msg.mentions[0] || msg.author
        ret.avatar1 = user.dynamicAvatarURL('png', 1024)
        ret.username1 = user.username

        if (msg.mentions[0]) {
          const member = msg.channel.guild.members.get(user.id)

          if (member) {
            args = args.join(' ').slice(`@${member.nick || member.username}`.length).trim().split(' ')
          }
        }
      }

      if (this.cmdProps.requiredArgs) {
        ret.text = args.join(' ')
      } else if (this.cmdProps.doubleAvatar) {
        const user2 = msg.mentions[0]
          ? msg.author
          : msg.channel.guild.shard.client.user

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
