import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'demo-key-please-add-real-key';

export const genAI = new GoogleGenerativeAI(API_KEY);

// Enhanced Gemini client configuration with streaming support
export const geminiProModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    candidateCount: 1,
    stopSequences: [],
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

export interface AgentChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatConfig {
  systemPrompt: string;
  agentId: string;
  conversationHistory?: AgentChatMessage[];
  temperature?: number;
}

export class AgentChatSession {
  private model: GenerativeModel;
  private chatSession: ChatSession | null = null;
  private systemPrompt: string;
  private agentId: string;
  private conversationHistory: AgentChatMessage[] = [];

  constructor(config: ChatConfig) {
    this.systemPrompt = config.systemPrompt;
    this.agentId = config.agentId;
    this.conversationHistory = config.conversationHistory || [];
    
    // Create model instance with custom temperature if provided
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: config.temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      systemInstruction: this.systemPrompt,
    });
  }

  async initializeChat(): Promise<void> {
    try {
      this.chatSession = this.model.startChat({
        history: this.conversationHistory,
      });
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      throw new Error('Chat session initialization failed');
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      await this.initializeChat();
    }

    try {
      const result = await this.chatSession!.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      
      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text }] }
      );

      return text;
    } catch (error) {
      console.error(`Agent ${this.agentId} chat error:`, error);
      throw new Error(`Failed to get response from ${this.agentId} agent`);
    }
  }

  async *sendMessageStream(message: string): AsyncIterable<string> {
    if (!this.chatSession) {
      await this.initializeChat();
    }

    try {
      const result = await this.chatSession!.sendMessageStream(message);
      let fullResponse = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        yield chunkText;
      }

      // Update conversation history with complete response
      this.conversationHistory.push(
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: fullResponse }] }
      );
    } catch (error) {
      console.error(`Agent ${this.agentId} streaming error:`, error);
      throw new Error(`Streaming failed for ${this.agentId} agent`);
    }
  }

  getConversationHistory(): AgentChatMessage[] {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
    this.chatSession = null;
  }
}

// Rate limiting utilities
interface RateLimitState {
  requests: number;
  lastReset: number;
  blocked: boolean;
}

const rateLimitStates = new Map<string, RateLimitState>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 30;
const COOLDOWN_PERIOD = 5 * 1000; // 5 seconds

export function checkRateLimit(agentId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let state = rateLimitStates.get(agentId);

  if (!state) {
    state = { requests: 0, lastReset: now, blocked: false };
    rateLimitStates.set(agentId, state);
  }

  // Reset window if needed
  if (now - state.lastReset >= RATE_LIMIT_WINDOW) {
    state.requests = 0;
    state.lastReset = now;
    state.blocked = false;
  }

  // Check if currently blocked
  if (state.blocked && now - state.lastReset < COOLDOWN_PERIOD) {
    return { allowed: false, retryAfter: COOLDOWN_PERIOD - (now - state.lastReset) };
  }

  // Check request limit
  if (state.requests >= MAX_REQUESTS_PER_MINUTE) {
    state.blocked = true;
    return { allowed: false, retryAfter: COOLDOWN_PERIOD };
  }

  // Allow request and increment counter
  state.requests++;
  return { allowed: true };
}

// Retry logic with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) break;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Legacy compatibility export
export const geminiPro = geminiProModel;
export const geminiProWithTools = geminiProModel;

export async function streamGeminiResponse(prompt: string) {
  const result = await geminiProModel.generateContentStream(prompt);
  return result.stream;
}