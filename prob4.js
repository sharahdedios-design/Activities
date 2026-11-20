//3 classes, implement abstraction, and have 4 methods

class Car {
    start() {
        console.log("Car started.");
    }

    stop() {
        console.log("Car stopped.");
    }
}

class Cat extends Car {
    eating() {
        console.log("Cat is eating.");
    }
}

class Dog extends Cat {
    sleep() {
        console.log("Dog is sleeping.");
    }
}

// Create objects
const car = new Car();
const cat = new Cat();
const dog = new Dog();

// Call methods
car.start();
car.stop();
cat.eating();
dog.sleep();