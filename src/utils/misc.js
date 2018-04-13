const config = require('../config.json')

module.exports = {
  errorMessages: async (e) => {
    // Voice related errors
    if (e.message.includes('Disconnected')) {
      return `Discord fucked something up. 😠\n\nTo fix this, you have to got to server settings and change the voice region.\nIf it still doesn't work after that, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`vc1\`.`
    }

    if (e.message.includes('Voice connection timeout')) {
      return `Discord fucked something up. 😠\n\nTo fix this, you have to kick me and reinvite me back. I know, it is stupid. 🙄\nIf it still doesn't work after that, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`vc2\`.`
    }

    if (e.message.includes('Already encoding')) {
      return `Something fucked up. 😠\n\nTo fix this, change your server region, and if it still doesn't work you have to kick me and reinvite me back. I know, it is stupid. 🙄\nIf it still doesn't work after that, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`vc3\`.`
    }

    // Currency Errors
    if (e.message.includes('new_val')) {
      return `Oopsy doopsy, we made a fucky wucky! 😊\n\nThis shouldn't happen to you again, and we are working semi-hard on fixing it. \nIf it DOES happen again, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`econ1\`.`
    }

    // Image Errors
    if (e.message.includes('Invalid character in header content')) {
      return `Well heck, I didn't like some character you used for this command! 😠\n\nIf you used any "not normal" characters for this command, remove those and try again. \nIf it is still happening, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`img1\`.`
    }

    if (e.message.includes('socket hang up')) {
      return `Looks like we just restarted our image server\n\nOnce it is done rebooting, this command will work again. Give it just a few seconds!\nIf it is still happening after multiple minutes, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`img2\`.`
    }

    // Discord Errors
    if (e.message.includes('DiscordRESTError [50001]: Missing Access')) {
      return `Hey! For some reason I don't have permission to run that command. 😠\n\nMake sure you have given me the correct channel perms to run this command. \nIf it is still happening after messing with permissions, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis1\`.`
    }

    if (e.message.includes('Request timed out (>15000ms) on POST')) {
      return `aggggghhhhhhhh discord is having connection issues 😠\n\nAll we can do is wait until they're better. Sorryyyyyy.\nIf it is still happening after a few hours, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis2\`.`
    }

    if (e.message.includes('DiscordRESTError [50013]: Missing Permissions')) {
      return `Hey! For some reason I don't have permission to run that command. 😠\n\nMake sure you have given me the correct channel perms to run this command. \nIf it is still happening after messing with permissions, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis3\`.`
    }

    if (e.message.includes('Must be 2000 or fewer in length')) {
      return `You included too many characters in that.\n\nI am only able to send 2k characters in one message, so please try again with less characters.\nIf it is still happening, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis4\`.`
    }

    if (e.message.includes('DiscordHTTPError: 500 INTERNAL SERVER ERROR on POST')) {
      return `aggggghhhhhhhh discord is having connection issues 😠\n\nAll we can do is wait until they're better. Sorryyyyyy.\nIf it is still happening after a few hours, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis5\`.`
    }

    // Known Errors
    if (e.message.includes('Cannot read property \'triggers\' of undefined')) {
      return `This command is currently under maintance, sorry :(\n\nIt will work if you are spelling the command you are enabling/disabling correctly.\nIf it is still happening, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`bug1\`.`
    }

    if (e.message.includes('504 Gateway Timeout')) {
      return `Look like the service we use for this command is giving us problems :(\n\nAll we can currently do is wait, sadly\nIf it is still happening after a few hours, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`bug2\`.`
    }

    // Bug Hunting errors
    if (e.message.includes('DiscordRESTError [10003]: Unknown Channel')) {
      return `Something broke!\n\nI am currently not sure why this bug is happening, but if you report this bug in the support server, you will get paid for it in meme coins.\nJoin (<https://discord.gg/ebUqc7F>) and tell support it is error \`hunt1\`.`
    }

    return false
  },

  intro: `Sup nerds. My name is **Dank Memer**.\n\nTo get started, send \`${config.defaultPrefix} help\`. All commands are run this way, for example, pls meme.\n\nThere ARE NSFW commands on this bot, but you can disable them with \`pls disable nsfw\`\n\nI am maintained by Melmsie#0001, who can be found at [this server](https://discord.gg/ebUqc7F) if you need to talk to him.`,

  links: '[Support Server](https://discord.gg/ebUqc7F) - Get help for the bot and meme around\n[Official Twitter](https://twitter.com/dankmemerbot) - Sometimes win free stuff and meme around\n[Owner\'s Stream](https://www.twitch.tv/m3lmsie) - Ask the bot owner questions live and meme around\n[Invite Link](https://goo.gl/BPWvB9) - Add the bot to another server and meme around',

  randomColor: () => {
    return Math.floor(Math.random() * 0xFFFFFF)
  },

  randomInArray: (array) => {
    return array[Math.floor(Math.random() * array.length)]
  },

  removeDuplicates: (array) => {
    return Array.from(new Set(array).values())
  },

  codeblock: (str, lang) => {
    return `${'```'}${lang || ''}\n${str}\n${'```'}`
  },

  parseTime: (time) => {
    const methods = [
      { name: 'd', count: 86400 },
      { name: 'h', count: 3600 },
      { name: 'm', count: 60 },
      { name: 's', count: 1 }
    ]

    const timeStr = [ Math.floor(time / methods[0].count).toString() + methods[0].name ]
    for (let i = 0; i < 3; i++) {
      timeStr.push(Math.floor(time % methods[i].count / methods[i + 1].count).toString() + methods[i + 1].name)
    }

    return timeStr.filter(g => !g.startsWith('0')).join(', ')
  },

  paginate: (text, limit = 2000) => {
    const lines = text.trim().split('\n')
    const pages = []

    let chunk = ''

    for (const line of lines) {
      if (chunk.length + line.length > limit && chunk.length > 0) {
        pages.push(chunk)
        chunk = ''
      }

      if (line.length > limit) {
        const lineChunks = line.length / limit

        for (let i = 0; i < lineChunks; i++) {
          const start = i * limit
          const end = start + limit
          pages.push(line.slice(start, end))
        }
      } else {
        chunk += `${line}\n`
      }
    }

    if (chunk.length > 0) {
      pages.push(chunk)
    }

    return pages
  }
}
