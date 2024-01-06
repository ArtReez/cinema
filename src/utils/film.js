/* eslint-disable no-undef */
/* eslint-disable no-var */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const humanizeFilmDate = (date) => dayjs(date).format('YYYY');

const humanizeFilmDatePopup = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeFilmDateCommentsPopup = (date) => dayjs().to(dayjs(date));

const humanizeFilmTime = (time) => dayjs.duration(time, 'minutes').format('H[h] mm[m]');

const getPoster = (url) => `${url.substring(0, url.lastIndexOf('.'))}.jpg`;

const getList = (array) => array.reduce((acc, el) => `${acc}, ${el}`);

const getGenres = (array) => array.map((item) => `<span class="film-details__genre">${item}</span>`);

const randomItem = (array) => array[parseInt(Math.random() * array.length, 10)];

const getWeightForNullSortItem = (filmA, filmB) => {
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
  const weight = getWeightForNullSortItem(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weight ?? dayjs(filmB.filmInfo.release.date).diff(filmA.filmInfo.release.date);
};

const sortFilmRating = (filmA, filmB) => {
  const weight = getWeightForNullSortItem(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);
  return weight ?? (filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
};

const sortFilmComments = (filmA, filmB) => {
  const weigth = getWeightForNullSortItem(filmA.comments.length, filmB.comments.length);
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
  getPoster,
  getList,
  getGenres,
  randomItem,
  sortFilmDate,
  sortFilmRating,
  sortFilmComments,
  randomInteger,
};
