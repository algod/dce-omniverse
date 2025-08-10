import { 
  GoogleGenerativeAI, 
  GenerativeModel, 
  ChatSession,
  HarmCategory,
  HarmBlockThreshold 
} from '@google/generative-ai';
import { generateAgentPrompt, getAgentConfig } from './agent-prompts';
import { customerIntelligence } from '@/lib/services/customer-intelligence';
import { budgetIntelligence } from '@/lib/services/budget-intelligence';
import { contentIntelligence } from '@/lib/services/content-intelligence';
import { orchestrationIntelligence } from '@/lib/services/orchestration-intelligence';
import { suggestionsIntelligence } from '@/lib/services/suggestions-intelligence';
import { copilotIntelligence } from '@/lib/services/copilot-intelligence';

const API_KEY = process.env.GEMINI_API_KEY || 'demo-key-please-add-real-key';

export const genAI = new GoogleGenerativeAI(API_KEY);

// Enhanced Gemini 2.5 Pro client configuration optimized for pharmaceutical intelligence
export const geminiProModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-pro', // Gemini 2.5 Pro with 1M+ token context window and thinking capabilities
  generationConfig: {
    temperature: 0.3, // More deterministic for pharmaceutical analysis
    topK: 40,
    topP: 0.9,
    maxOutputTokens: 65536, // Leverage Gemini 2.5 Pro's higher output limit
    candidateCount: 1,
    stopSequences: [],
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

export interface AgentChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatConfig {
  systemPrompt?: string; // Optional - will use agent-specific prompt if not provided
  agentId: string;
  conversationHistory?: AgentChatMessage[];
  temperature?: number;
  includeContext?: boolean; // Whether to include intelligence service data
  hcpId?: string; // For HCP-specific context
  territoryId?: string; // For territory-specific context
}

export class AgentChatSession {
  private model: GenerativeModel;
  private chatSession: ChatSession | null = null;
  private systemPrompt: string;
  private agentId: string;
  private conversationHistory: AgentChatMessage[] = [];
  private config: ChatConfig;

  constructor(config: ChatConfig) {
    this.config = config;
    this.agentId = config.agentId;
    this.conversationHistory = config.conversationHistory || [];
    
    // Generate enhanced system prompt with agent-specific configuration
    this.systemPrompt = this.generateEnhancedPrompt(config);
    
    // Get agent-specific temperature or use default
    const agentConfig = getAgentConfig(config.agentId);
    const temperature = config.temperature || agentConfig.temperature;
    
    // Create model instance optimized for pharmaceutical intelligence
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 65536, // Leverage Gemini 2.5 Pro's higher output limit
        candidateCount: 1,
      },
      systemInstruction: this.systemPrompt,
    });
  }

  private generateEnhancedPrompt(config: ChatConfig): string {
    // Use provided prompt or generate agent-specific prompt
    if (config.systemPrompt) {
      return config.systemPrompt;
    }

    // Gather contextual data from intelligence services if requested
    let contextData: any = {};
    
    if (config.includeContext) {
      try {
        contextData = this.gatherContextualData(config);
      } catch (error) {
        console.warn(`Failed to gather context for agent ${config.agentId}:`, error);
      }
    }

    return generateAgentPrompt(config.agentId, contextData);
  }

  private gatherContextualData(config: ChatConfig): any {
    const context: any = {};

    // Gather basic agent-specific data (non-async for build simplicity)
    try {
      switch (this.agentId) {
        case 'customer':
          if (config.hcpId) {
            const barriers = customerIntelligence.analyzeBarriers(config.hcpId);
            context.hcpData = { barriers };
          }
          break;
        case 'budget':
          const budgetAnalysis = budgetIntelligence.optimizeBudget(47000000);
          context.budgetData = budgetAnalysis;
          break;
        case 'content':
          const contentAnalysis = contentIntelligence.analyzeContentLibrary();
          context.contentData = { analysis: contentAnalysis };
          break;
        case 'orchestration':
          if (config.hcpId) {
            const journey = orchestrationIntelligence.optimizeJourney(config.hcpId);
            context.journeyData = journey;
          }
          break;
        case 'suggestions':
          if (config.territoryId) {
            const analysis = suggestionsIntelligence.analyzeTerritoryTriggers(config.territoryId);
            context.territoryData = analysis;
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn(`Failed to gather context for agent ${this.agentId}:`, error);
    }

    return context;
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
      // Enhance message with agent-specific context if needed
      const enhancedMessage = this.enhanceMessage(message);
      
      const result = await this.chatSession!.sendMessage(enhancedMessage);
      const response = await result.response;
      const text = response.text();
      
      // Update conversation history with original message (not enhanced)
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

  private enhanceMessage(message: string): string {
    // Add agent-specific context hints for better responses
    const agentConfig = getAgentConfig(this.agentId);
    
    let enhancedMessage = message;
    
    // Add capability context for better understanding
    if (message.toLowerCase().includes('help') || message.toLowerCase().includes('what can you')) {
      enhancedMessage += `\n\nNote: I specialize in: ${agentConfig.capabilities.join(', ')}`;
    }

    // Add business rules context for decision-making questions
    if (message.toLowerCase().includes('should') || message.toLowerCase().includes('recommend')) {
      enhancedMessage += `\n\nConsider these business rules: ${agentConfig.businessRules.join('; ')}`;
    }

    return enhancedMessage;
  }

  async *sendMessageStream(message: string): AsyncIterable<string> {
    if (!this.chatSession) {
      await this.initializeChat();
    }

    try {
      // Enhance message with agent-specific context
      const enhancedMessage = this.enhanceMessage(message);
      
      const result = await this.chatSession!.sendMessageStream(enhancedMessage);
      let fullResponse = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        yield chunkText;
      }

      // Update conversation history with original message (not enhanced)
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

// Agent chat session factory with intelligence integration
export function createAgentChatSession(agentId: string, options?: {
  includeContext?: boolean;
  hcpId?: string;
  territoryId?: string;
  temperature?: number;
}): AgentChatSession {
  const config: ChatConfig = {
    agentId,
    includeContext: options?.includeContext || false,
    hcpId: options?.hcpId,
    territoryId: options?.territoryId,
    temperature: options?.temperature,
  };

  return new AgentChatSession(config);
}

// Enhanced streaming response with agent context
export async function streamAgentResponse(
  agentId: string, 
  message: string,
  options?: {
    includeContext?: boolean;
    hcpId?: string;
    territoryId?: string;
  }
): Promise<AsyncIterable<string>> {
  const session = createAgentChatSession(agentId, options);
  return session.sendMessageStream(message);
}

// Get agent capabilities and configuration
export function getAgentInfo(agentId: string) {
  try {
    const config = getAgentConfig(agentId);
    return {
      agentId,
      capabilities: config.capabilities,
      dataContext: config.dataContext,
      temperature: config.temperature,
      businessRules: config.businessRules
    };
  } catch (error) {
    return null;
  }
}

// Validate agent message for business context
export function validateAgentMessage(agentId: string, message: string): {
  isValid: boolean;
  suggestions?: string[];
  warnings?: string[];
} {
  const validation: { isValid: boolean; suggestions?: string[]; warnings?: string[] } = { 
    isValid: true, 
    suggestions: [], 
    warnings: [] 
  };
  
  try {
    const config = getAgentConfig(agentId);
    
    // Check if message aligns with agent capabilities
    const hasRelevantCapability = config.capabilities.some(cap => 
      message.toLowerCase().includes(cap.toLowerCase().split(' ')[0])
    );
    
    if (!hasRelevantCapability && message.length > 20) {
      validation.suggestions!.push(
        `This question might be better suited for: ${config.capabilities.slice(0, 2).join(', ')}`
      );
    }
    
    // Check for pharmaceutical compliance
    const riskyTerms = ['guarantee', 'cure', 'best drug', 'always works'];
    const hasRiskyTerms = riskyTerms.some(term => 
      message.toLowerCase().includes(term)
    );
    
    if (hasRiskyTerms) {
      validation.warnings!.push(
        'Question contains terms that may require regulatory compliance review'
      );
    }
    
  } catch (error) {
    validation.warnings!.push('Unable to validate message for this agent');
  }
  
  return validation;
}

// Legacy compatibility exports
export const geminiPro = geminiProModel;
export const geminiProWithTools = geminiProModel;

export async function streamGeminiResponse(prompt: string) {
  const result = await geminiProModel.generateContentStream(prompt);
  return result.stream;
}