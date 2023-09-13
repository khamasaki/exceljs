const BaseXform = require('../base-xform');
const ListXform = require('../list-xform');

const ItemXform = require('./item-xform');
const AutoSortScopeXform = require('./auto-sort-scope-xform');

class PivotFieldXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      items: new ListXform({
        tag: 'items',
        count: true,
        always: true,
        childXform: new ItemXform(),
      }),
      autoSortScope: new AutoSortScopeXform(),
    };
  }

  get tag() {
    return 'pivotField';
  }

  render(xmlStream, model) {
    const attrs = {
      showAll: 0,
    };
    if (model.fieldType === 'row' || model.fieldType === 'column') {
      attrs.axis = model.fieldType === 'row' ? 'axisRow' : 'axisCol';
      if (model.filter) {
        attrs.measureFilter = 1;
      }
      if (model.sort) {
        attrs.sortType = model.sort.direction;
      }
      xmlStream.openNode(this.tag, attrs);
      this.map.items.render(
        xmlStream,
        model.sharedItems.concat(['']).map((item, index) => ({
          value: item,
          index,
          default: index === model.sharedItems.length,
          hidden: model.hiddenItems.includes(item),
        }))
      );
      if (model.sort && model.sort.index >= 0) {
        this.map.autoSortScope.render(xmlStream, model.sort);
      }
      xmlStream.closeNode();
    } else if (model.fieldType === 'value') {
      attrs.dataField = 1;
      xmlStream.leafNode(this.tag, attrs);
    } else {
      xmlStream.leafNode(this.tag, attrs);
    }
    return true;
  }
}

module.exports = PivotFieldXform;
