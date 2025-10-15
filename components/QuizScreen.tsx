
import React, { useState, useEffect } from 'react';
import { QuizQuestionWithImage } from '../types';
import Loader from './Loader';

interface QuizScreenProps {
  question: QuizQuestionWithImage;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  imageLoading: boolean;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  score, 
  onAnswer, 
  onNext,
  imageLoading 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [question]);

  const handleAnswerClick = (option: string) => {
    if (selectedAnswer) return;

    const correct = option === question.correctAnswer;
    setSelectedAnswer(option);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-gray-700 hover:bg-purple-700';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-600';
    }
    if (option === selectedAnswer && !isCorrect) {
      return 'bg-red-600';
    }
    return 'bg-gray-700 opacity-50 cursor-not-allowed';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 text-white">
      <div className="flex justify-between items-center mb-6 font-semibold text-lg">
        <span className="px-3 py-1 bg-purple-800 rounded-full">Question {questionNumber}/{totalQuestions}</span>
        <span className="px-3 py-1 bg-indigo-800 rounded-full">Score: {score}</span>
      </div>
      
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6">
        <div className="aspect-square bg-gray-900 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          {imageLoading ? (
            <Loader text="Generating visual..." />
          ) : (
            question.imageUrl && <img src={question.imageUrl} alt="Visual Puzzle" className="w-full h-full object-contain" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">{question.question}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              disabled={!!selectedAnswer || imageLoading}
              className={`p-4 text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${getButtonClass(option)} ${!selectedAnswer && !imageLoading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {selectedAnswer && (
          <div className="mt-6 text-center">
            <button
              onClick={onNext}
              className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out"
            >
              {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
