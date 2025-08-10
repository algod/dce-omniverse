// Customer Planning Intelligence Service
// Provides barrier analysis, HCP prioritization, and opportunity scoring

import { mockDataService } from './mock-data-service';
import { HCP, Barrier, HCPOpportunity, PrescribingData } from '@/lib/types/pharma';

export interface BarrierProfile {
  hcpId: string;
  hcpName: string;
  primaryBarriers: BarrierScore[];
  totalImpact: number;
  addressability: number;
  recommendedInterventions: Intervention[];
}

export interface BarrierScore {
  code: string;
  name: string;
  likelihood: number;
  impact: number;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  addressable: boolean;
  requiredResources: string[];
}

export interface OpportunityScore {
  hcpId: string;
  depthOpportunity: number;
  breadthOpportunity: number;
  combinedScore: number;
  confidence: number;
  timeToRealize: number; // days
  riskFactors: string[];
}

export interface Prediction {
  hcpId: string;
  intervention: string;
  likelihood: number;
  expectedLift: number;
  confidence: number;
  modelUsed: string;
}

export interface Intervention {
  type: string;
  description: string;
  targetBarrier: string;
  expectedImpact: number;
  requiredResources: string[];
  timeline: string;
  successMetrics: string[];
}

export class CustomerIntelligence {
  private static instance: CustomerIntelligence;
  private mockData = mockDataService;
  
  // Barrier definitions with business impact
  private readonly BARRIER_DEFINITIONS = {
    'B001': {
      name: 'No/challenging referral pathways',
      avgImpact: 185000,
      prevalence: 0.32,
      interventions: [
        'Establish referral network partnerships',
        'Provide referral pathway mapping tools',
        'Create specialist finder resources',
        'Facilitate peer-to-peer connections'
      ]
    },
    'B002': {
      name: 'Managing side effects challenges',
      avgImpact: 142000,
      prevalence: 0.28,
      interventions: [
        'Provide side effect management toolkit',
        'Offer nurse educator support',
        'Share best practice protocols',
        'Create patient monitoring tools'
      ]
    },
    'B003': {
      name: 'Insurance denials or restrictions',
      avgImpact: 156000,
      prevalence: 0.24,
      interventions: [
        'Provide prior authorization support',
        'Share payer coverage guides',
        'Offer patient assistance programs',
        'Create appeals letter templates'
      ]
    },
    'B004': {
      name: 'Product not in formulary',
      avgImpact: 198000,
      prevalence: 0.21,
      interventions: [
        'Present formulary dossier',
        'Share health economics data',
        'Provide comparative effectiveness studies',
        'Facilitate P&T committee presentations'
      ]
    },
    'B005': {
      name: 'Requires new diagnostic tool',
      avgImpact: 125000,
      prevalence: 0.18,
      interventions: [
        'Provide diagnostic training programs',
        'Offer equipment partnerships',
        'Share diagnostic protocols',
        'Create certification pathways'
      ]
    }
  };
  
  private constructor() {}
  
  static getInstance(): CustomerIntelligence {
    if (!CustomerIntelligence.instance) {
      CustomerIntelligence.instance = new CustomerIntelligence();
    }
    return CustomerIntelligence.instance;
  }
  
  // ==================== Barrier Analysis ====================
  
  analyzeBarriers(hcpId: string): BarrierProfile {
    const hcp = this.mockData.getHCPById(hcpId);
    if (!hcp) {
      throw new Error(`HCP ${hcpId} not found`);
    }
    
    const barriers = this.identifyHCPBarriers(hcp);
    const totalImpact = barriers.reduce((sum, b) => sum + b.impact, 0);
    const addressableBarriers = barriers.filter(b => b.addressable);
    const addressability = addressableBarriers.length / barriers.length;
    
    return {
      hcpId,
      hcpName: hcp.name,
      primaryBarriers: barriers,
      totalImpact,
      addressability,
      recommendedInterventions: this.generateInterventions(barriers, hcp)
    };
  }
  
  private identifyHCPBarriers(hcp: HCP): BarrierScore[] {
    const barriers: BarrierScore[] = [];
    const prescribingHistory = this.mockData.getPrescribingHistory(hcp.id);
    
    // Analyze prescribing patterns to identify barriers
    const avgPrescriptions = prescribingHistory.reduce((sum, p) => sum + p.totalRx, 0) / prescribingHistory.length;
    const trend = this.analyzePrescribingTrend(prescribingHistory);
    
    // B001: Referral pathway issues (more common in specialists)
    if (hcp.specialty !== 'Primary Care' && avgPrescriptions < 50) {
      barriers.push(this.createBarrierScore('B001', 0.75, hcp));
    }
    
    // B002: Side effect management (indicated by high discontinuation)
    const avgDiscontinuation = prescribingHistory.reduce((sum, p) => sum + p.discontinuationRate, 0) / prescribingHistory.length;
    if (avgDiscontinuation > 0.15) {
      barriers.push(this.createBarrierScore('B002', 0.85, hcp));
    }
    
    // B003: Insurance issues (low tier HCPs often face this)
    if (hcp.tier === 'C' || hcp.tier === 'D') {
      barriers.push(this.createBarrierScore('B003', 0.70, hcp));
    }
    
    // B004: Formulary restrictions (academic centers often have strict formularies)
    if (hcp.practice.type === 'Academic Medical Center') {
      barriers.push(this.createBarrierScore('B004', 0.80, hcp));
    }
    
    // B005: Diagnostic requirements (specialty-dependent)
    if (['Oncology', 'Immunology'].includes(hcp.specialty)) {
      barriers.push(this.createBarrierScore('B005', 0.65, hcp));
    }
    
    // Sort by impact
    return barriers.sort((a, b) => b.impact - a.impact);
  }
  
  private createBarrierScore(code: string, likelihood: number, hcp: HCP): BarrierScore {
    const definition = this.BARRIER_DEFINITIONS[code as keyof typeof this.BARRIER_DEFINITIONS];
    const impact = Math.floor(definition.avgImpact * likelihood * this.getHCPMultiplier(hcp));
    
    return {
      code,
      name: definition.name,
      likelihood,
      impact,
      trend: this.determineBarrierTrend(code, hcp),
      addressable: likelihood > 0.3 && impact > 50000,
      requiredResources: this.getRequiredResources(code)
    };
  }
  
  private getHCPMultiplier(hcp: HCP): number {
    const tierMultipliers = { 'A': 2.0, 'B': 1.5, 'C': 1.0, 'D': 0.7 };
    const sizeMultipliers = { 'Large': 1.5, 'Medium': 1.0, 'Small': 0.7 };
    
    return (tierMultipliers[hcp.tier] || 1.0) * (sizeMultipliers[hcp.practice.size] || 1.0);
  }
  
  private determineBarrierTrend(code: string, hcp: HCP): 'Increasing' | 'Stable' | 'Decreasing' {
    // Simulate trend based on HCP characteristics
    const random = Math.random();
    if (random < 0.3) return 'Increasing';
    if (random < 0.7) return 'Stable';
    return 'Decreasing';
  }
  
  private getRequiredResources(barrierCode: string): string[] {
    const resources: Record<string, string[]> = {
      'B001': ['Referral coordinator', 'Network mapping tool', 'Specialist database'],
      'B002': ['Clinical educator', 'Patient monitoring app', 'Side effect protocols'],
      'B003': ['Reimbursement specialist', 'Prior auth support', 'Appeals team'],
      'B004': ['Health economics data', 'P&T presentation', 'Formulary analyst'],
      'B005': ['Diagnostic training', 'Equipment partnership', 'Certification program']
    };
    
    return resources[barrierCode] || [];
  }
  
  private analyzePrescribingTrend(history: PrescribingData[]): 'Increasing' | 'Stable' | 'Declining' {
    if (history.length < 3) return 'Stable';
    
    const recent = history.slice(-3);
    const prior = history.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, p) => sum + p.totalRx, 0) / recent.length;
    const priorAvg = prior.reduce((sum, p) => sum + p.totalRx, 0) / prior.length;
    
    if (recentAvg > priorAvg * 1.1) return 'Increasing';
    if (recentAvg < priorAvg * 0.9) return 'Declining';
    return 'Stable';
  }
  
  private generateInterventions(barriers: BarrierScore[], hcp: HCP): Intervention[] {
    const interventions: Intervention[] = [];
    
    // Generate targeted interventions for top 3 barriers
    barriers.slice(0, 3).forEach(barrier => {
      const definition = this.BARRIER_DEFINITIONS[barrier.code as keyof typeof this.BARRIER_DEFINITIONS];
      const availableInterventions = definition.interventions;
      
      // Select most appropriate intervention
      const selectedIntervention = availableInterventions[0];
      
      interventions.push({
        type: this.getInterventionType(barrier.code),
        description: selectedIntervention,
        targetBarrier: barrier.code,
        expectedImpact: Math.floor(barrier.impact * 0.4), // 40% reduction potential
        requiredResources: barrier.requiredResources,
        timeline: this.getInterventionTimeline(barrier.code),
        successMetrics: this.getSuccessMetrics(barrier.code)
      });
    });
    
    return interventions;
  }
  
  private getInterventionType(barrierCode: string): string {
    const types: Record<string, string> = {
      'B001': 'Network Development',
      'B002': 'Clinical Support',
      'B003': 'Access Enhancement',
      'B004': 'Formulary Engagement',
      'B005': 'Capability Building'
    };
    
    return types[barrierCode] || 'General Support';
  }
  
  private getInterventionTimeline(barrierCode: string): string {
    const timelines: Record<string, string> = {
      'B001': '30-45 days',
      'B002': '14-21 days',
      'B003': '7-14 days',
      'B004': '60-90 days',
      'B005': '45-60 days'
    };
    
    return timelines[barrierCode] || '30 days';
  }
  
  private getSuccessMetrics(barrierCode: string): string[] {
    const metrics: Record<string, string[]> = {
      'B001': ['Referral volume increase', 'Network connections established', 'Time to specialist reduced'],
      'B002': ['Discontinuation rate reduction', 'Patient satisfaction scores', 'Side effect reports decreased'],
      'B003': ['Approval rate improvement', 'Time to approval reduced', 'Patient access increased'],
      'B004': ['Formulary additions', 'Tier improvements', 'Restriction removals'],
      'B005': ['Certifications completed', 'Diagnostic volume increase', 'Test accuracy improved']
    };
    
    return metrics[barrierCode] || ['Engagement increase', 'Barrier resolution rate'];
  }
  
  // ==================== Opportunity Scoring ====================
  
  calculateOpportunity(hcp: HCP): OpportunityScore {
    const prescribingHistory = this.mockData.getPrescribingHistory(hcp.id);
    const barriers = this.identifyHCPBarriers(hcp);
    
    // Calculate depth opportunity (increase per patient)
    const avgRxValue = 4500; // Average prescription value
    const currentRx = prescribingHistory[prescribingHistory.length - 1]?.totalRx || 0;
    const potentialRxIncrease = this.calculatePotentialIncrease(hcp, currentRx);
    const depthOpportunity = potentialRxIncrease * avgRxValue;
    
    // Calculate breadth opportunity (new patients)
    const marketSize = this.estimateMarketSize(hcp);
    const currentShare = currentRx / marketSize;
    const potentialShare = this.calculatePotentialShare(hcp, barriers);
    const breadthOpportunity = (potentialShare - currentShare) * marketSize * avgRxValue;
    
    // Combined score with confidence
    const combinedScore = this.calculateCombinedScore(depthOpportunity, breadthOpportunity);
    const confidence = this.calculateConfidence(hcp, barriers, prescribingHistory);
    
    return {
      hcpId: hcp.id,
      depthOpportunity: Math.floor(depthOpportunity),
      breadthOpportunity: Math.floor(breadthOpportunity),
      combinedScore,
      confidence,
      timeToRealize: this.estimateTimeToRealize(barriers),
      riskFactors: this.identifyRiskFactors(hcp, barriers)
    };
  }
  
  private calculatePotentialIncrease(hcp: HCP, currentRx: number): number {
    // Tier-based potential
    const tierPotential = { 'A': 0.5, 'B': 0.4, 'C': 0.3, 'D': 0.2 }[hcp.tier] || 0.3;
    
    // Segment-based potential
    const segmentPotential = {
      'High Prescriber': 0.2,
      'Growth Potential': 0.6,
      'Maintain': 0.3,
      'Monitor': 0.2,
      'New Opportunity': 0.7
    }[hcp.segment] || 0.3;
    
    return currentRx * (tierPotential + segmentPotential) / 2;
  }
  
  private estimateMarketSize(hcp: HCP): number {
    // Practice size-based estimation
    const sizeFactors = { 'Large': 500, 'Medium': 250, 'Small': 100 };
    const basePotential = sizeFactors[hcp.practice.size] || 200;
    
    // Specialty adjustment
    const specialtyMultiplier = {
      'Oncology': 1.5,
      'Cardiology': 1.3,
      'Immunology': 1.4,
      'Endocrinology': 1.2,
      'Neurology': 1.1,
      'Primary Care': 1.0
    }[hcp.specialty] || 1.0;
    
    return Math.floor(basePotential * specialtyMultiplier);
  }
  
  private calculatePotentialShare(hcp: HCP, barriers: BarrierScore[]): number {
    // Base potential share by tier
    let potentialShare = { 'A': 0.4, 'B': 0.3, 'C': 0.2, 'D': 0.15 }[hcp.tier] || 0.2;
    
    // Reduce by barrier impact
    const barrierReduction = barriers.reduce((sum, b) => sum + (b.likelihood * 0.05), 0);
    potentialShare *= (1 - Math.min(barrierReduction, 0.5));
    
    return potentialShare;
  }
  
  private calculateCombinedScore(depth: number, breadth: number): number {
    // Weighted combination with normalization
    const totalOpportunity = depth + breadth;
    const maxOpportunity = 500000; // Maximum expected opportunity
    
    return Math.min(totalOpportunity / maxOpportunity, 1.0);
  }
  
  private calculateConfidence(hcp: HCP, barriers: BarrierScore[], history: PrescribingData[]): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence for consistent prescribers
    const trend = this.analyzePrescribingTrend(history);
    if (trend === 'Increasing') confidence += 0.2;
    if (trend === 'Stable') confidence += 0.1;
    
    // Decrease confidence for high barriers
    const barrierImpact = barriers.reduce((sum, b) => sum + b.likelihood, 0) / barriers.length;
    confidence -= barrierImpact * 0.2;
    
    // Tier adjustment
    const tierBonus = { 'A': 0.2, 'B': 0.15, 'C': 0.1, 'D': 0.05 }[hcp.tier] || 0.1;
    confidence += tierBonus;
    
    return Math.max(0.3, Math.min(0.95, confidence));
  }
  
  private estimateTimeToRealize(barriers: BarrierScore[]): number {
    // Base time in days
    let baseTime = 60;
    
    // Add time for each barrier
    barriers.forEach(barrier => {
      const barrierTime = {
        'B001': 45,
        'B002': 30,
        'B003': 21,
        'B004': 90,
        'B005': 60
      }[barrier.code] || 30;
      
      baseTime += barrierTime * barrier.likelihood * 0.5;
    });
    
    return Math.floor(baseTime);
  }
  
  private identifyRiskFactors(hcp: HCP, barriers: BarrierScore[]): string[] {
    const risks: string[] = [];
    
    // Tier-based risks
    if (hcp.tier === 'C' || hcp.tier === 'D') {
      risks.push('Lower tier HCP with limited influence');
    }
    
    // Barrier-based risks
    if (barriers.some(b => b.code === 'B004' && b.likelihood > 0.7)) {
      risks.push('Strong formulary restrictions');
    }
    
    if (barriers.some(b => b.code === 'B001' && b.likelihood > 0.7)) {
      risks.push('Limited referral network');
    }
    
    // Practice-based risks
    if (hcp.practice.type === 'Academic Medical Center') {
      risks.push('Complex institutional decision-making');
    }
    
    // Segment-based risks
    if (hcp.segment === 'Monitor') {
      risks.push('Low growth potential segment');
    }
    
    return risks;
  }
  
  // ==================== Predictive Models ====================
  
  predictResponse(hcp: HCP, intervention: string): Prediction {
    const barriers = this.identifyHCPBarriers(hcp);
    const opportunity = this.calculateOpportunity(hcp);
    
    // Simulate Random Forest model prediction
    const features = this.extractFeatures(hcp, barriers, opportunity);
    const likelihood = this.runPredictionModel(features, intervention);
    const expectedLift = this.calculateExpectedLift(likelihood, opportunity);
    
    return {
      hcpId: hcp.id,
      intervention,
      likelihood,
      expectedLift,
      confidence: 0.89, // Model accuracy
      modelUsed: 'Random Forest (89% accuracy)'
    };
  }
  
  private extractFeatures(hcp: HCP, barriers: BarrierScore[], opportunity: OpportunityScore): any {
    return {
      tier: hcp.tier,
      segment: hcp.segment,
      specialty: hcp.specialty,
      practiceSize: hcp.practice.size,
      barrierCount: barriers.length,
      totalBarrierImpact: barriers.reduce((sum, b) => sum + b.impact, 0),
      opportunityScore: opportunity.combinedScore,
      depthOpportunity: opportunity.depthOpportunity,
      breadthOpportunity: opportunity.breadthOpportunity
    };
  }
  
  private runPredictionModel(features: any, intervention: string): number {
    // Simulate model prediction based on features
    let baseLikelihood = 0.5;
    
    // Tier impact
    const tierWeights = { 'A': 0.3, 'B': 0.2, 'C': 0.1, 'D': 0.05 };
    baseLikelihood += tierWeights[features.tier as keyof typeof tierWeights] || 0.1;
    
    // Segment impact
    if (features.segment === 'Growth Potential') baseLikelihood += 0.2;
    if (features.segment === 'High Prescriber') baseLikelihood += 0.15;
    
    // Barrier impact
    if (features.barrierCount <= 2) baseLikelihood += 0.1;
    if (features.totalBarrierImpact < 200000) baseLikelihood += 0.1;
    
    // Intervention-specific adjustments
    const interventionBoosts: Record<string, number> = {
      'Peer-to-peer education': 0.15,
      'Patient support program': 0.12,
      'Formulary engagement': 0.10,
      'Digital engagement': 0.08
    };
    
    baseLikelihood += interventionBoosts[intervention] || 0.05;
    
    return Math.min(0.95, baseLikelihood);
  }
  
  private calculateExpectedLift(likelihood: number, opportunity: OpportunityScore): number {
    const totalOpportunity = opportunity.depthOpportunity + opportunity.breadthOpportunity;
    return Math.floor(totalOpportunity * likelihood * 0.4); // 40% realization rate
  }
  
  // ==================== Territory Analysis ====================
  
  analyzeTerritoryOpportunities(territory: string): any {
    const hcps = this.mockData.getHCPList({ territory });
    const opportunities = hcps.map(hcp => ({
      hcp,
      opportunity: this.calculateOpportunity(hcp),
      barriers: this.identifyHCPBarriers(hcp)
    }));
    
    // Sort by combined score
    opportunities.sort((a, b) => b.opportunity.combinedScore - a.opportunity.combinedScore);
    
    return {
      territory,
      totalHCPs: hcps.length,
      totalOpportunity: opportunities.reduce((sum, o) => 
        sum + o.opportunity.depthOpportunity + o.opportunity.breadthOpportunity, 0),
      topOpportunities: opportunities.slice(0, 10),
      barrierDistribution: this.analyzeBarrierDistribution(opportunities),
      recommendations: this.generateTerritoryRecommendations(opportunities)
    };
  }
  
  private analyzeBarrierDistribution(opportunities: any[]): any {
    const distribution: Record<string, number> = {};
    
    opportunities.forEach(o => {
      o.barriers.forEach((barrier: BarrierScore) => {
        distribution[barrier.code] = (distribution[barrier.code] || 0) + 1;
      });
    });
    
    return distribution;
  }
  
  private generateTerritoryRecommendations(opportunities: any[]): string[] {
    const recommendations: string[] = [];
    
    // High opportunity focus
    const highOpportunities = opportunities.filter(o => o.opportunity.combinedScore > 0.7);
    if (highOpportunities.length > 0) {
      recommendations.push(`Focus on ${highOpportunities.length} high-opportunity HCPs with combined potential of $${Math.floor(highOpportunities.reduce((sum, o) => sum + o.opportunity.depthOpportunity + o.opportunity.breadthOpportunity, 0) / 1000)}K`);
    }
    
    // Barrier-specific recommendations
    const barrierDist = this.analyzeBarrierDistribution(opportunities);
    const topBarrier = Object.entries(barrierDist).sort((a, b) => b[1] - a[1])[0];
    if (topBarrier) {
      const barrierName = this.BARRIER_DEFINITIONS[topBarrier[0] as keyof typeof this.BARRIER_DEFINITIONS].name;
      recommendations.push(`Address ${barrierName} affecting ${topBarrier[1]} HCPs in territory`);
    }
    
    // Segment focus
    const growthPotential = opportunities.filter(o => o.hcp.segment === 'Growth Potential');
    if (growthPotential.length > 5) {
      recommendations.push(`Target ${growthPotential.length} growth potential HCPs for maximum ROI`);
    }
    
    return recommendations;
  }
  
  // ==================== Strategic Analysis ====================
  
  generateStrategicInsights(hcpIds: string[]): any {
    const analyses = hcpIds.map(id => {
      const hcp = this.mockData.getHCPById(id);
      if (!hcp) return null;
      
      return {
        hcp,
        barriers: this.analyzeBarriers(id),
        opportunity: this.calculateOpportunity(hcp)
      };
    }).filter(a => a !== null);
    
    return {
      totalHCPs: analyses.length,
      totalBlockedRevenue: analyses.reduce((sum, a) => sum + a!.barriers.totalImpact, 0),
      totalOpportunity: analyses.reduce((sum, a) => 
        sum + a!.opportunity.depthOpportunity + a!.opportunity.breadthOpportunity, 0),
      avgConfidence: analyses.reduce((sum, a) => sum + a!.opportunity.confidence, 0) / analyses.length,
      topBarriers: this.identifyTopBarriers(analyses),
      strategicPriorities: this.generateStrategicPriorities(analyses),
      quickWins: this.identifyQuickWins(analyses),
      longTermOpportunities: this.identifyLongTermOpportunities(analyses)
    };
  }
  
  private identifyTopBarriers(analyses: any[]): any[] {
    const barrierImpacts: Record<string, { count: number; totalImpact: number }> = {};
    
    analyses.forEach(a => {
      a.barriers.primaryBarriers.forEach((barrier: BarrierScore) => {
        if (!barrierImpacts[barrier.code]) {
          barrierImpacts[barrier.code] = { count: 0, totalImpact: 0 };
        }
        barrierImpacts[barrier.code].count++;
        barrierImpacts[barrier.code].totalImpact += barrier.impact;
      });
    });
    
    return Object.entries(barrierImpacts)
      .map(([code, data]) => ({
        code,
        name: this.BARRIER_DEFINITIONS[code as keyof typeof this.BARRIER_DEFINITIONS].name,
        affectedHCPs: data.count,
        totalImpact: data.totalImpact,
        avgImpact: Math.floor(data.totalImpact / data.count)
      }))
      .sort((a, b) => b.totalImpact - a.totalImpact);
  }
  
  private generateStrategicPriorities(analyses: any[]): string[] {
    const priorities: string[] = [];
    
    // High-value HCP focus
    const highValue = analyses.filter(a => 
      a.opportunity.depthOpportunity + a.opportunity.breadthOpportunity > 300000);
    if (highValue.length > 0) {
      priorities.push(`Prioritize ${highValue.length} high-value HCPs with >$300K opportunity`);
    }
    
    // Quick addressable barriers
    const addressable = analyses.filter(a => a.barriers.addressability > 0.7);
    if (addressable.length > 0) {
      priorities.push(`Target ${addressable.length} HCPs with highly addressable barriers`);
    }
    
    // Growth segment focus
    const growth = analyses.filter(a => a.hcp.segment === 'Growth Potential');
    if (growth.length > 0) {
      priorities.push(`Develop ${growth.length} growth potential HCPs for long-term value`);
    }
    
    return priorities;
  }
  
  private identifyQuickWins(analyses: any[]): any[] {
    return analyses
      .filter(a => 
        a.opportunity.timeToRealize < 45 && 
        a.opportunity.confidence > 0.7 &&
        a.barriers.addressability > 0.6)
      .map(a => ({
        hcp: a.hcp.name,
        opportunity: a.opportunity.depthOpportunity + a.opportunity.breadthOpportunity,
        timeToRealize: a.opportunity.timeToRealize,
        primaryIntervention: a.barriers.recommendedInterventions[0]
      }))
      .sort((a, b) => b.opportunity - a.opportunity)
      .slice(0, 5);
  }
  
  private identifyLongTermOpportunities(analyses: any[]): any[] {
    return analyses
      .filter(a => 
        a.opportunity.depthOpportunity + a.opportunity.breadthOpportunity > 200000 &&
        a.opportunity.timeToRealize > 60)
      .map(a => ({
        hcp: a.hcp.name,
        opportunity: a.opportunity.depthOpportunity + a.opportunity.breadthOpportunity,
        timeToRealize: a.opportunity.timeToRealize,
        requiredInvestment: this.estimateRequiredInvestment(a.barriers),
        expectedROI: this.calculateExpectedROI(a.opportunity, a.barriers)
      }))
      .sort((a, b) => b.expectedROI - a.expectedROI)
      .slice(0, 5);
  }
  
  private estimateRequiredInvestment(barriers: any): number {
    // Estimate based on barrier complexity
    const baseInvestment = 10000;
    const barrierCosts = {
      'B001': 15000,
      'B002': 12000,
      'B003': 8000,
      'B004': 25000,
      'B005': 20000
    };
    
    let totalInvestment = baseInvestment;
    barriers.primaryBarriers.forEach((barrier: BarrierScore) => {
      totalInvestment += (barrierCosts[barrier.code as keyof typeof barrierCosts] || 10000) * barrier.likelihood;
    });
    
    return Math.floor(totalInvestment);
  }
  
  private calculateExpectedROI(opportunity: OpportunityScore, barriers: any): number {
    const totalOpportunity = opportunity.depthOpportunity + opportunity.breadthOpportunity;
    const investment = this.estimateRequiredInvestment(barriers);
    const realizationRate = opportunity.confidence * (1 - (barriers.primaryBarriers.length * 0.1));
    
    return (totalOpportunity * realizationRate) / investment;
  }
}

// Export singleton instance
export const customerIntelligence = CustomerIntelligence.getInstance();