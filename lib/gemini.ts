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

export const geminiProWithTools = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
  tools: [
    {
      functionDeclarations: [
        {
          name: 'analyzeBarriers',
          description: 'Analyze HCP barriers and predict opportunity score',
          parameters: {
            type: 'object',
            properties: {
              hcpId: { type: 'string' },
              barriers: { 
                type: 'array',
                items: { type: 'string' }
              },
              prescribingHistory: { type: 'object' }
            },
            required: ['hcpId', 'barriers']
          }
        },
        {
          name: 'optimizeBudget',
          description: 'Optimize budget allocation across channels',
          parameters: {
            type: 'object',
            properties: {
              totalBudget: { type: 'number' },
              channels: {
                type: 'array',
                items: { type: 'string' }
              },
              constraints: { type: 'object' }
            },
            required: ['totalBudget', 'channels']
          }
        },
        {
          name: 'generateNBA',
          description: 'Generate Next Best Action for HCP',
          parameters: {
            type: 'object',
            properties: {
              hcpId: { type: 'string' },
              currentJourney: { type: 'array' },
              barriers: { type: 'array' }
            },
            required: ['hcpId']
          }
        }
      ]
    }
  ]
});

export async function streamGeminiResponse(prompt: string) {
  const result = await geminiPro.generateContentStream(prompt);
  return result.stream;
}