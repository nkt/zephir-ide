const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const BaseProvider = require('./base-provider');

class StubFunctionProvider extends BaseProvider {
  constructor(dirName : string) {
    super();
    this.suggestions = [];
    this.load(dirName);
  }

  getSuggestions({prefix}) {
    return this.filterSuggestions(prefix, this.suggestions);
  }

  load(dirName : string) {
    fs.readdirAsync(dirName).filter((file) => {
      return /\.json$/.test(file);
    }).map((file) => {
      return fs.readFileAsync(path.join(dirName, file));
    }).map((fileContent) => {
      return JSON.parse(fileContent);
    }).each((stub) => {
      stub.forEach((item) => this.addSuggestion(item));
    });
  }

  addSuggestion(stub) {
    const displayArgs = stub.args.map((arg) => {
      if (arg.optional) {
        return `[<i>${arg.type}</i> ${arg.name}]`;
      }

      return `<i>${arg.type}</i> ${arg.name}`;
    }).join(', ');

    this.suggestions.push({
      _key: stub.name,
      displayText: `${stub.name}(${displayArgs})`,
      snippet: this.getFunctionSnippet(stub.name, stub.args),
      type: 'function',
      leftLabel: stub.type,
      description: stub.description,
      descriptionMoreURL: stub.url
    });
  }
}

module.exports = StubFunctionProvider;
