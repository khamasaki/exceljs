const BaseXform = require('../base-xform');

const AutoFilterXform = require('../table/auto-filter-xform');

const operatorLookup = {
  valueNotEqual: 'notEqual',
  valueEqual: 'equal',
  valueGreaterThan: 'greaterThan',
  valueGreaterThanOrEqual: 'greaterThanOrEqual',
  valueLessThan: 'lessThan',
  valueLessThanOrEqual: 'lessThanOrEqual',
  captionNotEqual: 'notEqual',
  captionEqual: 'equal',
  captionBeginsWith: 'equal',
  captionNotBeginsWith: 'notEqual',
  captionEndsWith: 'equal',
  captionNotEndsWith: 'notEqual',
  captionContains: 'equal',
  captionNotContains: 'notEqual',
};

class FilterXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      autoFilter: new AutoFilterXform(),
    };
  }

  prepare(model, options) {
    this.map.autoFilter.prepare(model);
  }

  get tag() {
    return 'filter';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      fld: model.index,
      type: model.filter.type,
      evalOrder: -1,
      id: model.index,
      iMeasureFld: 0,
    });

    this.map.autoFilter.render(xmlStream, {
      autoFilterRef: model.sourceTable.ref,
      columns: [
        {
          colId: 0,
          customFilters: [
            {
              operator: operatorLookup[model.filter.type],
              val: model.filter.value,
            },
          ],
        },
      ],
    });

    xmlStream.closeNode();
    return true;
  }
}

module.exports = FilterXform;
