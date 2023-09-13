const BaseXform = require('../base-xform');

class IXform extends BaseXform {
  get tag() {
    return 'i';
  }

  render(xmlStream, model) {
    const attrs = {};
    const subAttrs = {};
    if (model.default) {
      attrs.t = 'grand';
    } else {
      subAttrs.v = model.index;
      if (model.rowIndex) {
        subAttrs.r = model.rowIndex;
      }
    }
    xmlStream.openNode(this.tag, attrs);
    xmlStream.leafNode('x', subAttrs);
    xmlStream.closeNode();
    return true;
  }
}

module.exports = IXform;
