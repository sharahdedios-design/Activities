//class1
class Fruit {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    show() {
        console.log(this.name + " ₱" + this.price);
    }
}

let fruit1 = new Fruit("Mango", 40);
fruit1.show();


//class2
class TropicalFruit extends Fruit {
    constructor(name, price, country) {
        super(name, price);
        this.country = country;
    }

    origin() {
        console.log(this.country);
    }
}

let fruit2 = new TropicalFruit("Banana", 30, "Philippines");
fruit2.origin();


//class3
class Basket {
    constructor(fruits) {
        this.fruits = fruits;
    }

    list() {
        for (let f of this.fruits)
            console.log(f);
    }
}

let b = new Basket(["Mango", "Banana", "Apple"]);
b.list();

//class4
class Shop extends Basket {
    welcome() {
        console.log("Fruit Shop");
    }
}

let s = new Shop(["Apple", "Orange"]);
s.welcome();

let name = "Ana";
let age = 18;
let price = 50;

let fruits = ["Mango", "Banana", "Apple"];
let colors = ["Red", "Yellow", "Green"];
let prices = [40, 30, 60];

if (age >= 18) console.log("Adult");
if (price >= 50) console.log("Expensive");
if (fruits.length >= 3) console.log("Many fruits");

for (let f of fruits) console.log(f);
for (let c of colors) console.log(c);
for (let p of prices) console.log(p);

let fruit = {name: "Sharmine", color: "Orange"};
let customer = {name: "Sha", age: 20};

class Box { //encapsolation
    #quantity = 10;
    getQuantity() {
        return this.#quantity;
    }
}

class Machine { //abstraction
    start() {
        console.log("Fruit ready");
    }
}