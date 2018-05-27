const { spawn } = require('child_process')
const ffprobe = process.platform === 'win32' ? 'ffprobe' : 'avprobe'
const args = '-v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1'.split(' ')

/**
 * Returns the audio encoding format from an audio file
 * @param {String} url The URL of the audio file to identify
 */
function getFormat (url) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffprobe, args.concat(url))
    const chunks = []

    proc.stdout.on('data', (data) => chunks.push(data))
    proc.stderr.on('data', (data) => reject(data.toString()))
    proc.on('close', () => {
      resolve(Buffer.concat(chunks).toString().trim())
    })
  })
}

module.exports = getFormat
