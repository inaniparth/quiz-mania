import React, { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { getPerformanceFeedback } from "@shared/utils";

export default function QuizResults() {
  const {
    currentCategory,
    answers,
    quizComplete,
    restartQuiz,
    resetQuiz,
    saveResults,
    userName,
  } = useQuiz();

  const [resultsSaved, setResultsSaved] = useState(false);
  const [score, setScore] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);
  const [timeoutQuestions, setTimeoutQuestions] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (quizComplete && currentCategory && answers.length > 0) {
      // Calculate score
      const correctAnswers = answers.filter((answer) => answer.correct).length;
      setScore(correctAnswers);

      // Calculate percentage
      const percentage = Math.round(
        (correctAnswers / currentCategory.questionCount) * 100,
      );
      setPercentageScore(percentage);

      // Count timed out questions

      setTimeoutQuestions(answers.filter((answer) => answer.isSkippedQuestion).length);

      // Generate feedback message
      setFeedbackMessage(
        getPerformanceFeedback(correctAnswers, currentCategory.questionCount),
      );

      // Save results to the server
      if (!resultsSaved) {
        saveResults();
        setResultsSaved(true);
      }
    }
  }, [quizComplete, currentCategory, answers, resultsSaved, saveResults]);

  if (!quizComplete || !currentCategory) {
    return null;
  }

  const correctAnswers = answers.filter((answer) => answer.correct).length;
  const incorrectAnswers = currentCategory.questionCount - correctAnswers - timeoutQuestions;

  const isGoodScore = percentageScore >= 70;

  return (
    <div className="max-w-3xl mx-auto text-center py-8">
      {/* Success/Needs Improvement Icon */}
      <div className="flex justify-center mb-6">
        {isGoodScore ? (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-pink-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-pink-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Heading section changes based on score */}
      {isGoodScore ? (
        <>
          <h2 className="text-4xl font-bold tracking-widest text-gray-700 mb-2">
            CONGRATULATIONS {userName}!
          </h2>
          <p className="text-gray-600 mb-8">
            You successfully completed the Quiz and achieved
          </p>

          {/* Score Section - Good */}
          <div className="mb-8">
            <h3 className="text-xl text-gray-700 mb-4">Your Score</h3>
            <p className="text-6xl font-bold text-green-500 mb-2">
              {percentageScore}%
            </p>
            <p className="text-2xl font-semibold text-gray-700">Great job!</p>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            {userName}, you successfully completed the Quiz but you need to
          </p>
          <h2 className="text-4xl font-bold tracking-widest text-gray-700 mb-2">
            KEEP
          </h2>
          <h2 className="text-4xl font-bold tracking-widest text-gray-700 mb-8">
            PRACTICING!
          </h2>

          {/* Score Section - Needs Improvement */}
          <div className="mb-8">
            <div className="border-2 border-pink-500 rounded-full inline-block p-10 mb-2">
              <p className="text-4xl font-bold text-yellow-600">
                {percentageScore}%
              </p>
              <p className="text-lg text-gray-700 mt-1">Your Score</p>
            </div>
          </div>
        </>
      )}

      {/* Results Summary Box */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 mb-8 inline-block mx-auto">
        <p className="text-gray-700 mb-4">
          Out of {currentCategory.questionCount} question
        </p>
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-green-500 mr-2">
              {correctAnswers}
            </span>
            <span className="text-gray-600">Correct</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-red-500 mr-2">
              {incorrectAnswers}
            </span>
            <span className="text-gray-600">Incorrect</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-500 mr-2">
              {timeoutQuestions}
            </span>
            <span className="text-gray-600">Not answered</span>
          </div>
        </div>
      </div>

      {/* Retake Quiz Button */}
      <div className="flex justify-center mt-6 mb-8">
        <button
          onClick={restartQuiz}
          className="px-8 py-2 mr-3 border border-pink-500 text-pink-600 rounded-md hover:bg-pink-50 transition-colors focus:outline-none"
        >
          Retake Quiz
        </button>
        <button
          onClick={resetQuiz}
          className="px-8 py-2 border border-pink-500 text-pink-600 rounded-md hover:bg-pink-50 transition-colors focus:outline-none"
        >
          Home
        </button>
      </div>
    </div>
  );
}
