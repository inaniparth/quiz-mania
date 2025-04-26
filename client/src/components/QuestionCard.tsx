import { Question } from "@shared/models";

interface QuestionCardProps {
  question: Question;
  selectedOptionId: number | null;
  onSelectOption: (optionId: number) => void;
}

export default function QuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
}: QuestionCardProps) {
  // Get option status for styling - modified to never show correct/incorrect answers
  const getOptionStatus = (optionId: number) => {
    // Always use selected/idle status, never show correct/incorrect
    return optionId === selectedOptionId ? "selected" : "idle";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-1">
          <span className="mr-2">{question.id}.</span>
          {question.text}
        </h3>
      </div>
      
      <div className="space-y-3">
        {question.options.map((option) => {
          const status = getOptionStatus(option.id);
          
          return (
            <div
              key={option.id}
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                selectedOptionId === option.id 
                  ? 'border-pink-600 bg-white' 
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => onSelectOption(option.id)}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex-shrink-0 relative">
                  {selectedOptionId === option.id ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border-2 border-pink-600 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-pink-600 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
                <span className="text-gray-700">{option.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
