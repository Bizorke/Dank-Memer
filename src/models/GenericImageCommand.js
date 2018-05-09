const { get } = require('snekfetch')
const { GenericCommand } = require('.')

class GenericImageCommand {
  constructor (commandProps, URLParseFN) {
    this.cmdProps = commandProps
    this.URLParseFN = URLParseFN || this.defaultURLParseFN
    this.requestURL = commandProps.reqURL || 'http://www.dank-memer-is-lots-of.fun/api/$ENDPOINT'
  }

  async run ({ Memer, msg, cleanArgs: args, addCD }) {
    const datasrc = this.URLParseFN(msg, args)
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
    if (this.cmdProps.textOnly) {
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

      return { text: args.join(' ') }
    }

    let avatarurl = (msg.mentions[0] || msg.author).dynamicAvatarURL('png', 1024)
    if (['jpg', 'jpeg', 'gif', 'png', 'webp'].some(ext => args.join(' ').includes(ext))) {
      avatarurl = args.join(' ').replace(/gif|webp/g, 'png').replace(/<|>/g, '')
    }

    if (this.cmdProps.requiredArgs) {
      if (!args[0]) {
        msg.channel.createMessage(this.cmdProps.requiredArgs)
        return false
      }

      if (args.join(' ').length > this.cmdProps.textLimit) {
        msg.channel.createMessage(`Too long. You're ${args.join(' ').length - this.cmdProps.textLimit} characters over the limit!`)
        return false
      }

      if (!/^[\x00-\x7F]*$/.test(args.join(' '))) { // eslint-disable-line
        msg.channel.createMessage('Your argument contains invalid characters. Please try again.')
        return false
      }

      return { avatar1: avatarurl, text: args.join(' ').replace(/’+/g, "'") }
    } else if (this.cmdProps.doubleAvatar) {
      const authorurl = (msg.mentions[0]
        ? msg.author
        : msg.channel.guild.shard.client.user)
        .dynamicAvatarURL('png', 1024)
      return { avatar1: avatarurl, avatar2: authorurl }
    }
    return { avatar1: avatarurl }
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
