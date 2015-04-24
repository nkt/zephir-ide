const {StubFunctionProvider, AstProvider} = require('./providers');
const CodeIndex = require('./code-index');

class Plugin {
  constructor(options) {
    this.options = options;
    this.completionProviders = [];
    this.codeIndex = new CodeIndex();
  }

  activate() {
    this.addCompletionProvider(new AstProvider(this.codeIndex));
    this.addCompletionProvider(new StubFunctionProvider(this.options.stubs.functions));
  }

  deactivate() {
  }

  addCompletionProvider(provider) {
    this.completionProviders.push(provider);
  }

  getCompletionProvider() {
    return this.completionProviders;
  }
}

export default Plugin;
