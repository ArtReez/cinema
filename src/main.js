import Presenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import FilmsApiService from './view/films-api-service.js';

const AUTORIZATION = 'Basic jf72fh8ws73kdf0d';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTORIZATION));
const commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTORIZATION));

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const presenter = new Presenter(siteHeaderElement, siteMainElement, siteFooterStatElement, filterModel, filmsModel, commentsModel);

filterPresenter.init();
presenter.init();
filmsModel.init();
