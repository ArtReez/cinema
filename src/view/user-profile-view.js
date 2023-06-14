import AbstractView from '../framework/view/abstract-view.js';


const getRating = (count) => {
  if (count === 0 ) {
    return '';
  }

  if (count > 0 && count <= 10 ) {
    return 'novice';
  }

  if (count > 10 && count <= 20 ) {
    return 'fan';
  }

  return 'movie buff';
};

const createUserProfileTemplate = (count) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRating(count)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserProfileView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createUserProfileTemplate(this.#count);
  }
}
