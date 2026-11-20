
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const decodeHtml = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          'https://opentdb.com/api.php?amount=5&type=multiple',
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error('Unable to get quiz questions. Please try again.');
        }

        const result = await response.json();

        if (result.response_code !== 0 || !result.results.length) {
          throw new Error('No quiz questions were returned. Please try again.');
        }

        const formattedQuestions = result.results.map((item) => ({
          question: decodeHtml(item.question),
          correctAnswer: decodeHtml(item.correct_answer),
          answers: [...item.incorrect_answers, item.correct_answer]
            .map(decodeHtml)
            .sort(() => Math.random() - 0.5),
        }));

        setQuestions(formattedQuestions);

      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      setGameFinished(true);
    } else {
      setCurrentQuestion((previousQuestion) => previousQuestion + 1);
      setSelectedAnswer('');
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setGameFinished(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.message}>Loading quiz questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (gameFinished) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🏆</Text>
          <Text style={styles.heading}>Game Finished!</Text>
          <Text style={styles.score}>
            Your score: {score} / {questions.length}
          </Text>

          <Pressable style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const question = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quick Quiz</Text>

      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.category}>GENERAL KNOWLEDGE</Text>

        <Text style={styles.question}>
          {question.question}
        </Text>

        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = answer === question.correctAnswer;

          let answerStyle = styles.answerButton;

          if (selectedAnswer && isCorrect) {
            answerStyle = [
              styles.answerButton,
              styles.correctAnswer,
            ];
          } else if (isSelected) {
            answerStyle = [
              styles.answerButton,
              styles.wrongAnswer,
            ];
          }

          return (
            <Pressable
              key={`${index}-${answer}`}
              style={answerStyle}
              onPress={() => handleAnswer(answer)}
              disabled={Boolean(selectedAnswer)}
            >
              <Text style={styles.answerText}>
                {answer}
              </Text>
            </Pressable>
          );
        })}

        {selectedAnswer ? (
          <View>
            <Text style={styles.feedback}>
              {selectedAnswer === question.correctAnswer
                ? 'Correct answer!'
                : `Incorrect. Correct answer: ${question.correctAnswer}`}
            </Text>

            <Pressable
              style={styles.button}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>
                {currentQuestion === questions.length - 1
                  ? 'See Result'
                  : 'Next Question'}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <Text style={styles.scoreSmall}>
        Score: {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2FF',
    padding: 20,
    paddingTop: 65,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F3F2FF',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#333333',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28234A',
    textAlign: 'center',
  },
  progress: {
    textAlign: 'center',
    color: '#6C63FF',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  category: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 12,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28234A',
    marginBottom: 20,
  },
  answerButton: {
    borderWidth: 1,
    borderColor: '#D9D7EF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  correctAnswer: {
    backgroundColor: '#DDF5E5',
    borderColor: '#299B55',
  },
  wrongAnswer: {
    backgroundColor: '#FFE1E1',
    borderColor: '#D64545',
  },
  answerText: {
    color: '#28234A',
    fontSize: 15,
  },
  feedback: {
    color: '#333333',
    marginTop: 8,
    marginBottom: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    color: '#28234A',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  scoreSmall: {
    color: '#28234A',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
  emoji: {
    fontSize: 54,
    textAlign: 'center',
    marginBottom: 12,
  },
  error: {
    color: '#B42318',
    textAlign: 'center',
    fontSize: 16,
  },
});
