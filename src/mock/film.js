import { randomItem, getGenres} from '../utils/utils.js';
import { nanoid } from 'nanoid';

const titles = [
  'A Little Pony Without The Carpet',
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor'
];

const totalRatings = ['4.5', '4.7', '4.9', '5.2', '5.4', '5.7', '5.9', '6.0', '6.4', '6,8', '7.1', '7.3', '7.5'];

const ageRatings = ['0', '3', '6', '10', '14', '16', '18'];

const posters = [
  'made-for-each-other',
  'popeye-meets-sinbad',
  'sagebrush-trail',
  'santa-claus-conquers-the-martians',
  'the-dance-of-life',
  'the-great-flamarion',
  'the-man-with-the-golden-arm'
];

const runtimes = [46, 57, 69, 84, 93, 110, 116, 121, 123, 137];

const genres = ['Comedy', 'Lyric', 'Drama', 'Western'];

const dates = [
  '1926-02-04T00:00:00.000Z',
  '1928-04-07T00:00:00.000Z',
  '1932-06-14T00:00:00.000Z',
  '1935-07-18T00:00:00.000Z',
  '1938-09-26T00:00:00.000Z',
  '1942-12-31T00:00:00.000Z',
  '1946-08-25T00:00:00.000Z',
];

const descriptions = [
  'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const isTrue = [true, false];

export const generateFilms = () => ({
  'id': nanoid(),
  'comments': [
    '56', '73', '83', '3'
  ],
  'filmInfo': {
    'title': randomItem(titles),
    'alternativeTitle': randomItem(titles),
    'totalRating': randomItem(totalRatings),
    'poster': `images/posters/${  randomItem(posters)  }.jpg`,
    'ageRating': randomItem(ageRatings),
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano',
      'Richard Weil'
    ],
    'actors': [
      'Morgan Freeman',
      'Mary Beth Hughes',
      'Dan Duryea'
    ],
    'release': {
      'date': randomItem(dates),
      'releaseCountry': 'Finland'
    },
    'runtime': randomItem(runtimes),
    'genre': getGenres(genres),
    'description': randomItem(descriptions),
  },
  'userDetails': {
    'watchlist': randomItem(isTrue),
    'alreadyWatched': randomItem(isTrue),
    'watchingDate': '2019-04-12T16:12:32.554Z',
    'favorite': randomItem(isTrue),
  }
});
