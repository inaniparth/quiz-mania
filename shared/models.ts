export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  questionCount: number;
  timePerQuestion: number;
}

export type Question = {
  id: number;
  categoryId: number;
  options: {
      id: number;
      text: string;
  }[];
  text: string;
  correctOptionId: number;
}

export type QuizAnswer = {
  questionId: number;
  selectedOptionId: number | null;
  correct: boolean;
  isSkippedQuestion?: boolean;
};

export type QuizData = {
  categories: Category[];
  questions: {
    [categoryId: string]: Question[];
  };
};
