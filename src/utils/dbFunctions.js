module.exports = Bot => ({
  createGuild: async function createGuild (guildID) {
    await Bot.r.table('guilds')
      .insert({
        id: guildID,
        prefix: Bot.config.defaultPrefix,
        disabledCommands: []
      })
      .run()
    return this.getGuild(guildID)
  },

  getGuild: async function getGuild (guildID) {
    return Bot.r.table('guilds')
      .get(guildID)
      .run()
  },

  updateGuild: async function updateGuild (guildEntry) {
    return Bot.r.table('guilds')
      .insert(guildEntry, { conflict: 'update' })
      .run()
  },

  deleteGuild: async function deleteGuild (guildID) {
    return Bot.r.table('guilds')
      .get(guildID)
      .delete()
      .run()
  },

  addCooldown: async function addCooldown (command, ownerID) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()))
    if (!pCommand) {
      return
    }
    const cooldown = pCommand.props.cooldown
    const profile = await this.getCooldowns(ownerID)
    if (!profile) {
      return this.createCooldowns(command, ownerID)
    }
    if (profile.cooldowns.some(cmd => cmd[command])) {
      profile.cooldowns.forEach(cmd => {
        if (cmd[command]) {
          cmd[command] = Date.now() + cooldown
        }
      })
    } else {
      profile.cooldowns.push({ [command]: Date.now() + cooldown })
    }
    return Bot.r.table('cooldowns')
      .insert({ id: ownerID, cooldowns: profile.cooldowns }, { conflict: 'update' })
  },

  createCooldowns: async function createCooldowns (command, ownerID) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()))
    if (!pCommand) {
      return
    }
    const cooldown = pCommand.props.cooldown
    return Bot.r.table('cooldowns')
      .insert({ id: ownerID, cooldowns: [ { [command]: Date.now() + cooldown } ] })
  },

  getCooldowns: async function getCooldown (ownerID) {
    return Bot.r.table('cooldowns')
      .get(ownerID)
      .run()
  },

  clearCooldowns: async function clearCooldowns (ownerID) {
    return Bot.r.table('cooldowns')
      .get(ownerID)
      .delete()
      .run()
  },

  getCooldown: async function getCooldown (command, ownerID) {
    const profile = await Bot.r.table('cooldowns').get(ownerID).run()
    if (!profile) {
      return 1
    }
    const cooldowns = profile.cooldowns.find(item => item[command])
    if (!cooldowns) {
      return 1
    }
    return profile.cooldowns.find(item => item[command])[command]
  },

  addBlock: async function addBlock (id) {
    return Bot.r.table('blocked')
      .insert({ id })
      .run()
  },

  removeBlock: async function removeBlock (id) {
    return Bot.r.table('blocked')
      .get(id)
      .delete()
      .run()
  },

  isBlocked: async function isBlocked (guildID, authorID = 1) {
    const res = await Bot.r.table('blocked').get(guildID).run() ||
                await Bot.r.table('blocked').get(authorID).run()

    return Boolean(res)
  },

  addPls: async function addPls (guildID, userID) {
    let pls = await this.getPls(guildID)
    let userPls = await this.getUser(userID)
    if (!pls) {
      return this.initPls(guildID)
    }
    if (!userPls) {
      return this.initUser(userID)
    }
    if (!userPls.pls) {
      return this.updateLegacyUser(userID)
    }
    pls.pls++
    userPls.pls++

    Bot.r.table('users')
      .insert(userPls, {conflict: 'update'})
      .run()

    return Bot.r.table('pls')
      .insert(pls, { conflict: 'update' })
      .run()
  },

  initPls: async function initPls (guildID) {
    return Bot.r.table('pls')
      .insert({
        id: guildID,
        pls: 1
      })
      .run()
  },

  deletePls: async function deletePls (guildID) {
    return Bot.r.table('pls')
      .get(guildID)
      .delete()
      .run()
  },

  getPls: async function getPls (guildID) {
    let pls = await Bot.r.table('pls')
      .get(guildID)
      .run()
    if (!pls) {
      this.initPls(guildID)
      return 0
    }
    return pls
  },

  topPls: async function topPls () {
    const res = await Bot.r.table('pls')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(5)
      .run()
    return res
  },
  /* come back another time, not sure how to model this data
  initCommand: async function initCommand (commandName) {
    return Bot.r.table('commands')
      .insert({
        command: commandName,
        uses: 1
      }, { conflict: 'update', returnChanges: true })
      .run()
  },

  updateCommand: async function updateCommand (commandName) {
    let commands = await Bot.r.table('commands')

    if (!commands.command) {
      return this.initCommand(commandName)
    }
    commands.command.uses++
    command.catagoryName.commandName.uses++

    return Bot.r.table('commands')
      .insert(command, { conflict: 'update' })
      .run()
  },
  */
  initUser: async function initUser (id) {
    return Bot.r.table('users')
      .insert({
        id: id,
        coin: 0,
        pls: 1,
        streak: { time: 0, streak: 0 },
        upvoted: false
      }, { conflict: 'update', returnChanges: true })
      .run()
  },

  topUsers: async function topUsers () {
    const res = await Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(5)
      .run()
    return res
  },

  updateLegacyUser: async function updateLegacyUser (id) {
    return Bot.r.table('users')
      .insert({
        id: id,
        pls: 1,
        streak: { time: 0, streak: 0 },
        upvoted: false
      }, { conflict: 'update', returnChanges: true })
      .run()
  },

  /* This vs just using the other pls functions?

  plsUser: async function plsUser (id) {
    let user = this.getUser(id)
    user.pls++
    return Bot.r.table('users')
      .insert(user, { conflict: 'update' })
      .run()
  },

  */

  getUser: async function getUser (userID) {
    let pls = await Bot.r.table('users')
      .get(userID)
      .run()
    if (!pls) {
      pls = await this.initUser(userID)
      if (pls.changes[0]) {
        pls = pls.changes[0].new_val
      }
      return pls
    }
    return pls
  },

  removeUser: async function removeUser (userID) {
    return Bot.r.table('users')
      .get(userID)
      .delete()
      .run()
  },

  addCoins: async function addCoins (id, amount) {
    let coins = await this.getCoins(id)
    coins.coin += amount

    return Bot.r.table('users')
      .insert(coins, { conflict: 'update' })
  },

  topCoins: async function topCoins () {
    const res = await Bot.r.table('users')
      .orderBy({index: Bot.r.desc('coin')})
      .limit(5)
      .run()
    return res
  },

  fixCoins: async function fixCoins (id, amount) {
    let coins = await this.getCoins(id)
    coins.coin = Math.round(coins.coin)

    Bot.r.table('users')
      .insert(coins, { conflict: 'update' })
    return coins
  },

  removeCoins: async function removeCoins (id, amount) {
    let coins = await this.getCoins(id)
    if (coins.coin - amount <= 0) {
      coins.coin = 0
    } else {
      coins.coin -= amount
    }

    return Bot.r.table('users')
      .insert(coins, { conflict: 'update' })
  },

  grabCoin: async function grabCoin (id) {
    let coins = await Bot.r.table('users')
      .get(id)
      .run()
    if (!coins) {
      return Bot.r.table('users')
        .insert({ id, coin: 0 }, { returnChanges: true })
        .run()
    }
    return coins
  },

  getCoins: async function getCoins (id) {
    let coins = await this.grabCoin(id)
    if (coins.changes) (coins = coins.changes[0].new_val)
    return coins
  },

  addStreak: async function addStreak (id) {
    let { streak } = await this.getStreak(id)
    if (!streak) {
      streak = {}
    }

    streak.time = Date.now()
    streak.streak = ~~streak.streak + 1

    await Bot.r.table('users').insert({ id, streak }, { conflict: 'update' }).run()
  },

  getStreak: async function getStreak (id) {
    let users = await this.getUser(id)
    return users
  },

  resetStreak: async function removeStreak (id) {
    const streak = {
      time: Date.now(),
      streak: 1
    }
    await Bot.r.table('users').insert({ id, streak }, { conflict: 'update' }).run()
  },

  /* noCoins: async function noCoins (id) {
    return Bot.r.table('users')
      .get(id) //no longer works with user table, needs reworked
      .delete()
      .run()
  }, */

  addDonator: async function addDonator (id, donatorLevel) {
    return Bot.r.table('donators')
      .insert({ id, donatorLevel })
      .run()
  },

  removeDonator: async function removeDonator (id) {
    return Bot.r.table('donators')
      .get(id)
      .delete()
      .run()
  },

  isDonator: async function isDonator (id, donatorLevel = 1) {
    const res = await Bot.r.table('donators')
      .get(id)
      .run()
    return res ? res.donatorLevel >= donatorLevel : false
  },

  getStats: async function getStats () {
    const res = await Bot.r.table('stats')
      .get(1)
      .run()
    return res.stats
  }
})
