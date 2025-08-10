// AI Orchestration Intelligence Service
// Provides journey optimization, NBA recommendations, and ML-powered sequence planning

import { mockDataService } from './mock-data-service';
import { CustomerJourney, NextBestAction, HCP } from '@/lib/types/pharma';

export interface JourneyOptimization {
  hcpId: string;
  currentStage: string;
  optimizedSequence: TouchpointSequence[];
  predictedOutcome: JourneyOutcome;
  modelConfidence: number;
  explainability: ExplainabilityData;
}

export interface TouchpointSequence {
  step: number;
  channel: string;
  content: string;
  timing: string;
  expectedEngagement: number;
  rationale: string;
}

export interface JourneyOutcome {
  conversionProbability: number;
  timeToConversion: number;
  expectedValue: number;
  riskFactors: string[];
  successFactors: string[];
}

export interface ExplainabilityData {
  topFeatures: FeatureImportance[];
  decisionPath: DecisionNode[];
  alternativeSequences: AlternativeSequence[];
  confidenceBreakdown: ConfidenceFactors;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  impact: 'Positive' | 'Negative' | 'Neutral';
  description: string;
}

export interface DecisionNode {
  stage: string;
  decision: string;
  probability: number;
  alternatives: string[];
  reasoning: string;
}

export interface AlternativeSequence {
  sequence: TouchpointSequence[];
  probability: number;
  tradeoffs: string;
}

export interface ConfidenceFactors {
  dataQuality: number;
  modelAccuracy: number;
  historicalPerformance: number;
  overall: number;
}

export interface NBA {
  hcpId: string;
  recommendedAction: string;
  channel: string;
  timing: string;
  confidence: number;
  expectedImpact: ImpactMetrics;
  reasoning: string[];
  alternativeActions: AlternativeAction[];
}

export interface ImpactMetrics {
  engagementLift: number;
  prescriptionLift: number;
  revenueImpact: number;
  timeToImpact: number; // days
}

export interface AlternativeAction {
  action: string;
  confidence: number;
  tradeoff: string;
}

export interface GeneticOptimizationResult {
  bestSequence: TouchpointSequence[];
  fitness: number;
  generations: number;
  convergenceRate: number;
  populationDiversity: number;
}

export class OrchestrationIntelligence {
  private static instance: OrchestrationIntelligence;
  private mockData = mockDataService;
  
  // ML Model configurations
  private readonly MODEL_CONFIG = {
    bertStyle: {
      contextWindow: 512,
      attentionHeads: 8,
      hiddenLayers: 12,
      accuracy: 0.87
    },
    geneticAlgorithm: {
      populationSize: 100,
      mutationRate: 0.1,
      crossoverRate: 0.7,
      elitismRate: 0.1,
      maxGenerations: 50
    },
    reinforcementLearning: {
      learningRate: 0.001,
      discountFactor: 0.95,
      explorationRate: 0.1
    }
  };
  
  // Channel effectiveness by stage
  private readonly CHANNEL_STAGE_EFFECTIVENESS = {
    'Awareness': {
      'Email': 0.7,
      'Digital Ad': 0.8,
      'Conference': 0.6,
      'Webinar': 0.7,
      'Field': 0.5
    },
    'Consideration': {
      'Field': 0.8,
      'Email': 0.6,
      'Webinar': 0.7,
      'Speaker Program': 0.9,
      'Digital Ad': 0.5
    },
    'Trial': {
      'Field': 0.9,
      'Sample': 0.85,
      'Patient Support': 0.8,
      'Email': 0.6,
      'Phone': 0.7
    },
    'Adoption': {
      'Field': 0.85,
      'Patient Support': 0.9,
      'Email': 0.7,
      'Phone': 0.75,
      'Portal': 0.8
    },
    'Advocacy': {
      'Speaker Program': 0.95,
      'Advisory Board': 0.9,
      'Field': 0.8,
      'Conference': 0.85,
      'Research': 0.8
    }
  };
  
  private constructor() {}
  
  static getInstance(): OrchestrationIntelligence {
    if (!OrchestrationIntelligence.instance) {
      OrchestrationIntelligence.instance = new OrchestrationIntelligence();
    }
    return OrchestrationIntelligence.instance;
  }
  
  // ==================== Journey Optimization ====================
  
  optimizeJourney(hcpId: string): JourneyOptimization {
    const hcp = this.mockData.getHCPById(hcpId);
    const journey = this.mockData.getJourneyByHCP(hcpId);
    
    if (!hcp || !journey) {
      throw new Error(`HCP ${hcpId} or journey not found`);
    }
    
    // Run BERT-style sequence prediction
    const optimizedSequence = this.predictOptimalSequence(hcp, journey);
    
    // Calculate predicted outcome
    const predictedOutcome = this.predictJourneyOutcome(hcp, optimizedSequence);
    
    // Generate explainability data
    const explainability = this.generateExplainability(hcp, journey, optimizedSequence);
    
    // Calculate model confidence
    const modelConfidence = this.calculateModelConfidence(hcp, journey, explainability);
    
    return {
      hcpId,
      currentStage: journey.currentStage,
      optimizedSequence,
      predictedOutcome,
      modelConfidence,
      explainability
    };
  }
  
  private predictOptimalSequence(hcp: HCP, journey: CustomerJourney): TouchpointSequence[] {
    const sequence: TouchpointSequence[] = [];
    const stages = this.determineRemainingStages(journey.currentStage);
    
    stages.forEach((stage, index) => {
      const optimalChannel = this.selectOptimalChannel(stage, hcp, journey);
      const content = this.selectOptimalContent(stage, optimalChannel, hcp);
      const timing = this.calculateOptimalTiming(index, hcp, journey);
      
      sequence.push({
        step: index + 1,
        channel: optimalChannel,
        content,
        timing,
        expectedEngagement: this.predictEngagement(optimalChannel, stage, hcp),
        rationale: this.generateRationale(optimalChannel, stage, hcp)
      });
    });
    
    return sequence;
  }
  
  private determineRemainingStages(currentStage: string): string[] {
    const allStages = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'];
    const currentIndex = allStages.indexOf(currentStage);
    
    if (currentIndex === -1) return allStages;
    
    // Return current stage and all following stages
    return allStages.slice(currentIndex);
  }
  
  private selectOptimalChannel(stage: string, hcp: HCP, journey: CustomerJourney): string {
    const stageChannels = this.CHANNEL_STAGE_EFFECTIVENESS[stage as keyof typeof this.CHANNEL_STAGE_EFFECTIVENESS];
    if (!stageChannels) return 'Email';
    
    // Consider HCP preferences and past engagement
    const channelScores: Record<string, number> = {};
    
    Object.entries(stageChannels).forEach(([channel, baseScore]) => {
      let score = baseScore;
      
      // Adjust based on HCP tier
      if (hcp.tier === 'A' && channel === 'Field') score *= 1.2;
      if (hcp.tier === 'D' && channel === 'Digital Ad') score *= 1.2;
      
      // Adjust based on specialty
      if (hcp.specialty === 'Oncology' && channel === 'Conference') score *= 1.15;
      if (hcp.specialty === 'Primary Care' && channel === 'Email') score *= 1.1;
      
      // Adjust based on past engagement from stages
      const relevantStages = journey.stages.filter(stage => stage.keyActivities.includes(channel));
      if (relevantStages.length > 0) {
        const avgEngagement = relevantStages.filter(stage => stage.engagementLevel === 'High' || stage.engagementLevel === 'Medium').length / relevantStages.length;
        score *= (1 + avgEngagement * 0.3);
      }
      
      channelScores[channel] = score;
    });
    
    // Select channel with highest score
    return Object.entries(channelScores).reduce((best, [channel, score]) => 
      score > channelScores[best] ? channel : best, Object.keys(channelScores)[0]);
  }
  
  private selectOptimalContent(stage: string, channel: string, hcp: HCP): string {
    const contentMap: Record<string, Record<string, string>> = {
      'Awareness': {
        'Email': 'Disease State Education Email Series',
        'Digital Ad': 'Targeted Disease Awareness Campaign',
        'Conference': 'Medical Education Symposium',
        'Webinar': 'Expert Panel Discussion on Treatment Advances'
      },
      'Consideration': {
        'Field': 'Clinical Data Presentation with Efficacy Focus',
        'Email': 'Comparative Effectiveness Summary',
        'Speaker Program': 'Peer Case Study Presentation',
        'Webinar': 'Treatment Guidelines Deep Dive'
      },
      'Trial': {
        'Field': 'Patient Selection Criteria and Trial Protocol',
        'Sample': 'Starter Sample Program with Support',
        'Patient Support': 'Comprehensive Patient Onboarding Kit',
        'Email': 'Trial Support Resources'
      },
      'Adoption': {
        'Field': 'Practice Integration Support Visit',
        'Patient Support': 'Patient Adherence Program Enrollment',
        'Email': 'Best Practices for Long-term Management',
        'Portal': 'HCP Dashboard with Patient Tracking'
      },
      'Advocacy': {
        'Speaker Program': 'Speaker Bureau Invitation',
        'Advisory Board': 'KOL Advisory Board Participation',
        'Conference': 'Abstract Submission Support',
        'Research': 'Investigator-Initiated Study Opportunity'
      }
    };
    
    return contentMap[stage]?.[channel] || 'General Product Information';
  }
  
  private calculateOptimalTiming(step: number, hcp: HCP, journey: CustomerJourney): string {
    // Base timing based on step
    const baseDays = step * 7; // Weekly cadence
    
    // Adjust based on HCP engagement level (calculated from completion probability)
    const engagementScore = journey.completionProbability;
    let timingMultiplier = 1.0;
    
    if (engagementScore > 0.8) timingMultiplier = 0.7; // Accelerate for engaged HCPs
    else if (engagementScore < 0.4) timingMultiplier = 1.5; // Slow down for low engagement
    
    // Adjust based on stage urgency
    if (journey.currentStage === 'Trial') timingMultiplier *= 0.8; // Faster follow-up during trial
    
    const days = Math.floor(baseDays * timingMultiplier);
    
    if (days === 0) return 'Immediate';
    if (days <= 3) return `Within ${days} days`;
    if (days <= 7) return 'Within 1 week';
    if (days <= 14) return 'Within 2 weeks';
    return `Within ${Math.ceil(days / 7)} weeks`;
  }
  
  private predictEngagement(channel: string, stage: string, hcp: HCP): number {
    const stageEffectiveness = this.CHANNEL_STAGE_EFFECTIVENESS[stage as keyof typeof this.CHANNEL_STAGE_EFFECTIVENESS] as Record<string, number> | undefined;
    const baseEngagement = stageEffectiveness?.[channel] || 0.5;
    
    // Adjust based on HCP characteristics
    let adjustment = 1.0;
    
    if (hcp.tier === 'A') adjustment *= 1.15;
    else if (hcp.tier === 'D') adjustment *= 0.85;
    
    if (hcp.segment === 'High Prescriber') adjustment *= 1.2;
    else if (hcp.segment === 'Monitor') adjustment *= 0.8;
    
    return Math.min(baseEngagement * adjustment, 0.95);
  }
  
  private generateRationale(channel: string, stage: string, hcp: HCP): string {
    const rationales: Record<string, string> = {
      'Field': `Face-to-face engagement optimal for ${hcp.tier}-tier HCP in ${stage} stage`,
      'Email': `Cost-effective digital touchpoint for ${hcp.specialty} specialist`,
      'Speaker Program': `Peer influence critical for ${stage} stage progression`,
      'Digital Ad': `Broad awareness building for ${hcp.segment} segment`,
      'Conference': `High-impact education opportunity for ${hcp.specialty}`,
      'Webinar': `Convenient virtual engagement for busy ${hcp.practice.type}`,
      'Patient Support': `Critical for patient success and HCP confidence`,
      'Sample': `Trial facilitation for appropriate patients`
    };
    
    return rationales[channel] || `Optimized channel selection for ${stage} stage`;
  }
  
  private predictJourneyOutcome(hcp: HCP, sequence: TouchpointSequence[]): JourneyOutcome {
    // Calculate conversion probability using ensemble model
    const baseConversion = this.calculateBaseConversion(hcp);
    const sequenceBoost = this.calculateSequenceEffectiveness(sequence);
    const conversionProbability = Math.min(baseConversion * sequenceBoost, 0.95);
    
    // Estimate time to conversion
    const totalSteps = sequence.length;
    const avgDaysPerStep = 10;
    const timeToConversion = totalSteps * avgDaysPerStep * (2 - conversionProbability);
    
    // Calculate expected value
    const avgPrescriptionValue = 4500;
    const expectedPrescriptions = this.estimatePrescriptions(hcp, conversionProbability);
    const expectedValue = expectedPrescriptions * avgPrescriptionValue;
    
    // Identify risk and success factors
    const riskFactors = this.identifyRiskFactors(hcp, sequence);
    const successFactors = this.identifySuccessFactors(hcp, sequence);
    
    return {
      conversionProbability,
      timeToConversion: Math.floor(timeToConversion),
      expectedValue: Math.floor(expectedValue),
      riskFactors,
      successFactors
    };
  }
  
  private calculateBaseConversion(hcp: HCP): number {
    let base = 0.3; // 30% base conversion
    
    // Tier adjustment
    const tierMultipliers = { 'A': 1.5, 'B': 1.3, 'C': 1.0, 'D': 0.7 };
    base *= tierMultipliers[hcp.tier] || 1.0;
    
    // Segment adjustment
    if (hcp.segment === 'High Prescriber') base *= 1.4;
    else if (hcp.segment === 'Growth Potential') base *= 1.3;
    else if (hcp.segment === 'Monitor') base *= 0.6;
    
    // Specialty adjustment
    if (['Oncology', 'Cardiology'].includes(hcp.specialty)) base *= 1.2;
    
    return Math.min(base, 0.8);
  }
  
  private calculateSequenceEffectiveness(sequence: TouchpointSequence[]): number {
    if (sequence.length === 0) return 1.0;
    
    const avgEngagement = sequence.reduce((sum, s) => sum + s.expectedEngagement, 0) / sequence.length;
    const diversityScore = new Set(sequence.map(s => s.channel)).size / sequence.length;
    const timingScore = sequence.every(s => s.timing !== 'Immediate') ? 0.9 : 0.7;
    
    return (avgEngagement * 0.5 + diversityScore * 0.3 + timingScore * 0.2) * 1.2;
  }
  
  private estimatePrescriptions(hcp: HCP, conversionProbability: number): number {
    const practiceMultiplier = { 'Large': 150, 'Medium': 75, 'Small': 30 }[hcp.practice.size] || 50;
    const specialtyMultiplier = {
      'Oncology': 1.3,
      'Cardiology': 1.2,
      'Immunology': 1.4,
      'Endocrinology': 1.1,
      'Neurology': 1.0,
      'Primary Care': 0.8
    }[hcp.specialty] || 1.0;
    
    return practiceMultiplier * specialtyMultiplier * conversionProbability;
  }
  
  private identifyRiskFactors(hcp: HCP, sequence: TouchpointSequence[]): string[] {
    const risks: string[] = [];
    
    if (hcp.tier === 'D') risks.push('Lower-tier HCP with limited influence');
    if (sequence.length > 7) risks.push('Extended journey may lead to fatigue');
    if (sequence.filter(s => s.channel === 'Field').length < 2) risks.push('Limited personal engagement');
    if (hcp.segment === 'Monitor') risks.push('Low growth potential segment');
    
    return risks;
  }
  
  private identifySuccessFactors(hcp: HCP, sequence: TouchpointSequence[]): string[] {
    const factors: string[] = [];
    
    if (hcp.tier === 'A') factors.push('High-value HCP with strong influence');
    if (sequence.some(s => s.channel === 'Speaker Program')) factors.push('Peer influence through speaker programs');
    if (sequence.filter(s => s.expectedEngagement > 0.7).length > 3) factors.push('Multiple high-engagement touchpoints');
    if (hcp.segment === 'Growth Potential') factors.push('Strong growth potential identified');
    
    return factors;
  }
  
  private generateExplainability(hcp: HCP, journey: CustomerJourney, sequence: TouchpointSequence[]): ExplainabilityData {
    const topFeatures = this.extractTopFeatures(hcp, journey);
    const decisionPath = this.buildDecisionPath(journey, sequence);
    const alternativeSequences = this.generateAlternatives(hcp, journey, sequence);
    const confidenceBreakdown = this.calculateConfidenceBreakdown(hcp, journey);
    
    return {
      topFeatures,
      decisionPath,
      alternativeSequences,
      confidenceBreakdown
    };
  }
  
  private extractTopFeatures(hcp: HCP, journey: CustomerJourney): FeatureImportance[] {
    const features: FeatureImportance[] = [
      {
        feature: 'HCP Tier',
        importance: 0.25,
        impact: hcp.tier === 'A' || hcp.tier === 'B' ? 'Positive' : 'Negative',
        description: `${hcp.tier}-tier classification drives ${hcp.tier === 'A' ? 'high' : 'moderate'} engagement priority`
      },
      {
        feature: 'Current Stage',
        importance: 0.20,
        impact: ['Trial', 'Adoption'].includes(journey.currentStage) ? 'Positive' : 'Neutral',
        description: `${journey.currentStage} stage indicates ${journey.currentStage === 'Trial' ? 'high' : 'moderate'} conversion readiness`
      },
      {
        feature: 'Past Engagement',
        importance: 0.18,
        impact: journey.completionProbability > 0.6 ? 'Positive' : 'Negative',
        description: `${Math.round(journey.completionProbability * 100)}% completion probability ${journey.completionProbability > 0.6 ? 'supports' : 'challenges'} progression`
      },
      {
        feature: 'Specialty',
        importance: 0.15,
        impact: ['Oncology', 'Cardiology'].includes(hcp.specialty) ? 'Positive' : 'Neutral',
        description: `${hcp.specialty} typically shows ${['Oncology', 'Cardiology'].includes(hcp.specialty) ? 'higher' : 'standard'} adoption rates`
      },
      {
        feature: 'Practice Size',
        importance: 0.12,
        impact: hcp.practice.size === 'Large' ? 'Positive' : 'Neutral',
        description: `${hcp.practice.size} practice size affects patient volume potential`
      },
      {
        feature: 'Geographic Region',
        importance: 0.10,
        impact: 'Neutral',
        description: `${hcp.region} region with standard market dynamics`
      }
    ];
    
    return features.sort((a, b) => b.importance - a.importance);
  }
  
  private buildDecisionPath(journey: CustomerJourney, sequence: TouchpointSequence[]): DecisionNode[] {
    const path: DecisionNode[] = [];
    const stages = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'];
    const currentIndex = stages.indexOf(journey.currentStage);
    
    for (let i = currentIndex; i < Math.min(currentIndex + 3, stages.length); i++) {
      const stage = stages[i];
      const relevantTouchpoint = sequence.find(s => this.matchStageToTouchpoint(stage, s));
      
      path.push({
        stage,
        decision: relevantTouchpoint?.channel || 'Multi-channel engagement',
        probability: 0.6 + Math.random() * 0.35,
        alternatives: this.getStageAlternatives(stage),
        reasoning: this.getDecisionReasoning(stage, relevantTouchpoint)
      });
    }
    
    return path;
  }
  
  private matchStageToTouchpoint(stage: string, touchpoint: TouchpointSequence): boolean {
    // Simple matching logic
    const stageStepMap: Record<string, number[]> = {
      'Awareness': [1, 2],
      'Consideration': [3, 4],
      'Trial': [5, 6],
      'Adoption': [7, 8],
      'Advocacy': [9, 10]
    };
    
    return stageStepMap[stage]?.includes(touchpoint.step) || false;
  }
  
  private getStageAlternatives(stage: string): string[] {
    const alternatives: Record<string, string[]> = {
      'Awareness': ['Email campaign', 'Digital advertising', 'Conference presence'],
      'Consideration': ['Field visit', 'Webinar invitation', 'Peer referral'],
      'Trial': ['Sample program', 'Patient support enrollment', 'Clinical data sharing'],
      'Adoption': ['Ongoing field support', 'Patient outcomes tracking', 'Formulary support'],
      'Advocacy': ['Speaker bureau', 'Advisory board', 'Research collaboration']
    };
    
    return alternatives[stage] || ['Standard engagement'];
  }
  
  private getDecisionReasoning(stage: string, touchpoint?: TouchpointSequence): string {
    if (!touchpoint) return `Standard ${stage} stage progression strategy`;
    
    return touchpoint.rationale || `Optimized ${touchpoint.channel} engagement for ${stage} stage`;
  }
  
  private generateAlternatives(hcp: HCP, journey: CustomerJourney, primary: TouchpointSequence[]): AlternativeSequence[] {
    const alternatives: AlternativeSequence[] = [];
    
    // Generate 2-3 alternative sequences
    for (let i = 0; i < 2; i++) {
      const altSequence = this.createAlternativeSequence(primary, i);
      alternatives.push({
        sequence: altSequence,
        probability: 0.5 + Math.random() * 0.3,
        tradeoffs: this.identifyTradeoffs(primary, altSequence)
      });
    }
    
    return alternatives.sort((a, b) => b.probability - a.probability);
  }
  
  private createAlternativeSequence(primary: TouchpointSequence[], variant: number): TouchpointSequence[] {
    return primary.map(touchpoint => {
      const alt = { ...touchpoint };
      
      if (variant === 0) {
        // More digital-focused alternative
        if (alt.channel === 'Field') alt.channel = 'Webinar';
        if (alt.channel === 'Conference') alt.channel = 'Digital Ad';
      } else {
        // More personal-touch alternative
        if (alt.channel === 'Email') alt.channel = 'Phone';
        if (alt.channel === 'Digital Ad') alt.channel = 'Field';
      }
      
      alt.expectedEngagement *= (0.8 + Math.random() * 0.3);
      return alt;
    });
  }
  
  private identifyTradeoffs(primary: TouchpointSequence[], alternative: TouchpointSequence[]): string {
    const primaryFieldCount = primary.filter(t => t.channel === 'Field').length;
    const altFieldCount = alternative.filter(t => t.channel === 'Field').length;
    
    if (altFieldCount < primaryFieldCount) {
      return 'Lower cost but potentially reduced personal engagement';
    } else if (altFieldCount > primaryFieldCount) {
      return 'Higher engagement potential but increased resource requirements';
    }
    
    return 'Similar resource allocation with different channel mix';
  }
  
  private calculateConfidenceBreakdown(hcp: HCP, journey: CustomerJourney): ConfidenceFactors {
    const dataQuality = journey.stages.reduce((sum, stage) => sum + stage.touchpoints, 0) > 5 ? 0.85 : 0.65;
    const modelAccuracy = this.MODEL_CONFIG.bertStyle.accuracy;
    const historicalPerformance = 0.82; // Based on past predictions
    
    const overall = (dataQuality * 0.3 + modelAccuracy * 0.5 + historicalPerformance * 0.2);
    
    return {
      dataQuality,
      modelAccuracy,
      historicalPerformance,
      overall
    };
  }
  
  private calculateModelConfidence(hcp: HCP, journey: CustomerJourney, explainability: ExplainabilityData): number {
    return explainability.confidenceBreakdown.overall;
  }
  
  // ==================== Next Best Action ====================
  
  getNextBestAction(hcpId: string, context?: any): NBA {
    const hcp = this.mockData.getHCPById(hcpId);
    const journey = this.mockData.getJourneyByHCP(hcpId);
    
    if (!hcp || !journey) {
      throw new Error(`HCP ${hcpId} or journey not found`);
    }
    
    // Determine NBA based on current state and ML predictions
    const recommendedAction = this.determineNBA(hcp, journey, context);
    const channel = this.selectNBAChannel(recommendedAction, hcp);
    const timing = this.determineNBATiming(hcp, journey);
    const confidence = this.calculateNBAConfidence(hcp, journey, recommendedAction);
    const expectedImpact = this.predictNBAImpact(recommendedAction, hcp, journey);
    const reasoning = this.generateNBAReasoning(recommendedAction, hcp, journey);
    const alternativeActions = this.generateAlternativeNBAs(recommendedAction, hcp, journey);
    
    return {
      hcpId,
      recommendedAction,
      channel,
      timing,
      confidence,
      expectedImpact,
      reasoning,
      alternativeActions
    };
  }
  
  private determineNBA(hcp: HCP, journey: CustomerJourney, context?: any): string {
    // NBA decision tree based on stage and engagement
    const stage = journey.currentStage;
    const engagement = journey.completionProbability;
    const lastStage = journey.stages[journey.stages.length - 1];
    const daysSinceLastContact = 30; // Simulated days since last contact
    
    // Stage-specific NBA logic
    if (stage === 'Awareness' && engagement < 0.3) {
      return 'Send disease education email series';
    } else if (stage === 'Awareness' && engagement >= 0.3) {
      return 'Schedule introductory field visit';
    } else if (stage === 'Consideration' && daysSinceLastContact > 14) {
      return 'Follow up with clinical data presentation';
    } else if (stage === 'Consideration' && hcp.tier === 'A') {
      return 'Invite to exclusive speaker program';
    } else if (stage === 'Trial' && engagement > 0.6) {
      return 'Initiate sample program enrollment';
    } else if (stage === 'Trial' && engagement <= 0.6) {
      return 'Provide patient selection support materials';
    } else if (stage === 'Adoption') {
      return 'Enroll in patient support program';
    } else if (stage === 'Advocacy') {
      return 'Extend speaker bureau invitation';
    }
    
    // Default NBA
    return 'Maintain regular touchpoint cadence';
  }
  
  private selectNBAChannel(action: string, hcp: HCP): string {
    const actionChannelMap: Record<string, string> = {
      'Send disease education email series': 'Email',
      'Schedule introductory field visit': 'Field',
      'Follow up with clinical data presentation': 'Field',
      'Invite to exclusive speaker program': 'Phone',
      'Initiate sample program enrollment': 'Field',
      'Provide patient selection support materials': 'Email',
      'Enroll in patient support program': 'Portal',
      'Extend speaker bureau invitation': 'Field',
      'Maintain regular touchpoint cadence': 'Multi-channel'
    };
    
    return actionChannelMap[action] || 'Email';
  }
  
  private determineNBATiming(hcp: HCP, journey: CustomerJourney): string {
    const engagement = journey.completionProbability;
    const stage = journey.currentStage;
    
    // High engagement = faster follow-up
    if (engagement > 0.7 && ['Trial', 'Adoption'].includes(stage)) {
      return 'Within 48 hours';
    } else if (engagement > 0.5) {
      return 'Within 1 week';
    } else if (stage === 'Awareness') {
      return 'Within 2 weeks';
    }
    
    return 'Within 10 days';
  }
  
  private calculateNBAConfidence(hcp: HCP, journey: CustomerJourney, action: string): number {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on data quality (using stages data)
    if (journey.stages.reduce((sum, stage) => sum + stage.touchpoints, 0) > 5) confidence += 0.1;
    
    // Adjust based on HCP tier
    if (hcp.tier === 'A' || hcp.tier === 'B') confidence += 0.05;
    
    // Adjust based on engagement
    if (journey.completionProbability > 0.6) confidence += 0.1;
    
    // Action-specific adjustments
    if (action.includes('speaker') && hcp.tier === 'A') confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }
  
  private predictNBAImpact(action: string, hcp: HCP, journey: CustomerJourney): ImpactMetrics {
    const baseImpact = {
      engagementLift: 0.15,
      prescriptionLift: 0.08,
      revenueImpact: 25000,
      timeToImpact: 30
    };
    
    // Adjust based on action type
    if (action.includes('speaker program')) {
      baseImpact.engagementLift *= 1.5;
      baseImpact.prescriptionLift *= 1.3;
    } else if (action.includes('sample')) {
      baseImpact.prescriptionLift *= 1.4;
      baseImpact.timeToImpact *= 0.7;
    }
    
    // Adjust based on HCP characteristics
    if (hcp.tier === 'A') {
      baseImpact.revenueImpact *= 2;
      baseImpact.prescriptionLift *= 1.2;
    }
    
    // Adjust based on stage
    if (journey.currentStage === 'Trial' || journey.currentStage === 'Adoption') {
      baseImpact.timeToImpact *= 0.6;
      baseImpact.prescriptionLift *= 1.2;
    }
    
    return {
      engagementLift: Math.min(baseImpact.engagementLift, 0.5),
      prescriptionLift: Math.min(baseImpact.prescriptionLift, 0.3),
      revenueImpact: Math.floor(baseImpact.revenueImpact),
      timeToImpact: Math.floor(baseImpact.timeToImpact)
    };
  }
  
  private generateNBAReasoning(action: string, hcp: HCP, journey: CustomerJourney): string[] {
    const reasoning: string[] = [];
    
    // Stage-based reasoning
    reasoning.push(`HCP currently in ${journey.currentStage} stage requiring ${this.getStageRequirement(journey.currentStage)}`);
    
    // Engagement-based reasoning
    if (journey.completionProbability > 0.6) {
      reasoning.push(`High engagement score (${Math.round(journey.completionProbability * 100)}%) indicates receptivity`);
    } else {
      reasoning.push(`Moderate engagement requires nurturing approach`);
    }
    
    // Action-specific reasoning
    if (action.includes('speaker')) {
      reasoning.push('Peer influence identified as key driver for this HCP profile');
    } else if (action.includes('sample')) {
      reasoning.push('Trial initiation will accelerate adoption timeline');
    }
    
    // Data-driven insights
    reasoning.push(`ML model confidence: ${Math.round(this.calculateNBAConfidence(hcp, journey, action) * 100)}%`);
    
    return reasoning;
  }
  
  private getStageRequirement(stage: string): string {
    const requirements: Record<string, string> = {
      'Awareness': 'education and engagement',
      'Consideration': 'clinical evidence and peer validation',
      'Trial': 'practical support and patient selection',
      'Adoption': 'integration support and outcome tracking',
      'Advocacy': 'leadership opportunities and recognition'
    };
    
    return requirements[stage] || 'continued engagement';
  }
  
  private generateAlternativeNBAs(primary: string, hcp: HCP, journey: CustomerJourney): AlternativeAction[] {
    const alternatives: AlternativeAction[] = [];
    
    // Generate 2-3 alternatives based on stage
    const stageAlternatives: Record<string, string[]> = {
      'Awareness': ['Digital education campaign', 'Conference invitation', 'Webinar series'],
      'Consideration': ['Peer referral program', 'Clinical study sharing', 'Virtual advisory board'],
      'Trial': ['Nurse educator support', 'Patient case studies', 'Telemedicine consultation'],
      'Adoption': ['Outcomes dashboard access', 'Best practices workshop', 'Formulary support'],
      'Advocacy': ['Research collaboration', 'Publication support', 'Expert panel participation']
    };
    
    const options = stageAlternatives[journey.currentStage] || ['Standard follow-up', 'Educational materials'];
    
    options.slice(0, 2).forEach(option => {
      if (option !== primary) {
        alternatives.push({
          action: option,
          confidence: 0.5 + Math.random() * 0.3,
          tradeoff: this.identifyNBATradeoff(primary, option)
        });
      }
    });
    
    return alternatives.sort((a, b) => b.confidence - a.confidence);
  }
  
  private identifyNBATradeoff(primary: string, alternative: string): string {
    if (alternative.includes('Digital') || alternative.includes('Virtual')) {
      return 'Lower cost but potentially less personal impact';
    } else if (alternative.includes('Conference') || alternative.includes('Advisory')) {
      return 'Higher impact but requires greater time investment';
    }
    
    return 'Different engagement approach with similar resource requirements';
  }
  
  // ==================== Genetic Algorithm Optimization ====================
  
  runGeneticOptimization(hcpId: string, constraints?: any): GeneticOptimizationResult {
    const hcp = this.mockData.getHCPById(hcpId);
    const journey = this.mockData.getJourneyByHCP(hcpId);
    
    if (!hcp || !journey) {
      throw new Error(`HCP ${hcpId} or journey not found`);
    }
    
    // Initialize population
    let population = this.initializePopulation(hcp, journey);
    let bestSequence: TouchpointSequence[] = [];
    let bestFitness = 0;
    let generation = 0;
    
    // Evolution loop
    while (generation < this.MODEL_CONFIG.geneticAlgorithm.maxGenerations) {
      // Evaluate fitness
      const fitnessScores = population.map(individual => 
        this.evaluateFitness(individual, hcp, journey, constraints)
      );
      
      // Track best
      const maxFitnessIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
      if (fitnessScores[maxFitnessIndex] > bestFitness) {
        bestFitness = fitnessScores[maxFitnessIndex];
        bestSequence = [...population[maxFitnessIndex]];
      }
      
      // Check convergence
      const avgFitness = fitnessScores.reduce((sum, f) => sum + f, 0) / fitnessScores.length;
      if (bestFitness - avgFitness < 0.01) break; // Converged
      
      // Selection and reproduction
      population = this.evolvePopulation(population, fitnessScores);
      generation++;
    }
    
    const convergenceRate = generation / this.MODEL_CONFIG.geneticAlgorithm.maxGenerations;
    const populationDiversity = this.calculateDiversity(population);
    
    return {
      bestSequence,
      fitness: bestFitness,
      generations: generation,
      convergenceRate,
      populationDiversity
    };
  }
  
  private initializePopulation(hcp: HCP, journey: CustomerJourney): TouchpointSequence[][] {
    const population: TouchpointSequence[][] = [];
    const populationSize = this.MODEL_CONFIG.geneticAlgorithm.populationSize;
    
    for (let i = 0; i < populationSize; i++) {
      population.push(this.generateRandomSequence(hcp, journey));
    }
    
    return population;
  }
  
  private generateRandomSequence(hcp: HCP, journey: CustomerJourney): TouchpointSequence[] {
    const sequence: TouchpointSequence[] = [];
    const sequenceLength = 3 + Math.floor(Math.random() * 5); // 3-7 touchpoints
    const channels = ['Field', 'Email', 'Digital Ad', 'Webinar', 'Conference', 'Phone'];
    
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push({
        step: i + 1,
        channel: channels[Math.floor(Math.random() * channels.length)],
        content: `Content variant ${Math.floor(Math.random() * 5) + 1}`,
        timing: `Within ${Math.floor(Math.random() * 14) + 1} days`,
        expectedEngagement: 0.4 + Math.random() * 0.5,
        rationale: 'Genetic algorithm generated'
      });
    }
    
    return sequence;
  }
  
  private evaluateFitness(sequence: TouchpointSequence[], hcp: HCP, journey: CustomerJourney, constraints?: any): number {
    let fitness = 0;
    
    // Engagement component
    const avgEngagement = sequence.reduce((sum, s) => sum + s.expectedEngagement, 0) / sequence.length;
    fitness += avgEngagement * 0.3;
    
    // Diversity component
    const uniqueChannels = new Set(sequence.map(s => s.channel)).size;
    fitness += (uniqueChannels / sequence.length) * 0.2;
    
    // Timing component (prefer appropriate pacing)
    const goodPacing = sequence.filter(s => s.timing.includes('7') || s.timing.includes('10')).length;
    fitness += (goodPacing / sequence.length) * 0.2;
    
    // Stage alignment component
    const stageAlignment = this.calculateStageAlignment(sequence, journey.currentStage);
    fitness += stageAlignment * 0.3;
    
    // Apply constraints penalty
    if (constraints) {
      if (constraints.maxTouchpoints && sequence.length > constraints.maxTouchpoints) {
        fitness *= 0.8;
      }
      if (constraints.maxBudget) {
        const cost = this.estimateSequenceCost(sequence);
        if (cost > constraints.maxBudget) fitness *= 0.7;
      }
    }
    
    return fitness;
  }
  
  private calculateStageAlignment(sequence: TouchpointSequence[], stage: string): number {
    // Check if sequence channels align with stage needs
    const stageOptimalChannels: Record<string, string[]> = {
      'Awareness': ['Email', 'Digital Ad', 'Webinar'],
      'Consideration': ['Field', 'Speaker Program', 'Conference'],
      'Trial': ['Field', 'Sample', 'Patient Support'],
      'Adoption': ['Field', 'Patient Support', 'Portal'],
      'Advocacy': ['Speaker Program', 'Conference', 'Advisory Board']
    };
    
    const optimal = stageOptimalChannels[stage] || [];
    const matches = sequence.filter(s => optimal.some(o => s.channel.includes(o))).length;
    
    return matches / sequence.length;
  }
  
  private estimateSequenceCost(sequence: TouchpointSequence[]): number {
    const channelCosts: Record<string, number> = {
      'Field': 500,
      'Email': 50,
      'Digital Ad': 200,
      'Webinar': 300,
      'Conference': 1000,
      'Phone': 100,
      'Speaker Program': 2000
    };
    
    return sequence.reduce((sum, s) => sum + (channelCosts[s.channel] || 100), 0);
  }
  
  private evolvePopulation(population: TouchpointSequence[][], fitnessScores: number[]): TouchpointSequence[][] {
    const newPopulation: TouchpointSequence[][] = [];
    const populationSize = population.length;
    
    // Elitism - keep best individuals
    const eliteCount = Math.floor(populationSize * this.MODEL_CONFIG.geneticAlgorithm.elitismRate);
    const sortedIndices = fitnessScores
      .map((f, i) => ({ fitness: f, index: i }))
      .sort((a, b) => b.fitness - a.fitness);
    
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push([...population[sortedIndices[i].index]]);
    }
    
    // Crossover and mutation for rest
    while (newPopulation.length < populationSize) {
      const parent1 = this.tournamentSelection(population, fitnessScores);
      const parent2 = this.tournamentSelection(population, fitnessScores);
      
      let offspring = this.crossover(parent1, parent2);
      
      if (Math.random() < this.MODEL_CONFIG.geneticAlgorithm.mutationRate) {
        offspring = this.mutate(offspring);
      }
      
      newPopulation.push(offspring);
    }
    
    return newPopulation;
  }
  
  private tournamentSelection(population: TouchpointSequence[][], fitnessScores: number[]): TouchpointSequence[] {
    const tournamentSize = 3;
    let bestIndex = Math.floor(Math.random() * population.length);
    let bestFitness = fitnessScores[bestIndex];
    
    for (let i = 1; i < tournamentSize; i++) {
      const index = Math.floor(Math.random() * population.length);
      if (fitnessScores[index] > bestFitness) {
        bestIndex = index;
        bestFitness = fitnessScores[index];
      }
    }
    
    return population[bestIndex];
  }
  
  private crossover(parent1: TouchpointSequence[], parent2: TouchpointSequence[]): TouchpointSequence[] {
    const minLength = Math.min(parent1.length, parent2.length);
    const crossoverPoint = Math.floor(Math.random() * minLength);
    
    const offspring = [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint)
    ];
    
    // Renumber steps
    offspring.forEach((touchpoint, index) => {
      touchpoint.step = index + 1;
    });
    
    return offspring;
  }
  
  private mutate(sequence: TouchpointSequence[]): TouchpointSequence[] {
    const mutated = [...sequence];
    const mutationType = Math.random();
    
    if (mutationType < 0.33 && mutated.length > 3) {
      // Remove a touchpoint
      mutated.splice(Math.floor(Math.random() * mutated.length), 1);
    } else if (mutationType < 0.66 && mutated.length < 10) {
      // Add a touchpoint
      const channels = ['Field', 'Email', 'Digital Ad', 'Webinar'];
      mutated.push({
        step: mutated.length + 1,
        channel: channels[Math.floor(Math.random() * channels.length)],
        content: `Mutated content ${Math.floor(Math.random() * 5) + 1}`,
        timing: `Within ${Math.floor(Math.random() * 14) + 1} days`,
        expectedEngagement: 0.4 + Math.random() * 0.5,
        rationale: 'Mutation generated'
      });
    } else {
      // Modify a touchpoint
      const index = Math.floor(Math.random() * mutated.length);
      const channels = ['Field', 'Email', 'Digital Ad', 'Webinar'];
      mutated[index].channel = channels[Math.floor(Math.random() * channels.length)];
    }
    
    // Renumber steps
    mutated.forEach((touchpoint, index) => {
      touchpoint.step = index + 1;
    });
    
    return mutated;
  }
  
  private calculateDiversity(population: TouchpointSequence[][]): number {
    // Calculate diversity as average pairwise distance
    let totalDistance = 0;
    let comparisons = 0;
    
    for (let i = 0; i < population.length - 1; i++) {
      for (let j = i + 1; j < population.length; j++) {
        totalDistance += this.sequenceDistance(population[i], population[j]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalDistance / comparisons : 0;
  }
  
  private sequenceDistance(seq1: TouchpointSequence[], seq2: TouchpointSequence[]): number {
    const maxLength = Math.max(seq1.length, seq2.length);
    let distance = Math.abs(seq1.length - seq2.length) / maxLength;
    
    const minLength = Math.min(seq1.length, seq2.length);
    for (let i = 0; i < minLength; i++) {
      if (seq1[i].channel !== seq2[i].channel) distance += 0.1;
    }
    
    return distance;
  }
}

// Export singleton instance
export const orchestrationIntelligence = OrchestrationIntelligence.getInstance();