export default class ColumnChart {
  chartHeight = 50;
  elementCssClass = ['column-chart'];

  constructor({data = [], label = '', link = '', value = 0, formatHeading} = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.element = document.createElement('div');
    this.element.className = this.renderCssClass();
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
    let linkTag = '';

    if (this.link.length) {
      linkTag = `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }

    return linkTag;
  }

  renderCssClass() {
    if (!this.data.length) {
      this.elementCssClass.push('column-chart_loading');
    }

    return this.elementCssClass.join(' ');
  }

  renderHeaderText() {
    if (typeof this.formatHeading === 'function') {
      return this.formatHeading(this.value);
    } else {
      return this.value;
    }
  }

  renderComponent() {
    this.element.innerHTML = `
      <div class="column-chart__title">
        Total ${this.label}
        ${this.renderLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.renderHeaderText()}</div>
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
  }

  destroy() {

  }
}
