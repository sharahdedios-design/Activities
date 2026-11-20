class Hero {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }

    introduce() {
        return `${this.name} is ready for battle as a ${this.role}!`;
    }
}

class Assassin extends Hero {
    constructor(name, weapon) {
        super(name, "Assassin");
        this.weapon = weapon;
    }

    attack() {
        return `${this.name} attacks quickly with ${this.weapon}!`;
    }
}

class Mage extends Hero {
    constructor(name, element) {
        super(name, "Mage");
        this.element = element;
    }

    castSpell() {
        return `${this.name} casts a devastating ${this.element} spell!`;
    }
}

const gusion = new Assassin("Gusion", "Holy Daggers");
const valir = new Mage("Valir", "Fire");

console.log(gusion.introduce());
console.log(gusion.attack());

console.log(valir.introduce());
console.log(valir.castSpell());