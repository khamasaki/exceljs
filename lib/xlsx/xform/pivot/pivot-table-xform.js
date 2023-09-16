const XmlStream = require('../../../utils/xml-stream');

const RelType = require('../../rel-type');

const BaseXform = require('../base-xform');
const ListXform = require('../list-xform');

const LocationXform = require('./location-xform');
const PivotFieldXform = require('./pivot-field-xform');
const FieldXform = require('./field-xform');
const IXform = require('./i-xform');
const DataFieldXform = require('./data-field-xform');
const PivotTableStyleInfoXform = require('./pivot-table-style-info-xform');
const FilterXform = require('./filter-xform');

class PivotTableXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      location: new LocationXform(),
      pivotFields: new ListXform({
        tag: 'pivotFields',
        count: true,
        childXform: new PivotFieldXform(),
      }),
      rowFields: new ListXform({
        tag: 'rowFields',
        count: true,
        childXform: new FieldXform(),
      }),
      rowItems: new ListXform({
        tag: 'rowItems',
        count: true,
        childXform: new IXform(),
      }),
      colFields: new ListXform({
        tag: 'colFields',
        count: true,
        childXform: new FieldXform(),
      }),
      colItems: new ListXform({
        tag: 'colItems',
        count: true,
        childXform: new IXform(),
      }),
      dataFields: new ListXform({
        tag: 'dataFields',
        count: true,
        childXform: new DataFieldXform(),
      }),
      pivotTableStyleInfo: new PivotTableStyleInfoXform(),
      filters: new ListXform({
        tag: 'filters',
        count: true,
        childXform: new FilterXform(),
      }),
    };
  }

  get tag() {
    return 'pivotTableDefinition';
  }

  prepare(model, options) {
    this.map.dataFields.prepare(model.dataFields, options);

    // prepare relationships
    const rels = (model.rels = []);

    function nextRid(r) {
      return `rId${r.length + 1}`;
    }

    // relationships
    const rId = nextRid(rels);
    rels.push({
      Id: rId,
      Type: RelType.PivotCacheDefinition,
      Target: `../pivotCache/pivotCacheDefinition${model.pivotCache.id}.xml`,
    });
  }

  render(xmlStream, model) {
    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, {
      ...PivotTableXform.TABLE_ATTRIBUTES,
      name: model.name,
      dataCaption: model.dataCaption,
      rowHeaderCaption: model.rowHeaderCaption,
      cacheId: model.sourceTable.table.id,
    });

    this.map.location.render(xmlStream, model);
    this.map.pivotFields.render(xmlStream, model.pivotFields);
    this.map.rowFields.render(xmlStream, model.rowFields);
    this.map.rowItems.render(xmlStream, model.rowItems);
    this.map.colFields.render(xmlStream, model.colFields);
    this.map.colItems.render(xmlStream, model.colItems);
    this.map.dataFields.render(xmlStream, model.dataFields);
    this.map.pivotTableStyleInfo.render(xmlStream, model.style);
    this.map.filters.render(xmlStream, model.filters);

    xmlStream.closeNode();
    return true;
  }
}

PivotTableXform.TABLE_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'xr',
  'xmlns:xr': 'http://schemas.microsoft.com/office/spreadsheetml/2014/revision',
  applyNumberFormats: 0,
  applyBorderFormats: 0,
  applyFontFormats: 0,
  applyPatternFormats: 0,
  applyAlignmentFormats: 0,
  applyWidthHeightFormats: 1,
  updatedVersion: 8,
  minRefreshableVersion: 3,
  useAutoFormatting: 1,
  itemPrintTitles: 1,
  createdVersion: 8,
  indent: 0,
  outline: 1,
  outlineData: 1,
  multipleFieldFilters: 0,
};

module.exports = PivotTableXform;
