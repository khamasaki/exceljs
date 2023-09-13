const XmlStream = require('../../../utils/xml-stream');

const BaseXform = require('../base-xform');

const RXform = require('./r-xform');

class PivotCacheRecordsXform extends BaseXform {
  get tag() {
    return 'pivotCacheRecords';
  }

  render(xmlStream, model) {
    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, {
      ...PivotCacheRecordsXform.TABLE_ATTRIBUTES,
      count: model.cacheRecords.length,
    });

    // this.map.cacheRecords.render(xmlStream, model.cacheRecords);
    const rXform = new RXform();
    model.cacheRecords.forEach((rec, index) => {
      rXform.render(xmlStream, rec, index);
    });

    xmlStream.closeNode();
    return true;
  }
}

PivotCacheRecordsXform.TABLE_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'xr',
  'xmlns:xr': 'http://schemas.microsoft.com/office/spreadsheetml/2014/revision',
};

module.exports = PivotCacheRecordsXform;
