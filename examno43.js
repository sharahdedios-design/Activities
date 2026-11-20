class student{
    constructor(course){
        this.course = course;
    }
        studying(){
         console.log("this user is studying");
        }
        sleeping(){
            console.log("this user is sleeping");
           
        }
}
const name = new student("sharah");
const age = new student(20);
const course = new student("BSIT");

console.log(`this user is ${student.course}`);