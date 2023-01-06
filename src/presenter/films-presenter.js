import {render, remove} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import PopupView from '../view/popup-view.js';
import PopupCommentView from '../view/popup-comment-view.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmsList = [];
  #commentsContainer = null;
  #compareComments = null;
  #commentsList = [];
  #popupContainer = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListTopRatedContainerComponent = new FilmsListContainerView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListMostCommentedContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmsList = [...this.#filmsModel.films];
    this.#renderMain();
  };

  #renderMain = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#filmsList.every((film) => film.empty)) {
      render(new NoFilmsListView(), this.#filmsComponent.element);

    } else {

      render(this.#filmsListComponent, this.#filmsComponent.element);
      render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

      for (let i = 0; i < Math.min(this.#filmsList.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilmCard(this.#filmsList[i]);
      }

      if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
        render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
        this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
      }

      render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
      render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
      render(new FilmCardView(this.#filmsList[0]), this.#filmsListTopRatedContainerComponent.element);

      render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
      render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
      render(new FilmCardView(this.#filmsList[0]), this.#filmsListMostCommentedContainerComponent.element);
    }
  };

  #handleLoadMoreButtonClick = () => {
    this.#filmsList
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);
    let popupComponent;

    this.#popupContainer = document.body;
    this.#commentsList = [...this.#filmsModel.comments];
    this.#compareComments = this.#commentsList.slice().filter((el) => this.#filmsList[0].comments.includes(el.id));

    const openPopup = () => {
      popupComponent = new PopupView(film);
      this.#popupContainer.append(popupComponent.element);
      this.#commentsContainer = popupComponent.element.querySelector('.film-details__comments-list');
      this.#commentsContainer.innerHTML = ''; // clear list for mocks
      for(let i = 0; i < this.#compareComments.length; i++) {
        render(new PopupCommentView(this.#compareComments[i]), this.#commentsContainer);
      }
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#popupContainer.classList.remove('hide-overflow');
        closedPopup();
      }
    };

    function closedPopup() {
      popupComponent.element.remove();
      popupComponent.removeElement();
      document.removeEventListener('keydown', onEscKeyDown);
    }

    filmCardComponent.setOpenPopupHandler(() => {
      if (this.#popupContainer.querySelector('.film-details')) {
        this.#popupContainer.querySelector('.film-details').remove();
      }

      openPopup();
      this.#popupContainer.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);

      popupComponent.setClosedPopupHandler(() => {
        this.#popupContainer.classList.remove('hide-overflow');
        closedPopup();
      });
    });

    render (filmCardComponent, this.#filmsListContainerComponent.element);
  };
}
