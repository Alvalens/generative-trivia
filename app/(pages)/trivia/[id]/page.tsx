"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
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

const revealLettersInRandomPositions = (answer: string, lettersToShow: number) => {
  const initialAnswer = answer.toUpperCase();
  const indices = Array.from({ length: initialAnswer.length }, (_, i) => i);

  // Shuffle the indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Take the first 'lettersToShow' indices
  const indicesToReveal = indices.slice(0, lettersToShow);

  // Initialize userAnswers with empty values
  const userAnswersArray = new Array(initialAnswer.length).fill('');

  // Set the revealed letters in the random positions
  indicesToReveal.forEach(index => {
    userAnswersArray[index] = initialAnswer[index];
  });

  return userAnswersArray;
};

export default function TriviaPage({params}: {params: {id: string}}) {
  const router = useRouter();
  const [trivia, setTrivia] = useState<TriviaQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState<number>(5);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const initializeUserAnswers = useCallback((triviaItem: TriviaQuestion) => {
    if (triviaItem && triviaItem.trivia[currentQuestionIndex]) {
      const initialAnswer = triviaItem.trivia[currentQuestionIndex].answer;
      const lettersToShow = initialAnswer.length > 5 ? 2 : 1;
      setUserAnswers(revealLettersInRandomPositions(initialAnswer, lettersToShow));
    }
  }, [currentQuestionIndex]);


  useEffect(() => {
    const triviaID = Number(params.id);
    const storedTrivia = localStorage.getItem("triviaQuestions");
    if (storedTrivia) {
      const triviaList = JSON.parse(storedTrivia);
      const triviaItem = triviaList.find((item: TriviaQuestion) => item.id === triviaID);

      if (triviaItem) {
        if (typeof triviaItem.trivia === 'string') {
          try {
            const cleanedJson = triviaItem.trivia
              .replace(/```json\n|\n```/g, '') 
              .trim(); 

            const parsedTrivia = JSON.parse(cleanedJson);
            if (Array.isArray(parsedTrivia)) {
              triviaItem.trivia = parsedTrivia;
            } else {
              console.error('Invalid trivia format');
              triviaItem.trivia = [];
            }
          } catch (error) {
            console.error('Error parsing trivia:', error);
            triviaItem.trivia = [];
          }
        }

        if (triviaItem.score !== undefined) {
          router.push(`/trivia/${triviaID}/result`);
          return;
        }
      }
    }
  }, [router, params.id]);


  useEffect(() => {
    const triviaID = Number(params.id);
    const storedTrivia = localStorage.getItem("triviaQuestions");

    if (storedTrivia) {
      const triviaList = JSON.parse(storedTrivia);
      const triviaItem = triviaList.find((item: TriviaQuestion) => item.id === triviaID);

      if (triviaItem) {
        if (typeof triviaItem.trivia === 'string') {
          try {
            const cleanedJson = triviaItem.trivia
              .replace(/```json\n|\n```/g, '')
              .trim();
            triviaItem.trivia = JSON.parse(cleanedJson);
          } catch (error) {
            console.error('Failed to parse trivia JSON:', error);
            router.push("/");
            return;
          }
        }
        setTrivia(triviaItem);
        initializeUserAnswers(triviaItem);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router, initializeUserAnswers, params.id]);


  const handleAnswerChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[index] = value.toUpperCase();
      setUserAnswers(updatedAnswers);
    }
  };

  const checkAnswer = () => {
    if (trivia) {
      const correctAnswer = trivia.trivia[currentQuestionIndex]?.answer || "";
      const userAnswer = userAnswers.join("");
      if (userAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
        setFeedback("Correct!");
        setCorrectAnswersCount(prev => prev + 1);
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
        initializeUserAnswers(trivia);
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
        router.push(`/trivia/${trivia.id}/result`);
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
          updatedAnswers[randomIndex] = answer[randomIndex].toUpperCase();
          setUserAnswers(updatedAnswers);
          setHintCount(hintCount - 1);
        }
      }
    }
  };

  const currentQuestion = trivia?.trivia[currentQuestionIndex];
  const displayValues = currentQuestion?.answer.split("").map((char, index) =>
    userAnswers[index] || ""
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
