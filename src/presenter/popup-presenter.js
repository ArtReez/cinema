/* eslint-disable no-console */
import PopupView from '../view/popup-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import { render } from '../render.js';

export default class PopupPresenter {

  initPopup = (popupContainer, filmsModel) => {
    this.popupContainer = popupContainer;
    this.filmsModel = filmsModel;
    this.filmsList = [...this.filmsModel.getFilms()];
    this.commentsList = [...this.filmsModel.getComments()];
    console.log(this.commentsList);

    this.compareComments = this.commentsList.slice().filter((el) => this.filmsList[0].comments.includes(el.id));
    console.log(this.compareComments);

    render(new PopupView(this.filmsList[0]), this.popupContainer);
    this.commentsContainer = document.querySelector('.film-details__comments-list');
    this.commentsContainer.innerHTML = ''; // clear list for mock
    for(let i = 0; i < this.compareComments.length; i++) {
      render(new PopupCommentView(this.compareComments[i]), this.commentsContainer);
    }
  };
}
