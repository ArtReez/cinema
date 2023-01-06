import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListContainertView extends AbstractView {
  get template() {
    return createFilmsListContainerTemplate();
  }
}
