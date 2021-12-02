class Tooltip {
  static activeTooltip;
  static instance;

  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    return this;
  }

  initialize() {
    document.addEventListener('pointerover', (event) => {
      if (event.target.dataset.tooltip !== undefined) {
        this.showTooltip(event);
      }
    });
  }

  showTooltip(event) {
    this.render(event.target.dataset.tooltip);
    Tooltip.activeTooltip = this;

    event.target.addEventListener('pointermove', this.moveTooltip);
    event.target.addEventListener('pointerout', this.hideTooltip);
  }

  hideTooltip(event) {
    event.target.removeEventListener('pointermove', this.moveTooltip);
    event.target.removeEventListener('pointerout', this.hideTooltip);

    if (Tooltip.activeTooltip) {
      Tooltip.activeTooltip.destroy();
    }
  }

  moveTooltip(event) {
    Tooltip.activeTooltip.element.style.top = `${event.clientY + 5}px`;
    Tooltip.activeTooltip.element.style.left = `${event.clientX + 5}px`;
  }

  render(text) {
    const element = document.createElement('div');
    element.innerHTML = `<div class="tooltip">${text}</div>`;

    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
    Tooltip.activeTooltip = null;
    Tooltip.instance = null;
  }
}

export default Tooltip;
