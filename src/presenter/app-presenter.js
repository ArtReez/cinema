import { render, remove, RenderPosition } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import SortView from '../view/sort-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import FilmPresenter from '../presenter/film-presenter.js';
import { updateItem } from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;

export default class AppPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmsList = [];
  #commentsPopup = null;
  #commentsList = [];

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListTopRatedContainerComponent = new FilmsListContainerView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListMostCommentedContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmsListView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmsList = [...this.#filmsModel.films];
    this.#commentsList = [...this.#filmsModel.comments];
    this.#renderApp();
    // console.log(this.#filmPresenter);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    // console.log(updatedFilm);
    this.#filmsList = updateItem(this.#filmsList, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderFilmCard = (film) => {
    this.#commentsPopup = this.#commentsList.slice().filter((el) => this.#filmsList[0].comments.includes(el.id));
    const filmPresenter = new FilmPresenter(
      this.#filmsListContainerComponent.element,
      this.#commentsPopup,
      this.#handleFilmChange,
      this.#handleModeChange
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (from, to) => {
    this.#filmsList
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.#filmsComponent.element);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#filmsComponent.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #renderFilmList = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
    this.#renderFilms(0, Math.min(this.#filmsList.length, FILM_COUNT_PER_STEP));

    if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderTopRated = () => {
    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
    render(new FilmCardView(this.#filmsList[0]), this.#filmsListTopRatedContainerComponent.element);
  };

  #renderMostCommented = () => {
    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
    render(new FilmCardView(this.#filmsList[1]), this.#filmsListMostCommentedContainerComponent.element);
  };

  #renderApp = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#filmsList.every((film) => film.empty)) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmList();
    this.#renderTopRated();
    this.#renderMostCommented();
  };
}
