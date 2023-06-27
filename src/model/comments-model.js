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

  // get comments() {
  //   console.log('COMMENTS_GETTER', this.#comments);
  //   return this.#comments;
  // }

  getComments = async (filmId) => {
    try {
      return await this.#filmsApiService.getComments(filmId);
      // console.log('COMMENTS', this.#comments);
    } catch (err) {
      this.#comments = [];
    }

    // this._notify(UpdateType.COMMENTS);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      ...this.#comments,
      update
    ];

    this._notify(updateType, this.#comments);

    console.log('ADD_COMMENT', this.#comments);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, this.#comments);

    console.log('DELETE_COMMENT', this.#comments);
  };

  updateComment = (updateType) => {

    this._notify(updateType);
  };
}
