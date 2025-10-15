
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.NUMBER },
    question: { type: Type.STRING },
    imagePrompt: { 
      type: Type.STRING,
      description: "A detailed, descriptive prompt for a text-to-image model to generate a visual puzzle that is essential to solving the question. The image should be abstract, geometric, or symbolic."
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    correctAnswer: { type: Type.STRING }
  },
  required: ['id', 'question', 'imagePrompt', 'options', 'correctAnswer']
};


export async function generateQuizData(): Promise<QuizQuestion[]> {
  try {
    const prompt = `Generate ${TOTAL_QUESTIONS} unique and challenging IQ test questions suitable for a general audience. The questions should cover various types of intelligence like logical reasoning, spatial awareness, and pattern recognition.
    For each question, provide a JSON object adhering to the specified schema. Ensure the entire output is a valid JSON array of these objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: quizQuestionSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Failed to generate valid quiz questions.");
    }
    
    return questions;
  } catch (error) {
    console.error("Error generating quiz data:", error);
    throw new Error("Could not generate the quiz. Please try again.");
  }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image generated from prompt.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Could not generate the visual for the question.");
    }
}
