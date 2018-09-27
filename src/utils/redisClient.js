<<<<<<< Updated upstream
const Redis = require('ioredis')
=======
const { promisify } = require('util');
const redis = require('redis');
>>>>>>> Stashed changes

/**
 * @returns {import('ioredis').Redis} The redis instance
*/
module.exports = (hostAddr) => new Promise(resolve => {
<<<<<<< Updated upstream
  const client = new Redis({host: hostAddr || '127.0.0.1'})
=======
  const client = redis.createClient({ host: hostAddr || '127.0.0.1' });

  for (const prop in client) {
    if (typeof client[prop] === 'function') {
      client[`${prop}Async`] = promisify(client[prop]).bind(client);
    }
  }
>>>>>>> Stashed changes

  client.on('error', (err) => {
    console.error(err);
  });

  client.on('ready', resolve.bind(null, client));
});
