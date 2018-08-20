const { GenericCommand } = require('../../models/')
const { convertAndSave, exists, isOpus, getFiles, saveAudioData } = require('../../utils/audioUtils.js')
const basePath = `${process.cwd()}/assets/audio/custom`

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!msg.attachments[0]) {
      return 'whaddya wanna add fam?'
    }

    const fileName = msg.args.nextArgument()

    if (!fileName) {
      return 'Whaddya want to call this clip?'
    }

    if (!/^[a-zA-Z0-9]+$/.test(fileName)) {
      return 'filename must be alphanumeric, living in windows 95 era 😤'
    }

    if (await exists(`${basePath}/${msg.author.id}/${fileName}.opus`)) {
      return 'Looks like a clip with that name already exists. SAD!'
    }

    const files = await getFiles(`${basePath}/${msg.author.id}/`)
      .catch(() => [])

    const isDonor = await Memer.db.checkDonor(msg.author.id)
    const maxClips = isDonor ? 10 : 3

    if (files.length >= maxClips) {
      return `No more clips for you, you've hit the maximum limit of ${maxClips} clips!`
    }

    const opus = await isOpus(msg.attachments[0].url)
    const requiresConversion = !opus

    // if (requiresConversion && !isDonor) {
    //   return 'soz dood, clip has to be opus format. Donors get their clips converted automatically'
    // }

    const MAX_FILE_SIZE = 256000 // 256 KB
    const fileSize = msg.attachments[0].size

    if (fileSize <= 0) {
      return 'you tryna fool me? this file is empty! BAMBOOZLED'
    }

    if (fileSize > MAX_FILE_SIZE) {
      return `do i look like a damn warehouse? keep ur files under ${MAX_FILE_SIZE / 1000}KB kthx`
    }

    if (requiresConversion) {
      try {
        await convertAndSave(msg.attachments[0].url, `${basePath}/${msg.author.id}`, `${fileName}.opus`)
        return 'k ur clip is ready, use the `playclip` command to play it'
      } catch (e) {
        return `fucc, ${e}`
      }
    } else {
      try {
        await saveAudioData(msg.attachments[0].url, `${basePath}/${msg.author.id}`, `${fileName}.opus`)
        return 'k ur clip is ready, use the `playclip` command to play it'
      } catch (e) {
        Memer.log(`[addclip] Failed to save clip!\n\t${e}`)
        return `Something went wrong while saving your hecking clip\n\`\`\`\n${e.message}\`\`\`\n\nJoin here (https://discord.gg/ebUqc7F) if the issue doesn't stop being an ass`
      }
    }
  },
  {
    triggers: ['addclip'],
    usage: '{command} <clipname>',
    description: 'Add a soundboard clip!'
  }
)
