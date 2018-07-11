module.exports = Bot => ({
  createGuild: async function createGuild (guildID) {
    await Bot.r.table('guilds')
      .insert({
        id: guildID,
        prefix: Bot.config.defaultPrefix,
        modlog: '',
        disabledCategories: [],
        disabledCommands: []
      })
      .run()
    return this.getGuild(guildID)
  },

  updateModlog: async function updateModlog (guildID, channelID) {
    let res = await this.getGuild(guildID)
    if (!res) {
      res = await this.createGuild(guildID)
    }
    if (channelID === 0) {
      res.modlog = 0
    }
    res.modlog = channelID

    return Bot.r.table('guilds')
      .insert(res, { conflict: 'update' })
  },

  fetchModlog: async function fetchModlog (guildID) {
    let res = await this.getGuild(guildID)
    if (!res) {
      res = await this.createGuild(guildID)
    }
    let modlog
    console.log(res.modlog)
    if (!res.modlog) {
      res.modlog = 0
      await Bot.r.table('guilds')
        .insert(res, { conflict: 'update' })
    }
    if (res.modlog === 0) {
      modlog = false
    } else {
      modlog = res.modlog
    }

    return modlog
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

  updateCooldowns: async function createCooldown (command, ownerID) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()))
    if (!pCommand) {
      return
    }
    const isDonor = await this.checkDonor(ownerID)
    let cooldown
    if (isDonor && !pCommand.props.donorBlocked) {
      cooldown = pCommand.props.donorCD
    } else {
      cooldown = pCommand.props.cooldown
    }
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
    const isDonor = await this.checkDonor(ownerID)
    if (isDonor && !pCommand.props.donorBlocked) {
      const cooldown = pCommand.props.donorCD
      return Bot.r.table('cooldowns')
        .insert({ id: ownerID, cooldowns: [ { [command]: Date.now() + cooldown } ] })
    }
    const cooldown = pCommand.props.cooldown
    return Bot.r.table('cooldowns')
      .insert({ id: ownerID, cooldowns: [ { [command]: Date.now() + cooldown } ] })
  },

  getCooldowns: async function getCooldowns (ownerID) {
    return Bot.r.table('cooldowns')
      .get(ownerID)
      .run()
  },

  deleteCooldowns: async function deleteCooldowns (ownerID) {
    return Bot.r.table('cooldowns')
      .get(ownerID)
      .delete()
      .run()
  },

  getSpecificCooldown: async function getSpecificCooldown (command, ownerID) {
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

  createBlock: async function createBlock (id) {
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

  checkBlocked: async function checkBlocked (guildID, authorID = 1) {
    const res = await Bot.r.table('blocked').get(guildID).run() ||
                await Bot.r.table('blocked').get(authorID).run()

    return Boolean(res)
  },

  addPls: async function addPls (guildID, userID) {
    let guild = await this.getPls(guildID)
    let user = await this.getUser(userID)
    if (!guild) {
      return this.initPls(guildID)
    }
    if (!user) {
      return this.initUser(userID)
    }
    guild.pls++
    user.pls++

    Bot.r.table('guildUsage')
      .insert(guild, { conflict: 'update' })
      .run()

    return Bot.r.table('users')
      .insert(user, {conflict: 'update'})
      .run()
  },

  initPls: async function initPls (guildID) {
    return Bot.r.table('guildUsage')
      .insert({
        id: guildID,
        pls: 1
      })
      .run()
  },

  deletePls: async function deletePls (guildID) {
    return Bot.r.table('guildUsage')
      .get(guildID)
      .delete()
      .run()
  },

  getPls: async function getPls (guildID) {
    let res = await Bot.r.table('guildUsage')
      .get(guildID)
      .run()
    if (!res) {
      this.initPls(guildID)
      return 0
    }
    return res
  },

  topPls: async function topPls () {
    return Bot.r.table('guildUsage')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(10)
      .run()
  },

  initUser: async function initUser (id) {
    return Bot.r.table('users')
      .insert({
        id: id, // User id/rethink id
        pls: 1, // Total commands ran
        lastCmd: Date.now(), // Last command time
        lastRan: 'nothing', // Last command ran
        spam: 0, // Spam means 2 commands in less than 1s
        pocket: 0, // Coins not in bank account
        bank: 0, // Coins in bank account
        lost: 0, // Total coins lost
        won: 0, // Total coins won
        shared: 0, // Transferred to other players
        streak: {
          time: 0, // Time since last daily command
          streak: 0 // Total current streak
        },
        items: {
          spin: 0, // Fidget Spinners
          memes: 0, // Memes
          tide: 0 // Tide Pods
        },
        upgrades: {
          incr: 0, // Incremental upgrades
          multi: 0, // Multiplier upgrades
          vault: 0, // Bank Vault upgrades
          shares: 0, // Sharing upgrades
          luck: 0 // Luck upgrades
        },
        donor: false, // Donor status, false or $amount
        godMode: false, // No cooldowns, only for select few
        vip: false, // Same cooldowns as donors without paying
        upvoted: false // DBL voter status
      }, { conflict: 'update', returnChanges: true })
      .run()
  },

  topUsers: async function topUsers () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(15) // TODO: Make 10 along with other (top) functions
      .run()
  },

  getUser: async function getUser (userID) {
    let res = await Bot.r.table('users')
      .get(userID)
      .run()
    if (!res) {
      res = await this.initUser(userID)
      if (res.changes[0]) {
        res = res.changes[0].new_val
      }
      return res
    }
    if (!res.lastCmd || !res.spam) {
      res.spam = 0
      res.lastCmd = Date.now()
    }
    return res
  },

  removeUser: async function removeUser (userID) {
    return Bot.r.table('users')
      .get(userID)
      .delete()
      .run()
  },

  checkVoter: async function checkVoter (id) {
    let res = await this.getUser(id)
    return res.upvoted
  },

  addPocket: async function addPocket (id, amount) {
    let res = await this.getUser(id)
    res.pocket += amount
    res.won += amount

    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  addBank: async function addPocket (id, amount) {
    let res = await this.getUser(id)
    res.bank += amount

    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  topPocket: async function topPocket () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pocket')})
      .limit(10)
      .run()
  },

  roundPocket: async function roundPocket (id) {
    let res = await this.getUser(id)
    res.pocket = Math.round(res.pocket)

    Bot.r.table('users')
      .insert(res, { conflict: 'update' })
    return res
  },

  removePocket: async function removePocket (id, amount) {
    let res = await this.getUser(id)

    res.pocket = Math.max(0, res.pocket - amount)
    res.lost -= amount
    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  removeBank: async function removePocket (id, amount) {
    let res = await this.getUser(id)

    res.bank = Math.max(0, res.bank - amount)
    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
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

  addSpam: async function addSpam (id) {
    let { spam } = await this.getSpam(id)
    spam = ~~spam + 1

    await Bot.r.table('users').insert({ id, spam }, { conflict: 'update' }).run()
  },

  topSpam: async function topSpam () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('spam')})
      .limit(10)
      .run()
  },

  addCmd: async function addCmd (id) {
    let lastCmd = Date.now()
    await Bot.r.table('users').insert({ id, lastCmd }, { conflict: 'update' }).run()
  },

  getSpam: async function getSpam (id) {
    return this.getUser(id)
  },

  getStreak: async function getStreak (id) {
    return this.getUser(id)
  },

  resetStreak: async function removeStreak (id) {
    const streak = {
      time: Date.now(),
      streak: 1
    }
    await Bot.r.table('users').insert({ id, streak }, { conflict: 'update' }).run()
  },

  addDonor: async function addDonor (id, donorAmount) {
    return Bot.r.table('donors')
      .insert({ id, donorAmount }, { conflict: 'update' })
      .run()
  },

  removeDonor: async function removeDonor (id) {
    return Bot.r.table('donors')
      .get(id)
      .delete()
      .run()
  },

  checkDonor: async function checkDonor (id) {
    const res = await Bot.r.table('donors')
      .get(id)
      .run()
    return res ? res.donorAmount : false
  },

  getStats: async function getStats () {
    const res = await Bot.r.table('stats')
      .get(1)
      .run()
    return res.stats
  }
})
