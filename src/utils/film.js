/* eslint-disable no-undef */
/* eslint-disable no-var */
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const humanizeFilmDate = (date) => dayjs(date).format('YYYY');

const humanizeFilmDatePopup = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeFilmDateCommentsPopup = (date) => dayjs().to(dayjs(date));

const humanizeFilmTime = (time) => {
  const hours = time >= 60 ? (time / 60).toFixed() : '';
  const minutes = time % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getList = (array) => array.reduce((acc, el) => `${acc}, ${el}`);

const getGenres = (array) => array.map((item) => `<span class="film-details__genre">${item}</span>`);

const randomItem = (array) => array[parseInt(Math.random() * array.length, 10)];

const getWeigthForNullSortItem = (filmA, filmB) => {
  if (filmA === null && filmB === null) {
    return 0;
  }

  if (filmA === null) {
    return 1;
  }

  if (filmB === null) {
    return -1;
  }

  return null;
};

const sortFilmDate = (filmA, filmB) => {
  const weigth = getWeigthForNullSortItem(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weigth ?? dayjs(filmB.filmInfo.release.date).diff(filmA.filmInfo.release.date);
};

const sortFilmRating = (filmA, filmB) => {
  const weigth = getWeigthForNullSortItem(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);
  return weigth ?? (filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
};

const sortFilmComments = (filmA, filmB) => {
  const weigth = getWeigthForNullSortItem(filmA.comments.length, filmB.comments.length);
  return weigth ?? (filmB.comments.length - filmA.comments.length);
};

function randomInteger(min=1, max=100) {
  const number = min + Math.random() * (max + 1 - min);
  return Math.floor(number);
}

export {
  humanizeFilmDate,
  humanizeFilmTime,
  humanizeFilmDatePopup,
  humanizeFilmDateCommentsPopup,
  getList,
  getGenres,
  randomItem,
  sortFilmDate,
  sortFilmRating,
  sortFilmComments,
  randomInteger,
};
