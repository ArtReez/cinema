const COUNT_ID = 500;
const arrayId = [];

(function() {
  for (let i = 1; i <= COUNT_ID; i++) {
    arrayId.push(i);
  }

  arrayId.sort(() => Math.random() - 0.5);
})();

export { arrayId };
