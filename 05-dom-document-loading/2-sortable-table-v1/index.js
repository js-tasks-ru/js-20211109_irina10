export default class SortableTable {
  element;
  subElements;
  arrowElement;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data ;

    this.render();
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        ${this.getTable()}
      </div>
    `;
  }

  sort(field, order) {
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order];
    const sortFieldConfig = this.headerConfig.find(item => item.id === field);
    const sortType = sortFieldConfig ? sortFieldConfig.sortType : 'number';

    const arrowInCell = this.subElements.header.querySelector(`[data-element="arrow"]`);
    if (arrowInCell) {
      arrowInCell.remove();
    }

    const headerCell = this.subElements.header.querySelector(`[data-id=${field}]`);
    headerCell.append(this.arrowElement);
    headerCell.setAttribute('data-order', order);

    const sortedData = [...this.data].sort(function (a, b) {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'});
      }
    });

    this.subElements.body.innerHTML = this.getRowsHtml(sortedData);
  }

  getTableHead() {
    const headerCells = this.headerConfig.map(cell => {
      return `
        <div class="sortable-table__cell" data-id="${cell.id}" data-sortable="${cell.sortable}">
          <span>${cell.title}</span>
        </div>
      `;
    });

    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${headerCells.join('')}
      </div>
    `;
  }

  getTableRow(item) {
    const itemCells = this.headerConfig.map(cell => {
      return cell.template ? cell.template(item[cell.id]) : `
        <div class="sortable-table__cell">${item[cell.id]}</div>
      `;
    });

    return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${itemCells.join('')}
      </a>
    `;
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getRowsHtml()}
      </div>
    `;
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHead()}
        ${this.getTableBody()}
      </div>
    `;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getRowsHtml(data = this.data) {
    const rows = data.map(item => {
      return this.getTableRow(item);
    });
    return rows.join('');
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    const arrowContainer = document.createElement('div');
    arrowContainer.innerHTML = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
    this.arrowElement = arrowContainer.firstElementChild;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
  }
}

