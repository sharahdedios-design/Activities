let  score = 0;
let passingScores = 50;
let feedback = "";

let studentName = ["Sharah", "Jenny", "Elijah"];
let studentScores = [80, 78,45]; 

for(i= 0; i < studentName.length; i++){
    score = studentScores[i];

    if (score >= passingScores){
      feedback = "Congratulations! You passed";
    }else{ 
      feedback = "improve better luck next time";
     }

   if(score >= 80){
    console.log(`${studentName.name || studentName[i]}  score ${score} - ${feedback} (Excellent!)`);
    }else {
    console.log(`${studentName[i]} score ${score} - feedback ${feedback}`);
  }
}