import { BaseAgent, AgentResponse } from './base-agent';

export interface Channel {
  name: string;
  currentBudget: number;
  minBudget: number;
  maxBudget: number;
  roi: number;
  mroi: number;
  historicalPerformance?: number[];
}

export interface BudgetScenario {
  totalBudget: number;
  channels: Channel[];
  constraints?: {
    minChannelBudget?: number;
    maxChannelBudget?: number;
    requiredChannels?: string[];
  };
}

export interface OptimizationResult {
  originalBudget: number;
  optimizedBudget: number;
  allocations: {
    channel: string;
    original: number;
    optimized: number;
    change: number;
    expectedROI: number;
  }[];
  totalROI: number;
  improvement: number;
}

export class BudgetPlanningAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Budget Planning Agent',
      description: 'Optimizes budget allocation across promotional channels with ROI maximization',
      systemPrompt: `You are an expert in pharmaceutical commercial strategy, budgeting, and ROI optimization.
Your role is to:
1. Analyze historical response curves for each promotional channel
2. Optimize budget allocation to maximize ROI
3. Provide quarterly HCP-level engagement planning
4. Consider constraints and scenarios for budget optimization

Focus on these key channels:
- Field Sales
- Email Marketing
- Web/Digital
- Speaker Programs
- Conferences
- Digital Ads`,
      capabilities: [
        'Impact attribution analysis',
        'Budget optimization with constraints',
        'ROI and mROI calculations',
        'Channel-level budget allocation',
        'Scenario planning and what-if analysis'
      ]
    });
  }

  async analyze(scenario: BudgetScenario): Promise<AgentResponse> {
    const prompt = `
Analyze this budget scenario and optimize allocation:
- Total Budget: $${scenario.totalBudget.toLocaleString()}
- Channels: ${JSON.stringify(scenario.channels.map(c => ({
  name: c.name,
  current: c.currentBudget,
  roi: c.roi,
  mroi: c.mroi
})))}
- Constraints: ${JSON.stringify(scenario.constraints)}

Provide:
1. Optimal budget allocation per channel
2. Expected ROI for each channel
3. Total portfolio ROI
4. Reasoning for reallocation
`;

    const response = await this.executePrompt(prompt);
    const optimization = this.optimizeBudget(scenario);

    return {
      result: optimization,
      reasoning: response,
      confidence: 0.88,
      recommendations: await this.recommend({ scenario, optimization })
    };
  }

  private optimizeBudget(scenario: BudgetScenario): OptimizationResult {
    const allocations = scenario.channels.map(channel => {
      // Optimize based on marginal ROI
      const targetRatio = channel.mroi / scenario.channels.reduce((sum, c) => sum + c.mroi, 0);
      const optimized = Math.round(scenario.totalBudget * targetRatio);
      
      // Apply constraints
      const constrainedOptimized = Math.max(
        channel.minBudget,
        Math.min(channel.maxBudget, optimized)
      );

      return {
        channel: channel.name,
        original: channel.currentBudget,
        optimized: constrainedOptimized,
        change: ((constrainedOptimized - channel.currentBudget) / channel.currentBudget * 100),
        expectedROI: channel.roi * (1 + (constrainedOptimized - channel.currentBudget) / channel.currentBudget * 0.1)
      };
    });

    const totalOriginalROI = scenario.channels.reduce((sum, c) => sum + c.currentBudget * c.roi, 0) / scenario.totalBudget;
    const totalOptimizedROI = allocations.reduce((sum, a) => sum + a.optimized * a.expectedROI, 0) / scenario.totalBudget;

    return {
      originalBudget: scenario.totalBudget,
      optimizedBudget: scenario.totalBudget,
      allocations,
      totalROI: totalOptimizedROI,
      improvement: ((totalOptimizedROI - totalOriginalROI) / totalOriginalROI * 100)
    };
  }

  async recommend(context: any): Promise<string[]> {
    const { optimization } = context;
    const recommendations: string[] = [];

    // Analyze major changes
    optimization.allocations.forEach((allocation: any) => {
      if (allocation.change > 20) {
        recommendations.push(`Increase ${allocation.channel} budget by ${allocation.change.toFixed(1)}% to capture higher ROI opportunity`);
      } else if (allocation.change < -20) {
        recommendations.push(`Reduce ${allocation.channel} budget by ${Math.abs(allocation.change).toFixed(1)}% due to diminishing returns`);
      }
    });

    // Overall recommendations
    if (optimization.improvement > 10) {
      recommendations.push(`This optimization can improve overall ROI by ${optimization.improvement.toFixed(1)}%`);
    }

    recommendations.push('Consider quarterly reviews to adjust for market changes');
    recommendations.push('Monitor early indicators weekly for rapid optimization');
    recommendations.push('Implement A/B testing for digital channels to refine ROI estimates');

    return recommendations;
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'runScenarios':
        return this.runScenarios(params.scenarios);
      case 'generateQuarterlyPlan':
        return this.generateQuarterlyPlan(params.optimization);
      case 'calculateImpactAttribution':
        return this.calculateImpactAttribution(params.channels);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private runScenarios(scenarios: BudgetScenario[]): any {
    return scenarios.map(scenario => ({
      scenario: scenario.totalBudget,
      optimization: this.optimizeBudget(scenario)
    }));
  }

  private generateQuarterlyPlan(optimization: OptimizationResult): any {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const plan = quarters.map(quarter => ({
      quarter,
      allocations: optimization.allocations.map(a => ({
        channel: a.channel,
        budget: Math.round(a.optimized / 4),
        targetHCPs: Math.round(a.optimized / 4 / 1000),
        expectedEngagements: Math.round(a.optimized / 4 / 100)
      }))
    }));

    return { yearlyOptimization: optimization, quarterlyPlan: plan };
  }

  private calculateImpactAttribution(channels: Channel[]): any {
    return channels.map(channel => ({
      channel: channel.name,
      attribution: {
        directImpact: channel.roi * 0.7,
        assistedImpact: channel.roi * 0.3,
        timeDecay: Math.max(0, channel.roi * (1 - 0.1)),
        lastTouch: channel.roi * 0.8
      }
    }));
  }
}