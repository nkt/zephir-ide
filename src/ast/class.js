const TopDefinition = require('./top');

class ClassDefinition extends TopDefinition {
  constructor(namespace, ast) {
    super(namespace, ast, 'class');
  }

  getName() {
    return this.body.name;
  }

  isAbstract() {
    return !!this.body['abstract'];
  }

  isFinal() {
    return !!this.body['final'];
  }
}

module.exports = ClassDefinition;
