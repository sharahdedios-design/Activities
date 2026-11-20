//4 object letirals, use the spread operator on object and has       2 arrow function

const obj1 = {age: 20};
const obj2 = {name: "sharah"};
const obj3 = {course: "BSIT"}
const obj4 = {favColor: "red"};

const sharahIdentity = { 
          ...obj1,
          ...obj2,
          ...obj3,
          ...obj4,
             allowance: 500
               };

const calculateDouble = ((n) =>n * 2);
const calculateYearlyAllowance = (monthlyAllowance) => monthlyAllowance * 12;

console.log("age Double:", calculateDouble(sharahIdentity.age));
console.log(" yearly Allowance:", calculateYearlyAllowance(sharahIdentity.allowance));

