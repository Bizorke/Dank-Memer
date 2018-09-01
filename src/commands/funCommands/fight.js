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

    const performTurn = async (attacker, opponent) => {
      [turn, oppturn] = [oppturn, turn]
      msg.channel.createMessage(`${turn.mention}, what do you want to do? \`punch\` or \`defend\`?\nType your choice out in chat as it's displayed`)
      let prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
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
        return defense
      } else {
        msg.channel.createMessage('That\'s not a valid option! You must type `punch` or `defend` in chat!')
      }
    }

    const play = async () => {
      const damage = await performTurn(turn, oppturn)
      if (!damage) {
        return
      }
      msg.channel.createMessage(`**${turn.username}** lands an amazing hit on **${oppturn.username}** dealing **${damage}**!\n**${oppturn.username}** is left with just ${oppturn.health} health!`)
    }

    if (turn.health > 1 && oppturn.health > 1) {
      play()
    }
  },
  {
    triggers: ['fight', 'challenge'],
    description: 'fight'
  }
)
