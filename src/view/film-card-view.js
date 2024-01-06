import AbstractView from '../framework/view/abstract-view.js';
import {humanizeFilmDate, humanizeFilmTime, getPoster} from '../utils/film';

const createFilmCardTemplate = (film) => {
  const {
    comments,
    filmInfo: {
      title,
      totalRating,
      poster,
      release: {date},
      runtime,
      genre,
      description
    },
    userDetails : {
      watchlist,
      alreadyWatched,
      favorite,
    },
  } = film;

  const releaseDate = humanizeFilmDate(date);
  const filmDuration = humanizeFilmTime(runtime);
  const filmPoster = getPoster(poster);
  const filmRating = totalRating.toFixed(1);
  const cutDescription = description.slice(0, 139).concat('...');
  const filmComments = comments.length;
  const isActiveClassName = (item) => item ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
    <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${filmRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseDate}</span>
      <span class="film-card__duration">${filmDuration}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="./${filmPoster}" alt="" class="film-card__poster">
    <p class="film-card__description">${cutDescription}</p>
    <span class="film-card__comments">${filmComments} comments</span>
    </a>
    <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isActiveClassName(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isActiveClassName(alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${isActiveClassName(favorite)}" type="button">Mark as favorite</button>
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
    this._callback.openPopupClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupClickHandler);
  };

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopupClick(this.#film);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
