import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'demo-key-please-add-real-key';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiPro = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
});

// Note: Function calling configuration can be added when needed
// For now, we'll use the standard model for the demo
export const geminiProWithTools = geminiPro;

export async function streamGeminiResponse(prompt: string) {
  const result = await geminiPro.generateContentStream(prompt);
  return result.stream;
}