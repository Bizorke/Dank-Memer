/** @typedef {import('eris').Message} Message
 * @typedef {import('../utils/misc')} Utils
 */

/** @typedef {Object} ExtendedMessage
 * @prop {import("../utils/ArgParser")} args
 */

/** @typedef {Message & ExtendedMessage} MemerMessage */

/** @typedef {Object} Memer
 * @prop {import('rethinkdbdash')} r The RethinkDB interface (haha no intellisense for it because rethonk sucks)
 * @prop {import('redis').RedisClient} redis The redis interface
 * @prop {import('../utils/http')} http The http module
 * @prop {import('../utils/logger')} log The log module
 * @prop {Object} db The database functions
 * @prop {Object} config The Memer config
 * @prop {Object} secrets The secrets, credentials and stuff
 * @prop {import('lavalink').Cluster} lavalink The lavalink cluster
 * @prop {import('../utils/MusicManager')} musicManager The music manager
 * @prop {import('eris').Client} bot The eris client instance
 * @prop {import('../utils/Autopost')} autopost The auto-poster
 * @prop {Array<Object>} cmds An array of all the commands
 * @prop {Utils.randomColor} randomColor
 * @prop {Utils.inviteRemoval} inviteRemoval
 * @prop {Utils.calcMultiplier} calcMultiplier
 * @prop {Utils.showMultiplier} showMultiplier
 * @prop {Utils.decodeHtmlEntity} decodeHtmlEntity
 * @prop {Utils.randomInArray} randomInArray
 * @prop {Utils.randomNumber} randomNumber
 * @prop {Utils.sleep} sleep
 * @prop {Utils.removeDuplicates} removeDuplicates
 * @prop {Utils.codeblock} codeblock
 * @prop {Utils.parseTime} parseTime
 * @prop {Utils.punish} punish
 * @prop {Utils.paginate} paginate
 * @prop {Utils.format} format
 */

/** @typedef {Object} FunctionParams
 * @prop {Memer} Memer The Memer instance
 * @prop {MemerMessage} msg The message
 * @prop {Array<String>} args The raw sliced arguments
 * @prop {Array<String>} cleanArgs The raw sliced arguments, but with mentions nullified
 */

module.exports = class GenericCommand {
  /**
   * Creates a new instance of GenericCommand
   * @param {CommandCallback} fn The function
   * @param {Object} cmdProps - The props
   */
  constructor (fn, props) {
    this.fn = fn
    this.cmdProps = props
  }

  async run ({ Memer, msg, args, addCD, cleanArgs }) {
    if (this.props.missingArgs && !args[0]) {
      return this.props.missingArgs
    }
    if (this.props.minArgs && args.length < this.props.minArgs) {
      return this.props.missingArgs
    }
    return this.fn({ Memer, msg, args, addCD, cleanArgs })
  }

  get props () {
    return Object.assign({
      usage: '{command}',
      cooldown: 2000,
      donorCD: 500,
      isNSFW: false,
      ownerOnly: false
    }, this.cmdProps, {
      perms: ['sendMessages'].concat(this.cmdProps.perms || [])
    })
  }
}

/**
 * @callback CommandCallback
 * @param {FunctionParams} params
 */
