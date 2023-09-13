const BaseXform = require('../base-xform');

const WorksheetSourceXform = require('./worksheet-source-xform');

class CacheSourceXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      worksheetSource: new WorksheetSourceXform(),
    };
  }

  get tag() {
    return 'cacheSource';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {type: 'worksheet'});

    this.map.worksheetSource.render(xmlStream, model);

    xmlStream.closeNode();
    return true;
  }
}

module.exports = CacheSourceXform;
