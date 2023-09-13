const BaseXform = require('../base-xform');

class PivotTableStyleInfoXform extends BaseXform {
  get tag() {
    return 'pivotTableStyleInfo';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      name: model.theme ? model.theme : undefined,
      showRowHeaders: model.showRowHeaders ? '1' : '0',
      showColHeaders: model.showColHeaders ? '1' : '0',
      showRowStripes: model.showRowStripes ? '1' : '0',
      showColStripes: model.showColStripes ? '1' : '0',
      showLastColumn: model.showLastColumn ? '1' : '0',
    });
    return true;
  }
}

module.exports = PivotTableStyleInfoXform;
