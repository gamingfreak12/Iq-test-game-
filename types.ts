
export interface QuizQuestion {
  id: number;
  question: string;
  imagePrompt: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizQuestionWithImage extends QuizQuestion {
  imageUrl: string;
}
