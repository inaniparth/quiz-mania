import React, { useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { setUserName, startQuizWithCategory } = useQuiz();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [rulesOpen, setRulesOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    if (!name.trim()) {
      setError("Please enter your name to continue");
      return;
    }
    
    // Validate category selection
    if (selectedCategory === null) {
      setError("Please select a topic to continue");
      return;
    }
    
    // Save name in context and start quiz with selected category directly
    setUserName(name.trim());
    startQuizWithCategory(selectedCategory);
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to <span className="text-gray-700">QUIZ</span><span className="text-pink-600">Mania</span>
        </h1>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-md p-4 mb-6">
        <p className="text-gray-700 mb-1">Please read all the rules about this quiz before you start.</p>
        <button 
          onClick={() => setRulesOpen(true)} 
          className="text-pink-600 font-medium bg-transparent border-none p-0 cursor-pointer"
        >
          Quiz rules
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <Input
            id="fullName"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Please select topic to continue</p>
          <RadioGroup className="grid grid-cols-2 gap-4" onValueChange={(value) => setSelectedCategory(Number(value))}>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="javascript" />
                <Label htmlFor="javascript">Javascript Basic</Label>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="react" />
                <Label htmlFor="react">React.js Advance</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <Button 
          type="submit" 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 rounded-md"
        >
          Start Quiz
        </Button>
      </form>
    </div>
  );
}