import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
//Types
import { QuestionState, Difficulty } from "./API";
//Components
import QuestionCard from "./components/QuestionCard";
//Styles
import { GlobalStyle, Wrapper } from "./App.styles";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setIsLoading(true);
    setGameOver(false);
    try {
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setGameOver(true);
    }

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    //Resetting the state
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setIsLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //user-answer:
      const answer = e.currentTarget.value;
      //check answer against correct answer:
      const correct = questions[number].correct_answer === answer;
      //add score if answer is correct:
      if (correct) setScore((prev) => prev + 1);
      //save answer in the array for user answers:
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    //move on to the next question if not the last question:
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>QUIZZY-BREAK</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <>
            <p>Let the games begin!</p>
            <button className="start" onClick={startTrivia}>
              Start
            </button>
          </>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {isLoading ? <p className="loading">Loading Questions...</p> : null}
        {!isLoading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !isLoading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
