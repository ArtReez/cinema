import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTopRatedContainerTemplate = () => '<div class="films-list__container films-list__container--top-rated"></div>';

export default class FilmsListTopRatedContainertView extends AbstractView {
  get template() {
    return createFilmsListTopRatedContainerTemplate();
  }
}
