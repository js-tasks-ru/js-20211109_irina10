export default class ColumnChart {
  chartHeight = 50;

  constructor({data = [], label = '', link = '', value = 0, formatHeading = (value) => value} = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.element = document.createElement('div');
    this.element.className = 'column-chart';
    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }
    this.element.style = `--chart-height: ${this.chartHeight}`;

    this.renderComponent();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  renderCol() {
    let html = '';
    const columnProps = this.getColumnProps(this.data);

    for (const prop of columnProps) {
      html += `<div style="--value: ${prop.value}" data-tooltip="${prop.percent}"></div>`;
    }

    return html;
  }

  renderLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  renderComponent() {
    this.element.innerHTML = `
      <div class="column-chart__title">
        Total ${this.label}
        ${this.renderLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.renderCol()}
        </div>
      </div>`;
  }

  remove() {
    this.element.remove();
  }

  update(data) {
    this.data = data;

    this.element.querySelector('.column-chart__chart').innerHTML = this.renderCol();
  }

  destroy() {
    this.remove();
    delete this;
  }
}
