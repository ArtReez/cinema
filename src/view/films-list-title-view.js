import AbstractView from '../framework/view/abstract-view.js';
import { Title } from '../const.js';

const createFilmsListTemplate = (title) => {
  switch (title) {
    case Title.DEFAULT:
      return ('<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>');
    case Title.TOP_RATED:
      return ('<h2 class="films-list__title">Top rated</h2>');
    case Title.MOST_COMMENTED:
      return ('<h2 class="films-list__title">Most commented</h2>');
  }
};

export default class FilmsListTitleView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmsListTemplate(this.#title);
  }
}
