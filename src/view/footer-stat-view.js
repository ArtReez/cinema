import {createElement} from '../render.js';

const createFooterStatTemplate = () => '<p>130 291 movies inside</p>';

export default class FooterStatView {
  #element = null;

  get template() {
    return createFooterStatTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
