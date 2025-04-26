import React from "react";
import { useQuiz } from "@/context/QuizContext";
import QuizActive from "@/components/QuizActive";
import QuizResults from "@/components/QuizResults";
import Header from "@/components/Header";
import LandingPage from "../components/LandingPage";

export default function Quiz() {
  const { quizActive, quizComplete } = useQuiz();

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!quizActive && !quizComplete && <LandingPage />}
          {quizActive && <QuizActive />}
          {quizComplete && <QuizResults />}
        </div>
      </main>
    </div>
  );
}
