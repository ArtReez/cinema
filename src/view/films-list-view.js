import AbstractView from '../framework/view/abstract-view.js';
import { FilmsList } from '../const.js';

const createFilmsListTemplate = (section) => {
  switch (section) {
    case FilmsList.DEFAULT:
      return ('<section class="films-list"></section>');
    case FilmsList.EXTRA:
      return ('<section class="films-list films-list--extra"></section>');
  }
};

export default class FilmsListView extends AbstractView {
  #section = null;

  constructor(section) {
    super();
    this.#section = section;
  }

  get template() {
    return createFilmsListTemplate(this.#section);
  }
}
