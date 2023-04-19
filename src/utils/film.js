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
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
const capitalizeFirstLetter = (item) => item.charAt(0).toUpperCase() + item.slice(1);

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
  const weigth = getWeigthForNullSortItem(+filmA.filmInfo.totalRating, +filmB.filmInfo.totalRating);
  return weigth ?? dayjs(filmB.filmInfo.totalRating).diff(filmA.filmInfo.totalRating);
};

export {
  humanizeFilmDate,
  humanizeFilmTime,
  humanizeFilmDatePopup,
  humanizeFilmDateCommentsPopup,
  getList,
  getGenres,
  randomItem,
  capitalizeFirstLetter,
  sortFilmDate,
  sortFilmRating,
};
