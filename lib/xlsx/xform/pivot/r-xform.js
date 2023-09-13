const BaseXform = require('../base-xform');

class RXform extends BaseXform {
  get tag() {
    return 'r';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);

    model.forEach(item => {
      if (item.type === 'shared') {
        xmlStream.leafNode('x', {v: item.index});
      } else if (item.type === 'number') {
        xmlStream.leafNode('n', {v: item.value});
      } else {
        xmlStream.leafNode('s', {v: item.value});
      }
    });

    xmlStream.closeNode();
    return true;
  }
}

module.exports = RXform;
