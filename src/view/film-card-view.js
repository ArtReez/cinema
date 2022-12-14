import AbstractView from '../framework/view/abstract-view.js';
import {humanizeFilmDate, humanizeFilmTime} from '../utils';

const createFilmCardTemplate = (film) => {
  const {filmInfo: {title, totalRating, poster, release: {date}, runtime, genre, description}, comments} = film;
  const releaseDate = humanizeFilmDate(date);
  const time = humanizeFilmTime(runtime);
  const cutDescription = description.slice(0, 139).concat('...');

  return (
    `<article class="film-card">
    <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseDate}</span>
      <span class="film-card__duration">${time}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="./${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${cutDescription}</p>
    <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setOpenPopupHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupClickHandler);
  };

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
