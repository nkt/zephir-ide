class BaseDefinition {
  constructor(ast, type) {
    console.assert(ast.type === type);
    this.ast = ast;
  }

  getLine() {
    return this.ast.line;
  }

  getChar() {
    return this.ast['char'];
  }

  getFile() {
    return this.ast.file;
  }
}

module.exports = BaseDefinition;
