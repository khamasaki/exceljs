const XmlStream = require('../../../utils/xml-stream');

const RelType = require('../../rel-type');

const BaseXform = require('../base-xform');
const ListXform = require('../list-xform');

const CacheFieldXform = require('./cache-field-xform');
const CacheSourceXform = require('./cache-source-xform');

class PivotCacheDefinitionXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      cacheSource: new CacheSourceXform(),
      cacheFields: new ListXform({
        tag: 'cacheFields',
        count: true,
        empty: true,
        childXform: new CacheFieldXform(),
      }),
    };
  }

  prepare(model, options) {
    this.map.cacheFields.prepare(model.cacheFields, options);

    // prepare relationships
    const rels = (model.rels = []);

    function nextRid(r) {
      return `rId${r.length + 1}`;
    }

    // relationships
    const rId = nextRid(rels);
    rels.push({
      Id: rId,
      Type: RelType.PivotCacheRecords,
      Target: `pivotCacheRecords${model.id}.xml`,
    });
    model.recordRId = rId;
  }

  get tag() {
    return 'pivotCacheDefinition';
  }

  render(xmlStream, model) {
    const date = new Date();
    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, {
      ...PivotCacheDefinitionXform.TABLE_ATTRIBUTES,
      'r:id': model.recordRId,
      // eslint-disable-next-line no-mixed-operators
      refreshedDate: 25569.0 + (date.getTime() - date.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24),
      recordCount: model.sourceTable.table.rows.length,
    });

    this.map.cacheSource.render(xmlStream, model);
    this.map.cacheFields.render(xmlStream, model.cacheFields);

    xmlStream.closeNode();
    return true;
  }
}

PivotCacheDefinitionXform.TABLE_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'xr',
  'xmlns:xr': 'http://schemas.microsoft.com/office/spreadsheetml/2014/revision',
  refreshedBy: 'Author',
  createdVersion: '8',
  refreshedVersion: '8',
  minRefreshableVersion: '3',
  refreshOnLoad: '1',
};

module.exports = PivotCacheDefinitionXform;
