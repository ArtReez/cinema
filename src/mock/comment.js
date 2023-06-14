import { randomItem } from '../utils/film.js';
import { arrayId } from '../utils/common.js';

const array = [...arrayId];

const author = [
  'Ilya Olenchikov',
  'Oleg Smirnov',
  'Ed Harris',
  'Elena Storm',
  'Alfred Faber',
  'Max Divoff',
  'Alex Croft',
  'Divid Zagorodnikov',
  'Nikolai Stregin',
  'Kostya Vasiliev',
  'Dmitriy Kurpatov'
];

const comment = [
  'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'My 34 year old son rates this shot very minimal :-)',
  'Sexy :) I approve the use of blur and background image!',
  'Hugely thought out! You just won the internet!',
  'Overly thought out! Flat design is going to die.',
  'Such colour palette, many lines, so strong',
  'Pattern, lines, animation, type – fun!',
  'My 45 year old grandpa rates this boldness very amazing!!',
  'My 63 year old son rates this camera angle very slick!!',
  'I want to make love to your shot m8',
  'This atmosphere has navigated right into my heart.',
  'My 62 year old brother rates this illustration very incredible!!',
  'Sick, friend. I approve the use of hero and background!',
  'I want to learn this kind of shapes! Teach me.',
  'It\'s minimal not just elegant!',
  'My 66 year old son rates this atmosphere very fresh!!',
  'Playfulness, background, shot, animation – excellent mate',
  'Minimal :-) Love the use of navigation and style!',
  'Highly thought out! You are so inspiring!',
  'My 28 year old son rates this notification very amazing dude',
  'I want to learn this kind of iconography! Teach me.',
  'Such texture, many background, so beastly',
  'Fab! I like the use of navigation and button!',
  'My 50 year old daughter rates this shot very elegant mate',
  'Sky blue. Mmh wondering if this comment will hit the generateor as well...',
  'Good m8 I like the use of hero and typography!',
  'Such idea, many hero, so fun',
  'Overly thought out! Yes yes yes yes yes yes.',
  'So revolutionary and slick m8',
  'Navigation, gradient, spaces, shot – killer :-)',
  'Background image, pattern, camera angle, shot – sublime m8'
];

const data = [
  '2023-05-27T11:12:32.554Z',
  '2020-02-10T16:12:32.554Z',
  '2020-03-11T16:12:32.554Z',
  '2020-04-14T16:12:32.554Z',
  '2021-05-19T16:12:32.554Z',
  '2021-06-15T16:12:32.554Z',
  '2021-07-19T16:12:32.554Z',
  '2021-08-12T16:12:32.554Z',
  '2021-09-17T16:12:32.554Z',
  '2021-10-14T16:12:32.554Z',
  '2021-11-17T16:12:32.554Z',
  '2023-05-27T16:12:32.554Z',
  '2022-02-12T16:12:32.554Z',
  '2022-03-04T16:12:32.554Z',
  '2022-04-05T16:12:32.554Z',
  '2022-05-28T16:12:32.554Z',
  '2022-06-12T16:12:32.554Z',
  '2023-01-03T16:12:32.554Z',
  '2023-02-15T16:12:32.554Z',
  '2023-03-23T16:12:32.554Z',
  '2023-04-25T16:12:32.554Z',
  '2023-05-10T16:12:32.554Z',
  '2023-05-15T16:12:32.554Z',
];

const emotion = [
  'smile',
  'angry',
  'puke',
  'sleeping'
];

const getId = () => {
  if (array.length > 0) {
    return array.pop().toString();
  }
};

export const generateComments = () => ({
  'id': getId(),
  'author': randomItem(author),
  'comment': randomItem(comment),
  'date': randomItem(data),
  'emotion': randomItem(emotion),
});
