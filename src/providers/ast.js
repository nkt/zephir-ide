const BaseProvider = require('./base');

class AstProvider extends BaseProvider {
  constructor(codeIndex) {
    super();
    this.index = codeIndex;
  }

  getSuggestions({editor}) {
    this.index.update(editor.buffer.file.path).then((ast) => {
      console.info(ast);
    });
  }
}

module.exports = AstProvider;
