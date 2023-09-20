const BaseXform = require('../base-xform');

class DataFieldXform extends BaseXform {
  get tag() {
    return 'dataField';
  }

  prepare(model, options) {
    const styleId = options.styles.addStyleModel(model);
    if (styleId) {
      // this is a hack to find the numFmtId from the style's xml
      // since addStyleModel does not return any style information
      const xmlStr = options.styles.model.styles[styleId];
      model.numFmtId = xmlStr.match(/numFmtId="([0-9]*)"/)[1];
    }
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      name: model.title,
      fld: model.index,
      baseField: model.baseField || 0,
      baseItem: 0,
      numFmtId: model.numFmtId || undefined,
      subtotal: model.subtotal || 'sum',
      showDataAs: model.showDataAs || undefined,
    });
    return true;
  }
}

module.exports = DataFieldXform;
