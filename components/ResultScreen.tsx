
import React from 'react';
import { TOTAL_QUESTIONS } from '../constants';

interface ResultScreenProps {
  score: number;
  onRestart: () => void;
}

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);


const ResultScreen: React.FC<ResultScreenProps> = ({ score, onRestart }) => {
  const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
  let message = "Good effort!";
  if (percentage > 80) {
    message = "Excellent work!";
  } else if (percentage > 50) {
    message = "Not bad at all!";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center text-white p-8">
      <div className="mb-6">
        <TrophyIcon className="w-24 h-24 text-yellow-400" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
      <p className="text-2xl text-gray-300 mb-6">{message}</p>
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
        <p className="text-lg text-gray-400 mb-2">Your Final Score</p>
        <p className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 mb-4">
          {score} / {TOTAL_QUESTIONS}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultScreen;
