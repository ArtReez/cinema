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

const getGenres = (array) => array.reduce((acc, el) => `${acc}<span class="film-details__genre">${el}</span>`, '');

const isActive = (item) => item ? 'film-details__control-button--active' : '';

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

const capitalizeFirstLetter = (item) => item.charAt(0).toUpperCase() + item.slice(1);

export {
  humanizeFilmDate,
  humanizeFilmTime,
  humanizeFilmDatePopup,
  humanizeFilmDateCommentsPopup,
  getList,
  getGenres,
  isActive,
  randomItem,
  capitalizeFirstLetter,
};
