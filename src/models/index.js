require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.includes('.'))
  .map(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
