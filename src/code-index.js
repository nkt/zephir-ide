const Promise = require('bluebird');
const zephir = Promise.promisifyAll(require('zephir'));
const {ClassDefinition, FunctionDefinition} = require('./ast');

class CodeIndex {
  constructor() {
    this.index = new Map();
  }

  update(filename) {
    return this.parse(filename).then((ast : array) => {
      if (ast.type === 'error') {
        console.error(ast);
        return this.index.get(filename) || [];
      }

      const namespace = ast.shift();
      const items = ast.map((item) => {
        switch (item.type) {
          case 'class':
            return new ClassDefinition(namespace, item);
          case 'function':
            return new FunctionDefinition(namespace, item);
          default:
            throw Error(`Unexpected top definition type: ${item.type}`);
        }
      });

      this.index.set(filename, items);

      return items;
    });
  }

  get(filename) {
    return this.index.get(filename);
  }

  parse(filename) {
    return zephir.parseAsync(filename);
  }
}

module.exports = CodeIndex;
