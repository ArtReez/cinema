/* eslint-disable no-console */
import Observable from '../framework/observable.js';
// import { UpdateType } from '../const.js';
// import { generateComments } from '../mock/comment.js';

export default class CommentsModel extends Observable {
  // #comments = Array.from({length: 500}, generateComments);
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;

    // const film = {id: '10'};
    // this.#filmsApiService.getComments(film).then((comments) => {
    //   console.log('COMMENTS_FILM', comments);
    // });
  }


  getComments = async (filmId) => {
    try {
      const response = await this.#filmsApiService.getComments(filmId);
      return response;
    } catch (err) {
      this.#comments = [];
      throw new Error('Can\'t get unexciting comments');

    }
    // console.log('COMMENTS', this.#comments);
  };

  addComment = async (updateType, film, comment) => {
    try {
      await this.#filmsApiService.addComment(film, comment);

      this._notify(updateType, film);

      console.log('ADD_COMMENT', this.#comments);
    } catch(err) {
      throw new Error('Can\'t add unexciting comment');
    }
  };

  deleteComment = async (updateType, film, commentId) => {
    try {
      await this.#filmsApiService.deleteComment(commentId);
      // this.#comments = [
      //   ...this.#comments.slice(0, index),
      //   ...this.#comments.slice(index + 1)
      // ];

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t delete unexciting comment');
    }
  };
}
