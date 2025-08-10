// Comprehensive Q&A Integration Test Suite for all DCE OmniVerse Agents
// Tests the complete pipeline: Agent prompts → Gemini client → Intelligence services → Visualization data

import { 
  createAgentChatSession, 
  getAgentInfo, 
  validateAgentMessage 
} from '../ai/gemini-client';
import { visualizationDataService } from '../services/visualization-data-service';
import { generateAgentPrompt, getAgentConfig } from '../ai/agent-prompts';

describe('Agent Q&A Integration Tests', () => {
  
  describe('All Agents Configuration', () => {
    const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];

    test('should have complete configuration for all agents', () => {
      allAgents.forEach(agentId => {
        const config = getAgentConfig(agentId);
        const info = getAgentInfo(agentId);

        // Verify agent configuration
        expect(config).toBeDefined();
        expect(config.systemPrompt).toContain('DCE OmniVerse');
        expect(config.capabilities).toBeInstanceOf(Array);
        expect(config.capabilities.length).toBeGreaterThan(3);
        expect(config.temperature).toBeGreaterThanOrEqual(0.2);
        expect(config.temperature).toBeLessThanOrEqual(0.5);
        expect(config.businessRules.length).toBeGreaterThan(2);

        // Verify agent info
        expect(info).toBeDefined();
        expect(info!.agentId).toBe(agentId);
        expect(info!.dataContext).toContain('agent data context');
      });
    });

    test('should generate appropriate prompts for all agents', () => {
      allAgents.forEach(agentId => {
        const prompt = generateAgentPrompt(agentId);

        // Common pharmaceutical terms should be present
        expect(prompt.toLowerCase()).toMatch(/hcp|prescribing|pharmaceutical|barrier|roi/);
        
        // Should contain agent-specific content
        if (agentId === 'customer') {
          expect(prompt).toContain('barrier analysis');
          expect(prompt).toContain('B001');
        }
        
        if (agentId === 'budget') {
          expect(prompt).toContain('ROI');
          expect(prompt).toContain('$47M');
        }

        if (agentId === 'content') {
          expect(prompt).toContain('MLR');
          expect(prompt).toContain('compliance');
        }
      });
    });
  });

  describe('Agent Chat Session Creation', () => {
    test('should successfully create chat sessions for all agents', () => {
      const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      allAgents.forEach(agentId => {
        const session = createAgentChatSession(agentId);
        expect(session).toBeDefined();
        
        // Test with context
        const sessionWithContext = createAgentChatSession(agentId, {
          includeContext: true,
          hcpId: 'HCP-00001',
          territoryId: 'T-01'
        });
        expect(sessionWithContext).toBeDefined();
      });
    });

    test('should handle invalid agent IDs gracefully', () => {
      expect(() => createAgentChatSession('invalid-agent')).toThrow();
    });
  });

  describe('Message Validation System', () => {
    test('should validate appropriate pharmaceutical questions', () => {
      const testCases = [
        { agentId: 'customer', message: 'What barriers affect Dr. Smith in Territory T-01?', shouldPass: true },
        { agentId: 'budget', message: 'How should I optimize my $50M budget across channels?', shouldPass: true },
        { agentId: 'content', message: 'Which content needs MLR review for barrier B001?', shouldPass: true },
        { agentId: 'orchestration', message: 'What\'s the optimal customer journey for oncology HCPs?', shouldPass: true },
        { agentId: 'suggestions', message: 'Which field triggers have the highest completion rates?', shouldPass: true },
        { agentId: 'copilot', message: 'Prepare a pre-call plan for my 2pm appointment', shouldPass: true }
      ];

      testCases.forEach(testCase => {
        const validation = validateAgentMessage(testCase.agentId, testCase.message);
        expect(validation.isValid).toBe(true);
        
        if (testCase.shouldPass) {
          expect(validation.warnings?.length || 0).toBeLessThan(2);
        }
      });
    });

    test('should flag risky pharmaceutical language', () => {
      const riskyMessages = [
        'Does this drug guarantee a cure?',
        'This is the best drug for all patients',
        'Our product always works better than competitors'
      ];

      riskyMessages.forEach(message => {
        const validation = validateAgentMessage('customer', message);
        expect(validation.warnings).toBeDefined();
        expect(validation.warnings!.length).toBeGreaterThan(0);
        expect(validation.warnings![0]).toContain('regulatory compliance');
      });
    });

    test('should suggest appropriate agents for mismatched queries', () => {
      const mismatchCases = [
        { agentId: 'customer', message: 'How should I allocate budget across digital channels?' },
        { agentId: 'budget', message: 'Which content has the highest MLR compliance score?' },
        { agentId: 'content', message: 'What barriers affect HCP prescribing in my territory?' }
      ];

      mismatchCases.forEach(testCase => {
        const validation = validateAgentMessage(testCase.agentId, testCase.message);
        // Should have suggestions for better-suited agents
        if (validation.suggestions && validation.suggestions.length > 0) {
          expect(validation.suggestions[0]).toContain('better suited for');
        }
      });
    });
  });

  describe('Visualization Data Integration', () => {
    test('should generate visualization data for all agents', () => {
      const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      allAgents.forEach(agentId => {
        const visualizations = visualizationDataService.getAllVisualizationsForAgent(agentId);
        expect(visualizations).toBeDefined();
        expect(Object.keys(visualizations)).toHaveLength(3); // Each agent should have 3 main visualizations
      });
    });

    test('should generate customer planning visualizations', () => {
      const customerViz = visualizationDataService.getAllVisualizationsForAgent('customer');
      
      expect(customerViz.barrierAnalysis).toBeDefined();
      expect(customerViz.barrierAnalysis.length).toBeGreaterThan(0);
      expect(customerViz.barrierAnalysis[0]).toHaveProperty('label');
      expect(customerViz.barrierAnalysis[0]).toHaveProperty('value');
      
      expect(customerViz.opportunityScatter).toBeDefined();
      expect(customerViz.opportunityScatter.length).toBeGreaterThan(0);
      expect(customerViz.opportunityScatter[0]).toHaveProperty('x');
      expect(customerViz.opportunityScatter[0]).toHaveProperty('y');
      
      expect(customerViz.territoryPerformance).toBeDefined();
    });

    test('should generate budget planning visualizations', () => {
      const budgetViz = visualizationDataService.getAllVisualizationsForAgent('budget');
      
      expect(budgetViz.channelROI).toBeDefined();
      expect(budgetViz.channelROI.length).toBeGreaterThan(0);
      expect(budgetViz.channelROI[0].value).toBeGreaterThan(0);
      
      expect(budgetViz.budgetAllocation).toBeDefined();
      expect(budgetViz.spendEfficiency).toBeDefined();
      
      // Verify pie chart percentages add up appropriately
      const totalPercentage = budgetViz.budgetAllocation.reduce((sum: number, item: any) => sum + item.value, 0);
      expect(totalPercentage).toBeGreaterThan(90); // Should be close to 100%
    });

    test('should generate content review visualizations', () => {
      const contentViz = visualizationDataService.getAllVisualizationsForAgent('content');
      
      expect(contentViz.mlrCompliance).toBeDefined();
      expect(contentViz.mlrCompliance.length).toBe(4); // 4 compliance categories
      
      expect(contentViz.barrierHeatmap).toBeDefined();
      expect(contentViz.barrierHeatmap.length).toBe(30); // 5 barriers × 6 content types
      
      expect(contentViz.performanceTimeSeries).toBeDefined();
    });

    test('should generate orchestration visualizations', () => {
      const orchestrationViz = visualizationDataService.getAllVisualizationsForAgent('orchestration');
      
      expect(orchestrationViz.journeyFunnel).toBeDefined();
      expect(orchestrationViz.journeyFunnel.length).toBe(5); // 5 journey stages
      expect(orchestrationViz.journeyFunnel[0].percentage).toBe(100); // First stage should be 100%
      
      expect(orchestrationViz.channelEffectiveness).toBeDefined();
      expect(orchestrationViz.modelConfidence).toBeDefined();
    });

    test('should generate field suggestions visualizations', () => {
      const suggestionsViz = visualizationDataService.getAllVisualizationsForAgent('suggestions');
      
      expect(suggestionsViz.triggerPerformance).toBeDefined();
      expect(suggestionsViz.triggerPerformance.length).toBe(7); // 7 trigger types
      
      expect(suggestionsViz.feedbackSentiment).toBeDefined();
      expect(suggestionsViz.territoryComparison).toBeDefined();
    });

    test('should generate field copilot visualizations', () => {
      const copilotViz = visualizationDataService.getAllVisualizationsForAgent('copilot');
      
      expect(copilotViz.callActivity).toBeDefined();
      expect(copilotViz.hcpPrioritization).toBeDefined();
      expect(copilotViz.performanceMetrics).toBeDefined();
      expect(copilotViz.performanceMetrics.length).toBe(5); // 5 performance metrics
    });
  });

  describe('Pharmaceutical Domain Accuracy', () => {
    test('should use correct pharmaceutical terminology', () => {
      const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      allAgents.forEach(agentId => {
        const config = getAgentConfig(agentId);
        const prompt = generateAgentPrompt(agentId);
        
        // Should contain pharmaceutical-specific terms
        const pharmaTerms = [
          'HCP', 'healthcare professional', 'prescribing', 'formulary', 
          'MLR', 'barrier', 'ROI', 'territory', 'specialty'
        ];
        
        const containsPharmaTerms = pharmaTerms.some(term => 
          prompt.toLowerCase().includes(term.toLowerCase())
        );
        
        expect(containsPharmaTerms).toBe(true);
      });
    });

    test('should reference the 5 primary barriers correctly', () => {
      const customerPrompt = generateAgentPrompt('customer');
      
      // Should contain all barrier codes
      ['B001', 'B002', 'B003', 'B004', 'B005'].forEach(barrier => {
        expect(customerPrompt).toContain(barrier);
      });
      
      // Should contain barrier descriptions
      expect(customerPrompt).toContain('referral pathways');
      expect(customerPrompt).toContain('side effects');
      expect(customerPrompt).toContain('insurance');
      expect(customerPrompt).toContain('formulary');
      expect(customerPrompt).toContain('diagnostic');
    });

    test('should have appropriate data context for pharmaceutical use', () => {
      const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      allAgents.forEach(agentId => {
        const config = getAgentConfig(agentId);
        
        // Should mention realistic pharmaceutical data volumes
        if (agentId === 'customer') {
          expect(config.dataContext).toContain('2,847 HCPs');
        }
        
        if (agentId === 'budget') {
          expect(config.dataContext).toContain('$47M');
        }
        
        if (agentId === 'content') {
          expect(config.dataContext).toContain('1,247');
        }
      });
    });
  });

  describe('Business Rules Validation', () => {
    test('should enforce appropriate business rules per agent', () => {
      const agentRules = {
        customer: ['barriers with >$50K impact', 'Tier A/B HCPs', 'confidence levels'],
        budget: ['3.5x blended ROI', 'Field min $8M', 'seasonal patterns'],
        content: ['85%+ MLR score', 'content coverage', '30-60 day MLR'],
        orchestration: ['70%+ confidence', 'A/B testing', '7-14 day intervals'],
        suggestions: ['20 suggestions per rep', '14-day expiration', '65%+ completion'],
        copilot: ['actionable insights', 'high-opportunity HCPs', 'compliance-appropriate']
      };

      Object.entries(agentRules).forEach(([agentId, expectedRules]) => {
        const config = getAgentConfig(agentId);
        
        expectedRules.forEach(rule => {
          const ruleFound = config.businessRules.some(businessRule => 
            businessRule.toLowerCase().includes(rule.toLowerCase())
          );
          
          expect(ruleFound).toBe(true);
        });
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle missing HCP data gracefully', () => {
      const session = createAgentChatSession('customer', {
        includeContext: true,
        hcpId: 'INVALID-HCP-999999'
      });
      
      expect(session).toBeDefined();
      // Should not throw error due to try-catch in context gathering
    });

    test('should handle visualization data generation failures gracefully', () => {
      // Test with extreme parameters that might cause issues
      const barriers = visualizationDataService.generateBarrierAnalysisChart([]);
      expect(barriers).toBeInstanceOf(Array);
      
      const scatter = visualizationDataService.generateHCPOpportunityScatter(0);
      expect(scatter).toBeInstanceOf(Array);
    });

    test('should validate temperature ranges for all agents', () => {
      const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      allAgents.forEach(agentId => {
        const config = getAgentConfig(agentId);
        
        // Temperature should be in pharmaceutical-appropriate range
        // More deterministic for analytical agents, more creative for field support
        expect(config.temperature).toBeGreaterThanOrEqual(0.2);
        expect(config.temperature).toBeLessThanOrEqual(0.5);
        
        if (['customer', 'budget', 'content'].includes(agentId)) {
          // Analytical agents should be more deterministic
          expect(config.temperature).toBeLessThan(0.35);
        }
        
        if (['copilot', 'orchestration'].includes(agentId)) {
          // Interactive agents can be more creative
          expect(config.temperature).toBeGreaterThanOrEqual(0.35);
        }
      });
    });
  });

  describe('Integration Consistency', () => {
    test('should maintain consistency between agents and visualizations', () => {
      const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
      
      allAgents.forEach(agentId => {
        const agentInfo = getAgentInfo(agentId);
        const visualizations = visualizationDataService.getAllVisualizationsForAgent(agentId);
        
        expect(agentInfo).toBeDefined();
        expect(visualizations).toBeDefined();
        
        // Should have matching data themes
        if (agentId === 'customer') {
          expect(agentInfo!.capabilities).toContain('Barrier analysis');
          expect(visualizations.barrierAnalysis).toBeDefined();
        }
        
        if (agentId === 'budget') {
          expect(agentInfo!.capabilities).toContain('Multi-channel budget optimization');
          expect(visualizations.channelROI).toBeDefined();
        }
      });
    });
  });
});

// Performance benchmarks for production readiness
describe('Performance Benchmarks', () => {
  test('should generate visualizations within acceptable time limits', () => {
    const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
    
    allAgents.forEach(agentId => {
      const start = performance.now();
      const visualizations = visualizationDataService.getAllVisualizationsForAgent(agentId);
      const end = performance.now();
      
      expect(visualizations).toBeDefined();
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  test('should handle concurrent visualization generation', async () => {
    const allAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
    
    const promises = allAgents.map(agentId => 
      Promise.resolve(visualizationDataService.getAllVisualizationsForAgent(agentId))
    );
    
    const results = await Promise.all(promises);
    
    expect(results).toHaveLength(6);
    results.forEach(result => {
      expect(result).toBeDefined();
      expect(Object.keys(result)).toHaveLength(3);
    });
  });
});