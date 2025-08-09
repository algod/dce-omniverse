import { BaseAgent, AgentResponse } from './base-agent';
import { Channel, HCPOpportunity, HCP as HCPType } from '@/lib/types/pharma';

export interface BudgetAllocation {
  totalBudget: number;
  allocations: ChannelAllocation[];
  expectedROI: number;
  expectedMROI: number;
  incrementalRevenue: number;
  optimizationScenario: string;
}

export interface ChannelAllocation {
  channel: Channel;
  currentBudget: number;
  recommendedBudget: number;
  change: number;
  expectedROI: number;
  expectedMROI: number;
  saturationLevel: number;
  hcpReach: number;
  quarterlyDistribution: QuarterlyPlan[];
}

export interface QuarterlyPlan {
  quarter: string;
  budget: number;
  hcpTargets: number;
  touchpoints: number;
  expectedOutcome: number;
}

export interface ResponseCurve {
  channel: string;
  dataPoints: { spend: number; response: number; efficiency: number }[];
  saturationPoint: number;
  optimalRange: { min: number; max: number };
  currentPosition: number;
  recommendation: string;
}

export interface OptimizationScenario {
  name: string;
  description: string;
  constraints: ChannelConstraint[];
  objective: 'MaxROI' | 'MaxReach' | 'Balanced' | 'MinRisk';
  results?: BudgetAllocation;
}

export interface ChannelConstraint {
  channelId: string;
  min?: number;
  max?: number;
  fixed?: number;
  growthLimit?: number;
}

export interface ImpactAttribution {
  channel: string;
  historicalImpact: number;
  incrementalImpact: number;
  synergyEffect: number;
  confidence: number;
  methodology: string;
}

export class BudgetPlanningAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Budget Planning Agent',
      description: 'Optimizes budget allocation across promotional channels with advanced ROI modeling',
      systemPrompt: `You are an expert in pharmaceutical commercial strategy, budget optimization, and marketing mix modeling.
Your role is to:
1. Run impact attribution analysis to understand historical response curves for each channel
2. Consider HCP profile, barriers, and segment in optimization
3. Calculate ROI and mROI for each channel with diminishing returns modeling
4. Optimize budget allocation with multiple scenario planning
5. Break down to quarterly HCP-level engagement plans

Key channels to optimize:
- Field Sales (personal promotion)
- Email Marketing (Veeva, IQVIA)
- Web/Digital (HCP portals, programmatic)
- Speaker Programs (peer influence)
- Conferences (medical education)
- Non-Personal Promotion (samples, materials)

Apply advanced analytics including:
- Response curve modeling with saturation points
- Cross-channel synergy effects
- Time-decay attribution
- Competitive share of voice impact
- Seasonal and launch phase adjustments`,
      capabilities: [
        'Multi-channel budget optimization',
        'Response curve and saturation modeling',
        'ROI and mROI calculations',
        'Scenario planning and what-if analysis',
        'HCP-level engagement planning',
        'Impact attribution analysis',
        'Quarterly budget phasing'
      ]
    });
  }

  async analyze(input: any): Promise<AgentResponse> {
    const { channels, totalBudget, hcpOpportunities, constraints, scenario } = input;
    
    const prompt = `
Optimize pharmaceutical promotional budget allocation:
- Total Budget: $${totalBudget?.toLocaleString() || '15,000,000'}
- Channels: ${channels?.length || 6} channels
- Time Period: ${input.period || '2025'}
- Optimization Objective: ${scenario?.objective || 'MaxROI'}

Analyze:
1. Historical response curves and saturation points for each channel
2. Cross-channel synergies and cannibalization effects
3. HCP segment responsiveness to different channels
4. Competitive intensity and share of voice requirements
5. Compliance and regulatory constraints

Provide optimal allocation with expected ROI, mROI, and incremental revenue projections.
`;

    const response = await this.executePrompt(prompt);
    const impactAttribution = this.performImpactAttribution(channels);
    const responseCurves = this.generateResponseCurves(channels);
    const optimalAllocation = this.optimizeBudget(channels, totalBudget, constraints);
    const quarterlyPlan = this.generateQuarterlyPlan(optimalAllocation, hcpOpportunities);

    return {
      result: {
        allocation: optimalAllocation,
        impactAttribution,
        responseCurves,
        quarterlyPlan,
        scenarios: this.generateScenarios(channels, totalBudget)
      },
      reasoning: response,
      confidence: 0.92,
      recommendations: await this.recommend({ 
        allocation: optimalAllocation, 
        responseCurves,
        impactAttribution 
      })
    };
  }

  private performImpactAttribution(channels: Channel[]): ImpactAttribution[] {
    return channels.map(channel => {
      const baseImpact = channel.roi * channel.actualSpend;
      const incrementalRate = this.calculateIncrementalImpact(channel);
      const synergy = this.calculateSynergyEffect(channel, channels);
      
      return {
        channel: channel.name,
        historicalImpact: baseImpact,
        incrementalImpact: baseImpact * incrementalRate,
        synergyEffect: synergy,
        confidence: 0.75 + Math.random() * 0.2,
        methodology: 'Multi-touch attribution with time decay and synergy modeling'
      };
    });
  }

  private calculateIncrementalImpact(channel: Channel): number {
    // Calculate incremental impact based on saturation curve
    const utilizationRate = channel.actualSpend / channel.responseCurve.saturationPoint;
    if (utilizationRate < 0.5) return 1.2; // High incremental impact
    if (utilizationRate < 0.8) return 1.0; // Moderate incremental impact
    if (utilizationRate < 1.0) return 0.8; // Diminishing returns
    return 0.5; // Past saturation
  }

  private calculateSynergyEffect(channel: Channel, allChannels: Channel[]): number {
    // Calculate synergy with other channels
    let synergy = 1.0;
    
    if (channel.type === 'Personal' && allChannels.some(c => c.type === 'Digital')) {
      synergy *= 1.15; // Personal + Digital synergy
    }
    if (channel.type === 'Event' && allChannels.some(c => c.type === 'Personal')) {
      synergy *= 1.2; // Event + Field synergy
    }
    if (channel.name.includes('Email') && allChannels.some(c => c.name.includes('Web'))) {
      synergy *= 1.1; // Email + Web synergy
    }
    
    return synergy;
  }

  private generateResponseCurves(channels: Channel[]): ResponseCurve[] {
    return channels.map(channel => {
      const points = channel.responseCurve.points.map(p => ({
        spend: p.spend,
        response: p.response,
        efficiency: p.response / p.spend
      }));
      
      const currentEfficiency = channel.roi;
      const optimalEfficiency = Math.max(...points.map(p => p.efficiency));
      const currentPosition = (channel.actualSpend / channel.responseCurve.saturationPoint) * 100;
      
      let recommendation = '';
      if (currentPosition < 50) {
        recommendation = 'Significant growth opportunity - increase investment';
      } else if (currentPosition < 80) {
        recommendation = 'Optimal range - moderate increase recommended';
      } else if (currentPosition < 100) {
        recommendation = 'Approaching saturation - maintain or slight increase';
      } else {
        recommendation = 'Past saturation - reduce or reallocate budget';
      }
      
      return {
        channel: channel.name,
        dataPoints: points,
        saturationPoint: channel.responseCurve.saturationPoint,
        optimalRange: {
          min: channel.responseCurve.saturationPoint * 0.5,
          max: channel.responseCurve.saturationPoint * 0.85
        },
        currentPosition,
        recommendation
      };
    });
  }

  private optimizeBudget(
    channels: Channel[], 
    totalBudget: number, 
    constraints?: ChannelConstraint[]
  ): BudgetAllocation {
    const allocations: ChannelAllocation[] = [];
    let remainingBudget = totalBudget || 15000000;
    
    // Sort channels by efficiency at current spend level
    const sortedChannels = [...channels].sort((a, b) => b.mroi - a.mroi);
    
    // First pass: Allocate minimum budgets
    sortedChannels.forEach(channel => {
      const constraint = constraints?.find(c => c.channelId === channel.id);
      const minBudget = constraint?.min || channel.constraints.min;
      const allocation = Math.min(minBudget, remainingBudget);
      
      allocations.push({
        channel,
        currentBudget: channel.currentBudget,
        recommendedBudget: allocation,
        change: 0,
        expectedROI: 0,
        expectedMROI: 0,
        saturationLevel: 0,
        hcpReach: 0,
        quarterlyDistribution: []
      });
      
      remainingBudget -= allocation;
    });
    
    // Second pass: Optimize remaining budget based on mROI
    while (remainingBudget > 10000) {
      let bestChannelIndex = -1;
      let bestMROI = 0;
      
      allocations.forEach((alloc, index) => {
        const constraint = constraints?.find(c => c.channelId === alloc.channel.id);
        const maxBudget = constraint?.max || alloc.channel.constraints.max;
        
        if (alloc.recommendedBudget < maxBudget) {
          const marginalROI = this.calculateMarginalROI(
            alloc.channel, 
            alloc.recommendedBudget
          );
          
          if (marginalROI > bestMROI) {
            bestMROI = marginalROI;
            bestChannelIndex = index;
          }
        }
      });
      
      if (bestChannelIndex === -1 || bestMROI < 1.5) break; // Stop if no good opportunities
      
      const increment = Math.min(100000, remainingBudget);
      allocations[bestChannelIndex].recommendedBudget += increment;
      remainingBudget -= increment;
    }
    
    // Calculate final metrics
    let totalExpectedReturn = 0;
    allocations.forEach(alloc => {
      alloc.change = ((alloc.recommendedBudget - alloc.currentBudget) / alloc.currentBudget) * 100;
      alloc.expectedROI = this.calculateROI(alloc.channel, alloc.recommendedBudget);
      alloc.expectedMROI = this.calculateMarginalROI(alloc.channel, alloc.recommendedBudget);
      alloc.saturationLevel = (alloc.recommendedBudget / alloc.channel.responseCurve.saturationPoint) * 100;
      alloc.hcpReach = this.estimateHCPReach(alloc.channel, alloc.recommendedBudget);
      alloc.quarterlyDistribution = this.distributeQuarterly(alloc);
      
      totalExpectedReturn += alloc.recommendedBudget * alloc.expectedROI;
    });
    
    const totalAllocated = allocations.reduce((sum, a) => sum + a.recommendedBudget, 0);
    
    return {
      totalBudget: totalAllocated,
      allocations,
      expectedROI: totalExpectedReturn / totalAllocated,
      expectedMROI: this.calculatePortfolioMROI(allocations),
      incrementalRevenue: totalExpectedReturn - (totalAllocated * 2.5), // Baseline ROI of 2.5
      optimizationScenario: 'Optimal allocation based on marginal ROI'
    };
  }

  private calculateROI(channel: Channel, budget: number): number {
    // Calculate ROI with diminishing returns
    const utilization = budget / channel.responseCurve.saturationPoint;
    const baseROI = channel.roi;
    
    if (utilization <= 0.5) {
      return baseROI * 1.2; // Below optimal range - higher ROI
    } else if (utilization <= 0.85) {
      return baseROI; // Optimal range
    } else if (utilization <= 1.0) {
      return baseROI * (1 - (utilization - 0.85) * 2); // Approaching saturation
    } else {
      return baseROI * 0.5 * (1 / utilization); // Past saturation - steep decline
    }
  }

  private calculateMarginalROI(channel: Channel, currentBudget: number): number {
    const increment = 100000;
    const currentROI = this.calculateROI(channel, currentBudget);
    const incrementalROI = this.calculateROI(channel, currentBudget + increment);
    const marginalReturn = (incrementalROI * (currentBudget + increment)) - (currentROI * currentBudget);
    return marginalReturn / increment;
  }

  private calculatePortfolioMROI(allocations: ChannelAllocation[]): number {
    const totalMarginalReturn = allocations.reduce(
      (sum, a) => sum + (a.expectedMROI * a.recommendedBudget), 
      0
    );
    const totalBudget = allocations.reduce((sum, a) => sum + a.recommendedBudget, 0);
    return totalMarginalReturn / totalBudget;
  }

  private estimateHCPReach(channel: Channel, budget: number): number {
    // Estimate HCP reach based on channel and budget
    const costPerHCP = {
      'Field Sales': 500,
      'Email Marketing': 50,
      'Web/Digital': 75,
      'Speaker Programs': 2000,
      'Conferences': 1500,
      'Non-Personal Promotion': 100
    };
    
    const unitCost = costPerHCP[channel.name as keyof typeof costPerHCP] || 200;
    const reach = Math.floor(budget / unitCost);
    
    // Apply reach curve (not linear due to frequency)
    const reachEfficiency = Math.min(1, budget / (channel.responseCurve.saturationPoint * 0.7));
    return Math.floor(reach * reachEfficiency);
  }

  private distributeQuarterly(allocation: ChannelAllocation): QuarterlyPlan[] {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    const seasonality = [0.3, 0.25, 0.2, 0.25]; // Front-loaded for impact
    
    return quarters.map((quarter, i) => ({
      quarter,
      budget: allocation.recommendedBudget * seasonality[i],
      hcpTargets: Math.floor(allocation.hcpReach * seasonality[i]),
      touchpoints: Math.floor(allocation.hcpReach * seasonality[i] * 3), // Avg 3 touchpoints
      expectedOutcome: allocation.recommendedBudget * seasonality[i] * allocation.expectedROI
    }));
  }

  private generateQuarterlyPlan(
    allocation: BudgetAllocation, 
    hcpOpportunities?: HCPOpportunity[]
  ): any {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    
    return {
      totalAnnualBudget: allocation.totalBudget,
      quarters: quarters.map((q, i) => {
        const quarterlyBudget = allocation.totalBudget * [0.3, 0.25, 0.2, 0.25][i];
        const highValueHCPs = hcpOpportunities?.filter(h => h.priorityLevel === 'High').length || 30;
        
        return {
          quarter: q,
          budget: quarterlyBudget,
          channels: allocation.allocations.map(a => ({
            name: a.channel.name,
            budget: a.recommendedBudget * [0.3, 0.25, 0.2, 0.25][i],
            hcpTargets: Math.floor(a.hcpReach * [0.3, 0.25, 0.2, 0.25][i])
          })),
          focus: i === 0 ? 'Launch and awareness' : 
                 i === 1 ? 'Adoption acceleration' :
                 i === 2 ? 'Persistence and depth' :
                 'Loyalty and advocacy',
          highValueTargets: Math.floor(highValueHCPs * [0.4, 0.3, 0.2, 0.1][i]),
          expectedROI: allocation.expectedROI * [1.1, 1.0, 0.95, 0.9][i] // Declining ROI over time
        };
      })
    };
  }

  private generateScenarios(channels: Channel[], totalBudget: number): OptimizationScenario[] {
    const scenarios: OptimizationScenario[] = [
      {
        name: 'Maximum ROI',
        description: 'Optimize for highest return on investment',
        constraints: channels.map(c => ({ channelId: c.id })),
        objective: 'MaxROI'
      },
      {
        name: 'Maximum Reach',
        description: 'Optimize for maximum HCP coverage',
        constraints: channels.map(c => ({ 
          channelId: c.id,
          min: c.constraints.min,
          max: c.id.includes('Email') || c.id.includes('Web') ? c.constraints.max * 1.5 : c.constraints.max
        })),
        objective: 'MaxReach'
      },
      {
        name: 'Balanced Growth',
        description: 'Balance between ROI and reach with risk mitigation',
        constraints: channels.map(c => ({ 
          channelId: c.id,
          min: c.currentBudget * 0.8,
          max: c.currentBudget * 1.3,
          growthLimit: 0.3
        })),
        objective: 'Balanced'
      },
      {
        name: 'Digital First',
        description: 'Prioritize digital channels for efficiency',
        constraints: channels.map(c => ({ 
          channelId: c.id,
          min: c.type === 'Digital' ? c.currentBudget * 1.5 : c.constraints.min,
          max: c.type === 'Digital' ? c.constraints.max * 1.5 : c.currentBudget
        })),
        objective: 'MaxROI'
      },
      {
        name: 'Field Focused',
        description: 'Emphasize personal promotion for high-value targets',
        constraints: channels.map(c => ({ 
          channelId: c.id,
          min: c.type === 'Personal' ? c.currentBudget * 1.2 : c.constraints.min,
          max: c.type === 'Personal' ? c.constraints.max * 1.2 : c.currentBudget * 0.9
        })),
        objective: 'MaxROI'
      }
    ];
    
    // Calculate results for each scenario
    scenarios.forEach(scenario => {
      scenario.results = this.optimizeBudget(channels, totalBudget, scenario.constraints);
    });
    
    return scenarios;
  }

  async recommend(context: any): Promise<string[]> {
    const { allocation, responseCurves, impactAttribution } = context;
    const recommendations: string[] = [];
    
    // ROI-based recommendations
    if (allocation.expectedROI > 3.5) {
      recommendations.push(`Strong ROI of ${allocation.expectedROI.toFixed(1)}x expected - proceed with confidence`);
    } else if (allocation.expectedROI > 2.5) {
      recommendations.push(`Moderate ROI of ${allocation.expectedROI.toFixed(1)}x - consider optimization opportunities`);
    } else {
      recommendations.push('Below-target ROI - review channel mix and consider reallocation');
    }
    
    // Channel-specific recommendations
    allocation.allocations.forEach((alloc: any) => {
      if (alloc.change > 20) {
        recommendations.push(`Increase ${alloc.channel.name} budget by ${alloc.change.toFixed(0)}% to capture opportunity`);
      } else if (alloc.change < -20) {
        recommendations.push(`Reduce ${alloc.channel.name} budget by ${Math.abs(alloc.change).toFixed(0)}% due to saturation`);
      }
      
      if (alloc.saturationLevel > 90) {
        recommendations.push(`${alloc.channel.name} approaching saturation - explore new channels or tactics`);
      } else if (alloc.saturationLevel < 50) {
        recommendations.push(`${alloc.channel.name} has significant growth potential - test incremental investment`);
      }
    });
    
    // Synergy recommendations
    const highSynergyChannels = impactAttribution.filter((ia: any) => ia.synergyEffect > 1.1);
    if (highSynergyChannels.length > 0) {
      recommendations.push(`Leverage synergies between ${highSynergyChannels.map((c: any) => c.channel).join(' and ')}`);
    }
    
    // Response curve insights
    const underutilized = responseCurves.filter((rc: any) => rc.currentPosition < 50);
    if (underutilized.length > 0) {
      recommendations.push(`Growth opportunity in: ${underutilized.map((rc: any) => rc.channel).join(', ')}`);
    }
    
    // Strategic recommendations
    recommendations.push('Implement monthly budget reviews to capture emerging opportunities');
    recommendations.push('Test and learn with 10% of budget for innovative channels');
    recommendations.push('Coordinate channel timing for maximum synergy effect');
    
    return recommendations.slice(0, 10);
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'runScenario':
        return this.runWhatIfScenario(params.channels, params.scenario);
      case 'compareScenarios':
        return this.compareScenarios(params.scenarios);
      case 'sensitivityAnalysis':
        return this.performSensitivityAnalysis(params.channels, params.budget);
      case 'channelDeepDive':
        return this.analyzeChannelPerformance(params.channel, params.historicalData);
      case 'hcpLevelPlanning':
        return this.generateHCPLevelPlan(params.allocation, params.hcps, params.opportunities);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private runWhatIfScenario(channels: Channel[], scenario: OptimizationScenario): any {
    const result = this.optimizeBudget(
      channels, 
      scenario.results?.totalBudget || 15000000, 
      scenario.constraints
    );
    
    return {
      scenario: scenario.name,
      results: result,
      comparison: {
        currentROI: channels.reduce((sum, c) => sum + c.roi * c.currentBudget, 0) / 
                    channels.reduce((sum, c) => sum + c.currentBudget, 0),
        scenarioROI: result.expectedROI,
        roiImprovement: ((result.expectedROI / 2.5) - 1) * 100,
        budgetEfficiency: result.expectedROI / (result.totalBudget / 1000000)
      },
      risks: this.identifyRisks(result),
      opportunities: this.identifyOpportunities(result)
    };
  }

  private compareScenarios(scenarios: OptimizationScenario[]): any {
    const comparison = scenarios.map(scenario => ({
      name: scenario.name,
      totalBudget: scenario.results?.totalBudget || 0,
      expectedROI: scenario.results?.expectedROI || 0,
      expectedMROI: scenario.results?.expectedMROI || 0,
      incrementalRevenue: scenario.results?.incrementalRevenue || 0,
      riskScore: this.calculateRiskScore(scenario.results),
      feasibilityScore: this.calculateFeasibilityScore(scenario)
    }));
    
    const bestROI = comparison.reduce((best, current) => 
      current.expectedROI > best.expectedROI ? current : best
    );
    
    const bestBalance = comparison.reduce((best, current) => {
      const currentScore = current.expectedROI * 0.4 + 
                          (10 - current.riskScore) * 0.3 + 
                          current.feasibilityScore * 0.3;
      const bestScore = best.expectedROI * 0.4 + 
                       (10 - best.riskScore) * 0.3 + 
                       best.feasibilityScore * 0.3;
      return currentScore > bestScore ? current : best;
    });
    
    return {
      scenarios: comparison,
      recommendations: {
        bestROI: bestROI.name,
        mostBalanced: bestBalance.name,
        analysis: 'Consider organizational readiness and risk tolerance when selecting scenario'
      }
    };
  }

  private performSensitivityAnalysis(channels: Channel[], baseBudget: number): any {
    const variations = [-0.2, -0.1, 0, 0.1, 0.2]; // ±20% variations
    const results = variations.map(variation => {
      const adjustedBudget = baseBudget * (1 + variation);
      const allocation = this.optimizeBudget(channels, adjustedBudget);
      
      return {
        budgetChange: `${(variation * 100).toFixed(0)}%`,
        totalBudget: adjustedBudget,
        expectedROI: allocation.expectedROI,
        expectedMROI: allocation.expectedMROI,
        incrementalRevenue: allocation.incrementalRevenue
      };
    });
    
    return {
      analysis: results,
      insights: {
        roiSensitivity: this.calculateSensitivity(results, 'expectedROI'),
        revenueSensitivity: this.calculateSensitivity(results, 'incrementalRevenue'),
        optimalBudgetRange: {
          min: baseBudget * 0.9,
          max: baseBudget * 1.15,
          sweet_spot: baseBudget * 1.05
        }
      }
    };
  }

  private analyzeChannelPerformance(channel: Channel, historicalData?: any): any {
    const monthlyPerformance = Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      spend: channel.currentBudget / 12 * (0.8 + Math.random() * 0.4),
      impressions: Math.floor(10000 + Math.random() * 50000),
      engagements: Math.floor(500 + Math.random() * 2000),
      conversions: Math.floor(50 + Math.random() * 200),
      roi: 2 + Math.random() * 2
    }));
    
    return {
      channel: channel.name,
      performance: {
        current: {
          budget: channel.currentBudget,
          roi: channel.roi,
          mroi: channel.mroi,
          utilization: (channel.actualSpend / channel.responseCurve.saturationPoint) * 100
        },
        historical: monthlyPerformance,
        trends: {
          roiTrend: 'Stable',
          efficiencyTrend: 'Improving',
          saturationRisk: channel.actualSpend > channel.responseCurve.saturationPoint * 0.8 ? 'High' : 'Low'
        }
      },
      recommendations: [
        `Optimal spend range: $${(channel.responseCurve.saturationPoint * 0.5).toLocaleString()} - $${(channel.responseCurve.saturationPoint * 0.85).toLocaleString()}`,
        `Current efficiency: ${channel.mroi.toFixed(2)}x marginal ROI`,
        channel.actualSpend < channel.responseCurve.saturationPoint * 0.7 ? 
          'Increase investment to capture growth opportunity' : 
          'Maintain current levels or test reduction'
      ]
    };
  }

  private generateHCPLevelPlan(
    allocation: BudgetAllocation, 
    hcps: HCPType[], 
    opportunities: HCPOpportunity[]
  ): any {
    const segmentPlans = {
      'A': { touchpoints: 52, channels: ['Field', 'Email', 'Events'], budget: 15000 },
      'B': { touchpoints: 26, channels: ['Field', 'Email'], budget: 8000 },
      'C': { touchpoints: 12, channels: ['Email', 'Web'], budget: 3000 },
      'D': { touchpoints: 4, channels: ['Email'], budget: 1000 }
    };
    
    const hcpPlans = hcps.slice(0, 20).map(hcp => {
      const opportunity = opportunities.find(o => o.hcpId === hcp.id);
      const plan = segmentPlans[hcp.tier as keyof typeof segmentPlans];
      
      return {
        hcpId: hcp.id,
        hcpName: hcp.name,
        tier: hcp.tier,
        segment: hcp.segment,
        annualBudget: plan.budget,
        touchpoints: plan.touchpoints,
        channels: plan.channels,
        quarterlySchedule: this.generateHCPQuarterlySchedule(plan, hcp),
        expectedLift: opportunity ? 
          `${Math.round(opportunity.depthOpportunity * 0.3 + opportunity.breadthOpportunity * 0.2)}%` : 
          'TBD'
      };
    });
    
    return {
      totalHCPs: hcps.length,
      plannedHCPs: hcpPlans.length,
      totalInvestment: hcpPlans.reduce((sum, p) => sum + p.annualBudget, 0),
      hcpPlans,
      summary: {
        tierA: hcpPlans.filter(p => p.tier === 'A').length,
        tierB: hcpPlans.filter(p => p.tier === 'B').length,
        tierC: hcpPlans.filter(p => p.tier === 'C').length,
        tierD: hcpPlans.filter(p => p.tier === 'D').length,
        avgTouchpoints: hcpPlans.reduce((sum, p) => sum + p.touchpoints, 0) / hcpPlans.length
      }
    };
  }

  private generateHCPQuarterlySchedule(plan: any, hcp: HCPType): any[] {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const distribution = hcp.tier === 'A' ? [0.3, 0.3, 0.2, 0.2] : [0.4, 0.3, 0.2, 0.1];
    
    return quarters.map((q, i) => ({
      quarter: q,
      touchpoints: Math.floor(plan.touchpoints * distribution[i]),
      primaryChannel: plan.channels[0],
      budget: Math.floor(plan.budget * distribution[i])
    }));
  }

  private identifyRisks(allocation: BudgetAllocation): string[] {
    const risks: string[] = [];
    
    allocation.allocations.forEach(alloc => {
      if (alloc.saturationLevel > 95) {
        risks.push(`${alloc.channel.name} is over-saturated - high risk of diminishing returns`);
      }
      if (alloc.change > 50) {
        risks.push(`${alloc.channel.name} has aggressive growth - execution risk`);
      }
      if (alloc.change < -30) {
        risks.push(`${alloc.channel.name} significant reduction - relationship risk`);
      }
    });
    
    if (allocation.expectedMROI < 2) {
      risks.push('Low marginal ROI - consider alternative investment options');
    }
    
    return risks;
  }

  private identifyOpportunities(allocation: BudgetAllocation): string[] {
    const opportunities: string[] = [];
    
    allocation.allocations.forEach(alloc => {
      if (alloc.saturationLevel < 50 && alloc.expectedROI > 3) {
        opportunities.push(`${alloc.channel.name} has high growth potential with strong ROI`);
      }
      if (alloc.expectedMROI > 4) {
        opportunities.push(`${alloc.channel.name} showing exceptional marginal returns`);
      }
    });
    
    if (allocation.incrementalRevenue > allocation.totalBudget * 0.5) {
      opportunities.push('Strong incremental revenue opportunity - consider budget increase');
    }
    
    return opportunities;
  }

  private calculateRiskScore(results?: BudgetAllocation): number {
    if (!results) return 10;
    
    let riskScore = 0;
    
    // Concentration risk
    const maxAllocation = Math.max(...results.allocations.map(a => a.recommendedBudget));
    if (maxAllocation / results.totalBudget > 0.4) riskScore += 3;
    
    // Saturation risk
    const oversaturated = results.allocations.filter((a: any) => a.saturationLevel > 90).length;
    riskScore += oversaturated * 2;
    
    // Change risk
    const bigChanges = results.allocations.filter(a => Math.abs(a.change) > 30).length;
    riskScore += bigChanges;
    
    return Math.min(10, riskScore);
  }

  private calculateFeasibilityScore(scenario: OptimizationScenario): number {
    let score = 10;
    
    // Penalize extreme constraints
    scenario.constraints.forEach(c => {
      if (c.growthLimit && c.growthLimit < 0.2) score -= 2;
      if (c.fixed) score -= 1;
    });
    
    // Penalize complex objectives
    if (scenario.objective === 'MinRisk') score -= 1;
    
    return Math.max(0, score);
  }

  private calculateSensitivity(results: any[], metric: string): string {
    const values = results.map(r => r[metric]);
    const range = Math.max(...values) - Math.min(...values);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const sensitivity = (range / avg) * 100;
    
    if (sensitivity < 10) return 'Low sensitivity';
    if (sensitivity < 25) return 'Moderate sensitivity';
    return 'High sensitivity';
  }
}