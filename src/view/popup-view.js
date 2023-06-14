/* eslint-disable no-console */
import AbstructStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDatePopup, humanizeFilmDateCommentsPopup, humanizeFilmTime, getList } from '../utils/film.js';
import { nanoid } from 'nanoid';
import { Comment } from '../const.js';
import he from 'he';

const createEmojiTemplate = (emotion) => (
  `${emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : ''}`
);

const createPopupCommentTemplate = (userComment) => {
  const {id, author, comment, date, emotion} = userComment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeFilmDateCommentsPopup(date)}</span>
          <button class="film-details__comment-delete" data-id="${id}">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentInputTemplate = (comment) => (comment ? `${comment}` : '');

const createPopupTemplate = (state, commentsList) => {
  const {
    comments,
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: { date, releaseCountry },
      runtime,
      genre,
      description,
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    },
    comment,
    emotion,
  } = state;

  const filmDate = humanizeFilmDatePopup(date);
  const filmTime = humanizeFilmTime(runtime);
  const filmWrites = getList(writers);
  const filmActors = getList(actors);
  const filmGenresName = genre.length > 1 ? 'Generes' : 'Genre';
  const filmGenres = genre.join('');
  const isActiveClassName = (item) => item ? 'film-details__control-button--active' : '';
  const emojiTemplate = createEmojiTemplate(emotion);
  const commentInputTemplate = createCommentInputTemplate(comment);

  const commentsFilmFiltered = commentsList.filter((item) => comments.includes(item.id));
  const commentsFilm = commentsFilmFiltered.map((userComment) => createPopupCommentTemplate(userComment)).join('');

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmWrites}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${filmDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${filmGenresName}</td>
                <td class="film-details__cell">${filmGenres}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isActiveClassName(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${isActiveClassName(alreadyWatched)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${isActiveClassName(favorite)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsFilmFiltered.length}</span></h3>

          <ul class="film-details__comments-list">${commentsFilm}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${emojiTemplate}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(commentInputTemplate)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

let commentStatus = Comment.DEFAULT;

export default class PopupView extends AbstructStatefulView {
  #scroll = null;
  #commentsList = null;

  constructor(film, comments) {
    super();
    this._state = PopupView.setFilmToState(film);
    this.#commentsList = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state, this.#commentsList);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);

    this.element.querySelectorAll('.film-details__emoji-label')
      .forEach((item) => item.addEventListener('click', this.#emojiClickHandler));

    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((item) => {
        if (item.value === this._state.emotion) {
          item.checked = true;
        }
      });
  };

  reset = (film) => {
    this.updateElement(
      PopupView.setFilmToState(film)
    );

    console.log('RESET_POPUP (FILM -> STATE)');
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value
    });
  };

  #emojiClickHandler = (evt) => {
    this.updateElement({
      emotion: evt.target.src.split('/').pop().split('.')[0]
    });

    this.element.scrollTop = this.#scroll;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosedPopupHandler(this._callback.closedPopupClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setAddCommentSubmitHandler(this._callback.formSubmit);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setScrollPopupHandler(this._callback.scrollPopup);
  };

  static setFilmToState = (film) => ({...film,
    comment: null,
    emotion: null,
  });

  static setStateToFilm = (state) => {
    const film = {...state};

    // if(!film.isComment) {
    //   film.comment = null;
    // }

    // if(!film.isEmotion) {
    //   film.emotion = null;
    // }

    delete film.comment;
    delete film.emotion;

    return film;
  };

  setAddCommentSubmitHandler = (callback) => {
    this._callback.addCommentSubmit = callback;
    this.element.querySelector('form').addEventListener('keydown', this.#addCommentSubmitHandler);
  };

  #addCommentSubmitHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();

      commentStatus = Comment.EDITED;
      const comment = {
        'id': nanoid(),
        'author': 'James Carter',
        'comment': this._state.comment ?? 'Some new comment',
        'date': new Date(),
        'emotion': this._state.emotion ?? 'angry'
      };

      this.element.scrollTop = this.#scroll;
      this._state.comments = [...this._state.comments, comment.id];
      const film = PopupView.setStateToFilm(this._state);
      this._callback.addCommentSubmit(comment, film, commentStatus);

      console.log(commentStatus );
      console.log('ADD_COMMENT_SUBMIT_HANDLER -> FILM', film);
    }
  };

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((item) => item.addEventListener('click', this.#deleteCommentClickHandler));
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();

    commentStatus = Comment.EDITED;
    this._state.comments = this._state.comments.filter((item) => item !== evt.target.dataset.id);
    const film = PopupView.setStateToFilm(this._state);
    this._callback.deleteCommentClick(evt.target.dataset.id, film, commentStatus);

    console.log(commentStatus);

    // console.log('STATE_BEFORE_SAVE:', this._state);
    // console.log('SCROLL_BEFORE_SAVE:', this.#scroll);
  };

  setUpdateCommentHandler = (callback) => {
    this._callback.updateComment = callback;
  };

  setScrollPopupHandler = (callback) => {
    this._callback.scrollPopup = callback;
    this.element.addEventListener('scroll', this.#popupScrollHandler);
  };

  #popupScrollHandler = (evt) => {
    evt.preventDefault();
    this.#scroll = this.element.scrollTop;
    this._callback.scrollPopup(this.#scroll);
    // console.log('SCROLL:', this.#scroll);
  };

  setClosedPopupHandler = (callback) => {
    this._callback.closedPopupClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closedPopupClickHandler);
  };

  #closedPopupClickHandler = (evt) => {
    evt.preventDefault();
    this.#scroll = null;
    this._callback.closedPopupClick();

    if (commentStatus === Comment.EDITED) {
      this._callback.updateComment();
      commentStatus = Comment.DEFAULT;
    }
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
