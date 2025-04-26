import { QuizProvider } from "@/context/QuizContext";
import Quiz from "@/pages/Quiz";

function App() {
  
  return (
    <QuizProvider>
      <Quiz />
    </QuizProvider>
  );
}

export default App;
