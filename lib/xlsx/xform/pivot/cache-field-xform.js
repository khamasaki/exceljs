const dayjs = require('dayjs');
const BaseXform = require('../base-xform');
const ListXform = require('../list-xform');

const SharedItemXform = require('./shared-item-xform');

class CacheFieldXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      sharedItems: new ListXform({
        tag: 'sharedItems',
        count: true,
        always: true,
        childXform: new SharedItemXform(),
      }),
    };
  }

  prepare(model, options) {
    this.map.sharedItems.prepare(model.sharedItems, options);
  }

  get tag() {
    return 'cacheField';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      name: model.name,
      numFmtId: model.numFmtId,
    });

    this.map.sharedItems.$ = {};
    if (model.minValue && model.maxValue) {
      this.map.sharedItems.$.minValue = model.minValue;
      this.map.sharedItems.$.maxValue = model.maxValue;
      this.map.sharedItems.$.containsNumber = 1;
    }
    if (model.minDate && model.maxDate) {
      this.map.sharedItems.$.minDate = dayjs(model.minDate).format('YYYY-MM-DDTHH:mm:ss');
      this.map.sharedItems.$.maxDate = dayjs(model.maxDate).format('YYYY-MM-DDTHH:mm:ss');
      this.map.sharedItems.$.containsDate = 1;
    }
    this.map.sharedItems.render(xmlStream, model.sharedItems);

    xmlStream.closeNode();
    return true;
  }
}

module.exports = CacheFieldXform;
