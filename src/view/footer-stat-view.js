import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatTemplate = (count) => `<p>${count} movies inside</p>`;

export default class FooterStatView extends AbstractView {
  #conut = null;

  constructor(count) {
    super();
    this.#conut = count;
  }

  get template() {
    return createFooterStatTemplate(this.#conut);
  }
}
