// Budget Planning Intelligence Service
// Provides ROI optimization, channel allocation, and budget scenario analysis

import { mockDataService } from './mock-data-service';

export interface BudgetAllocation {
  channel: string;
  currentBudget: number;
  optimizedBudget: number;
  currentROI: number;
  projectedROI: number;
  saturation: number;
  efficiency: number;
  recommendations: string[];
}

export interface ResponseCurve {
  channel: string;
  dataPoints: { spend: number; response: number; roi: number }[];
  saturationPoint: number;
  optimalSpend: number;
  currentPosition: number;
  marginalROI: number;
}

export interface ScenarioImpact {
  scenario: string;
  changes: Record<string, number>;
  totalBudget: number;
  projectedROI: number;
  roiChange: number;
  reachImpact: number;
  prescriptionLift: number;
  risks: string[];
  opportunities: string[];
}

export interface OptimizationResult {
  currentAllocation: BudgetAllocation[];
  optimizedAllocation: BudgetAllocation[];
  totalBudget: number;
  currentROI: number;
  optimizedROI: number;
  roiImprovement: number;
  implementationPlan: ImplementationStep[];
}

export interface ImplementationStep {
  phase: number;
  description: string;
  timeline: string;
  budgetChanges: Record<string, number>;
  expectedImpact: number;
  dependencies: string[];
}

export class BudgetIntelligence {
  private static instance: BudgetIntelligence;
  private mockData = mockDataService;
  
  // Channel characteristics for optimization
  private readonly CHANNEL_PROFILES = {
    'Field Force': {
      baseROI: 3.5,
      saturationSpend: 35000000,
      minSpend: 10000000,
      responseType: 'logarithmic',
      reachPerDollar: 0.00008,
      qualityScore: 0.85
    },
    'Digital': {
      baseROI: 2.8,
      saturationSpend: 15000000,
      minSpend: 2000000,
      responseType: 'linear-plateau',
      reachPerDollar: 0.00025,
      qualityScore: 0.65
    },
    'Speaker Programs': {
      baseROI: 4.2,
      saturationSpend: 10000000,
      minSpend: 1000000,
      responseType: 'exponential-decay',
      reachPerDollar: 0.00005,
      qualityScore: 0.90
    },
    'Medical Conferences': {
      baseROI: 2.2,
      saturationSpend: 5000000,
      minSpend: 500000,
      responseType: 'step-function',
      reachPerDollar: 0.00012,
      qualityScore: 0.75
    },
    'Email Marketing': {
      baseROI: 2.5,
      saturationSpend: 4000000,
      minSpend: 100000,
      responseType: 'linear',
      reachPerDollar: 0.00035,
      qualityScore: 0.55
    },
    'Web Portals': {
      baseROI: 2.0,
      saturationSpend: 3000000,
      minSpend: 200000,
      responseType: 'logarithmic',
      reachPerDollar: 0.00020,
      qualityScore: 0.60
    }
  };
  
  private constructor() {}
  
  static getInstance(): BudgetIntelligence {
    if (!BudgetIntelligence.instance) {
      BudgetIntelligence.instance = new BudgetIntelligence();
    }
    return BudgetIntelligence.instance;
  }
  
  // ==================== Budget Optimization ====================
  
  optimizeBudget(totalBudget: number, constraints?: BudgetConstraints): OptimizationResult {
    const currentData = this.mockData.getBudgetData();
    const currentAllocation = this.getCurrentAllocation(currentData);
    
    // Run optimization algorithm
    const optimizedAllocation = this.runOptimizationAlgorithm(
      totalBudget,
      currentAllocation,
      constraints
    );
    
    // Calculate ROI improvements
    const currentROI = this.calculateTotalROI(currentAllocation);
    const optimizedROI = this.calculateTotalROI(optimizedAllocation);
    const roiImprovement = ((optimizedROI - currentROI) / currentROI) * 100;
    
    // Generate implementation plan
    const implementationPlan = this.generateImplementationPlan(
      currentAllocation,
      optimizedAllocation
    );
    
    return {
      currentAllocation,
      optimizedAllocation,
      totalBudget,
      currentROI,
      optimizedROI,
      roiImprovement,
      implementationPlan
    };
  }
  
  private getCurrentAllocation(budgetData: any): BudgetAllocation[] {
    return budgetData.channels.map((channel: any) => ({
      channel: channel.name,
      currentBudget: channel.budget,
      optimizedBudget: channel.budget, // Will be updated
      currentROI: channel.roi,
      projectedROI: channel.roi, // Will be updated
      saturation: channel.saturation,
      efficiency: this.calculateEfficiency(channel),
      recommendations: []
    }));
  }
  
  private runOptimizationAlgorithm(
    totalBudget: number,
    current: BudgetAllocation[],
    constraints?: BudgetConstraints
  ): BudgetAllocation[] {
    const optimized = [...current];
    let remainingBudget = totalBudget;
    
    // Step 1: Apply minimum constraints
    optimized.forEach(channel => {
      const profile = this.CHANNEL_PROFILES[channel.channel as keyof typeof this.CHANNEL_PROFILES];
      if (profile) {
        const minBudget = constraints?.minBudgets?.[channel.channel] || profile.minSpend;
        channel.optimizedBudget = Math.max(minBudget, 0);
        remainingBudget -= channel.optimizedBudget;
      }
    });
    
    // Step 2: Allocate based on marginal ROI
    const iterations = 100;
    const increment = remainingBudget / iterations;
    
    for (let i = 0; i < iterations; i++) {
      // Find channel with highest marginal ROI
      let bestChannel: BudgetAllocation | undefined;
      let bestMarginalROI = 0;
      
      optimized.forEach(channel => {
        const marginalROI = this.calculateMarginalROI(
          channel.channel,
          channel.optimizedBudget
        );
        
        const profile = this.CHANNEL_PROFILES[channel.channel as keyof typeof this.CHANNEL_PROFILES];
        const maxBudget = constraints?.maxBudgets?.[channel.channel] || profile?.saturationSpend || Infinity;
        
        if (marginalROI > bestMarginalROI && channel.optimizedBudget < maxBudget) {
          bestMarginalROI = marginalROI;
          bestChannel = channel;
        }
      });
      
      if (bestChannel) {
        bestChannel.optimizedBudget += increment;
      }
    }
    
    // Step 3: Update ROI projections and recommendations
    optimized.forEach(channel => {
      channel.projectedROI = this.calculateROIAtSpend(channel.channel, channel.optimizedBudget);
      channel.saturation = this.calculateSaturation(channel.channel, channel.optimizedBudget);
      channel.efficiency = this.calculateEfficiencyAtSpend(channel.channel, channel.optimizedBudget);
      channel.recommendations = this.generateChannelRecommendations(channel);
    });
    
    return optimized;
  }
  
  private calculateMarginalROI(channel: string, currentSpend: number): number {
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    if (!profile) return 0;
    
    const saturationRatio = currentSpend / profile.saturationSpend;
    
    switch (profile.responseType) {
      case 'logarithmic':
        // Diminishing returns
        return profile.baseROI * (1 / (1 + saturationRatio * 2));
      
      case 'linear-plateau':
        // Linear until saturation
        return saturationRatio < 0.8 ? profile.baseROI : profile.baseROI * 0.2;
      
      case 'exponential-decay':
        // Quick saturation
        return profile.baseROI * Math.exp(-saturationRatio * 2);
      
      case 'step-function':
        // Discrete jumps
        if (saturationRatio < 0.3) return profile.baseROI * 1.2;
        if (saturationRatio < 0.6) return profile.baseROI;
        return profile.baseROI * 0.5;
      
      case 'linear':
        // Constant returns
        return saturationRatio < 1 ? profile.baseROI : 0;
      
      default:
        return profile.baseROI * (1 - saturationRatio);
    }
  }
  
  private calculateROIAtSpend(channel: string, spend: number): number {
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    if (!profile) return 0;
    
    const saturationRatio = Math.min(spend / profile.saturationSpend, 1);
    const qualityAdjustment = profile.qualityScore;
    
    let baseROI = profile.baseROI;
    
    // Adjust ROI based on response type and saturation
    switch (profile.responseType) {
      case 'logarithmic':
        baseROI *= Math.log(1 + saturationRatio * 10) / Math.log(11);
        break;
      
      case 'linear-plateau':
        baseROI *= saturationRatio < 0.8 ? 1 : (1 - (saturationRatio - 0.8) * 2);
        break;
      
      case 'exponential-decay':
        baseROI *= (1 - Math.exp(-saturationRatio * 3)) / (1 - Math.exp(-3));
        break;
      
      case 'step-function':
        if (saturationRatio < 0.3) baseROI *= 0.8;
        else if (saturationRatio < 0.6) baseROI *= 1.0;
        else if (saturationRatio < 0.9) baseROI *= 0.9;
        else baseROI *= 0.6;
        break;
      
      case 'linear':
        baseROI *= 1 - saturationRatio * 0.3;
        break;
    }
    
    return baseROI * qualityAdjustment;
  }
  
  private calculateSaturation(channel: string, spend: number): number {
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    if (!profile) return 0;
    
    return Math.min(spend / profile.saturationSpend, 1);
  }
  
  private calculateEfficiency(channel: any): number {
    // Efficiency = ROI * (1 - saturation) * quality
    return channel.roi * (1 - channel.saturation) * 0.8;
  }
  
  private calculateEfficiencyAtSpend(channel: string, spend: number): number {
    const roi = this.calculateROIAtSpend(channel, spend);
    const saturation = this.calculateSaturation(channel, spend);
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    
    return roi * (1 - saturation) * (profile?.qualityScore || 0.7);
  }
  
  private calculateTotalROI(allocation: BudgetAllocation[]): number {
    const totalSpend = allocation.reduce((sum, a) => sum + (a.optimizedBudget || a.currentBudget), 0);
    const totalReturn = allocation.reduce((sum, a) => 
      sum + (a.optimizedBudget || a.currentBudget) * (a.projectedROI || a.currentROI), 0);
    
    return totalReturn / totalSpend;
  }
  
  private generateChannelRecommendations(channel: BudgetAllocation): string[] {
    const recommendations: string[] = [];
    
    // Budget change recommendations
    const budgetChange = channel.optimizedBudget - channel.currentBudget;
    const changePercent = (budgetChange / channel.currentBudget) * 100;
    
    if (changePercent > 20) {
      recommendations.push(`Increase budget by ${Math.round(changePercent)}% to capture untapped opportunity`);
    } else if (changePercent < -20) {
      recommendations.push(`Reduce budget by ${Math.round(Math.abs(changePercent))}% due to saturation`);
    }
    
    // Saturation recommendations
    if (channel.saturation > 0.8) {
      recommendations.push('Channel approaching saturation - consider reallocation');
    } else if (channel.saturation < 0.3) {
      recommendations.push('Significant growth potential available');
    }
    
    // Efficiency recommendations
    if (channel.efficiency > 2.5) {
      recommendations.push('High efficiency channel - prioritize for investment');
    } else if (channel.efficiency < 1.0) {
      recommendations.push('Low efficiency - optimize targeting or reduce spend');
    }
    
    // ROI recommendations
    if (channel.projectedROI > channel.currentROI * 1.1) {
      recommendations.push(`Projected ${Math.round((channel.projectedROI - channel.currentROI) * 100) / 100}x ROI improvement`);
    }
    
    return recommendations;
  }
  
  private generateImplementationPlan(
    current: BudgetAllocation[],
    optimized: BudgetAllocation[]
  ): ImplementationStep[] {
    const steps: ImplementationStep[] = [];
    
    // Phase 1: Quick wins (high ROI, low risk changes)
    const quickWins: Record<string, number> = {};
    optimized.forEach((channel, i) => {
      const change = channel.optimizedBudget - current[i].currentBudget;
      if (Math.abs(change) < current[i].currentBudget * 0.2 && channel.projectedROI > current[i].currentROI) {
        quickWins[channel.channel] = change;
      }
    });
    
    if (Object.keys(quickWins).length > 0) {
      steps.push({
        phase: 1,
        description: 'Quick wins - Minor adjustments with immediate impact',
        timeline: '0-30 days',
        budgetChanges: quickWins,
        expectedImpact: this.calculatePhaseImpact(quickWins, current, optimized),
        dependencies: ['Budget approval', 'Channel partner alignment']
      });
    }
    
    // Phase 2: Major reallocations
    const majorChanges: Record<string, number> = {};
    optimized.forEach((channel, i) => {
      const change = channel.optimizedBudget - current[i].currentBudget;
      if (Math.abs(change) >= current[i].currentBudget * 0.2) {
        majorChanges[channel.channel] = change;
      }
    });
    
    if (Object.keys(majorChanges).length > 0) {
      steps.push({
        phase: 2,
        description: 'Strategic reallocation - Significant budget shifts',
        timeline: '30-60 days',
        budgetChanges: majorChanges,
        expectedImpact: this.calculatePhaseImpact(majorChanges, current, optimized),
        dependencies: ['Executive approval', 'Contract renegotiation', 'Team restructuring']
      });
    }
    
    // Phase 3: Optimization and monitoring
    steps.push({
      phase: 3,
      description: 'Continuous optimization - Monitor and adjust based on performance',
      timeline: '60-90 days',
      budgetChanges: {},
      expectedImpact: 0.05, // 5% additional improvement through optimization
      dependencies: ['Performance tracking systems', 'Analytics infrastructure', 'Regular review cycles']
    });
    
    return steps;
  }
  
  private calculatePhaseImpact(
    changes: Record<string, number>,
    current: BudgetAllocation[],
    optimized: BudgetAllocation[]
  ): number {
    let impactSum = 0;
    let changeSum = 0;
    
    Object.entries(changes).forEach(([channel, change]) => {
      const currentChannel = current.find(c => c.channel === channel);
      const optimizedChannel = optimized.find(c => c.channel === channel);
      
      if (currentChannel && optimizedChannel) {
        const roiDiff = optimizedChannel.projectedROI - currentChannel.currentROI;
        impactSum += Math.abs(change) * roiDiff;
        changeSum += Math.abs(change);
      }
    });
    
    return changeSum > 0 ? impactSum / changeSum : 0;
  }
  
  // ==================== Response Curves ====================
  
  generateResponseCurves(channels: string[]): ResponseCurve[] {
    return channels.map(channel => this.generateChannelResponseCurve(channel));
  }
  
  private generateChannelResponseCurve(channel: string): ResponseCurve {
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    if (!profile) {
      throw new Error(`Unknown channel: ${channel}`);
    }
    
    const currentBudget = this.getCurrentChannelBudget(channel);
    const dataPoints = this.generateCurveDataPoints(channel, profile);
    const saturationPoint = this.findSaturationPoint(dataPoints);
    const optimalSpend = this.findOptimalSpend(dataPoints);
    const marginalROI = this.calculateMarginalROI(channel, currentBudget);
    
    return {
      channel,
      dataPoints,
      saturationPoint,
      optimalSpend,
      currentPosition: currentBudget,
      marginalROI
    };
  }
  
  private getCurrentChannelBudget(channel: string): number {
    const budgetData = this.mockData.getBudgetData();
    const channelData = budgetData.channels.find((c: any) => c.name === channel);
    return channelData?.budget || 0;
  }
  
  private generateCurveDataPoints(
    channel: string,
    profile: any
  ): { spend: number; response: number; roi: number }[] {
    const points: { spend: number; response: number; roi: number }[] = [];
    const maxSpend = profile.saturationSpend * 1.5;
    const steps = 50;
    
    for (let i = 0; i <= steps; i++) {
      const spend = (maxSpend / steps) * i;
      const roi = this.calculateROIAtSpend(channel, spend);
      const response = spend * roi;
      
      points.push({ spend, response, roi });
    }
    
    return points;
  }
  
  private findSaturationPoint(dataPoints: { spend: number; response: number; roi: number }[]): number {
    // Find where marginal ROI drops below 1.0
    for (let i = 1; i < dataPoints.length; i++) {
      const marginalROI = (dataPoints[i].response - dataPoints[i - 1].response) / 
                         (dataPoints[i].spend - dataPoints[i - 1].spend);
      
      if (marginalROI < 1.0) {
        return dataPoints[i].spend;
      }
    }
    
    return dataPoints[dataPoints.length - 1].spend;
  }
  
  private findOptimalSpend(dataPoints: { spend: number; response: number; roi: number }[]): number {
    // Find spend level with maximum total return
    let maxReturn = 0;
    let optimalSpend = 0;
    
    dataPoints.forEach(point => {
      if (point.response > maxReturn) {
        maxReturn = point.response;
        optimalSpend = point.spend;
      }
    });
    
    return optimalSpend;
  }
  
  // ==================== Scenario Analysis ====================
  
  simulateScenario(changes: BudgetChanges): ScenarioImpact {
    const currentData = this.mockData.getBudgetData();
    const simulatedData = this.mockData.simulateBudgetReallocation(changes);
    
    // Calculate impacts
    const roiChange = ((simulatedData.overallROI - currentData.overallROI) / currentData.overallROI) * 100;
    const reachImpact = this.calculateReachImpact(changes);
    const prescriptionLift = this.calculatePrescriptionLift(simulatedData.overallROI, roiChange);
    
    // Identify risks and opportunities
    const risks = this.identifyScenarioRisks(changes, simulatedData);
    const opportunities = this.identifyScenarioOpportunities(changes, simulatedData);
    
    return {
      scenario: this.generateScenarioDescription(changes),
      changes,
      totalBudget: Object.values(changes).reduce((sum, val) => sum + val, 0),
      projectedROI: simulatedData.overallROI,
      roiChange,
      reachImpact,
      prescriptionLift,
      risks,
      opportunities
    };
  }
  
  private calculateReachImpact(changes: BudgetChanges): number {
    let totalReachChange = 0;
    
    Object.entries(changes).forEach(([channel, newBudget]) => {
      const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
      if (profile) {
        const currentBudget = this.getCurrentChannelBudget(channel);
        const reachChange = (newBudget - currentBudget) * profile.reachPerDollar;
        totalReachChange += reachChange;
      }
    });
    
    // Convert to percentage of total HCP universe (2,847 HCPs)
    return (totalReachChange / 2847) * 100;
  }
  
  private calculatePrescriptionLift(newROI: number, roiChange: number): number {
    // Estimate prescription impact based on ROI improvement
    // Assuming 1% ROI improvement = 0.5% prescription lift
    return roiChange * 0.5;
  }
  
  private generateScenarioDescription(changes: BudgetChanges): string {
    const increases: string[] = [];
    const decreases: string[] = [];
    
    Object.entries(changes).forEach(([channel, newBudget]) => {
      const currentBudget = this.getCurrentChannelBudget(channel);
      const change = newBudget - currentBudget;
      
      if (change > 0) {
        increases.push(`${channel} +$${Math.round(change / 1000)}K`);
      } else if (change < 0) {
        decreases.push(`${channel} -$${Math.round(Math.abs(change) / 1000)}K`);
      }
    });
    
    const parts: string[] = [];
    if (increases.length > 0) parts.push(`Increase: ${increases.join(', ')}`);
    if (decreases.length > 0) parts.push(`Decrease: ${decreases.join(', ')}`);
    
    return parts.join('; ');
  }
  
  private identifyScenarioRisks(changes: BudgetChanges, simulated: any): string[] {
    const risks: string[] = [];
    
    // Check for over-saturation
    simulated.channels.forEach((channel: any) => {
      if (channel.saturation > 0.85) {
        risks.push(`${channel.name} approaching saturation (${Math.round(channel.saturation * 100)}%)`);
      }
    });
    
    // Check for under-investment
    Object.entries(changes).forEach(([channel, newBudget]) => {
      const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
      if (profile && newBudget < profile.minSpend) {
        risks.push(`${channel} below minimum effective spend threshold`);
      }
    });
    
    // Check for dramatic shifts
    Object.entries(changes).forEach(([channel, newBudget]) => {
      const currentBudget = this.getCurrentChannelBudget(channel);
      const changePercent = Math.abs((newBudget - currentBudget) / currentBudget) * 100;
      
      if (changePercent > 50) {
        risks.push(`${channel} change >50% may disrupt operations`);
      }
    });
    
    return risks;
  }
  
  private identifyScenarioOpportunities(changes: BudgetChanges, simulated: any): string[] {
    const opportunities: string[] = [];
    
    // Identify high-ROI improvements
    simulated.channels.forEach((channel: any) => {
      const currentChannel = this.mockData.getBudgetData().channels.find((c: any) => c.name === channel.name);
      if (currentChannel && channel.roi > currentChannel.roi * 1.1) {
        opportunities.push(`${channel.name} ROI improvement of ${Math.round((channel.roi - currentChannel.roi) * 100) / 100}x`);
      }
    });
    
    // Identify efficiency gains
    const totalEfficiencyGain = simulated.channels.reduce((sum: number, channel: any) => {
      const efficiency = this.calculateEfficiency(channel);
      return sum + efficiency;
    }, 0);
    
    if (totalEfficiencyGain > 0) {
      opportunities.push(`Overall efficiency improvement potential identified`);
    }
    
    // Identify reach expansion
    const reachExpansion = this.calculateReachImpact(changes);
    if (reachExpansion > 10) {
      opportunities.push(`${Math.round(reachExpansion)}% increase in HCP reach`);
    }
    
    return opportunities;
  }
  
  // ==================== Channel Analysis ====================
  
  analyzeChannelPerformance(channel: string, period?: string): ChannelPerformanceAnalysis {
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    if (!profile) {
      throw new Error(`Unknown channel: ${channel}`);
    }
    
    const currentBudget = this.getCurrentChannelBudget(channel);
    const historicalPerformance = this.generateHistoricalPerformance(channel, period);
    const competitiveBenchmark = this.getCompetitiveBenchmark(channel);
    const optimizationPotential = this.calculateOptimizationPotential(channel, currentBudget);
    
    return {
      channel,
      currentBudget,
      currentROI: this.calculateROIAtSpend(channel, currentBudget),
      historicalPerformance,
      competitiveBenchmark,
      optimizationPotential,
      recommendations: this.generateDetailedChannelRecommendations(
        channel,
        currentBudget,
        historicalPerformance,
        competitiveBenchmark
      )
    };
  }
  
  private generateHistoricalPerformance(channel: string, period?: string): any {
    // Generate 12-month historical data
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const monthData = {
        period: date.toISOString().slice(0, 7),
        spend: this.getCurrentChannelBudget(channel) / 12 * (0.8 + Math.random() * 0.4),
        roi: this.calculateROIAtSpend(channel, this.getCurrentChannelBudget(channel)) * (0.9 + Math.random() * 0.2),
        reach: Math.floor(100 + Math.random() * 500),
        conversions: Math.floor(10 + Math.random() * 50)
      };
      
      months.push(monthData);
    }
    
    return {
      monthly: months,
      avgROI: months.reduce((sum, m) => sum + m.roi, 0) / months.length,
      trend: this.calculatePerformanceTrend(months)
    };
  }
  
  private calculatePerformanceTrend(monthlyData: any[]): string {
    const recentAvg = monthlyData.slice(-3).reduce((sum, m) => sum + m.roi, 0) / 3;
    const priorAvg = monthlyData.slice(-6, -3).reduce((sum, m) => sum + m.roi, 0) / 3;
    
    if (recentAvg > priorAvg * 1.05) return 'Improving';
    if (recentAvg < priorAvg * 0.95) return 'Declining';
    return 'Stable';
  }
  
  private getCompetitiveBenchmark(channel: string): any {
    // Industry benchmark data
    const benchmarks = {
      'Field Force': { avgROI: 3.2, topQuartile: 4.0, avgSpend: 30000000 },
      'Digital': { avgROI: 2.5, topQuartile: 3.2, avgSpend: 10000000 },
      'Speaker Programs': { avgROI: 3.8, topQuartile: 4.5, avgSpend: 7000000 },
      'Medical Conferences': { avgROI: 2.0, topQuartile: 2.5, avgSpend: 4000000 },
      'Email Marketing': { avgROI: 2.2, topQuartile: 2.8, avgSpend: 2500000 },
      'Web Portals': { avgROI: 1.8, topQuartile: 2.3, avgSpend: 2000000 }
    };
    
    return benchmarks[channel as keyof typeof benchmarks] || {
      avgROI: 2.5,
      topQuartile: 3.0,
      avgSpend: 5000000
    };
  }
  
  private calculateOptimizationPotential(channel: string, currentBudget: number): any {
    const profile = this.CHANNEL_PROFILES[channel as keyof typeof this.CHANNEL_PROFILES];
    if (!profile) return { potential: 0, actions: [] };
    
    const currentROI = this.calculateROIAtSpend(channel, currentBudget);
    const optimalBudget = profile.saturationSpend * 0.7; // 70% of saturation is typically optimal
    const optimalROI = this.calculateROIAtSpend(channel, optimalBudget);
    
    return {
      potentialROI: optimalROI,
      roiImprovement: optimalROI - currentROI,
      optimalBudget,
      budgetAdjustment: optimalBudget - currentBudget,
      actions: this.generateOptimizationActions(channel, currentBudget, optimalBudget)
    };
  }
  
  private generateOptimizationActions(channel: string, current: number, optimal: number): string[] {
    const actions: string[] = [];
    const change = optimal - current;
    const changePercent = (change / current) * 100;
    
    if (changePercent > 10) {
      actions.push(`Increase budget by $${Math.round(change / 1000)}K to reach optimal spend level`);
      actions.push('Expand targeting to high-value HCP segments');
      actions.push('Test new creative formats to improve engagement');
    } else if (changePercent < -10) {
      actions.push(`Reduce budget by $${Math.round(Math.abs(change) / 1000)}K to improve efficiency`);
      actions.push('Focus on highest-performing tactics');
      actions.push('Eliminate underperforming campaigns');
    } else {
      actions.push('Maintain current budget levels');
      actions.push('Focus on optimization within current spend');
      actions.push('A/B test to improve conversion rates');
    }
    
    return actions;
  }
  
  private generateDetailedChannelRecommendations(
    channel: string,
    budget: number,
    historical: any,
    benchmark: any
  ): string[] {
    const recommendations: string[] = [];
    const currentROI = this.calculateROIAtSpend(channel, budget);
    
    // Performance vs benchmark
    if (currentROI < benchmark.avgROI) {
      recommendations.push(`Performance below industry average (${benchmark.avgROI}x) - review targeting and creative`);
    } else if (currentROI > benchmark.topQuartile) {
      recommendations.push(`Top quartile performance - maintain current strategy and document best practices`);
    }
    
    // Trend-based recommendations
    if (historical.trend === 'Declining') {
      recommendations.push('Address declining performance through audience refresh and message testing');
    } else if (historical.trend === 'Improving') {
      recommendations.push('Capitalize on positive momentum with incremental investment');
    }
    
    // Saturation recommendations
    const saturation = this.calculateSaturation(channel, budget);
    if (saturation > 0.8) {
      recommendations.push('Near saturation - explore new segments or complementary channels');
    } else if (saturation < 0.4) {
      recommendations.push('Significant headroom for growth - consider accelerated investment');
    }
    
    return recommendations;
  }
  
  // ==================== Quarterly Planning ====================
  
  generateQuarterlyPlan(annualBudget: number, priorities: string[]): QuarterlyPlan {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    const seasonalFactors = [0.9, 1.1, 0.8, 1.2]; // Q4 typically highest
    
    const quarterlyAllocations = quarters.map((quarter, index) => {
      const quarterBudget = (annualBudget / 4) * seasonalFactors[index];
      const optimized = this.optimizeBudget(quarterBudget);
      
      return {
        quarter,
        budget: quarterBudget,
        allocation: optimized.optimizedAllocation,
        projectedROI: optimized.optimizedROI,
        focusAreas: this.generateQuarterlyFocus(quarter, priorities),
        milestones: this.generateQuarterlyMilestones(quarter, index)
      };
    });
    
    return {
      annualBudget,
      quarterlyAllocations,
      annualROI: this.calculateAnnualROI(quarterlyAllocations),
      keyInitiatives: this.generateKeyInitiatives(priorities),
      risks: this.identifyAnnualRisks(quarterlyAllocations)
    };
  }
  
  private generateQuarterlyFocus(quarter: string, priorities: string[]): string[] {
    const focusAreas: Record<string, string[]> = {
      'Q1 2025': ['Launch year initiatives', 'Establish baseline metrics', 'Build field readiness'],
      'Q2 2025': ['Scale successful programs', 'Optimize based on Q1 learnings', 'Expand HCP reach'],
      'Q3 2025': ['Mid-year optimization', 'Prepare for Q4 push', 'Address underperforming channels'],
      'Q4 2025': ['Maximize year-end impact', 'Capture budget opportunities', 'Plan for next year']
    };
    
    return focusAreas[quarter] || [];
  }
  
  private generateQuarterlyMilestones(quarter: string, index: number): string[] {
    const milestones = [
      ['10% HCP reach', '2.5x ROI achieved', 'All channels operational'],
      ['25% HCP reach', '3.0x ROI achieved', 'First optimization cycle complete'],
      ['40% HCP reach', '3.2x ROI maintained', 'Budget reallocation implemented'],
      ['60% HCP reach', '3.5x ROI achieved', 'Annual targets met']
    ];
    
    return milestones[index] || [];
  }
  
  private calculateAnnualROI(quarterlyAllocations: any[]): number {
    const totalSpend = quarterlyAllocations.reduce((sum, q) => sum + q.budget, 0);
    const totalReturn = quarterlyAllocations.reduce((sum, q) => sum + q.budget * q.projectedROI, 0);
    
    return totalReturn / totalSpend;
  }
  
  private generateKeyInitiatives(priorities: string[]): string[] {
    const initiatives = [
      'Implement multi-touch attribution model',
      'Launch integrated omnichannel campaigns',
      'Develop predictive ROI models',
      'Establish real-time optimization dashboard',
      'Create channel synergy programs'
    ];
    
    // Add priority-specific initiatives
    priorities.forEach(priority => {
      if (priority.includes('digital')) {
        initiatives.push('Accelerate digital transformation');
      }
      if (priority.includes('field')) {
        initiatives.push('Enhance field force effectiveness');
      }
    });
    
    return initiatives.slice(0, 5);
  }
  
  private identifyAnnualRisks(quarterlyAllocations: any[]): string[] {
    const risks: string[] = [];
    
    // Check for budget concentration
    quarterlyAllocations.forEach(q => {
      const maxChannel = q.allocation.reduce((max: any, channel: any) => 
        channel.optimizedBudget > (max?.optimizedBudget || 0) ? channel : max, null);
      
      if (maxChannel && maxChannel.optimizedBudget > q.budget * 0.5) {
        risks.push(`Over-concentration in ${maxChannel.channel} in ${q.quarter}`);
      }
    });
    
    // Check for volatility
    const roiValues = quarterlyAllocations.map(q => q.projectedROI);
    const avgROI = roiValues.reduce((sum, roi) => sum + roi, 0) / roiValues.length;
    const variance = roiValues.reduce((sum, roi) => sum + Math.pow(roi - avgROI, 2), 0) / roiValues.length;
    
    if (Math.sqrt(variance) > avgROI * 0.2) {
      risks.push('High ROI volatility across quarters');
    }
    
    return risks;
  }
}

// Type definitions
interface BudgetConstraints {
  minBudgets?: Record<string, number>;
  maxBudgets?: Record<string, number>;
  fixedBudgets?: Record<string, number>;
  totalBudgetLimit?: number;
}

interface BudgetChanges {
  [channel: string]: number;
}

interface ChannelPerformanceAnalysis {
  channel: string;
  currentBudget: number;
  currentROI: number;
  historicalPerformance: any;
  competitiveBenchmark: any;
  optimizationPotential: any;
  recommendations: string[];
}

interface QuarterlyPlan {
  annualBudget: number;
  quarterlyAllocations: any[];
  annualROI: number;
  keyInitiatives: string[];
  risks: string[];
}

// Export singleton instance
export const budgetIntelligence = BudgetIntelligence.getInstance();