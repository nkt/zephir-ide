const fuzzaldrin = require('fuzzaldrin');

class BaseProvider {
  constructor() {
    this.selector = '.source.zep';
    this.disableForSelector = 'source.zep comment.line.double-slash.zep';
  }

  getFunctionSnippet(name, args) {
    const argsSnippet = args.map((arg, i) => {
      return `\${${i + 1}:${arg.name}}`;
    }).join(', ');

    return `${name}(${argsSnippet})$0`;
  }

  filterSuggestions(prefix : string, suggestions : array, limit = 10 : int) {
    return fuzzaldrin.filter(suggestions, prefix, {
      key: '_key',
      maxResults: limit
    });
  }
}

module.exports = BaseProvider;
