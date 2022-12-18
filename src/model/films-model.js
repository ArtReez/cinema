import { generateFilms } from '../mock/film.js';
import { generateComments } from '../mock/comment.js';

export default class FilmsModel {
  films = Array.from({length: 5}, generateFilms);
  comments = generateComments();

  getFilms = () => this.films;
  getComments = () => this.comments;
}
