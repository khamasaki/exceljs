const BaseXform = require('../base-xform');

// data field is equal to -2 as an unsigned int
const DATA_FIELD = 4294967294;

class ReferenceXform extends BaseXform {
  get tag() {
    return 'reference';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      field: DATA_FIELD,
    });

    xmlStream.leafNode('x', {v: model.index});

    xmlStream.closeNode();
    return true;
  }
}

module.exports = ReferenceXform;
