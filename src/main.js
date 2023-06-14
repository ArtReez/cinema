import Presenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const presenter = new Presenter(siteHeaderElement, siteMainElement, siteFooterStatElement, filterModel, filmsModel, commentsModel);

filterPresenter.init();
presenter.init();
