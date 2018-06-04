const sf = require('snekfetch')
const fs = require('fs')

async function isOpus (url) {
  const res = await sf.get(url)
    .set('Range', 'bytes=0-35')
    .catch(() => ({})) // eslint-disable-line

  const buf = res.body

  if (!res.ok || !buf || buf.length < 36) {
    return false
  }

  // Bytes 0 to 3: detect general OGG (OPUS is OGG)
  // Bytes 28 to 35: detect OPUS
  return buf[0] === 79 &&
    buf[1] === 103 &&
    buf[2] === 103 &&
    buf[3] === 83 &&
    buf[28] === 79 &&
    buf[29] === 112 &&
    buf[30] === 117 &&
    buf[31] === 115 &&
    buf[32] === 72 &&
    buf[33] === 101 &&
    buf[34] === 97 &&
    buf[35] === 100
}

async function getFileSize (url) {
  const res = await sf.get(url)
  return res.headers['content-length'] || 0
}

function saveAudioData (url, dir, file) {
  return new Promise((resolve, reject) => {
    sf.get(url)
      .catch(reject)
      .then(res => {
        writeBuffer(dir, file, res.body)
          .catch(reject)
          .then(resolve)
      })
  })
}

function makeDir (dir) {
  return new Promise((resolve, reject) => {
    exists(dir).then(res => {
      if (res) {
        return resolve()
      }

      fs.mkdir(dir, (err) => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  })
}

function writeBuffer (path, file, buffer) {
  // TODO: Use fs/promise?
  return new Promise((resolve, reject) => {
    makeDir(path)
      .then(() => {
        fs.writeFile(`${path}/${file}`, buffer, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
      .catch(reject)
  })
}

function getFiles (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

function removeFile (path) {
  return new Promise((resolve, reject) => {
    exists(path)
      .then(res => {
        if (!res) {
          return reject(`File ${path} not found`) // eslint-disable-line
        }

        fs.unlink(path, (err) => {
          if (err) {
            return reject(err)
          }

          resolve()
        })
      })
  })
}

function exists (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.R_OK, (err) => {
      resolve(err === null)
    })
  })
}

module.exports = {
  exists,
  getFiles,
  getFileSize,
  isOpus,
  removeFile,
  saveAudioData
}
