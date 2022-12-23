import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import {render} from '../render.js';
import PopupView from '../view/popup-view.js';
import PopupCommentView from '../view/popup-comment-view.js';


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

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filmsList = [...this.#filmsModel.films];

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < this.#filmsList.length; i++) {
      this.#renderFilmCard(this.#filmsList[i]);
    }

    render(new LoadMoreButtonView(), this.#filmsListComponent.element);

    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsListTopRatedContainerComponent, this.#filmsListTopRatedComponent.element);
    render(new FilmCardView(this.#filmsList[0]), this.#filmsListTopRatedContainerComponent.element);

    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsListMostCommentedContainerComponent, this.#filmsListMostCommentedComponent.element);
    render(new FilmCardView(this.#filmsList[0]), this.#filmsListMostCommentedContainerComponent.element);
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);
    let popupComponent;

    this.#popupContainer = document.body;
    this.#commentsList = [...this.#filmsModel.comments];
    this.#compareComments = this.#commentsList.slice().filter((el) => this.#filmsList[0].comments.includes(el.id));

    const popupOpen = () => {
      popupComponent = new PopupView(film);
      this.#popupContainer.appendChild(popupComponent.element);
      this.#commentsContainer = document.querySelector('.film-details__comments-list');
      this.#commentsContainer.innerHTML = ''; // clear list for mocks
      for(let i = 0; i < this.#compareComments.length; i++) {
        render(new PopupCommentView(this.#compareComments[i]), this.#commentsContainer);
      }
    };

    const popupClosed = () => {
      this.#popupContainer.removeChild(popupComponent.element);
    };

    const onEscapeKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        popupClosed();
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      if(document.querySelector('.film-details')) {
        document.querySelector('.film-details').remove();
      }
      popupOpen();
      document.addEventListener('keydown', onEscapeKeyDown);
      this.#popupContainer.classList.add('hide-overflow');

      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
        popupClosed();
        document.removeEventListener('keydown', onEscapeKeyDown);
        this.#popupContainer.classList.remove('hide-overflow');
      });
    });

    render (filmCardComponent, this.#filmsListContainerComponent.element);
  };
}
