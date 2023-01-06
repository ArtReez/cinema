import { filterType } from './const.js';

const filter = {
  [filterType.ALL]: (films) => films,
  [filterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [filterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [filterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export {filter};

