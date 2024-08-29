"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TriviaQuestion {
  id: number;
  trivia: {
    question: string;
    answer: string;
    options: string[];
  }[];
  userAnswers?: string[];
  score?: number; // Added score to track user score
}

export default function TriviaPage() {
  const router = useRouter();
  const [trivia, setTrivia] = useState<TriviaQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState<number>(3);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0); // Track correct answers count

  useEffect(() => {
    const triviaID = Number(window.location.pathname.split("/")[1]);
    const storedTrivia = localStorage.getItem("triviaQuestions");

    if (storedTrivia) {
      const triviaList = JSON.parse(storedTrivia);
      const triviaItem = triviaList.find((item: TriviaQuestion) => item.id === triviaID);

      if (triviaItem) {
        // Check if triviaItem.trivia is already an object
        if (typeof triviaItem.trivia === 'string') {
          triviaItem.trivia = JSON.parse(triviaItem.trivia);
        }

        if (triviaItem.score !== undefined && triviaItem.score >= triviaItem.trivia.length) {
          // Redirect to results page if trivia is completed
          router.push(`/${triviaID}/trivia/result`);
          return;
        }

        setTrivia(triviaItem);
        setUserAnswers(triviaItem.userAnswers || new Array(triviaItem.trivia[0].answer.length).fill(''));
        setCorrectAnswersCount(triviaItem.score || 0); // Load previous score if available
      } else {
        router.push("/"); // Redirect to home if no trivia found
      }
    } else {
      router.push("/"); // Redirect to home if no trivia data in localStorage
    }
  }, [router]);

  const handleAnswerChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[index] = value.toUpperCase(); // Ensure uppercase for consistency
      setUserAnswers(updatedAnswers);
    }
  };

  const checkAnswer = () => {
    if (trivia) {
      const correctAnswer = trivia.trivia[currentQuestionIndex]?.answer || "";
      const userAnswer = userAnswers.join("");
      if (userAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
        setFeedback("Correct!");
        setCorrectAnswersCount(prev => prev + 1); // Increment correct answers count
        // Store user answers in trivia object
        const updatedTrivia = { ...trivia, userAnswers, score: correctAnswersCount + 1 };
        const storedTrivia = localStorage.getItem("triviaQuestions");
        if (storedTrivia) {
          const triviaList = JSON.parse(storedTrivia).map((item: TriviaQuestion) =>
            item.id === trivia.id ? updatedTrivia : item
          );
          localStorage.setItem("triviaQuestions", JSON.stringify(triviaList));
        }
      } else {
        setFeedback(`Incorrect. The correct answer is: ${correctAnswer}`);
      }
      setIsAnswerChecked(true);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerChecked(false);
    setFeedback(null);
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (trivia && trivia.trivia[nextIndex]) {
        setUserAnswers(new Array(trivia.trivia[nextIndex].answer.length).fill(''));
      } else if (trivia) {
        // Redirect to results page if all questions are answered
        const updatedTrivia = { ...trivia, score: correctAnswersCount };
        const storedTrivia = localStorage.getItem("triviaQuestions");
        if (storedTrivia) {
          const triviaList = JSON.parse(storedTrivia).map((item: TriviaQuestion) =>
            item.id === trivia.id ? updatedTrivia : item
          );
          localStorage.setItem("triviaQuestions", JSON.stringify(triviaList));
        }
        router.push(`/${trivia.id}/trivia/result`);
      }
      return nextIndex;
    });
  };

  const revealLetter = () => {
    if (hintCount > 0 && trivia) {
      const currentQuestion = trivia.trivia[currentQuestionIndex];
      if (currentQuestion) {
        const answer = currentQuestion.answer;
        // Identify unrevealed indices
        const unrevealedIndices = answer.split("").map((_, index) => index).filter(index => userAnswers[index] === '');
        if (unrevealedIndices.length > 0) {
          const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
          const updatedAnswers = [...userAnswers];
          updatedAnswers[randomIndex] = answer[randomIndex].toUpperCase(); // Ensure uppercase for consistency
          // Update state and hint count
          setUserAnswers(updatedAnswers);
          setHintCount(hintCount - 1);
        }
      }
    }
  };

  const currentQuestion = trivia?.trivia[currentQuestionIndex];
  const displayValues = currentQuestion?.answer.split("").map((char, index) =>
    userAnswers[index] || "" // Use empty string instead of underscore
  );

  if (!trivia || trivia.trivia.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 h-screen flex flex-col justify-center items-center">
      {trivia && currentQuestionIndex < trivia.trivia.length ? (
        <>
          <h2 className="text-xl font-bold mb-4">{currentQuestion?.question}</h2>
          <div className="flex space-x-2 gap-1 mb-4 flex-wrap">
            {displayValues?.map((char, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                placeholder="_"
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                value={userAnswers[index]}
                className="w-12 text-center"
              />
            ))}
          </div>
          <div className="mt-4">
            {isAnswerChecked ? (
              <Button onClick={handleNextQuestion}>Next Question</Button>
            ) : (
              <Button onClick={checkAnswer}>Check Answer</Button>
            )}
            {hintCount > 0 && !isAnswerChecked && (
              <Button onClick={revealLetter} className="ml-2">
                Reveal Letter ({hintCount} left)
              </Button>
            )}
          </div>
          {feedback && <p className="mt-2">{feedback}</p>}
        </>
      ) : (
        <p>Trivia ended!</p>
      )}
    </div>
  );
}
