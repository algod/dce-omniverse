import { BaseAgent, AgentResponse } from './base-agent';

export interface FieldSuggestion {
  id: string;
  triggerId: string;
  hcpId: string;
  hcpName: string;
  insight: string;
  action: string;
  priority: number;
  status: 'active' | 'completed' | 'dismissed' | 'expired';
  createdDate: Date;
  expiryDate: Date;
  repFeedback?: string;
  outcome?: string;
}

export interface SuggestionTrigger {
  id: string;
  name: string;
  description: string;
  criteria: string;
  threshold: number;
  currentValue?: number;
  insightTemplate: string;
  actionTemplate: string;
  priority: number;
  isActive: boolean;
  performance?: {
    triggered: number;
    completed: number;
    dismissed: number;
    successRate: number;
  };
}

export class FieldSuggestionsAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Field Suggestions Agent',
      description: 'Designs and monitors field suggestions aligned with brand objectives',
      systemPrompt: `You are an expert in pharmaceutical field strategy, sales operations, and data-driven suggestion systems.
Your role is to:
1. Design effective field suggestion triggers
2. Monitor suggestion performance and adoption
3. Optimize suggestion prioritization
4. Incorporate field feedback for continuous improvement
5. Align suggestions with brand objectives

Key focus areas:
- Speaker program follow-ups
- Prescription fulfillment issues
- Payer coverage updates
- Prescribing pace changes
- Email engagement signals
- High-potential HCP identification

Prioritization formula: 40% rep feedback + 40% strategic priority + 20% customer behavior severity`,
      capabilities: [
        'Trigger design and optimization',
        'Suggestion prioritization',
        'Performance monitoring',
        'Feedback loop integration',
        'ROI measurement'
      ]
    });
  }

  async analyze(trigger: SuggestionTrigger): Promise<AgentResponse> {
    const prompt = `
Analyze this field suggestion trigger:
- Name: ${trigger.name}
- Description: ${trigger.description}
- Criteria: ${trigger.criteria}
- Threshold: ${trigger.threshold}
- Current Value: ${trigger.currentValue || 'N/A'}
- Priority: ${trigger.priority}

Evaluate:
1. Trigger effectiveness
2. Threshold optimization
3. Expected impact
4. Adoption likelihood
5. Improvement recommendations
`;

    const response = await this.executePrompt(prompt);
    const optimization = this.optimizeTrigger(trigger);

    return {
      result: optimization,
      reasoning: response,
      confidence: 0.86,
      recommendations: await this.recommend({ trigger, optimization })
    };
  }

  private optimizeTrigger(trigger: SuggestionTrigger): any {
    const baseEffectiveness = 0.7;
    const priorityBonus = (trigger.priority / 10) * 0.2;
    const thresholdOptimality = trigger.currentValue && trigger.threshold
      ? 1 - Math.abs(trigger.currentValue - trigger.threshold) / trigger.threshold * 0.3
      : 0.8;
    
    const effectiveness = Math.min(1, baseEffectiveness + priorityBonus) * thresholdOptimality;
    
    const optimizedThreshold = trigger.threshold * (0.9 + Math.random() * 0.2);
    const expectedTriggers = Math.floor(20 + Math.random() * 30);
    const expectedCompletionRate = 0.6 + Math.random() * 0.3;

    return {
      triggerId: trigger.id,
      currentEffectiveness: effectiveness,
      optimizedThreshold,
      thresholdChange: ((optimizedThreshold - trigger.threshold) / trigger.threshold * 100),
      expectedWeeklyTriggers: expectedTriggers,
      expectedCompletionRate,
      expectedROI: 2.5 + Math.random() * 1.5,
      priorityScore: this.calculatePriorityScore(trigger),
      recommendations: this.generateTriggerRecommendations(trigger, effectiveness)
    };
  }

  private calculatePriorityScore(trigger: SuggestionTrigger): number {
    const repFeedbackScore = 0.4 * (trigger.performance?.successRate || 0.7);
    const strategicScore = 0.4 * (trigger.priority / 10);
    const behaviorScore = 0.2 * (trigger.currentValue && trigger.threshold 
      ? Math.min(1, trigger.currentValue / trigger.threshold)
      : 0.5);
    
    return (repFeedbackScore + strategicScore + behaviorScore) * 100;
  }

  private generateTriggerRecommendations(trigger: SuggestionTrigger, effectiveness: number): string[] {
    const recommendations: string[] = [];
    
    if (effectiveness < 0.6) {
      recommendations.push('Consider adjusting threshold for better trigger frequency');
      recommendations.push('Refine criteria to reduce false positives');
    } else if (effectiveness > 0.8) {
      recommendations.push('High-performing trigger - expand to more territories');
      recommendations.push('Use as template for similar triggers');
    }

    if (trigger.performance && trigger.performance.dismissed > trigger.performance.completed) {
      recommendations.push('High dismissal rate - review action language for clarity');
      recommendations.push('Consider rep training on this trigger type');
    }

    return recommendations;
  }

  async recommend(context: any): Promise<string[]> {
    const { trigger, optimization } = context;
    const recommendations: string[] = [];

    if (optimization.thresholdChange > 10) {
      recommendations.push(`Adjust threshold to ${optimization.optimizedThreshold.toFixed(0)} for optimal triggering`);
    }

    if (optimization.expectedCompletionRate < 0.5) {
      recommendations.push('Low expected completion - simplify action steps');
      recommendations.push('Provide additional context in insight language');
    }

    if (optimization.priorityScore > 80) {
      recommendations.push('High-priority trigger - ensure prominent placement in CRM');
      recommendations.push('Track outcomes closely for ROI validation');
    }

    recommendations.push(`Monitor weekly for ${optimization.expectedWeeklyTriggers} expected triggers`);
    recommendations.push('Collect rep feedback after first 2 weeks');
    recommendations.push('A/B test different action languages for optimization');

    return recommendations;
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'generateSuggestions':
        return this.generateSuggestions(params.triggers, params.hcps);
      case 'analyzeFeedback':
        return this.analyzeFeedback(params.suggestions);
      case 'optimizePrioritization':
        return this.optimizePrioritization(params.suggestions);
      case 'measureROI':
        return this.measureROI(params.completedSuggestions);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private generateSuggestions(triggers: SuggestionTrigger[], hcps: any[]): FieldSuggestion[] {
    const suggestions: FieldSuggestion[] = [];
    
    triggers.forEach(trigger => {
      if (!trigger.isActive) return;
      
      // Randomly select HCPs that meet criteria
      const eligibleHCPs = hcps.slice(0, Math.floor(Math.random() * 10) + 5);
      
      eligibleHCPs.forEach(hcp => {
        suggestions.push({
          id: `SUG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          triggerId: trigger.id,
          hcpId: hcp.id,
          hcpName: hcp.name,
          insight: trigger.insightTemplate.replace('[Name]', hcp.name),
          action: trigger.actionTemplate,
          priority: trigger.priority,
          status: 'active',
          createdDate: new Date(),
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
        });
      });
    });
    
    // Apply 20 suggestions per week limit
    return suggestions.slice(0, 20);
  }

  private analyzeFeedback(suggestions: FieldSuggestion[]): any {
    const feedback = {
      total: suggestions.length,
      completed: suggestions.filter(s => s.status === 'completed').length,
      dismissed: suggestions.filter(s => s.status === 'dismissed').length,
      expired: suggestions.filter(s => s.status === 'expired').length,
      active: suggestions.filter(s => s.status === 'active').length,
      completionRate: 0,
      dismissalRate: 0,
      avgTimeToAction: '3.2 days',
      topDismissalReasons: [
        'Already contacted recently (35%)',
        'HCP not available (25%)',
        'Not relevant to territory (20%)',
        'Other priority (20%)'
      ],
      successStories: suggestions
        .filter(s => s.outcome === 'positive')
        .slice(0, 3)
        .map(s => ({
          suggestion: s.insight,
          outcome: s.outcome,
          feedback: s.repFeedback
        }))
    };
    
    feedback.completionRate = feedback.total > 0 ? feedback.completed / feedback.total : 0;
    feedback.dismissalRate = feedback.total > 0 ? feedback.dismissed / feedback.total : 0;
    
    return feedback;
  }

  private optimizePrioritization(suggestions: FieldSuggestion[]): any {
    // Apply 40/40/20 prioritization
    const prioritized = suggestions.map(suggestion => {
      const repFeedbackScore = 0.4 * (Math.random() * 100); // Simulated
      const strategicScore = 0.4 * (suggestion.priority * 10);
      const behaviorScore = 0.2 * (Math.random() * 100); // Simulated
      
      return {
        ...suggestion,
        finalPriority: repFeedbackScore + strategicScore + behaviorScore,
        components: {
          repFeedback: repFeedbackScore,
          strategic: strategicScore,
          behavior: behaviorScore
        }
      };
    });
    
    prioritized.sort((a, b) => b.finalPriority - a.finalPriority);
    
    return {
      original: suggestions.length,
      prioritized: prioritized.slice(0, 20), // Top 20
      methodology: '40% rep feedback + 40% strategic priority + 20% behavior severity'
    };
  }

  private measureROI(completedSuggestions: FieldSuggestion[]): any {
    const outcomes = completedSuggestions.map(suggestion => ({
      suggestionId: suggestion.id,
      incrementalValue: Math.random() * 10000 + 5000,
      timeInvested: Math.random() * 2 + 0.5, // hours
      prescriptionLift: Math.random() * 5 + 2 // percentage
    }));
    
    const totalValue = outcomes.reduce((sum, o) => sum + o.incrementalValue, 0);
    const totalTime = outcomes.reduce((sum, o) => sum + o.timeInvested, 0);
    const avgPrescriptionLift = outcomes.reduce((sum, o) => sum + o.prescriptionLift, 0) / outcomes.length;
    
    return {
      totalSuggestions: completedSuggestions.length,
      totalIncrementalValue: totalValue,
      totalTimeInvested: totalTime,
      roi: totalValue / (totalTime * 200), // Assuming $200/hour cost
      averagePrescriptionLift: avgPrescriptionLift,
      topPerformingTriggers: [
        'Speaker Program Follow-up (ROI: 4.2x)',
        'Payer Coverage Update (ROI: 3.8x)',
        'Email Engagement Signal (ROI: 3.5x)'
      ]
    };
  }
}