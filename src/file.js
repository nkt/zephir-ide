class File {
  constructor(filename) {
    this.filename = filename;
    this.error = null;
  }

  hasError() {
    return this.error !== null;
  }
}

module.exports = File;
