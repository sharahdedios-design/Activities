//2 destructured array,2 destructured object, and 3 arrow function.
class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const num = [20, 21];
const fruit = ["apple", "banana", "grapes"];

const [first, second] = num;
const [third, fourth] = fruit;

const student = new Student("Sharah", 20);

const { name } = student;
const { age } = student;

const add = (a, b) => a + b;
const double = (num) => num * 2;
const capitalized = (name) => name.toUpperCase();


console.log(add(first, age));
console.log(double(5));
console.log(capitalized(name));