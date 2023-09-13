const BaseXform = require('../base-xform');
const ListXform = require('../list-xform');

const ReferenceXform = require('./reference-xform');

class AutoSortScopeXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      references: new ListXform({
        tag: 'references',
        count: true,
        always: true,
        childXform: new ReferenceXform(),
      }),
    };
  }

  render(xmlStream, model) {
    xmlStream.openNode('autoSortScope');
    xmlStream.openNode('pivotArea');

    this.map.references.render(xmlStream, [model]);

    xmlStream.closeNode();
    xmlStream.closeNode();
    return true;
  }
}

module.exports = AutoSortScopeXform;
