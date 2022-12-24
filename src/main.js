import UserProfileView from './view/user-profile-view.js';
import NavigationView from './view/nav-view.js';
import SortView from './view/sort-view.js';
import FooterStatView from './view/footer-stat-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import {render} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);

render(new UserProfileView(), siteHeaderElement);
render(new NavigationView(), siteMainElement);
render(new SortView(), siteMainElement);
render(new FooterStatView(), siteFooterStatElement);

filmsPresenter.init();
