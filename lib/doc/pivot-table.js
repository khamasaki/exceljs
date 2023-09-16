class PivotTable {
  constructor(worksheet, pivotTable) {
    this.worksheet = worksheet;
    if (pivotTable) {
      this.pivotTable = pivotTable;
      // check things are ok first
      this.validate();
    }
  }

  validate() {
    const {pivotTable} = this;
    // set defaults and check is valid
    const assign = (o, name, dflt) => {
      if (o[name] === undefined) {
        o[name] = dflt;
      }
    };
    assign(pivotTable, 'dataCaption', 'Values');
    assign(pivotTable, 'rowHeaderCaption', 'Row Labels');
    assign(pivotTable, 'rows', []);
    assign(pivotTable, 'columns', []);
    assign(pivotTable, 'values', []);
    assign(pivotTable, 'style', {});
    assign(pivotTable.style, 'theme', 'PivotStyleLight16');
    assign(pivotTable.style, 'showRowHeaders', true);
    assign(pivotTable.style, 'showColHeaders', true);
    assign(pivotTable.style, 'showRowStripes', false);
    assign(pivotTable.style, 'showColStripes', false);
    assign(pivotTable.style, 'showLastColumn', true);

    const assert = (test, message) => {
      if (!test) {
        throw new Error(message);
      }
    };
    assert(pivotTable.ref, 'Pivot table must have ref');
    assert(pivotTable.sourceTable, 'Pivot table must have source table');
    assert(pivotTable.sourceTable.table, 'Source table must be an instance of Table');

    // check rows, values, columns
    const allFilters = [
      'valueNotEqual',
      'valueEqual',
      'valueGreaterThan',
      'valueGreaterThanOrEqual',
      'valueLessThan',
      'valueLessThanOrEqual',
      'captionNotEqual',
      'captionEqual',
      'captionBeginsWith',
      'captionNotBeginsWith',
      'captionEndsWith',
      'captionNotEndsWith',
      'captionContains',
      'captionNotContains',
    ];
    const allSortDirections = ['ascending', 'descending'];
    const allSubtotals = [
      'sum',
      'count',
      'average',
      'max',
      'min',
      'product',
      'countNums',
      'stdDev',
      'stdDevp',
      'var',
      'varp',
    ];

    const validateFilter = filter => {
      if (filter) {
        assert(filter.type, 'Pivot table filter must have type');
        assert(allFilters.includes(filter.type), `Invalid pivot table filter type: ${filter.type}`);
      }
    };
    const validateSort = sort => {
      if (sort) {
        assert(sort.direction, 'Pivot table sort must have direction');
        assert(allSortDirections.includes(sort.direction), `Invalid pivot table sort direction: ${sort.direction}`);
        if (sort.field) {
          const field = this.pivotTable.values.find(item => item.name === sort.field);
          assert(field, `Invalid pivot table sort field: ${sort.field}`);
        }
      }
    };
    pivotTable.rows.forEach(row => {
      const field = this.pivotTable.pivotCache.cacheFields.find(cf => cf.name === row.name);
      assert(field, `Invalid pivot table row: ${row.name}`);
      validateFilter(row.filter);
      validateSort(row.sort);
    });
    pivotTable.values.forEach(value => {
      const field = this.pivotTable.pivotCache.cacheFields.find(cf => cf.name === value.name);
      assert(field, `Invalid pivot table value: ${value.name}`);
      if (value.subtotal) {
        assert(allSubtotals.includes(value.subtotal), `Invalid pivot table subtotal value: ${value.subtotal}`);
      }
    });
    pivotTable.columns.forEach(col => {
      const field = this.pivotTable.pivotCache.cacheFields.find(cf => cf.name === col.name);
      assert(field, `Invalid pivot table column: ${col.name}`);
      validateFilter(col.filter);
    });
  }

  get model() {
    return {
      ...this.pivotTable,
      pivotCache: this.pivotTable.pivotCache.model,
      rowFields: this.rowFields,
      rowItems: this.rowItems,
      colFields: this.colFields,
      colItems: this.colItems,
      dataFields: this.dataFields,
      pivotFields: this.pivotFields,
      filters: this.filters,
    };
  }

  set model(value) {
    this.pivotTable = value;
  }

  get pivotFields() {
    return this.pivotTable.pivotCache.cacheFields.map((c, index) => {
      let fieldType = null;
      let filter = false;
      let fieldSort = null;
      let hiddenItems = [];
      if (this.pivotTable.rows.some(item => item.name === c.name)) {
        fieldType = 'row';
        const rowField = this.pivotTable.rows.find(item => item.name === c.name);
        filter = !!rowField.filter;
        if (rowField.sort) {
          fieldSort = {
            direction: rowField.sort.direction,
          };
          if (rowField.sort.field) {
            fieldSort.index = this.dataFields.findIndex(item => item.name === rowField.sort.field);
          }
        }
        if (rowField.collapsed) {
          hiddenItems = c.sharedItems;
        } else if (rowField.hiddenItems) {
          // eslint-disable-next-line prefer-destructuring
          hiddenItems = rowField.hiddenItems;
        }
      } else if (this.pivotTable.columns.some(item => item.name === c.name)) {
        fieldType = 'column';
      } else if (this.pivotTable.values.some(item => item.name === c.name)) {
        fieldType = 'value';
      }

      return {
        name: c.name,
        sharedItems: c.sharedItems,
        hiddenItems,
        fieldType,
        filter,
        sort: fieldSort,
      };
    });
  }

  get rowFields() {
    const {table} = this.pivotTable.sourceTable;
    return this.pivotTable.rows.map(row => ({
      name: row.name,
      index: table.columns.findIndex(item => item.name === row.name),
    }));
  }

  get rowItems() {
    const ret = [];
    this.pivotTable.rows.forEach((row, rowIndex) => {
      const cacheField = this.pivotTable.pivotCache.cacheFields.find(cf => cf.name === row.name);
      ret.push(
        ...cacheField.sharedItems.map((item, index) => ({
          rowIndex,
          index,
        }))
      );
    });
    ret.push({default: true});
    return ret;
  }

  get colFields() {
    const {table} = this.pivotTable.sourceTable;
    if (this.pivotTable.columns.length > 0) {
      return this.pivotTable.columns.map(row => ({
        name: row.name,
        index: table.columns.findIndex(item => item.name === row.name),
      }));
    }
    // not sure why but if you have two or more values you need to return a "Values" column
    // with an index of -2
    if (this.pivotTable.values.length > 1) {
      return [
        {
          name: 'Values',
          index: -2,
        },
      ];
    }
    return [];
  }

  get colItems() {
    const ret = [];
    if (this.pivotTable.columns.length > 0) {
      this.pivotTable.columns.forEach(col => {
        const cacheField = this.pivotTable.pivotCache.cacheFields.find(cf => cf.name === col.name);
        ret.push(...cacheField.sharedItems.map((item, index) => ({index})));
      });
    } else {
      for (let i = 0; i < this.pivotTable.values.length; i++) {
        ret.push({
          index: i,
        });
      }
    }
    return ret;
  }

  get dataFields() {
    const {table} = this.pivotTable.sourceTable;
    return this.pivotTable.values.map(value => ({
      name: value.name,
      index: table.columns.findIndex(item => item.name === value.name),
      title: value.title,
      numFmtId: value.numFmtId,
      numFmt: value.numFmt,
      filter: value.filter,
      subtotal: value.subtotal,
    }));
  }

  get filters() {
    const {table} = this.pivotTable.sourceTable;
    return this.pivotTable.rows
      .concat(this.pivotTable.columns)
      .filter(row => row.filter)
      .map(row => ({
        index: table.columns.findIndex(item => item.name === row.name),
        filter: row.filter,
        sourceTable: this.pivotTable.sourceTable.model,
      }));
  }
}

module.exports = PivotTable;
