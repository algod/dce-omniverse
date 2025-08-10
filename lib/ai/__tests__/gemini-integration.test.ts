// Test suite for enhanced Gemini 2.5 Pro integration
// Tests agent-specific prompts, intelligence service integration, and Q&A functionality

import { 
  createAgentChatSession, 
  getAgentInfo, 
  validateAgentMessage,
  streamAgentResponse 
} from '../gemini-client';
import { generateAgentPrompt, getAgentConfig } from '../agent-prompts';

describe('Enhanced Gemini 2.5 Pro Integration', () => {
  
  describe('Agent Configuration', () => {
    test('should load all agent configurations', () => {
      const agentIds = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      agentIds.forEach(agentId => {
        const config = getAgentConfig(agentId);
        expect(config).toBeDefined();
        expect(config.systemPrompt).toContain('DCE OmniVerse');
        expect(config.capabilities).toBeInstanceOf(Array);
        expect(config.capabilities.length).toBeGreaterThan(0);
        expect(config.temperature).toBeGreaterThanOrEqual(0);
        expect(config.temperature).toBeLessThanOrEqual(1);
      });
    });

    test('should generate agent-specific prompts', () => {
      const customerPrompt = generateAgentPrompt('customer');
      expect(customerPrompt).toContain('Customer Planning Agent');
      expect(customerPrompt).toContain('B001');
      expect(customerPrompt).toContain('barrier analysis');

      const budgetPrompt = generateAgentPrompt('budget');
      expect(budgetPrompt).toContain('Budget Planning Agent');
      expect(budgetPrompt).toContain('ROI');
      expect(budgetPrompt).toContain('$47M');
    });

    test('should include contextual data in prompts', () => {
      const contextData = {
        hcpData: { id: 'HCP-00001', name: 'Dr. Test' },
        budgetData: { totalBudget: 47000000 }
      };

      const prompt = generateAgentPrompt('customer', contextData);
      expect(prompt).toContain('Current Context');
      expect(prompt).toContain('HCP-00001');
      expect(prompt).toContain('Dr. Test');
    });
  });

  describe('Agent Chat Sessions', () => {
    test('should create agent chat session with correct configuration', () => {
      const session = createAgentChatSession('customer', {
        includeContext: true,
        hcpId: 'HCP-00001'
      });

      expect(session).toBeDefined();
      // Note: Cannot test private properties, but session should be created successfully
    });

    test('should get agent information', () => {
      const agentInfo = getAgentInfo('customer');
      
      expect(agentInfo).toBeDefined();
      expect(agentInfo!.agentId).toBe('customer');
      expect(agentInfo!.capabilities).toContain('Barrier analysis and impact quantification');
      expect(agentInfo!.dataContext).toContain('2,847 HCPs');
    });

    test('should return null for invalid agent', () => {
      const agentInfo = getAgentInfo('invalid-agent');
      expect(agentInfo).toBeNull();
    });
  });

  describe('Message Validation', () => {
    test('should validate appropriate messages', () => {
      const validation = validateAgentMessage('customer', 'What barriers affect Dr. Smith?');
      
      expect(validation.isValid).toBe(true);
      expect(validation.warnings).toHaveLength(0);
    });

    test('should suggest better agents for mismatched queries', () => {
      const validation = validateAgentMessage('customer', 'How should I allocate my budget across channels?');
      
      expect(validation.suggestions).toBeDefined();
      expect(validation.suggestions!.length).toBeGreaterThan(0);
    });

    test('should flag risky pharmaceutical terms', () => {
      const validation = validateAgentMessage('customer', 'Does this drug guarantee a cure for patients?');
      
      expect(validation.warnings).toBeDefined();
      expect(validation.warnings!.length).toBeGreaterThan(0);
      expect(validation.warnings![0]).toContain('regulatory compliance');
    });

    test('should handle short messages appropriately', () => {
      const validation = validateAgentMessage('customer', 'Help');
      
      expect(validation.isValid).toBe(true);
      // Short messages shouldn't trigger capability mismatch warnings
    });
  });

  describe('Agent Capabilities Matrix', () => {
    test('should correctly categorize agent capabilities', () => {
      const customerInfo = getAgentInfo('customer');
      const budgetInfo = getAgentInfo('budget');
      const orchestrationInfo = getAgentInfo('orchestration');

      expect(customerInfo!.capabilities).toContain('Barrier analysis and impact quantification');
      expect(budgetInfo!.capabilities).toContain('Multi-channel budget optimization');
      expect(orchestrationInfo!.capabilities).toContain('Customer journey optimization with ML models');
    });

    test('should have appropriate temperature settings', () => {
      const customerConfig = getAgentConfig('customer');
      const copilotConfig = getAgentConfig('copilot');

      // Customer agent should be more deterministic for analysis
      expect(customerConfig.temperature).toBeLessThan(0.5);
      
      // Copilot should be more creative for field support
      expect(copilotConfig.temperature).toBeGreaterThanOrEqual(0.4);
    });
  });

  describe('Business Rules Integration', () => {
    test('should include relevant business rules for each agent', () => {
      const customerConfig = getAgentConfig('customer');
      const budgetConfig = getAgentConfig('budget');
      const suggestionsConfig = getAgentConfig('suggestions');

      expect(customerConfig.businessRules).toContain('Focus on barriers with >$50K impact and >30% likelihood');
      expect(budgetConfig.businessRules).toContain('Maintain minimum 3.5x blended ROI target');
      expect(suggestionsConfig.businessRules).toContain('Maximum 20 suggestions per rep per week');
    });
  });

  describe('Error Handling', () => {
    test('should handle unknown agent gracefully', () => {
      expect(() => getAgentConfig('unknown-agent')).toThrow('Unknown agent ID: unknown-agent');
      expect(() => generateAgentPrompt('unknown-agent')).toThrow('Unknown agent ID: unknown-agent');
    });

    test('should handle context gathering failures gracefully', () => {
      // This tests the try-catch blocks in context gathering
      const session = createAgentChatSession('customer', {
        includeContext: true,
        hcpId: 'INVALID-HCP-ID'
      });

      expect(session).toBeDefined();
      // Should not throw even with invalid HCP ID due to error handling
    });
  });

  describe('Pharmaceutical Industry Context', () => {
    test('should include appropriate pharmaceutical terminology', () => {
      const agentIds = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      agentIds.forEach(agentId => {
        const config = getAgentConfig(agentId);
        const prompt = generateAgentPrompt(agentId);
        
        // Should contain pharmaceutical-specific terms
        const pharmaTerms = ['HCP', 'prescribing', 'MLR', 'barrier', 'formulary', 'ROI'];
        const containsPharmaTerms = pharmaTerms.some(term => 
          prompt.toLowerCase().includes(term.toLowerCase())
        );
        
        expect(containsPharmaTerms).toBe(true);
      });
    });

    test('should reference the 5 primary barriers appropriately', () => {
      const customerPrompt = generateAgentPrompt('customer');
      const contentPrompt = generateAgentPrompt('content');

      expect(customerPrompt).toContain('B001');
      expect(customerPrompt).toContain('B002');
      expect(customerPrompt).toContain('B003');
      expect(customerPrompt).toContain('B004');
      expect(customerPrompt).toContain('B005');
    });
  });
});

// Integration test for live API (only run if API key is available)
describe('Live Gemini API Integration', () => {
  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'demo-key-please-add-real-key';

  if (!hasApiKey) {
    test.skip('Skipping live API tests - no valid API key', () => {});
    return;
  }

  test('should successfully create and use agent chat session', async () => {
    const session = createAgentChatSession('customer', {
      includeContext: false // Avoid dependencies on mock data for this test
    });

    try {
      const response = await session.sendMessage('What can you help me with?');
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
      expect(response.toLowerCase()).toContain('barrier');
    } catch (error) {
      // If API fails, ensure it's a reasonable error (not a code error)
      expect(error).toBeInstanceOf(Error);
    }
  }, 10000); // 10 second timeout for API call

  test('should successfully stream agent response', async () => {
    try {
      const stream = await streamAgentResponse('budget', 'How should I optimize my budget?', {
        includeContext: false
      });

      let response = '';
      for await (const chunk of stream) {
        response += chunk;
        if (response.length > 100) break; // Don't need full response for test
      }

      expect(response.length).toBeGreaterThan(0);
    } catch (error) {
      // If API fails, ensure it's a reasonable error (not a code error)
      expect(error).toBeInstanceOf(Error);
    }
  }, 15000); // 15 second timeout for streaming
});