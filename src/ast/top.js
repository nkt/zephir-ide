const BaseDefinition = require('./base');

class TopDefinition extends BaseDefinition {
  constructor(namespace, ast, type) {
    super(ast, type);
    this.namespace = namespace;
  }

  getName() {
    return this.ast.name;
  }
}

module.exports = TopDefinition;
