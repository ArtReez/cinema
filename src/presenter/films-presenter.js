import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsListContainerComponent = new FilmsListContainerView();
  filmsListTopRatedComponent = new FilmsListTopRatedView();
  filmsListTopRatedContainerComponent = new FilmsListContainerView();
  filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  filmsListMostCommentedContainerComponent = new FilmsListContainerView();

  init = (filmsContainer, filmsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.filmsList = [...this.filmsModel.getFilms()];

    render(this.filmsComponent, filmsContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());
    for (let i = 0; i < this.filmsList.length; i++) {
      render(new FilmCardView(this.filmsList[i]), this.filmsListContainerComponent.getElement());
    }
    render(new LoadMoreButtonView(), this.filmsListComponent.getElement());

    render(this.filmsListTopRatedComponent, this.filmsComponent.getElement());
    render(this.filmsListTopRatedContainerComponent, this.filmsListTopRatedComponent.getElement());
    render(new FilmCardView(this.filmsList[0]), this.filmsListTopRatedContainerComponent.getElement());

    render(this.filmsListMostCommentedComponent, this.filmsComponent.getElement());
    render(this.filmsListMostCommentedContainerComponent, this.filmsListMostCommentedComponent.getElement());
    render(new FilmCardView(this.filmsList[0]), this.filmsListMostCommentedContainerComponent.getElement());
  };
}
