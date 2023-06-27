import ApiService from '../framework/api-service';
import { Method } from '../const';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  // get comments() {
  //   return this._load({url: 'comments/10'})
  //     .then(ApiService.parseResponse);
  // }

  getComments = async (filmId) => {
    const response = await this._load({url: `comments/${filmId}`});
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        'release': {...film.filmInfo.release,
          'release_country': film.filmInfo.release.releaseCountry},
      },
      'user_details': {...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate instanceof Date
          ? film.userDetails.watchingDate.toISOString()
          : null,
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info']['release'].releaseCountry;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['user_details'].alreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;

    return adaptedFilm;
  };
}
