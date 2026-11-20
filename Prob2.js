//4 const variable, 1 array, 2 loops and 3 template literal

const name = "sharah";
const age = 20;
const favColor = "red";
const numbers = [4, 7, 8, 9, 10];

for( let i = 0; i < name.length; i++){
console.log(`${name[i]} is adult`);}

for(let j = 0; j < numbers.length; j++){
    console.log(`${numbers[j]} is her number`)
}
if(age >= 18){
console.log(`${name} is adult, her favorite color is ${favColor}`);
}