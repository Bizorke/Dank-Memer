module.exports = {
  help: 'donor <add | remove> <1 | 5 | 10> <id | @tag>',
  fn: async ({ Memer, msg, args }) => {
    const ids = msg.mentions[0] ? msg.mentions.map(u => u.id) : args.slice(2).filter(arg => parseInt(arg))

    if (
      !args[0] ||
      !args[1]
    ) {
      return 'Argument error. The first argument must be one of `add` or `remove`, and the second must be the amount donated'
    }

    if (args[0] === 'add') {
      ids.forEach(id => Memer.db.addDonor(id, parseInt(args[1])))
      return `Successfully added ${ids.join(', ')} to tier ${args[1]}.`
    } else if (args[0] === 'remove') {
      ids.forEach(id => Memer.db.removeDonor(id))
      return `Successfully removed ${ids.join(', ')}.`
    }
  }
}
