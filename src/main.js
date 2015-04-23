const path = require('path');
const Plugin = require('./plugin');

let plugin = new Plugin({
  stubs: {
    functions: path.join(__dirname, '../stubs/functions')
  }
});

module.exports = plugin;
