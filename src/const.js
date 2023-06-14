const FilterType = {
  ALL: 'ALL',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES',
};

const SortType = {
  DEFAULT: 'DEFAULT',
  DATE: 'DATE',
  RATING: 'RATING',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  COMMENT: 'COMMENT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const Container ={
  FILMS: 'FILMS',
  TOP_RATED: 'TOP_RATED',
  MOST_COMMENTED: 'MOST_COMMENTED',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const Comment = {
  DEFAULT: 'DEFAULT',
  EDITED: 'EDITED',
};

const FilmsList = {
  DEFAULT: 'DEFAULT',
  EXTRA: 'EXTRA',
};

const Title = {
  DEFAULT: 'DEFAULT',
  TOP_RATED: 'TOP_RATED',
  MOST_COMMENTED: 'MOST_COMMENTED',
};

export {FilterType, SortType, UserAction, UpdateType, Container, Mode, Comment, FilmsList, Title};
