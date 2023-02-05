import UserProfileView from './view/user-profile-view.js';
import NavigationView from './view/nav-view.js';
import FooterStatView from './view/footer-stat-view.js';
import AppPresenter from './presenter/app-presenter.js';
import FilmsModel from './model/films-model.js';
import { render } from './framework/render.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filters = generateFilter(filmsModel.films);
const appPresenter = new AppPresenter(siteMainElement, filmsModel);

render(new UserProfileView(), siteHeaderElement);
render(new NavigationView(filters), siteMainElement);
render(new FooterStatView(), siteFooterStatElement);

appPresenter.init();
