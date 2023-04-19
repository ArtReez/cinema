import AbstructStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDatePopup, humanizeFilmTime, getList } from '../utils/film.js';

const createEmojiTemplate = (emotion) => (
  `${emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : ''}`
);

const createCommentInputTemplate = (comment) => (
  `${comment ? `${comment}` : ''}`
);

const createPopupTemplate = (data) => {
  const {
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
  } = data;

  const filmDate = humanizeFilmDatePopup(date);
  const filmTime = humanizeFilmTime(runtime);
  const filmWrites = getList(writers);
  const filmActors = getList(actors);
  const filmGenresName = genre.length > 1 ? 'Generes' : 'Genre';
  const filmGenres = genre.join('');
  const isActiveClassName = (item) => item ? 'film-details__control-button--active' : '';
  const emojiTemplate = createEmojiTemplate(emotion);
  const commentInputTemplate = createCommentInputTemplate(comment);

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
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

          <ul class="film-details__comments-list">

          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${emojiTemplate}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentInputTemplate}</textarea>
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

export default class PopupView extends AbstructStatefulView {
  constructor(film) {
    super();
    this._state = PopupView.setFilmToState(film);
    this.#setInnerHandlers();
    console.log('_state:', this._state);
  }

  get template() {
    return createPopupTemplate(this._state);
  }

  #setInnerHandlers = () => {
    this.element.addEventListener('scroll', this.#popupScrollHandler);
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
    this._callback.commentsFilm();
  };

  setCommentsFilmHandler = (callback) => {
    this._callback.commentsFilm = callback;
  };

  #popupScrollHandler = (evt) => {
    evt.preventDefault();
    this._state.scroll = this.element.scrollTop;
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value
    });
    this.element.scrollTop = this._state.scroll;
  };

  #emojiClickHandler = (evt) => {
    this.updateElement({
      emotion: evt.target.src.split('/').pop().split('.')[0]
    });
    this._callback.commentsFilm();
    this.element.scrollTop = this._state.scroll;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosedPopupHandler(this._callback.closedPopupClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  static setFilmToState = (film) => ({...film,
    comment: null,
    emotion: null,
    scroll: null,
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
    delete film.scroll;

    return film;
  };

  setClosedPopupHandler = (callback) => {
    this._callback.closedPopupClick = callback;
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closedPopupClickHandler);
  };

  #closedPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closedPopupClick();
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


// {/* <li class="film-details__comment">
//               <span class="film-details__comment-emoji">
//                 <img src="./images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
//               </span>
//               <div>
//                 <p class="film-details__comment-text">Interesting setting and a good cast</p>
//                 <p class="film-details__comment-info">
//                   <span class="film-details__comment-author">Tim Macoveev</span>
//                   <span class="film-details__comment-day">2019/12/31 23:59</span>
//                   <button class="film-details__comment-delete">Delete</button>
//                 </p>
//               </div>
//             </li>
//             <li class="film-details__comment">
//               <span class="film-details__comment-emoji">
//                 <img src="./images/emoji/sleeping.png" width="55" height="55" alt="emoji-sleeping">
//               </span>
//               <div>
//                 <p class="film-details__comment-text">Booooooooooring</p>
//                 <p class="film-details__comment-info">
//                   <span class="film-details__comment-author">John Doe</span>
//                   <span class="film-details__comment-day">2 days ago</span>
//                   <button class="film-details__comment-delete">Delete</button>
//                 </p>
//               </div>
//             </li>
//             <li class="film-details__comment">
//               <span class="film-details__comment-emoji">
//                 <img src="./images/emoji/puke.png" width="55" height="55" alt="emoji-puke">
//               </span>
//               <div>
//                 <p class="film-details__comment-text">Very very old. Meh</p>
//                 <p class="film-details__comment-info">
//                   <span class="film-details__comment-author">John Doe</span>
//                   <span class="film-details__comment-day">2 days ago</span>
//                   <button class="film-details__comment-delete">Delete</button>
//                 </p>
//               </div>
//             </li>
//             <li class="film-details__comment">
//               <span class="film-details__comment-emoji">
//                 <img src="./images/emoji/angry.png" width="55" height="55" alt="emoji-angry">
//               </span>
//               <div>
//                 <p class="film-details__comment-text">Almost two hours? Seriously?</p>
//                 <p class="film-details__comment-info">
//                   <span class="film-details__comment-author">John Doe</span>
//                   <span class="film-details__comment-day">Today</span>
//                   <button class="film-details__comment-delete">Delete</button>
//                 </p>
//               </div>
//             </li> */}
