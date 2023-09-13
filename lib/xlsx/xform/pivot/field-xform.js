const BaseXform = require('../base-xform');

class FieldXform extends BaseXform {
  get tag() {
    return 'field';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      x: model.index,
    });
    return true;
  }
}

module.exports = FieldXform;
