exports.handle = function (guild) {
  const embed = {
    color: 12054271,
    description: this.intro,
    fields: [
      {name: 'Important Links', value: this.links}
    ],
    footer: { text: 'Enjoy the 200+ commands!' }
  };
  guild.channels.get(guild.channels.filter(c => c.type === 0).map(c => c.id)[0]).createMessage({ embed })
    .catch(() => {});
};
