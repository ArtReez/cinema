import { generateFilms } from '../mock/film.js';
import { generateComments } from '../mock/comment.js';

export default class FilmsModel {
  #films = Array.from({length: 22}, generateFilms);
  #comments = generateComments();

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
