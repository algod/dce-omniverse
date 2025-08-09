import { geminiPro } from '@/lib/gemini';

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
}

export interface AgentResponse {
  result: any;
  reasoning: string;
  confidence: number;
  recommendations: string[];
}

export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  protected async executePrompt(userPrompt: string): Promise<string> {
    const fullPrompt = `
System: You are ${this.config.name}, an AI agent for pharmaceutical omnichannel planning.
${this.config.systemPrompt}

User: ${userPrompt}

Provide a detailed, actionable response with clear reasoning.
`;

    const result = await geminiPro.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }

  abstract analyze(input: any): Promise<AgentResponse>;
  abstract recommend(context: any): Promise<string[]>;
  abstract execute(action: string, params: any): Promise<any>;

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description;
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }
}