import { quizStore } from "@/data/quizStore";
import { Category, Question, QuizAnswer, QuizData } from "@shared/models";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface QuizContextType {
  quizData: QuizData | null;
  currentCategory: Category | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  quizActive: boolean;
  quizComplete: boolean;
  timeLeft: number;
  userName: string;
  
  // Functions
  selectCategory: (categoryId: number) => void;
  startQuiz: () => void;
  startQuizWithCategory: (categoryId: number) => void;
  answerQuestion: (optionId: number) => void;
  goToNextQuestion: () => void;
  skipQuestion: () => void;
  resetQuiz: () => void;
  restartQuiz: () => void;
  saveResults: () => Promise<void>;
  setUserName: (name: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  // const { toast } = useToast();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [userName, setUserName] = useState<string>("");

  // Load quiz data from store on mount
  useEffect(() => {
    const unsubscribe = quizStore.subscribe((data) => {
      setQuizData(data);
    });
    return unsubscribe;
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizActive && !quizComplete) {
      if (timer) clearInterval(timer);
      
      setTimeLeft(10);
      
      const newTimer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up, auto-submit with no answer
            timeUpHandler();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      setTimer(newTimer);
      
      return () => {
        if (newTimer) clearInterval(newTimer);
      };
    }
  }, [quizActive, quizComplete, currentQuestionIndex]);

  // Function to handle time up
  const timeUpHandler = () => {
    if (timer) clearInterval(timer);
    
    // Record answer with null selection (no answer)
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      
      const newAnswer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOptionId: null,
        correct: false,
      };
      
      setAnswers((prev) => [...prev, newAnswer]);
      
      // Move to next question or end the quiz - immediately
      if (currentQuestionIndex < (currentCategory?.questionCount || 0) - 1) {
        // No delay - immediate progression
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setQuizActive(false);
        setQuizComplete(true);
      }
    }
  };

  // Select a category
  const selectCategory = (categoryId: number) => {
    if (!quizData) return;
    
    const selected = quizData.categories.find((cat) => cat.id === categoryId);
    if (selected) {
      setCurrentCategory(selected);
    }
  };

  // Start the quiz
  const startQuiz = () => {
    if (!currentCategory) return;
    
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizActive(true);
    setQuizComplete(false);
    setTimeLeft(10);
  };
  
  // Combined function to start quiz with a specific category
  const startQuizWithCategory = (categoryId: number) => {
    if (!quizData) return;
    
    // Find and set the category
    const selected = quizData.categories.find((cat) => cat.id === categoryId);
    if (!selected) return;
    
    // Set the category
    setCurrentCategory(selected);
    
    // Then start the quiz directly
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizActive(true);
    setQuizComplete(false);
    setTimeLeft(10);
  };

  // Answer the current question
  const answerQuestion = (optionId: number) => {
    if (!quizActive || !currentCategory) return;
    
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    if (timer) clearInterval(timer);
    
    const isCorrect = optionId === currentQuestion.correctOptionId;
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      correct: isCorrect,
    };
    
    setAnswers((prev) => [...prev, newAnswer]);
    
    // Move to next question or end the quiz - immediately
    if (currentQuestionIndex < currentCategory.questionCount - 1) {
      // Immediate progression - no delay to show answer
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizActive(false);
      setQuizComplete(true);
    }
  };

  // Get the current question
  const getCurrentQuestion = (): Question | null => {
    if (!quizData || !currentCategory) return null;
    
    const questions = quizData.questions[currentCategory.id.toString()];
    if (!questions || currentQuestionIndex >= questions.length) return null;
    
    // Add categoryId to match the Question type
    return {
      ...questions[currentQuestionIndex],
      categoryId: currentCategory.id
    };
  };

  // Go to the next question
  const goToNextQuestion = () => {
    if (!quizActive || !currentCategory) return;
    
    if (currentQuestionIndex < currentCategory.questionCount - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizActive(false);
      setQuizComplete(true);
    }
  };
  
  // Skip the current question
  const skipQuestion = () => {
    if (!quizActive || !currentCategory) return;
    
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    if (timer) clearInterval(timer);
    
    // Record skipped answer (no selection)
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: null,
      correct: false,
      isSkippedQuestion: true
    };
    
    setAnswers((prev) => [...prev, newAnswer]);
    
    // Move to the next question or complete quiz
    if (currentQuestionIndex < currentCategory.questionCount - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizActive(false);
      setQuizComplete(true);
    }
  };

  // Reset quiz state
  const resetQuiz = () => {
    if (timer) clearInterval(timer);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizActive(false);
    setQuizComplete(false);
    setTimeLeft(10);
  };

  // Restart current quiz
  const restartQuiz = () => {
    resetQuiz();
    startQuiz();
  };

  // Save quiz results locally
  const saveResults = async () => {
    if (!currentCategory) return;
    const score = answers.filter((answer) => answer.correct).length;
    console.log('result saved')
  };

  const value = {
    quizData,
    currentCategory,
    currentQuestionIndex,
    answers,
    quizActive,
    quizComplete,
    timeLeft,
    userName,
    selectCategory,
    startQuiz,
    startQuizWithCategory,
    answerQuestion,
    goToNextQuestion,
    skipQuestion,
    resetQuiz,
    restartQuiz,
    saveResults,
    setUserName,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
