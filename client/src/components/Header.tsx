import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";

export default function Header() {
  const { quizActive, resetQuiz } = useQuiz();
  
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="text-2xl font-bold">
                <span className="text-gray-700">QUIZ</span>
                <span className="text-pink-600">Mania</span>
              </h1>
            </div>
          </Link>
          
          {quizActive && (
            <Button 
              variant="outline" 
              onClick={resetQuiz}
              className="px-4 py-1 border border-pink-500 text-pink-600 rounded-md bg-white"
            >
              Exit Quiz
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
