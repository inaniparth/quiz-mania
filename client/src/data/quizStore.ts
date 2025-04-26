
import { QuizData } from "@shared/models";

class QuizStore {
  private observers: ((data: QuizData) => void)[] = [];
  private quizData: QuizData = {
    categories: [
      {
        id: 1,
        name: "JavaScript Basics",
        slug: "javascript",
        description: "Test your knowledge of JavaScript fundamentals, from variables to functions and beyond.",
        questionCount: 3,
        timePerQuestion: 10
      },
      {
        id: 2,
        name: "React Basics",
        slug: "react",
        description: "Learn about React's core concepts including components, props, state, and hooks.",
        questionCount: 3,
        timePerQuestion: 10
      }
    ],
    questions: {
      "1": [
        {
          id: 1,
          categoryId: 1,
          text: "What is the correct way to declare a variable in JavaScript?",
          options: [
            { id: 1, text: "var myVar = 10;" },
            { id: 2, text: "variable myVar = 10;" },
            { id: 3, text: "let myVar = 10;" },
            { id: 4, text: "int myVar = 10;" }
          ],
          correctOptionId: 3
        },
        {
          id: 2,
          categoryId: 1,
          text: "Which of the following is NOT a JavaScript data type?",
          options: [
            { id: 1, text: "String" },
            { id: 2, text: "Boolean" },
            { id: 3, text: "Float" },
            { id: 4, text: "Object" }
          ],
          correctOptionId: 3
        },
        {
          id: 3,
          categoryId: 1,
          text: "How do you create a function in JavaScript?",
          options: [
            { id: 1, text: "function = myFunction() {}" },
            { id: 2, text: "function myFunction() {}" },
            { id: 3, text: "function:myFunction() {}" },
            { id: 4, text: "create myFunction() {}" }
          ],
          correctOptionId: 2
        }
      ],
      "2": [
        {
          id: 1,
          categoryId: 2,
          text: "What is the purpose of React's useCallback hook?",
          options: [
            { id: 1, text: "To fetch data from an API" },
            { id: 2, text: "To memoize a value" },
            { id: 3, text: "To memoize a function" },
            { id: 4, text: "To create a ref" }
          ],
          correctOptionId: 3
        },
        {
          id: 2,
          categoryId: 2,
          text: "Which React hook is used for side-effects?",
          options: [
            { id: 1, text: "useEffect" },
            { id: 2, text: "useReducer" },
            { id: 3, text: "useMemo" },
            { id: 4, text: "useContext" }
          ],
          correctOptionId: 1
        },
        {
          id: 3,
          categoryId: 2,
          text: "What is a controlled component in React?",
          options: [
            { id: 1, text: "A component that controls other components" },
            { id: 2, text: "A component that uses refs" },
            { id: 3, text: "A form element whose value is controlled by React state" },
            { id: 4, text: "A component with propTypes" }
          ],
          correctOptionId: 3
        }
      ]
    }
  };

  subscribe(callback: (data: QuizData) => void) {
    this.observers.push(callback);
    callback(this.quizData);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  getQuizData(): QuizData {
    return this.quizData;
  }
}

export const quizStore = new QuizStore();
