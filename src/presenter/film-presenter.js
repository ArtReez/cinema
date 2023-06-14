/* eslint-disable no-console */
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import { UserAction, UpdateType, Container, Mode, Comment } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

let commentStatus = Comment.DEFAULT;

export default class FilmPresenter {
  #filmListContainer = null;
  #filmListTopRatedContainer = null;
  #filmListMostCommentedContainer = null;
  #filmCardComponent = null;
  #prevFilmCardComponent = null;
  #popupContainer = null;
  #filmPopupComponent = null;
  #prevFilmPopupComponent = null;
  #commentsList = null;
  #changeData = null;
  #changeMode = null;
  #film = null;
  #scrollPopup = null;
  #filmTopRatedComponent = null;
  #prevFilmTopRatedComponent = null;
  #filmMostCommentedComponent = null;
  #prevMostCommentedComponent = null;

  #mode = Mode.DEFAULT;

  constructor(
    filmListContainer,
    filmListTopRatedContainer,
    filmListMostCommentedContainer,
    commentsModelComments,
    handleViewAction,
    handleModeChange) {
    this.#filmListContainer = filmListContainer;
    this.#filmListTopRatedContainer = filmListTopRatedContainer;
    this.#filmListMostCommentedContainer = filmListMostCommentedContainer;
    this.#commentsList = commentsModelComments;
    this.#changeData = handleViewAction;
    this.#changeMode = handleModeChange;
  }

  init = (film, container) => {
    this.#film = film;
    this.#popupContainer = document.body;

    this.#prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupView(film, this.#commentsList);
    this.#filmPopupComponent.setClosedPopupHandler(this.#handleClosedPopupClick);
    this.#filmPopupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmPopupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setAddCommentSubmitHandler(this.#handleAddCommentSubmit);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#handleDeleteCommentClick);
    this.#filmPopupComponent.setUpdateCommentHandler(this.#handleUpdateComment);
    this.#filmPopupComponent.setScrollPopupHandler(this.#handleScrollPopup);

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmPopupComponent, this.#prevFilmPopupComponent);
      this.#filmPopupComponent.element.scrollTop = this.#scrollPopup;
    }

    remove(this.#prevFilmPopupComponent);

    switch (container) {
      case Container.FILMS:
        this.#prevFilmCardComponent = this.#filmCardComponent;
        this.#filmCardComponent = new FilmCardView(film);
        this.#filmCardComponent.setOpenPopupHandler(this.#handleFilmCardClick);
        this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);
        this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
        this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

        if (this.#prevFilmCardComponent === null || this.#prevFilmPopupComponent === null) {
          render(this.#filmCardComponent, this.#filmListContainer);
          return;
        }

        replace(this.#filmCardComponent, this.#prevFilmCardComponent);
        remove(this.#prevFilmCardComponent);
        break;

      case Container.TOP_RATED:
        this.#prevFilmTopRatedComponent = this.#filmTopRatedComponent;
        this.#filmTopRatedComponent = new FilmCardView(film);
        this.#filmTopRatedComponent.setOpenPopupHandler(this.#handleFilmCardClick);
        this.#filmTopRatedComponent.setWatchListClickHandler(this.#handleWatchListClick);
        this.#filmTopRatedComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
        this.#filmTopRatedComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

        if (this.#prevFilmTopRatedComponent === null || this.#prevFilmPopupComponent === null) {
          render(this.#filmTopRatedComponent, this.#filmListTopRatedContainer);
          return;
        }

        replace(this.#filmTopRatedComponent, this.#prevFilmTopRatedComponent);
        remove(this.#prevFilmTopRatedComponent);
        break;

      case Container.MOST_COMMENTED:
        this.#prevMostCommentedComponent = this.#filmMostCommentedComponent;
        this.#filmMostCommentedComponent = new FilmCardView(film);
        this.#filmMostCommentedComponent.setOpenPopupHandler(this.#handleFilmCardClick);
        this.#filmMostCommentedComponent.setWatchListClickHandler(this.#handleWatchListClick);
        this.#filmMostCommentedComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
        this.#filmMostCommentedComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

        if (this.#prevMostCommentedComponent === null || this.#prevFilmPopupComponent === null) {
          render(this.#filmMostCommentedComponent, this.#filmListMostCommentedContainer);
          return;
        }

        replace(this.#filmMostCommentedComponent, this.#prevMostCommentedComponent);
        remove(this.#prevMostCommentedComponent);
        break;
    }
  };

  setComments = (comments) => {
    this.#commentsList = comments;
  };

  #handleScrollPopup = (scroll) => {
    this.#scrollPopup = scroll;
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmTopRatedComponent);
    remove(this.#filmMostCommentedComponent);
    remove(this.#filmPopupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmPopupComponent.reset(this.#film);

      // if (this.#prevFilmCardComponent !== null || this.#prevFilmPopupComponent !== null) {
      //   this.#changeData(
      //     UserAction.UPDATE_FILM,
      //     UpdateType.MINOR,
      //     {...this.#film});
      // }

      this.#closedPopup(); // (NEEDED!!!)
      console.log('resetView(POPUP):', this.#mode);
    }
  };

  #handleAddCommentSubmit = (comment, film, commentMode) => {
    commentStatus = commentMode;

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.COMMENT,
      comment
    );

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      film
    );

    console.log('ADD_COMMENT');
  };

  #handleDeleteCommentClick = (commentId, film, commentMode) => {
    commentStatus = commentMode;

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.COMMENT,
      commentId
    );

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      film
    );

    console.log('DELETE_COMMENT');
  };

  #handleUpdateComment = () => {
    this.#changeData(
      UserAction.UPDATE_COMMENT,
      UpdateType.MINOR,
    );
  };

  #openPopup = () => {
    render(this.#filmPopupComponent, this.#popupContainer);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#popupContainer.classList.add('hide-overflow');
    this.#mode = Mode.POPUP;

    console.log('OPEN_POPUP:', this.#mode);
  };

  #closedPopup = () => {
    this.#filmPopupComponent.element.remove(this.#film);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#popupContainer.classList.remove('hide-overflow');
    this.#scrollPopup = null;
    this.#mode = Mode.DEFAULT;

    console.log('CLOSED_POPUP:', this.#mode);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#scrollPopup = null;
      this.#filmPopupComponent.reset(this.#film);
      this.#closedPopup();

      if (commentStatus === Comment.EDITED) {
        this.#handleUpdateComment(commentStatus);
        commentStatus = Comment.DEFAULT;
      }
    }
  };

  #handleFilmCardClick = () => {
    this.#changeMode(); // reset all filmPresenters opened POPUP (NEEDED!!!)
    this.#openPopup();
  };

  #handleClosedPopupClick = () => {
    this.#filmPopupComponent.reset(this.#film);
    this.#closedPopup();
    // this.#handleUpdateComment();
  };

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist,
        }
      }
    );
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched,
        }
      }
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite,
        }
      }
    );
  };
}
