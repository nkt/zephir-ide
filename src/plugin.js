const {StubFunctionProvider} = require('./providers');

class Plugin {
  constructor(options) {
    this.options = options;
    this.completionProviders = [];
  }

  activate() {
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
