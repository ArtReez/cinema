import { filter } from '../filter.js';

export const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterCount]) => ({
    name: filterName,
    count: filterCount(films).length,
  }),
);
