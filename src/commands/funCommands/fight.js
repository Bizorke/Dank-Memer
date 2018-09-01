const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let author = msg.author
    let enemy = msg.args.resolveUser()
    if (!enemy) {
      return 'you need to provide a valid user ID or name to fight against'
    }
    enemy.health = author.health = 100
    enemy.armor = author.armor = 0
    let turn = author
    let oppturn = enemy

    const performTurn = async (attacker, opponent, retry) => {
      msg.channel.createMessage(`${turn.mention}, what do you want to do? \`punch\` or \`defend\`?\nType your choice out in chat as it's displayed!`)
      let prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, attacker.id, 30e3)
      if (!prompt) {
        return `${author.username} didn't answer in time`
      } else if (prompt.content.toLowerCase() === 'punch') {
        let critChance = Math.random() >= 0.75 // 25% chance
        let damage = Math.floor((Math.random() * 100) * (critChance ? 2 : 1))

        opponent.health -= (damage - opponent.armor)
        return damage
      } else if (prompt.content.toLowerCase() === 'defend') {
        let critChance = Math.random() >= 0.75 // 25% chance
        let defense = Math.floor((Math.random() * 25) * (critChance ? 2 : 1))

        attacker.health += defense
        msg.channel.createMessage(`**${attacker.username}** increased their armor by **${defense}**!`)
        return false
      } else {
        msg.channel.createMessage(`That's not a valid option! You must type \`punch\` or \`defend\` in chat!\n${retry ? 'The game has ended due to multiple invalid choices.' : ''}`)
        if (!retry) {
          return performTurn(attacker, opponent, true)
        }
      }
    }

    const play = async () => {
      const damage = await performTurn(turn, oppturn)
      if (!damage) {
        oppturn = [turn, turn = oppturn][0]
        return play()
      }
      const adjective = Memer.randomInArray(['an incredible', 'a fantastic', 'a phenomenal', 'a game-ending', 'an amazing', 'a catastrophic', 'a devestating', 'a crazy'])
      msg.channel.createMessage(`**${turn.username}** lands ${adjective} hit on **${oppturn.username}** dealing **${damage}**!\n**${oppturn.username}** is left with ${oppturn.health} health!`)
      if (turn.health > 1 && oppturn.health > 1) {
        oppturn = [turn, turn = oppturn][0]
        return play()
      } else {
        const loser = turn.health > 1 ? oppturn : turn
        const winner = loser === turn ? oppturn : turn
        loser.health = 0

        // Random words to SPICE up the winning message
        const wowword = Memer.randomInArray(['Holy cow!', 'Wow!', 'I did not expect that!', 'God damn!', 'Oh my god!', 'No way!', 'Holy crap!', 'Dang!'])
        const noun = Memer.randomInArray(['just', 'totally', 'kinda', '100%', 'absolutely', 'seriously', 'legitimately', 'completely'])
        const verb = Memer.randomInArray(['annihilated', 'knocked out', 'memed', 'destroyed', 'crushed', 'ruined', 'eradicated', 'dismantled', 'wiped out',
          'erased', 'squashed', 'shattered'])
        msg.channel.createMessage(`${wowword} **${winner.username}** ${noun} ${verb} **${loser.username}**, winning with just \`${winner.health} HP\` left!`)
      }
    }
    play()
  },
  {
    triggers: ['fight', 'challenge'],
    description: 'Fight to the death!'
  }
)
