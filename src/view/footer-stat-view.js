import {createElement} from '../render.js';

const createFooterStatTemplate = () => '<p>130 291 movies inside</p>';

export default class FooterStatView {
  getTemplate() {
    return createFooterStatTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
