class Car {
    #brand;

    constructor(brand) {
        this.#brand = brand;
    }

    start() {
        console.log(`${this.#brand} the car is starting`);
    }

    getBrand() {
        return this.#brand;
    }
}

class Sha extends Car {
    engine() {
        console.log("The engine is okay");
    }
}

const myCar = new Car("Toyota");
const mySha = new Sha("Honda");

myCar.start();
mySha.engine();

const cars = [myCar, mySha];

for (let i = 0; i < cars.length; i++) {
    if (cars[i].getBrand() === "Toyota") {
        console.log(`${cars[i].getBrand()} is nice`);
    } else {
        console.log(`${cars[i].getBrand()} is also nice`);
    }
}