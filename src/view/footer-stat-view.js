import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatTemplate = () => '<p>130 291 movies inside</p>';

export default class FooterStatView extends AbstractView {
  get template() {
    return createFooterStatTemplate();
  }
}
