class Student {
    constructor(name,age, course){
        this.name = name;
        this.age = age;
        this.course = course;
    }
    introduce() {
        console.log("Hello! My name is " + this.name);
        console.log (" I am " + this.age + " years old.");
        console.log("I am taking" + this.course + ".");
    }
    study(){
        console.log(this.name + " is studying.");
    }
}

let student1 = new Student("Sharah", 20, "BS Information technology");

student1.introduce();
student1.study();