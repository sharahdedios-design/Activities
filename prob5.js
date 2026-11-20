const heroOne = {
    heroName: "Miya",
    role: "Marksman",
    stats: {
        damage: "High",
        battleSpell: "inspire"
    }
};
const heroTwo = {
    heroName: "Nana",
    role: "Tank"
};
const{ heroName: name1, stats: stats1 } = heroOne;
const{ heroName: name2, stats: stats2 } = heroTwo;

console.log(`${name1} spell: ${stats1?.battleSpell ?? "None"}`);
console.log(`${name2} spell: ${stats2?.battleSpell ?? "None"}`);