
import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, QuizQuestionWithImage } from './types';
import { TOTAL_QUESTIONS } from './constants';
import { generateQuizData, generateImage } from './services/geminiService';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import Loader from './components/Loader';

type GameState = 'start' | 'loading' | 'playing' | 'finished' | 'error';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionWithImage, setCurrentQuestionWithImage] = useState<QuizQuestionWithImage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const startQuiz = useCallback(async () => {
    setGameState('loading');
    setError(null);
    try {
      const quizData = await generateQuizData();
      if (quizData.length < TOTAL_QUESTIONS) {
        throw new Error("Not enough questions generated.");
      }
      setQuestions(quizData);
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setGameState('error');
    }
  }, []);
  
  useEffect(() => {
    if (gameState === 'loading' && questions.length > 0) {
       setGameState('playing');
    }
  }, [gameState, questions]);

  useEffect(() => {
    const loadQuestionImage = async () => {
      if (gameState === 'playing' && questions[currentQuestionIndex]) {
        setImageLoading(true);
        setCurrentQuestionWithImage(null);
        try {
          const currentQ = questions[currentQuestionIndex];
          const imageUrl = await generateImage(currentQ.imagePrompt);
          setCurrentQuestionWithImage({ ...currentQ, imageUrl });
        } catch (err: any) {
          setError(err.message || 'Failed to load question image.');
          setGameState('error');
        } finally {
          setImageLoading(false);
        }
      }
    };
    loadQuestionImage();
  }, [gameState, questions, currentQuestionIndex]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameState('finished');
    }
  };

  const restartQuiz = () => {
    setGameState('start');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setError(null);
    setCurrentQuestionWithImage(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={startQuiz} />;
      case 'loading':
        return <Loader text="Preparing your challenge..." />;
      case 'playing':
        if (!currentQuestionWithImage) {
            return <Loader text="Loading question..." />;
        }
        return (
          <QuizScreen
            question={currentQuestionWithImage}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            score={score}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            imageLoading={imageLoading}
          />
        );
      case 'finished':
        return <ResultScreen score={score} onRestart={restartQuiz} />;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center text-white p-8">
            <h2 className="text-3xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-lg text-gray-300 mb-6">{error}</p>
            <button
              onClick={restartQuiz}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold text-lg rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans">
      <main className="container mx-auto p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
