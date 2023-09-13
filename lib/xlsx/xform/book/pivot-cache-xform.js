const BaseXform = require('../base-xform');

class PivotCacheXform extends BaseXform {
  get tag() {
    return 'pivotCache';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      cacheId: model.sourceTable.table.id,
      'r:id': model.rId,
    });
    return true;
  }
}

module.exports = PivotCacheXform;
