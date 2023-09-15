class PivotCache {
  constructor(pivotCache) {
    this.pivotCache = pivotCache;
  }

  get model() {
    this.pivotCache.cacheFields = this.cacheFields;
    this.pivotCache.cacheRecords = this.cacheRecords;
    return this.pivotCache;
  }

  set model(value) {
    this.pivotCache = value;
  }

  get cacheFields() {
    const {table} = this.pivotCache.sourceTable;
    return table.columns.map((c, index) => {
      const items = table.rows.map(item => item[index]);
      const containsNumber = items.some(item => typeof item === 'number');
      const containsDate = items.some(item => item instanceof Date);
      const allDates = items.every(item => item instanceof Date);
      const rowField = this.pivotCache.rows.find(item => item.name === c.name);
      let sharedItems = [];
      if (rowField && rowField.sharedItems) {
        // eslint-disable-next-line prefer-destructuring
        sharedItems = rowField.sharedItems;
      } else if (!containsNumber && !containsDate) {
        sharedItems = [...new Set(items)];
      }

      return {
        name: c.name,
        numFmtId: allDates ? 14 : 0,
        sharedItems,
        minValue: containsNumber ? Math.min(...items) : null,
        maxValue: containsNumber ? Math.max(...items) : null,
        minDate: allDates ? new Date(Math.min(...items.map(item => item.getTime()))) : null,
        maxDate: allDates ? new Date(Math.max(...items.map(item => item.getTime()))) : null,
      };
    });
  }

  get cacheRecords() {
    // This algorithm is way too slow and doesn't seem to work anyway.
    // The generated records file looks correct but Excel doesn't
    // seem to recognize it.
    // Leaving in for possible future update

    // const {table} = this.pivotCache.sourceTable;
    // return table.rows.map(row =>
    //   this.cacheFields.map((col, index) => {
    //     const sharedIndex = col.sharedItems.indexOf(row[index]);
    //     if (sharedIndex >= 0) {
    //       return {
    //         type: 'shared',
    //         index: sharedIndex,
    //       };
    //     }
    //     if (typeof row[index] === 'number') {
    //       return {
    //         type: 'number',
    //         value: row[index],
    //       };
    //     }
    //     return {
    //       type: 'string',
    //       value: row[index],
    //     };
    //   })
    // );
    return [];
  }
}

module.exports = PivotCache;
