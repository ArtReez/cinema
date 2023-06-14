/* eslint-disable no-console */
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import SortView from '../view/sort-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import FilmPresenter from './film-presenter.js';
import UserProfileView from '../view/user-profile-view.js';
import FooterStatView from '../view/footer-stat-view.js';
import { SortType, UserAction, UpdateType, FilterType, Container, FilmsList, Title } from '../const.js';
import { sortFilmDate, sortFilmRating, sortFilmComments } from '../utils/film.js';
import { render, remove, replace } from '../framework/render.js';
import { filter } from '../filter.js';

const FILM_COUNT_PER_STEP = 5;

export default class Presenter {
  #filmsContainer = null;
  #headerContainer = null;
  #footerContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #noFilmComponent = null;
  #userProfileComponent = null;
  #prevUserProfileComponent = null;
  #prevFooterStatComponent = null;
  #footerStatComponent = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView(FilmsList.DEFAULT);
  #filmsListTitleComponent = new FilmsListTitleView(Title.DEFAULT);
  #filmsListContainerComponent = new FilmsListContainerView();

  #filmsListTopRatedComponent = new FilmsListView(FilmsList.EXTRA);
  #filmsListTopRatedTitleComponent = new FilmsListTitleView(Title.TOP_RATED);
  #filmsListTopRatedContainerComponent = new FilmsListContainerView();

  #filmsListMostCommentedComponent = new FilmsListView(FilmsList.EXTRA);
  #filmsListMostCommentedTitleComponent = new FilmsListTitleView(Title.MOST_COMMENTED);
  #filmsListMostCommentedContainerComponent = new FilmsListContainerView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #filmPresenters = new Map();
  #filmPresentersTopRated = new Map();
  #filmPresentersMostCommented = new Map();

  constructor(headerContainer, filmsContainer, footerContainer, filterModel, filmsModel, commentsModel) {
    this.#headerContainer = headerContainer;
    this.#filmsContainer = filmsContainer;
    this.#footerContainer = footerContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const films = this.#filmsModel.films;
    this.#filterType = this.#filterModel.filter;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderApp();
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log('HANDLE_VIEW_ACTION -> ACTION_TYPE:', actionType, 'UPDATE_TYPE:', updateType, 'PAYLOAD:', update);

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.UPDATE_COMMENT:
        this.#commentsModel.updateComment(updateType);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log('HANDLE_MODEL_EVENT -> UPDATE_TYPE:', updateType, 'PAYLOAD:', data);

    switch (updateType) {
      case UpdateType.COMMENT:
        this.#filmPresenters.forEach((item) => item.setComments(data));
        this.#filmPresentersTopRated.forEach((item) => item.setComments(data));
        this.#filmPresentersMostCommented.forEach((item) => item.setComments(data));
        break;
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id)?.init(data, Container.FILMS);
        this.#filmPresentersTopRated.get(data.id)?.init(data, Container.TOP_RATED);
        this.#filmPresentersMostCommented.get(data.id)?.init(data, Container.MOST_COMMENTED);
        break;
      case UpdateType.MINOR:
        this.#clearApp();
        this.#renderApp();
        break;
      case UpdateType.MAJOR:
        this.#clearApp({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderApp();
        break;
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmsContainer);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearApp({resetRenderedFilmCount: true});
    this.#renderApp();
  };

  #renderFilmCard = (film, container) => {
    const filmPresenter = new FilmPresenter(
      this.#filmsListContainerComponent.element,
      this.#filmsListTopRatedContainerComponent.element,
      this.#filmsListMostCommentedContainerComponent.element,
      this.#commentsModel.comments,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    filmPresenter.init(film, container);

    switch (container) {
      case Container.FILMS:
        return this.#filmPresenters.set(film.id, filmPresenter);
      case Container.TOP_RATED:
        return this.#filmPresentersTopRated.set(film.id, filmPresenter);
      case Container.MOST_COMMENTED:
        return this.#filmPresentersMostCommented.set(film.id, filmPresenter);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.resetView());
  };

  #renderFilms = (films, container) => {
    films.forEach((film) => this.#renderFilmCard(film, container));
  };

  #renderNoFilms = () => {
    render(this.#filmsComponent, this.#filmsContainer);
    this.#noFilmComponent = new NoFilmsListView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsComponent.element);
  };

  #renderUserProfile = () => {
    const countWatchedFilm = this.#filmsModel.films.reduce((acc, item) => item.userDetails.alreadyWatched === true ? acc + 1 : acc, 0);
    this.#prevUserProfileComponent = this.#userProfileComponent;
    this.#userProfileComponent = new UserProfileView(countWatchedFilm);

    if (this.#prevUserProfileComponent === null) {
      render(this.#userProfileComponent, this.#headerContainer);
      return;
    }

    replace(this.#userProfileComponent, this.#prevUserProfileComponent);
    remove(this.#prevUserProfileComponent);
  };

  #renderFilmsList = () => {
    const films = this.films;
    const filmCount = films.length;

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListTitleComponent, this.#filmsListComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)), Container.FILMS);
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  };

  #handleLoadMoreButtonClick = () => {
    const filmCount = this.films.length;
    console.log('FILM_COUNT', filmCount);
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    console.log('RENDERED_FILM_COUNT', this.#renderedFilmCount);
    this.#renderFilms(films, 'FILMS');
    // this.#renderFilms(films, 'TOPRATED');
    this.#renderedFilmCount = newRenderedFilmCount;
    console.log('NEW_RENDERED_FILM_COUNT', this.#renderedFilmCount);

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderTopRated = () => {
    const isTopRated = this.#filmsModel.films.every((item) => item.filmInfo.totalRating !== '0.0');
    const filmsTopRated = this.#filmsModel.films.slice().sort(sortFilmRating).slice(0, 2);
    console.log(filmsTopRated);

    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);

    if (isTopRated) {
      render(this.#filmsListTopRatedTitleComponent, this.#filmsListTopRatedComponent.element);
      render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
      this.#renderFilms(filmsTopRated, Container.TOP_RATED);
    }
  };

  #renderMostCommented = () => {
    const isMostCommented = this.#filmsModel.films.every((item) => item.comments.length !== 0);
    const filmsMostCommented = this.#filmsModel.films.slice().sort(sortFilmComments).slice(0, 2);

    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);

    if (isMostCommented) {
      render(this.#filmsListMostCommentedTitleComponent, this.#filmsListMostCommentedComponent.element);
      render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
      this.#renderFilms(filmsMostCommented, Container.MOST_COMMENTED);
    }
  };

  #renderFooterStat = (filmsCount) => {
    this.#prevFooterStatComponent = this.#footerStatComponent;
    this.#footerStatComponent = new FooterStatView(filmsCount);

    if (this.#prevFooterStatComponent === null) {
      render(this.#footerStatComponent, this.#footerContainer);
    }
  };

  #renderApp = () => {
    const films = this.films;
    const filmCount = films.length;

    this.#renderUserProfile();

    if (filmCount === 0) {
      this.#renderNoFilms();
      this.#renderFooterStat(this.#filmsModel.films.length);
      return;
    }

    this.#renderSort();

    this.#renderFilmsList();

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }

    this.#renderTopRated();

    this.#renderMostCommented();

    this.#renderFooterStat(this.#filmsModel.films.length);
  };

  #clearApp = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    this.#filmPresentersTopRated.forEach((presenter) => presenter.destroy());
    this.#filmPresentersTopRated.clear();
    this.#filmPresentersMostCommented.forEach((presenter) => presenter.destroy());
    this.#filmPresentersMostCommented.clear();

    remove(this.#sortComponent);
    remove(this.#noFilmComponent);
    remove(this.#loadMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}


