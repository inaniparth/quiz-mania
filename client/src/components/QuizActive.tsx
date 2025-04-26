import { useQuiz } from "@/context/QuizContext";
import { Question } from "@shared/models";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";

// Create a type for the question as it appears in the QuizData structure
type QuizDataQuestion = {
  id: number;
  text: string;
  options: { id: number; text: string }[];
  correctOptionId: number;
};

export default function QuizActive() {
  const {
    quizData,
    currentCategory,
    currentQuestionIndex,
    answers,
    quizActive,
    timeLeft,
    answerQuestion,
    goToNextQuestion,
    skipQuestion,
    resetQuiz,
  } = useQuiz();

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Get current question from the context
  const getCurrentQuestion = (): Question | null => {
    if (!quizData || !currentCategory) return null;

    const questions = quizData.questions[currentCategory.id.toString()];
    if (!questions || currentQuestionIndex >= questions.length) return null;

    // Add categoryId to match the Question type
    return {
      ...questions[currentQuestionIndex],
      categoryId: currentCategory.id,
    };
  };

  const currentQuestion = getCurrentQuestion();

  // Reset options when question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setShowAnswer(false);
  }, [currentQuestionIndex]);

  // Handle option selection
  const handleSelectOption = (optionId: number) => {
    if (!quizActive || !currentQuestion) return;

    // Just select the option without showing the answer
    setSelectedOptionId(optionId);
    // Don't show answer feedback
    setShowAnswer(false);
  };

  // Handle next question when user clicks Next button
  const handleNextQuestion = () => {
    if (selectedOptionId === null || !currentQuestion) return;

    // Submit the answer without showing the correct option
    answerQuestion(selectedOptionId);
  };

  if (!quizActive || !currentQuestion || !currentCategory) {
    return null;
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Question counter and timer */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-600">
          {currentQuestionIndex + 1}{" "}
          <span className="text-gray-500">
            /{currentCategory.questionCount}
          </span>
        </h2>
        <div className="text-base font-medium bg-gray-100 px-4 py-1 rounded-full">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-pink-600 rounded-full"
          style={{
            width: `${((currentQuestionIndex + 1) / currentCategory.questionCount) * 100}%`,
          }}
        ></div>
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelectOption={handleSelectOption}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 mb-8">
        <button
          type="button"
          onClick={skipQuestion}
          className={`text-gray-600 hover:text-gray-800 font-medium ${
            currentQuestionIndex === currentCategory.questionCount - 1 ? 'invisible' : ''
          }`}
        >
          Skip this question
        </button>

        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={selectedOptionId === null}
          className="px-8 py-3 rounded-md bg-pink-600 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === currentCategory.questionCount - 1
            ? "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
