const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || Memer.db.updateGuild({
      prefix: Memer.config.options.prefix,
      disabledCommands: [],
      disabledCategories: [],
      enabledCommands: [],
      autoResponse: {
        dad: false,
        ree: false,
        sec: false,
        nou: false
      }
    });

    gConfig.enabledCommands = gConfig.enabledCommands || [];
    gConfig.disabledCategories = gConfig.disabledCategories || [];

    const enabledCommands = gConfig.enabledCommands.filter(cmd => gConfig.disabledCategories.includes(Memer.cmds.find(c => c.props.triggers.includes(cmd)).category.split(' ')[1].toLowerCase()));
    return {
      author:
        { name: `Server Config for ${msg.channel.guild.name}`,
          icon_url: msg.channel.guild.iconURL
        },
      fields: [
        {
          name: 'Prefix',
          value: gConfig.prefix,
          inline: true
        },
        {
          name: 'Modlog Channel',
          value: gConfig.modlog || 'No modlog channel set',
          inline: true
        },
        {
          name: 'Disabled Commands',
          value: gConfig.disabledCommands.map(cmd => `\`${cmd}\``).join(', ') || 'No disabled commands',
          inline: true
        },
        {
          name: 'Disabled Categories',
          value: gConfig.disabledCategories.map(cmd => `\`${cmd}\``).join(', ') || 'No disabled categories',
          inline: true
        },
        {
          name: 'Enabled Commands',
          value: enabledCommands.map(c => `\`${c}\``).join(', ') || 'No overriding enabled commands',
          inline: true
        }
      ]
    };
  },
  {
    triggers: ['serverconf', 'conf'],
    description: 'show your server configuration'
  }
);
