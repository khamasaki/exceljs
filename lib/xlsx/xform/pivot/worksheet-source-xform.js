const BaseXform = require('../base-xform');

class WorksheetSourceXform extends BaseXform {
  get tag() {
    return 'worksheetSource';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      ref: model.sourceTable.table.tableRef,
      sheet: model.sourceTable.worksheet.name,
    });
    return true;
  }
}

module.exports = WorksheetSourceXform;
