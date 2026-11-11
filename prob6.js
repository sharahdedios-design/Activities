
const MIN_LEVEL = 10;
const TARGET_ROLE = "Marksman";

const isHighLevel = (level) => level >= MIN_LEVEL;
const isTargetRole = (role) => role === TARGET_ROLE;
const formatHeroInfo = (hero) => `${hero.name} [Lv.${hero.level}] - ${hero.role}`;

const heroesList = [
  { name: "Miya", level: 12, role: "Marksman" },
  { name: "Layla", level: 8, role: "Marksman" },
  { name: "Tigreal", level: 15, role: "Tank" },
  { name: "Claude", level: 11, role: "Marksman" }
];

const highLevelHeroes = heroesList.filter(hero => isHighLevel(hero.level));
const marksmanHeroes = heroesList.filter(hero => isTargetRole(hero.role));

console.log("--- High Level Heroes ---");
highLevelHeroes.forEach(hero => console.log(formatHeroInfo(hero)));

console.log("\n--- Marksman Heroes ---");
marksmanHeroes.forEach(hero => console.log(formatHeroInfo(hero)));