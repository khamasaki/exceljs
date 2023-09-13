const BaseXform = require('../base-xform');

class DataFieldXform extends BaseXform {
  get tag() {
    return 'dataField';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      name: model.title,
      fld: model.index,
      baseField: 0,
      baseItem: 0,
      numFmtId: model.numFmtId || undefined,
      subtotal: model.subtotal || 'sum',
    });
    return true;
  }
}

module.exports = DataFieldXform;
