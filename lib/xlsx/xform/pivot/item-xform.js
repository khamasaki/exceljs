const BaseXform = require('../base-xform');

class ItemXform extends BaseXform {
  get tag() {
    return 'item';
  }

  render(xmlStream, model) {
    const attrs = {};
    if (model.default) {
      attrs.t = 'default';
    } else {
      attrs.x = model.index;
    }
    if (model.hidden) {
      attrs.sd = 0;
    }
    xmlStream.leafNode(this.tag, attrs);
    return true;
  }
}

module.exports = ItemXform;
