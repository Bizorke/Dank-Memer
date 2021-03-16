const { createDeflate, createGunzip } = require('zlib');
const querystring = require('querystring');
const https = require('https');
const http = require('http');
const url = require('url');

class HTTPError extends Error {
  constructor (message, res) {
    super(message);
    Object.assign(this, res);
    this.name = this.constructor.name;
  }
}

module.exports = class HTTPRequest {
  constructor (method, url, options = {}) {
    this.options = Object.assign({
      method,
      url
    }, options, {
      headers: {},
      query: undefined,
      data: undefined
    });
    if (options.headers) {
      this.set(options.headers);
    }
    if (options.query) {
      this.query(options.query);
    }
    if (options.data) {
      this.send(options.data);
    }
    this.redirects = 0;
    this.req = null;
  }

  query (name, value) {
    if (this.options.query === undefined) {
      this.options.query = {};
    }
    if (typeof name === 'object') {
      Object.assign(this.options.query, name);
    } else {
      this.options.query[name] = value;
    }

    return this;
  }

  set (name, value) {
    if (typeof name === 'object') {
      for (const [k, v] of Object.entries(name)) {
        this.options.headers[k.toLowerCase()] = v;
      }
    } else {
      this.options.headers[name.toLowerCase()] = value;
    }

    return this;
  }

  send (data) {
    if (data !== null && typeof data === 'object') {
      const header = this.options.headers['content-type'];
      let serialize;
      if (header) {
        if (header.includes('application/json')) {
          serialize = JSON.stringify;
        } else if (header.includes('urlencoded')) {
          serialize = querystring.stringify;
        }
      } else {
        this.set('Content-Type', 'application/json');
        serialize = JSON.stringify;
      }
      this.options.data = serialize(data);
    } else {
      this.options.data = data;
    }
    return this;
  }

  execute () {
    return new Promise((resolve, reject) => {
      const fetch = this.options.url.startsWith('https') ? https.request : http.request;
      if (this.options.query) {
        const stringifiedQuery = querystring.stringify(this.options.query);

        if (stringifiedQuery) {
          this.options.url += `?${stringifiedQuery}`;
        }
      }
      this.options = Object.assign(this.options, url.parse(this.options.url));
      const req = fetch(this.options, res => {
        const ce = res.headers['content-encoding'];

        let data = [];
        let response = res;

        if (ce === 'deflate') res.pipe(response = createDeflate());
        if (ce === 'gzip') res.pipe(response = createGunzip());

        response.on('data', chunk => { data.push(chunk); });
        response.once('error', reject);
        response.once('end', async () => {
          let result = {
            get body () {
              const type = res.headers['content-type'];
              let parsed;
              if (/application\/json/.test(type)) {
                try {
                  parsed = JSON.parse(result.raw);
                } catch (_) {
                  parsed = String(result.raw);
                }
              } else {
                parsed = result.raw;
              }
              return parsed;
            },
            raw: Buffer.concat(data),
            ok: res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            statusText: res.statusMessage,
            headers: response.headers
          };
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && this.redirects < 2) {
            this.redirects++;
            result = await new HTTPRequest('GET', res.headers.location).then(redirectRes => redirectRes);
          } else if (this.redirects > 2) {
            return reject(new HTTPError('Too many redirects', result));
          }
          if (result.ok) {
            return resolve(result);
          } else {
            return reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result));
          }
        });
      });

      if (this.options.data) req.write(this.options.data);
      req.on('error', reject);
      req.end();
    });
  }

  then (resolver, rejector) {
    if (!this.req) {
      this.req = this.execute().then(resolver, rejector);
    } else {
      this.req = this.req.then(resolver, rejector);
    }
    return this.req;
  }

  catch (rejector) {
    return this.then(null, rejector);
  }

  end () {
    return this.then(null, null);
  }

  static get (...args) {
    return new HTTPRequest('GET', ...args);
  }

  static post (...args) {
    return new HTTPRequest('POST', ...args);
  }
};
