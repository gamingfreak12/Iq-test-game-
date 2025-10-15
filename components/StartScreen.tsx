
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.98-1.57A3 3 0 0 1 5 15.5V12c0-1.9.7-3.4 2-4.5s2-2 4.5-2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.98-1.57A3 3 0 0 0 19 15.5V12c0-1.9-.7-3.4-2-4.5s-2-2-4.5-2z" />
  </svg>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white p-8">
      <div className="mb-8">
        <BrainIcon className="w-24 h-24 text-purple-400 animate-pulse" />
      </div>
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
        IQ Visual Quiz
      </h1>
      <p className="text-lg text-gray-300 max-w-xl mb-8">
        Challenge your mind with AI-generated visual puzzles. Each question is a unique test of your logic and pattern recognition skills.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        Start the Challenge
      </button>
    </div>
  );
};

export default StartScreen;
