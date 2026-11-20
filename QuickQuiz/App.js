import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

const bibleQuestions = [
  {
    question: 'Who built the ark?',
    choices: ['Moses', 'Noah', 'Abraham', 'David'],
    answer: 'Noah',
  },
  {
    question: 'Who was the first man created by God?',
    choices: ['Adam', 'Abraham', 'Jacob', 'Joseph'],
    answer: 'Adam',
  },
  {
    question: 'Who was the mother of Jesus?',
    choices: ['Martha', 'Mary', 'Elizabeth', 'Ruth'],
    answer: 'Mary',
  },
  {
    question: 'Where was Jesus born?',
    choices: ['Jerusalem', 'Nazareth', 'Bethlehem', 'Egypt'],
    answer: 'Bethlehem',
  },
  {
    question: 'Who defeated Goliath?',
    choices: ['Saul', 'Solomon', 'David', 'Samson'],
    answer: 'David',
  },
  {
    question: 'How many disciples did Jesus have?',
    choices: ['10', '11', '12', '13'],
    answer: '12',
  },
  {
    question: 'Who was swallowed by a great fish?',
    choices: ['Jonah', 'Peter', 'Paul', 'John'],
    answer: 'Jonah',
  },
  {
    question: 'Who received the Ten Commandments?',
    choices: ['Joshua', 'Moses', 'Aaron', 'Noah'],
    answer: 'Moses',
  },
  {
    question: 'What is the first book of the Bible?',
    choices: ['Exodus', 'Psalms', 'Genesis', 'Matthew'],
    answer: 'Genesis',
  },
  {
    question: 'Who betrayed Jesus?',
    choices: ['Peter', 'Judas Iscariot', 'John', 'Thomas'],
    answer: 'Judas Iscariot',
  },
  {
    question: 'Who was thrown into the lions’ den?',
    choices: ['Daniel', 'Joseph', 'Elijah', 'Isaiah'],
    answer: 'Daniel',
  },
  {
    question: 'What did God create on the first day?',
    choices: ['Animals', 'The sun', 'Light', 'The sea'],
    answer: 'Light',
  },
];

function getRandomQuestions() {
  return [...bibleQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}

export default function App() {
  const [questions, setQuestions] = useState(getRandomQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [gameFinished, setGameFinished] = useState(false);

  const question = questions[currentQuestion];

  function handleAnswer(answer) {
    if (selectedAnswer !== '') return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setScore(previous => previous + 1);
    }
  }

  function nextQuestion() {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(previous => previous + 1);
      setSelectedAnswer('');
    } else {
      setGameFinished(true);
    }
  }

  function restartGame() {
    setQuestions(getRandomQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setGameFinished(false);
  }

  if (gameFinished) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Bible Quiz Completed!</Text>
        <Text style={styles.score}>
          Your Score: {score} / {questions.length}
        </Text>
        <Text style={styles.info}>
          Keep learning and growing in God's Word!
        </Text>

        <Pressable style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Play Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bible Quiz</Text>
      <Text style={styles.subtitle}>
        Test Your Knowledge of the Bible
      </Text>

      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>

      <Text style={styles.score}>Score: {score}</Text>

      <View style={styles.questionBox}>
        <Text style={styles.question}>
          {question.question}
        </Text>
      </View>

      {question.choices.map((choice, index) => {
        let buttonColor = '#7B2CBF';

        if (selectedAnswer !== '') {
          if (choice === question.answer) {
            buttonColor = '#2E9D50';
          } else if (choice === selectedAnswer) {
            buttonColor = '#D64545';
          } else {
            buttonColor = '#999999';
          }
        }

        return (
          <Pressable
            key={index}
            style={[
              styles.answerButton,
              { backgroundColor: buttonColor },
            ]}
            onPress={() => handleAnswer(choice)}
            disabled={selectedAnswer !== ''}
          >
            <Text style={styles.answerText}>{choice}</Text>
          </Pressable>
        );
      })}

      {selectedAnswer !== '' && (
        <View>
          <Text style={styles.feedback}>
            {selectedAnswer === question.answer
              ? 'Correct Answer! Great job!'
              : `Incorrect! The correct answer is ${question.answer}.`}
          </Text>

          <Pressable style={styles.button} onPress={nextQuestion}>
            <Text style={styles.buttonText}>
              {currentQuestion + 1 === questions.length
                ? 'See Results'
                : 'Next Question'}
            </Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.footer}>
        Old Testament • New Testament
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F0FA',
    justifyContent: 'center',
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: '#F5F0FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5A189A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7B2CBF',
    marginVertical: 15,
  },
  questionBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  question: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  answerButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#5A189A',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 15,
  },
  footer: {
    textAlign: 'center',
    color: '#777',
    marginTop: 25,
    marginBottom: 10,
  },
});