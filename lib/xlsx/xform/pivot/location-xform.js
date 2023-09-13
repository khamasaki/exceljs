const colCache = require('../../../utils/col-cache');

const BaseXform = require('../base-xform');

class LocationXform extends BaseXform {
  get tag() {
    return 'location';
  }

  render(xmlStream, model) {
    const start = colCache.decodeAddress(model.ref);
    const ref = colCache.encode(
      start.row,
      start.col,
      start.row + model.rowItems.length,
      start.col + model.values.length + model.columns.length
    );

    xmlStream.leafNode(this.tag, {
      ref,
      firstHeaderRow: 1,
      firstDataRow: 1,
      firstDataCol: 1,
    });
    return true;
  }
}

module.exports = LocationXform;
