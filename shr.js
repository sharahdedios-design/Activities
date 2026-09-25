const doublenum = (num) => num * 2;
const capitalized = (word) =>  word.toUpperCase();
const formatSummary = (totalHeroes) => `Total heroes processed: ${totalHeroes}`;

const scores = [10, 20, 30];
const heroes = ["miya", "layla", "zilong"];

const doubleScores = scores.map(doublenum);
const wordHeroes = heroes.map(capitalized);

console.log (`Original scores: ${scores} | Doubled scores: ${doubleScores}`);
console.log(`Original heroes: ${heroes} |Capitalized heroes: ${wordHeroes}`);

console.log(formatSummary(wordHeroes.length));
