const BaseXform = require('../base-xform');

class SharedItemXform extends BaseXform {
  render(xmlStream, model) {
    xmlStream.leafNode(typeof model === 'number' ? 'n' : 's', {
      v: model,
    });
    return true;
  }
}

module.exports = SharedItemXform;
