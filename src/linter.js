const path = require('path');
const {Range} = require('atom');
const linterPath = atom.packages.getLoadedPackage('linter').path;
const Linter = require(path.join(linterPath, 'lib/linter'));

class ZephirLinter extends Linter {
  constructor(editor) {
    super(editor);

    const Promise = require('bluebird');
    this.parse = Promise.promisify(require('zephir').parse);
  }

  lintFile(filePath, callback) {
    this.parse(filePath).then((ast) => {
      let errors = [];

      if (ast.type === 'error') {
        errors.push({
          message: ast.message,
          line: ast.line,
          range: new Range([ast.line, ast.char], [ast.line, ast.char]),
          level: 'error',
          linter: 'Zephir'
        });
      }

      callback(errors);
    }).catch((e) => {
      console.error(e);
    });
  }
}

ZephirLinter.syntax = 'source.zep';

module.exports = ZephirLinter;
