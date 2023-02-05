import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeFirstLetter } from '../utils/utils.js';

const createNavigationItemTemplate = (filter) => {
  const {name, count} = filter;
  let filterCount = `<span class="main-navigation__item-count">${count}</span>`;
  let moviesWord = '';

  if (name === 'all') {
    filterCount = '';
    moviesWord = 'movies';
  }

  return (
    `<a href="#${name}" class="main-navigation__item">
    ${capitalizeFirstLetter(name)}
    ${moviesWord}
    ${filterCount}
    </a>`
  );
};

const createNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createNavigationItemTemplate(filter, index === 0))
    .join('');

  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
