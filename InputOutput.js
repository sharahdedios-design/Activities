const readline = require("readline");
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

input.question("Enter your name: ", (name) => {
  console.log("Hello, " + name + "!");
  input.close();
});