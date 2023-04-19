import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import PopupCommentView from '../view/popup-comment-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #filmCardComponent = null;
  #popupContainer = null;
  #filmPopupComponent = null;
  #commentsContainer = null;
  #commentsListFiltered = null;
  #changeData = null;
  #changeMode = null;
  #film = null;
  #mode = Mode.DEFAULT;

  constructor(filmListContainer, commentsListFiltered, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#commentsListFiltered = commentsListFiltered;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;
    this.#popupContainer = document.body;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#filmCardComponent.setOpenPopupHandler(this.#handleFilmCardClick);
    this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#filmPopupComponent = new PopupView(film);
    this.#filmPopupComponent.setClosedPopupHandler(this.#handleClosedPopupClick);
    this.#filmPopupComponent.setCommentsFilmHandler(this.#commentsFilm);
    this.#filmPopupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmPopupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      this.#commentsFilm();
      // render(this.#filmCardComponent, this.#filmListTopRatedContainer);
      console.log('prevComponent === NULL');
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      console.log('Card Element DEFAULT mode =>:', this.#mode);
      this.#commentsFilm();
      // replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      this.#commentsFilm();
      console.log('Popup Element POPUP mode =>:', this.#mode);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmPopupComponent.reset(this.#film);
      this.#closedPopup();
      console.log('reseted mode:', this.#mode);
    }
  };

  #commentsFilm = () => {
    this.#commentsContainer = this.#filmPopupComponent.element.querySelector('.film-details__comments-list');
    this.#commentsListFiltered.forEach((comment) => render(new PopupCommentView(comment), this.#commentsContainer));
  };

  #openPopup = () => {
    if (this.#mode === Mode.POPUP) {
      return;
    }
    render(this.#filmPopupComponent, this.#popupContainer);
    this.#changeMode();
    this.#mode = Mode.POPUP;
    console.log('openPopup mode:', this.#mode);
  };

  #closedPopup = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#popupContainer.classList.remove('hide-overflow');
    this.#filmPopupComponent.element.remove();
    this.#mode = Mode.DEFAULT;
    console.log('closedPopup mode:', this.#mode);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#filmPopupComponent.reset(this.#film);
      this.#closedPopup();
    }
  };

  #handleFilmCardClick = () => {
    this.#openPopup();
    this.#popupContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleClosedPopupClick = () => {
    this.#changeMode();
  };

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, userDetails: {
      watchlist: !this.#film.userDetails.watchlist,
      alreadyWatched: this.#film.userDetails.alreadyWatched,
      favorite: this.#film.userDetails.favorite,
    }});
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#film, userDetails: {
      watchlist: this.#film.userDetails.watchlist,
      alreadyWatched: !this.#film.userDetails.alreadyWatched,
      favorite: this.#film.userDetails.favorite,
    }});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, userDetails: {
      watchlist: this.#film.userDetails.watchlist,
      alreadyWatched: this.#film.userDetails.alreadyWatched,
      favorite: !this.#film.userDetails.favorite,
    }});
  };
}
