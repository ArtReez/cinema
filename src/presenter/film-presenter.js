/* eslint-disable no-console */
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import { UserAction, UpdateType, Container, Mode, Comment, FilterType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmListTopRatedContainer = null;
  #filmListMostCommentedContainer = null;
  #filmCardComponent = null;
  #prevFilmCardComponent = null;
  #popupContainer = null;
  #filmPopupComponent = null;
  #prevFilmPopupComponent = null;
  #commentsModel = null;
  #commentsList = [];
  #changeData = null;
  #changeMode = null;
  #film = null;
  #scrollPopup = null;
  #filterType = null;
  #filmTopRatedComponent = null;
  #prevFilmTopRatedComponent = null;
  #filmMostCommentedComponent = null;
  #prevMostCommentedComponent = null;

  #mode = Mode.DEFAULT;
  #status = Comment.DEFAULT;
  #filmDetailsContainerComponent = new FilmDetailsView();


  constructor(
    filmListContainer,
    filmListTopRatedContainer,
    filmListMostCommentedContainer,
    commentsModel,
    handleViewAction,
    handleModeChange,
    filterType) {
    this.#filmListContainer = filmListContainer;
    this.#filmListTopRatedContainer = filmListTopRatedContainer;
    this.#filmListMostCommentedContainer = filmListMostCommentedContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = handleViewAction;
    this.#changeMode = handleModeChange;
    this.#filterType = filterType;
  }

  init = (film, container) => {
    this.#film = film;
    this.#popupContainer = document.body;

    this.#prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupView(film, this.#commentsList);
    this.#filmPopupComponent.setClosedPopupHandler(this.#handleClosedPopupClick);
    this.#filmPopupComponent.setAddCommentSubmitHandler(this.#handleAddCommentSubmit);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#handleDeleteCommentClick);
    this.#filmPopupComponent.setScrollPopupHandler(this.#handleScrollPopup);
    this.#filmPopupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmPopupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

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

  getComments = async (filmId) => {
    try {
      this.#commentsList = await this.#commentsModel.getComments(filmId);
    } catch(err) {
      throw new Error('Can\'t get film ID');
    }
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
      this.#closedPopup(); // (NEEDED!!!)

      console.log('resetView(POPUP):', this.#mode);
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.POPUP) {
      this.#filmPopupComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });

      this.#filmPopupComponent.element.scrollTop = this.#scrollPopup;
    }
  };

  setAbording = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#filmCardComponent?.shake();
      this.#filmTopRatedComponent?.shake();
      this.#filmMostCommentedComponent?.shake();
      return;
    }

    const resetFormState = () => {
      this.#filmPopupComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
      });
    };

    this.#filmPopupComponent.shake(resetFormState);
    this.#filmPopupComponent.element.scrollTop = this.#scrollPopup;
  };

  #handleAddCommentSubmit = (comment, film, commentStatus) => {
    this.#status = commentStatus;

    Promise.resolve()
      .then(() =>
        this.#changeData(
          UserAction.ADD_COMMENT,
          UpdateType.COMMENT,
          film,
          comment
        )
      )
      .then(() =>
        this.#changeData(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          film
        )
      );

    console.log('ADD_COMMENT');
  };

  // #handleAddCommentSubmit = async (comment, film, commentStatus) => {
  //   this.#status = commentStatus;

  //   await this.#changeData(
  //     UserAction.ADD_COMMENT,
  //     UpdateType.COMMENT,
  //     film,
  //     comment
  //   );

  //   setTimeout(() => {
  //     this.#changeData(
  //       UserAction.UPDATE_FILM,
  //       UpdateType.PATCH,
  //       film
  //     );
  //   }, 200);

  //   console.log('ADD_COMMENT');
  // };

  #handleDeleteCommentClick = (commentId, film, commentStatus) => {
    this.#status = commentStatus;

    Promise.resolve()
      .then(() =>
        this.#changeData(
          UserAction.DELETE_COMMENT,
          UpdateType.COMMENT,
          film,
          commentId
        )
      )
      .then(() =>
        this.#changeData(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          film
        )
      );

    console.log('DELETE_COMMENT');
  };

  #handleUpdateMostCommented = (film) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MOST_COMMENTED,
      film
    );
  };

  #openPopup = () => {
    // render(this.#filmPopupComponent, this.#popupContainer); // single componenet
    render(this.#filmDetailsContainerComponent, this.#popupContainer);
    render(this.#filmPopupComponent, this.#filmDetailsContainerComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#popupContainer.classList.add('hide-overflow');
    this.#popupContainer.style.marginRight = `${25}px`;
    this.#mode = Mode.POPUP;

    console.log('OPEN_POPUP (MODE):', this.#mode);
  };

  #closedPopup = () => {
    // this.#filmDetailsContainerComponet.element.remove();
    // this.#filmPopupComponent.element.remove();
    remove(this.#filmDetailsContainerComponent);
    remove(this.#filmPopupComponent); // single componenet
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#popupContainer.classList.remove('hide-overflow');
    this.#popupContainer.style.marginRight = null;
    this.#scrollPopup = null;
    this.#mode = Mode.DEFAULT;

    if (this.#status === Comment.EDITED) {
      this.#handleUpdateMostCommented(this.#film);
      this.#status = Comment.DEFAULT;
    }

    console.log('CLOSED_POPUP (MODE):', this.#mode);
    console.log('CLOSED_POPUP (STATUS):', this.#status);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#scrollPopup = null;
      this.#filmPopupComponent.reset(this.#film);
      this.#closedPopup();
    }
  };

  #handleFilmCardClick = async (film) => {
    this.#changeMode(); // reset all filmPresenters opened POPUP (NEEDED!!!)
    await this.getComments(film.id);
    this.init(film);
    this.#openPopup();
  };

  #handleClosedPopupClick = () => {
    this.#filmPopupComponent.reset(this.#film);
    this.#closedPopup();
  };

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.DEFAULT && this.#filterType === FilterType.WATCHLIST
        ? UpdateType.MINOR
        : UpdateType.PATCH,
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
      this.#mode === Mode.DEFAULT && this.#filterType === FilterType.HISTORY
        ? UpdateType.MINOR
        : UpdateType.PATCH,
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
      this.#mode === Mode.DEFAULT && this.#filterType === FilterType.FAVORITES
        ? UpdateType.MINOR
        : UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite,
        }
      }
    );
  };
}
