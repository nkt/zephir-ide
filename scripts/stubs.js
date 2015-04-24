var Promise = require('bluebird');
var xml2js = Promise.promisifyAll(require('xml2js'));
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var util = require('util');

var docsPath = path.join(process.argv[process.argv.length - 1], 'en/reference');
var outPath = path.join(__dirname, '../stubs/functions');

if (!fs.statSync(docsPath).isDirectory()) {
  console.error('Wrong doc path: %s', docsPath);
}

var modules = Object.create(null);

fs.readdirSync(docsPath).map(function(module) {
  var moduleDir = path.join(docsPath, module, 'functions');
  if (!fs.existsSync(moduleDir) || !fs.statSync(moduleDir).isDirectory()) {
    return;
  }

  modules[module] = fs.readdirSync(moduleDir).map(function(file) {
    return path.join(moduleDir, file);
  }).filter(function(file) {
    return /\.xml$/.test(file);
  });
});

Promise.map(Object.keys(modules), function(module) {
  return Promise.map(modules[module], function(file) {
    return xml2js.parseStringAsync(fs.readFileSync(file), {
      normalizeTags: true,
      normalize: true,
      trim: true,
      mergeAttrs: true,
      strict: false,
      explicitArray: false,
      attrNameProcessors: [
        function (name) {
          return name.toLowerCase();
        }
      ]
    });
  }).map(function(doc) {
    return description = doc.refentry.refsect1[0] || doc.refentry.refsect1;
  }).filter(function(doc) {
    return doc.role === 'description' && doc.methodsynopsis
  }).map(function(doc) {
    var method = {
      name: doc.methodsynopsis.methodname || '',
      type: doc.methodsynopsis.type || 'mixed'
    };

    if (method.name.replaceable) {
      method.name = method.name.replaceable;
    }

    var params = (doc.methodsynopsis.methodparam || []);
    if (!Array.isArray(params)) {
      params = [params];
    }

    method.args = params.map(function(param) {
      var arg = {
        name: param.parameter || '',
        type: param.type
      };

      if (arg.name.role) {
        arg[arg.name.role] = true;
        arg.name = arg.name._ || '';
      }

      if (param.choice === 'opt') {
        arg.optional = true;
      }

      return arg;
    });

    return method;
  }).filter(function(doc) {
    return !!doc.name;
  }).then(function(docs) {
    docs = docs.sort(function(a, b) {
      if (typeof a.name !== 'string') {
        console.log(a);
      }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    return fs.writeFileAsync(path.join(outPath, module + '.json'), JSON.stringify(docs, null, '  '));
  });
});
