const gifs = require('../assets/arrays/permGifs.json');
const ArgParser = require('../utils/ArgParser.js');

exports.handle = async function (msg) {
  if (
    !msg.channel.guild ||
    msg.author.bot
  ) {
    return;
  }

  if (this.config.options.dev && !this.config.options.developers.includes(msg.author.id)) { return; }

  let ar = ['im', 'i\'m', 'i am', 'no u', 'sec', 'one sec', 'ree'];

  let slicedMessage = msg.content.split(/\s+/g);
  let passed;
  if (ar.find(a => msg.content.toLowerCase().startsWith(a))) {
    passed = true;
  } else {
    if (slicedMessage.length > 1) {
      for (const command of slicedMessage) {
        if (this.cmds.find(c => c.props.triggers.includes(command.toLowerCase())) || this.tags[command.toLowerCase()]) {
          passed = true;
        }
      }
    }
  }
  if (!passed || await this.db.checkBlocked(msg.author.id, msg.channel.guild.id)) {
    return;
  }

  this.stats.messages++;
  cacheMessage.bind(this)(msg);
  const gConfig = await this.db.getGuild(msg.channel.guild.id) || {
    prefix: this.config.options.prefix,
    disabledCommands: [],
    disabledCategories: [],
    enabledCommands: [],
    autoResponse: {
      dad: false,
      ree: false,
      sec: false,
      nou: false
    }
  };

  gConfig.disabledCategories = gConfig.disabledCategories || [];
  gConfig.enabledCommands = gConfig.enabledCommands || [];

  if (!gConfig.autoResponse) {
    gConfig.autoResponse = {
      dad: false,
      ree: false,
      sec: false,
      nou: false
    };
  }

  if (gConfig.autoResponse.dad) {
    let re = /^(im|i['’]m|i am)\s+(.+)/i;
    const match = re.exec(msg.content);
    if (match && match[2].length < 1980) {
      msg.channel.createMessage(`Hi ${match[2]}, I'm dad`);
    }
  }

  if (gConfig.autoResponse.sec) {
    let re = /^(one sec$|one second|sec$)/i;
    const match = re.exec(msg.content);
    if (match) {
      await this.sleep(1000);
      msg.channel.createMessage(`It's been one second`);
    }
  }

  if (gConfig.autoResponse.ree) {
    let re = /^(ree)/i;
    const match = re.exec(msg.content);
    let content = msg.content.split(/ +/g);
    let e = content[0].length;
    if (match && e < 1997) {
      msg.channel.createMessage(`R${'E'.repeat(e)}`);
    }
  }

  if (gConfig.autoResponse.nou) {
    let re = /^(no (?=u{1,}$))/i;
    const match = re.exec(msg.content);
    if (match) {
      msg.channel.createMessage(`no u`);
    }
  }

  // Swear detection
  if (gConfig.swearFilter) {
    let swears = ['fuck', 'penis', 'cunt', 'faggot', 'wank', 'nigger', 'nigga', 'slut', 'bastard', 'bitch', 'asshole', 'dick', 'blowjob', 'cock',
      'pussy', 'retard', 'ligma', 'sugondese', 'sugandese', 'fricc', 'hecc', 'sugma', 'updog', 'bofa', 'fugma', 'snifma', 'bepis', 'da wae', 'despacito'];
    let re = new RegExp(`.*(${swears.join('|')}).*`, 'i');
    const match = re.exec(msg.content);
    if (match) {
      let failed = '';
      await msg.delete()
        .catch(() => {
          failed = 'I couldn\'t remove the offending message because I don\'t have `Manage Messages` :(';
        });
      msg.channel.createMessage(`No swearing in this christian server :rage:\n${failed}`);
    }
  }

  let isDonor = await this.db.checkDonor(msg.author.id);
  const isGlobalPremiumGuild = await this.db.checkGlobalPremiumGuild(msg.channel.guild.id);

  const selfMember = msg.channel.guild.members.get(this.bot.user.id);
  const mention = `<@${selfMember.nick ? '!' : ''}${selfMember.id}>`;
  const wasMentioned = msg.content.startsWith(mention);
  const triggerLength = (wasMentioned ? mention : gConfig.prefix).length + 1;
  const cleanTriggerLength = (wasMentioned ? `@${selfMember.nick || selfMember.username}` : gConfig.prefix).length + 1;

  if (!msg.content.toLowerCase().startsWith(gConfig.prefix) && !wasMentioned) {
    return;
  }

  let [command, ...args] = msg.content.slice(triggerLength).split(/ +/g);
  const cleanArgs = msg.cleanContent.slice(cleanTriggerLength).split(/ +/g).slice(1); // Preserving this so it doesn't break anything
  // You should use msg.args.cleanContent(consumeRest: boolean), though

  msg.args = new ArgParser(msg, args);

  command = command && (this.cmds.find(c => c.props.triggers.includes(command.toLowerCase())) || this.tags[command.toLowerCase()]);

  if (
    !command &&
    msg.mentions.find(u => u.id === this.bot.user.id) &&
    msg.content.toLowerCase().includes('hello')
  ) {
    return msg.channel.createMessage(`Hello, ${msg.author.username}. My prefix is \`${gConfig.prefix}\`. Example: \`${gConfig.prefix} meme\``);
  } else if (
    !command ||
    (command.props.ownerOnly && !this.config.options.developers.includes(msg.author.id)) ||
    gConfig.disabledCommands.includes(command.props.triggers[0]) ||
    ((gConfig.disabledCategories || []).includes(command.category.split(' ')[1].toLowerCase()) && !['disable', 'enable'].includes(command.props.triggers[0]) && !gConfig.enabledCommands.includes(command.props.triggers[0]))
  ) {
    return;
  } else if (command.props.donorOnly && !isDonor && (!isGlobalPremiumGuild || command.props.triggers.includes('redeem')) && !this.config.options.developers.includes(msg.author.id)) {
    return msg.channel.createMessage('This command is for donors only. You can find more information by using `pls donate` if you are interested.');
  }

  if (msg.member.roles.some(id => msg.channel.guild.roles.get(id).name === 'no memes for you')) { return; }

  let { spam, lastCmd } = await this.db.getUser(msg.author.id);

  if (spam > 1e4) {
    let reason = 'Blacklisted for spamming over 10,000 times.';
    await this.punish(this, msg.author.id, 'user', reason);
    return;
  }

  updateStats.bind(this)(msg, command, lastCmd);

  const isInCooldown = await checkCooldowns.bind(this)(msg, command, isDonor, isGlobalPremiumGuild);
  if (isInCooldown) { return; }

  const updateCooldowns = () => this.db.updateCooldowns(command.props.triggers[0], msg.author.id, isGlobalPremiumGuild);

  try {
    const permissions = msg.channel.permissionsOf(this.bot.user.id);
    if (command.props.perms.some(perm => !permissions.has(perm))) {
      checkPerms.bind(this)(command, permissions, msg);
    } else if (command.props.isNSFW && !msg.channel.nsfw) {
      msg.channel.createMessage(
        {
          'embed': {
            'title': 'NSFW not allowed here',
            'description': 'Use NSFW commands in a NSFW marked channel (look in channel settings, dummy)',
            'color': this.randomColor(),
            'image': {
              'url': gifs.nsfw
            }
          }
        }
      );
    } else {
      msg.reply = (str) => { msg.channel.createMessage(`${msg.author.mention}, ${str}`); };
      await runCommand.bind(this)(command, msg, args, cleanArgs, updateCooldowns, isGlobalPremiumGuild, permissions);
    }
  } catch (e) {
    reportError.bind(this)(e, msg, command, cleanArgs);
  }
};

function cacheMessage (msg) {
  if (!msg.content) { // Ignore attachments without content
    return;
  }
  this.redis.set(`msg-${msg.id}`, JSON.stringify({ userID: msg.author.id, content: msg.content, timestamp: msg.timestamp, guildID: msg.channel.guild.id, channelID: msg.channel.id }), 'EX', 20 * 60);
}

async function updateStats (msg, command, lastCmd) {
  if (Date.now() - lastCmd < 500) {
    await this.db.addSpam(msg.author.id);
  }

  await this.db.addCmd(msg.author.id);

  this.db.addPls(msg.channel.guild.id, msg.author.id);
}

async function checkCooldowns (msg, command, isDonor, isGlobalPremiumGuild) {
  const cooldown = await this.db.getSpecificCooldown(command.props, msg.author.id, isDonor, isGlobalPremiumGuild);
  if (cooldown > Date.now() && process.env.NODE_ENV !== 'dev') {
    const waitTime = (cooldown - Date.now()) / 1000;
    let cooldownWarning = command.props.cooldownMessage || `**Time left until you can run the command again:** `;

    const cooldownMessage = {
      embed: {
        color: this.randomColor(),
        title: 'Slow it down, cmon',
        description: cooldownWarning + (waitTime > 60 ? `**${this.parseTime(waitTime)}**` : `**${waitTime.toFixed()} seconds**`) + `\n\n__Default Cooldown__: ${this.parseTime(command.props.cooldown / 1000)}\n__[Donor](https://www.patreon.com/dankmemerbot) Cooldown__: ${!command.props.donorCD ? this.parseTime(command.props.cooldown / 1000) : this.parseTime(command.props.donorCD / 1000)}\n\nWhile you wait, go check our our [Twitter](https://twitter.com/dankmemerbot), [Subreddit](https://www.reddit.com/r/dankmemer/), and [Discord Server](https://www.discord.gg/Wejhbd4)`
      }
    };
    const donorMessage = {
      embed: {
        color: this.randomColor(),
        title: 'Woah now, slow it down',
        description: cooldownWarning + (waitTime > 60 ? `**${this.parseTime(waitTime)}**` : `**${waitTime.toFixed()} seconds**`) + `\n__[Donor](https://www.patreon.com/dankmemerbot) Cooldown__: ${!command.props.donorCD ? this.parseTime(command.props.cooldown / 1000) : this.parseTime(command.props.donorCD / 1000)}`,
        footer: { text: 'Thanks for your support!' }
      }
    };
    msg.channel.createMessage(isDonor || isGlobalPremiumGuild ? donorMessage : cooldownMessage);
    return true;
  }
  return false;
}

function checkPerms (command, permissions, msg) {
  const neededPerms = command.props.perms.filter(perm => !permissions.has(perm));
  if (permissions.has('sendMessages')) {
    if (permissions.has('embedLinks')) {
      msg.channel.createMessage({
        embed: {
          'title': 'oh no!',
          'description': `You need to add **${neededPerms.length > 1 ? neededPerms.join(', ') : neededPerms}** to use this command!\nGo to **Server settings => Roles => Dank Memer** to change this!`,
          'color': this.randomColor(),
          'image': neededPerms.length === 1 ? {
            'url': gifs[neededPerms[0]]
          } : undefined,
          'footer': {
            'text': 'If it still doesn\'t work, check channel permissions too!'
          }
        }
      });
    } else {
      msg.channel.createMessage(
        `You need to add **${neededPerms.join(', ')}** to use this command!\n\nGo to **Server settings => Roles => Dank Memer** to change this!`
      );
    }
  }
}

async function runCommand (command, msg, args, cleanArgs, updateCooldowns, isGlobalPremiumGuild, permissions) {
  this.stats.commands++;
  let res = await command.run({
    msg,
    args,
    cleanArgs,
    Memer: this,
    addCD: updateCooldowns,
    isGlobalPremiumGuild
  });
  if (!res) {
    return;
  }
  if (res instanceof Object) {
    if (res.reply) {
      return msg.channel.createMessage(`${msg.author.mention}, ${res.content}`);
    }
    res = Object.assign({ color: this.randomColor() }, res);

    if (!permissions.has('embedLinks')) {
      res = this.unembedify({
        content: res.content,
        file: res.file,
        embed: res
      });
    } else {
      res = {
        content: res.content,
        file: res.file,
        embed: res
      };
      if (Object.keys(res.embed).join(',') === 'color,content,file') {
        delete res.embed; // plz fix later
      }
    }
  }

  await msg.channel.createMessage(res, res.file);
}

async function reportError (e, msg, command, cleanArgs) {
  let date = new Date();
  this.stats.errReported++;
  let message = await this.errorMessages(e);
  let randNum = Math.floor(Math.random() * Math.floor(99999));
  const channel = this.config.options.errorChannel || '470338254848262154';
  if (!message) {
    msg.channel.createMessage(`Something went wrong lol\nError: \`${command.props.triggers[0]}.${this.clusterID}.${msg.channel.guild.shard.id}.${date.getHours()}:${date.getMinutes()}.err${randNum}\``);
    await this.bot.createMessage(channel, `**Error: ${e.message}**\nCode: \`err${randNum}\`\nCommand Ran: ${command.props.triggers[0]}\nDate: ${date.toLocaleTimeString('en-US')}\nSupplied arguments: ${cleanArgs.join(' ')}\nServer ID: ${msg.channel.guild.id}\nCluster ${this.clusterID} | Shard ${msg.channel.guild.shard.id}\n\`\`\` ${e.stack} \`\`\``);
    this.log(`Command error:\n\tCommand: ${command.props.triggers[0]}\n\tSupplied arguments: ${cleanArgs.join(' ')}\n\tServer ID: ${msg.channel.guild.id}\n\tError: ${e.stack}`, 'error');
  } else {
    msg.channel.createMessage(message);
    await this.bot.createMessage(channel, `**Error: ${e.message}**\nCommand Ran: ${command.props.triggers[0]}\nDate: ${date.toLocaleTimeString('en-US')}\nSupplied arguments: ${cleanArgs.join(' ')}\nServer ID: ${msg.channel.guild.id}\nCluster ${this.clusterID} | Shard ${msg.channel.guild.shard.id}\n\`\`\` ${e.stack} \`\`\``);
    this.log(`Command error:\n\tCommand: ${command.props.triggers[0]}\n\tSupplied arguments: ${cleanArgs.join(' ')}\n\tServer ID: ${msg.channel.guild.id}\n\tError: ${e.stack}`, 'error');
  }
}
