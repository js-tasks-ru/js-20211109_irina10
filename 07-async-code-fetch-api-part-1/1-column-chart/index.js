import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  data = [];
  chartHeight = 50;
  subElements = {};
  loadingCssClass = 'column-chart_loading';

  constructor({
    url = '',
    label = '',
    link = '',
    value = 0,
    range = {
      from: new Date(),
      to: new Date()
    },
    formatHeading = (value) => value
  } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.label = label;
    this.link = link;
    this.value = value;
    this.range = range;
    this.formatHeading = formatHeading;

    this.render();
    this.update(this.range.from, this.range.to);
  }

  get template() {
    return `
      <div class="column-chart ${this.loadingCssClass}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.renderLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.renderHeader()}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.renderCol()}
          </div>
        </div>
      </div>
    `;
  }

  renderHeader(data = this.data) {
    const values = Object.values(data);
    const total = values.length ? values.reduce((a, b) => a + b) : 0;

    return this.formatHeading(total);
  }

  renderCol(data = this.data) {
    const values = Object.values(data);
    const maxValue = Math.max(...values);
    const scale = this.chartHeight / maxValue;

    const result = values.map(item => {
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const value = String(Math.floor(item * scale));

      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    });

    return result.join('');
  }

  renderLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
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

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  async loadData(from, to) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    const data = await fetchJson(this.url);

    return data;
  }

  async update(from, to) {
    this.element.classList.add(this.loadingCssClass);

    const data = await this.loadData(from, to);


    if (data && Object.values(data).length) {
      this.subElements.header.innerHTML = this.renderHeader(data);
      this.subElements.body.innerHTML = this.renderCol(data);

      this.element.classList.remove(this.loadingCssClass);
    }

    this.data = data;
    return this.data;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}

