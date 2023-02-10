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
  // #filmListTopRatedContainer = null;
  #filmCardComponent = null;
  #popupContainer = null;
  #filmPopupComponent = null;
  #commentsContainer = null;
  #commentsPopup = null;
  #changeData = null;
  #changeMode = null;
  #film = null;
  #mode = Mode.DEFAULT;

  constructor(filmListContainer, commentsPopup, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    // this.#filmListTopRatedContainer = filmListTopRatedContainer;
    this.#commentsPopup = commentsPopup;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;
    this.#popupContainer = document.body;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#filmPopupComponent = new PopupView(film);

    this.#filmCardComponent.setOpenPopupHandler(this.#handleFilmCardClick);
    this.#filmPopupComponent.setClosedPopupHandler(this.#handlePopupClick);

    this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmPopupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      // render(this.#filmCardComponent, this.#filmListTopRatedContainer);
      console.log('prevComponent - NULL');
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      console.log('Card Element mode:', this.#mode);
      replace(this.#filmCardComponent, prevFilmCardComponent);
      // replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      replace(this.#filmCardComponent, prevFilmCardComponent);
      this.#commentsFilm();
      console.log('Popup Element mode:', this.#mode);
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
      console.log('reseted mode:', this.#mode);
      this.#closedPopup();
    }
  };

  #commentsFilm = () => {
    this.#commentsContainer = this.#filmPopupComponent.element.querySelector('.film-details__comments-list');
    this.#commentsContainer.innerHTML = '';
    this.#commentsPopup.forEach((comment) => render(new PopupCommentView(comment), this.#commentsContainer));
  };

  #openPopup = () => {
    if (this.#mode === Mode.POPUP) {
      return;
    }
    this.#popupContainer.append(this.#filmPopupComponent.element);
    this.#commentsFilm();
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
      this.#closedPopup();
    }
  };

  #handleFilmCardClick = () => {
    this.#openPopup();
    this.#popupContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handlePopupClick = () => {
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
