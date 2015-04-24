const TopDefinition = require('./top');

class FunctionDefinition extends TopDefinition {
  constructor(namespace, ast) {
    super(namespace, ast, 'function');
  }

  getName() {
    return this.body.name;
  }

}

module.exports = FunctionDefinition;
