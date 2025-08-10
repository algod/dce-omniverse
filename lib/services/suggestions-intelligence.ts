// Field Suggestions Intelligence Service
// Provides trigger analysis, performance tracking, and feedback integration

import { mockDataService } from './mock-data-service';
import { FieldSuggestion } from '@/lib/types/pharma';

export interface TriggerRecommendation {
  triggerId: string;
  triggerName: string;
  sensitivity: number;
  currentVolume: number;
  optimalVolume: number;
  priority: number;
  adjustmentReason: string;
  expectedImpact: TriggerImpact;
}

export interface TriggerImpact {
  adoptionRateChange: number;
  completionRateChange: number;
  prescriptionLiftChange: number;
  repSatisfactionChange: number;
}

export interface FeedbackAdjustment {
  triggerType: string;
  currentSettings: TriggerSettings;
  recommendedSettings: TriggerSettings;
  feedbackScore: number;
  adjustmentRationale: string[];
  expectedOutcome: string;
}

export interface TriggerSettings {
  sensitivity: number;
  threshold: number;
  frequency: number;
  priority: number;
  suppressionRules: string[];
}

export interface PerformanceMetrics {
  suggestionId: string;
  triggerType: string;
  adoptionRate: number;
  completionRate: number;
  timeToAction: number;
  prescriptionImpact: number;
  repFeedback: RepFeedbackMetrics;
  businessImpact: BusinessImpactMetrics;
}

export interface RepFeedbackMetrics {
  overallSatisfaction: number;
  relevanceScore: number;
  timingScore: number;
  actionabilityScore: number;
  comments: string[];
}

export interface BusinessImpactMetrics {
  revenueImpact: number;
  hcpEngagementLift: number;
  prescriptionLift: number;
  efficiencyGain: number;
}

export interface TriggerAnalysisResult {
  repId: string;
  territoryId: string;
  activeTriggers: TriggerRecommendation[];
  volumeProjection: VolumeProjection;
  priorityMatrix: PriorityMatrix;
  optimizationOpportunities: string[];
}

export interface VolumeProjection {
  daily: number;
  weekly: number;
  monthly: number;
  capacityUtilization: number;
  recommendedAdjustment: string;
}

export interface PriorityMatrix {
  urgent: string[];
  important: string[];
  routine: string[];
  optional: string[];
}

export class SuggestionsIntelligence {
  private static instance: SuggestionsIntelligence;
  private mockData = mockDataService;
  
  // 7 Trigger types with configurations
  private readonly TRIGGER_CONFIGS = {
    'T001': {
      name: 'Speaker Program Follow-up',
      baseSensitivity: 0.8,
      baseThreshold: 7, // days
      baseFrequency: 2, // per month
      basePriority: 1,
      expectedAdoption: 0.85,
      expectedCompletion: 0.90,
      prescriptionImpact: 0.25
    },
    'T002': {
      name: 'Low Prescription Fulfillment',
      baseSensitivity: 0.7,
      baseThreshold: 0.6, // fulfillment rate
      baseFrequency: 4,
      basePriority: 2,
      expectedAdoption: 0.75,
      expectedCompletion: 0.85,
      prescriptionImpact: 0.20
    },
    'T003': {
      name: 'Positive Payer Coverage',
      baseSensitivity: 0.9,
      baseThreshold: 5, // patients
      baseFrequency: 3,
      basePriority: 3,
      expectedAdoption: 0.80,
      expectedCompletion: 0.88,
      prescriptionImpact: 0.22
    },
    'T004': {
      name: 'Slowed Prescribing Pace',
      baseSensitivity: 0.6,
      baseThreshold: 0.7, // vs baseline
      baseFrequency: 3,
      basePriority: 4,
      expectedAdoption: 0.70,
      expectedCompletion: 0.82,
      prescriptionImpact: 0.18
    },
    'T005': {
      name: 'Single Prescription Pattern',
      baseSensitivity: 0.75,
      baseThreshold: 1, // prescription
      baseFrequency: 5,
      basePriority: 5,
      expectedAdoption: 0.72,
      expectedCompletion: 0.80,
      prescriptionImpact: 0.15
    },
    'T006': {
      name: 'Email Engagement Signal',
      baseSensitivity: 0.85,
      baseThreshold: 3, // opens/clicks
      baseFrequency: 6,
      basePriority: 6,
      expectedAdoption: 0.68,
      expectedCompletion: 0.78,
      prescriptionImpact: 0.12
    },
    'T007': {
      name: 'High Potential Indicator',
      baseSensitivity: 0.7,
      baseThreshold: 0.8, // score
      baseFrequency: 2,
      basePriority: 7,
      expectedAdoption: 0.65,
      expectedCompletion: 0.75,
      prescriptionImpact: 0.30
    }
  };
  
  // Feedback weighting system
  private readonly FEEDBACK_WEIGHTS = {
    repFeedback: 0.40,
    strategicPriority: 0.40,
    behaviorSeverity: 0.20
  };
  
  private constructor() {}
  
  static getInstance(): SuggestionsIntelligence {
    if (!SuggestionsIntelligence.instance) {
      SuggestionsIntelligence.instance = new SuggestionsIntelligence();
    }
    return SuggestionsIntelligence.instance;
  }
  
  // ==================== Trigger Analysis ====================
  
  evaluateTriggers(repId: string): TriggerAnalysisResult {
    const fieldData = this.mockData.getFieldData();
    const repData = fieldData.repPerformance.find(r => r.repId === repId);
    
    if (!repData) {
      throw new Error(`Rep ${repId} not found`);
    }
    
    const activeTriggers = this.analyzeActiveTriggers(repData);
    const volumeProjection = this.projectVolume(activeTriggers, repData);
    const priorityMatrix = this.buildPriorityMatrix(activeTriggers);
    const optimizationOpportunities = this.identifyOptimizations(activeTriggers, repData);
    
    return {
      repId,
      territoryId: repData.territory,
      activeTriggers,
      volumeProjection,
      priorityMatrix,
      optimizationOpportunities
    };
  }
  
  private analyzeActiveTriggers(repData: any): TriggerRecommendation[] {
    const triggers: TriggerRecommendation[] = [];
    
    Object.entries(this.TRIGGER_CONFIGS).forEach(([triggerId, config]) => {
      const currentVolume = this.calculateCurrentVolume(triggerId, repData);
      const optimalVolume = this.calculateOptimalVolume(triggerId, repData);
      const sensitivity = this.adjustSensitivity(config.baseSensitivity, repData);
      
      triggers.push({
        triggerId,
        triggerName: config.name,
        sensitivity,
        currentVolume,
        optimalVolume,
        priority: config.basePriority,
        adjustmentReason: this.generateAdjustmentReason(currentVolume, optimalVolume, sensitivity),
        expectedImpact: this.predictTriggerImpact(triggerId, sensitivity, repData)
      });
    });
    
    return triggers.sort((a, b) => a.priority - b.priority);
  }
  
  private calculateCurrentVolume(triggerId: string, repData: any): number {
    // Simulate current trigger volume based on rep activity
    const baseVolume = repData.metrics.suggestionsAdopted || 10;
    const triggerConfig = this.TRIGGER_CONFIGS[triggerId as keyof typeof this.TRIGGER_CONFIGS];
    
    return Math.floor(baseVolume * (triggerConfig.baseFrequency / 20) * (1 + Math.random() * 0.3));
  }
  
  private calculateOptimalVolume(triggerId: string, repData: any): number {
    const config = this.TRIGGER_CONFIGS[triggerId as keyof typeof this.TRIGGER_CONFIGS];
    
    // Base optimal volume
    let optimal = config.baseFrequency;
    
    // Adjust based on rep performance
    if (repData.metrics.conversionRate > 0.2) optimal *= 1.2;
    if (repData.metrics.avgCallQuality > 0.8) optimal *= 1.1;
    
    // Adjust based on territory needs
    const territoryMultiplier = 1 + (Math.random() * 0.3);
    optimal *= territoryMultiplier;
    
    // Cap at 20 per week (4 per day)
    return Math.min(Math.floor(optimal), 20);
  }
  
  private adjustSensitivity(baseSensitivity: number, repData: any): number {
    let sensitivity = baseSensitivity;
    
    // Adjust based on rep experience (implied by performance)
    if (repData.ranking <= 50) {
      sensitivity *= 0.9; // Top performers need less sensitive triggers
    } else if (repData.ranking > 150) {
      sensitivity *= 1.1; // Lower performers benefit from more triggers
    }
    
    // Adjust based on adoption rate
    const adoptionRate = repData.metrics.suggestionsAdopted / (repData.metrics.suggestionsAdopted + 5);
    if (adoptionRate > 0.8) sensitivity *= 1.05;
    else if (adoptionRate < 0.5) sensitivity *= 0.95;
    
    return Math.max(0.3, Math.min(1.0, sensitivity));
  }
  
  private generateAdjustmentReason(current: number, optimal: number, sensitivity: number): string {
    const volumeDiff = optimal - current;
    
    if (volumeDiff > 5) {
      return `Increase volume by ${volumeDiff} to capture missed opportunities`;
    } else if (volumeDiff < -5) {
      return `Reduce volume by ${Math.abs(volumeDiff)} to prevent alert fatigue`;
    } else if (sensitivity > 0.85) {
      return 'High sensitivity may generate noise - consider refinement';
    } else if (sensitivity < 0.5) {
      return 'Low sensitivity may miss important signals - consider increasing';
    }
    
    return 'Current settings are well-optimized';
  }
  
  private predictTriggerImpact(triggerId: string, sensitivity: number, repData: any): TriggerImpact {
    const config = this.TRIGGER_CONFIGS[triggerId as keyof typeof this.TRIGGER_CONFIGS];
    
    // Base impact
    let adoptionRateChange = (config.expectedAdoption - 0.7) * sensitivity;
    const completionRateChange = (config.expectedCompletion - 0.8) * sensitivity;
    let prescriptionLiftChange = config.prescriptionImpact * sensitivity;
    let repSatisfactionChange = 0;
    
    // Adjust based on rep profile
    if (repData.metrics.avgCallQuality > 0.8) {
      prescriptionLiftChange *= 1.2;
      repSatisfactionChange = 0.1;
    }
    
    // Sensitivity adjustments
    if (sensitivity > 0.9) {
      repSatisfactionChange -= 0.1; // Too many alerts
    } else if (sensitivity < 0.5) {
      adoptionRateChange *= 0.8; // Too few relevant alerts
    }
    
    return {
      adoptionRateChange: Math.round(adoptionRateChange * 100) / 100,
      completionRateChange: Math.round(completionRateChange * 100) / 100,
      prescriptionLiftChange: Math.round(prescriptionLiftChange * 100) / 100,
      repSatisfactionChange: Math.round(repSatisfactionChange * 100) / 100
    };
  }
  
  private projectVolume(triggers: TriggerRecommendation[], repData: any): VolumeProjection {
    const totalOptimal = triggers.reduce((sum, t) => sum + t.optimalVolume, 0);
    const totalCurrent = triggers.reduce((sum, t) => sum + t.currentVolume, 0);
    
    const daily = Math.floor(totalOptimal / 5); // 5 working days
    const weekly = totalOptimal;
    const monthly = totalOptimal * 4.3; // Average weeks per month
    
    const maxCapacity = 20; // Max suggestions per week
    const capacityUtilization = (weekly / maxCapacity) * 100;
    
    let recommendedAdjustment = 'Current volume is appropriate';
    
    if (capacityUtilization > 90) {
      recommendedAdjustment = 'Reduce sensitivity to stay within capacity';
    } else if (capacityUtilization < 50) {
      recommendedAdjustment = 'Increase sensitivity to optimize rep utilization';
    } else if (totalOptimal > totalCurrent * 1.3) {
      recommendedAdjustment = 'Gradually increase volume to reach optimal levels';
    }
    
    return {
      daily,
      weekly,
      monthly: Math.floor(monthly),
      capacityUtilization: Math.round(capacityUtilization),
      recommendedAdjustment
    };
  }
  
  private buildPriorityMatrix(triggers: TriggerRecommendation[]): PriorityMatrix {
    const matrix: PriorityMatrix = {
      urgent: [],
      important: [],
      routine: [],
      optional: []
    };
    
    triggers.forEach(trigger => {
      const impact = trigger.expectedImpact.prescriptionLiftChange;
      const volume = trigger.currentVolume;
      
      if (trigger.priority <= 2 && impact > 0.2) {
        matrix.urgent.push(trigger.triggerName);
      } else if (trigger.priority <= 4 && impact > 0.15) {
        matrix.important.push(trigger.triggerName);
      } else if (trigger.priority <= 6) {
        matrix.routine.push(trigger.triggerName);
      } else {
        matrix.optional.push(trigger.triggerName);
      }
    });
    
    return matrix;
  }
  
  private identifyOptimizations(triggers: TriggerRecommendation[], repData: any): string[] {
    const optimizations: string[] = [];
    
    // Volume optimization
    const totalVolume = triggers.reduce((sum, t) => sum + t.currentVolume, 0);
    const optimalVolume = triggers.reduce((sum, t) => sum + t.optimalVolume, 0);
    
    if (optimalVolume > totalVolume * 1.2) {
      optimizations.push(`Increase trigger volume by ${Math.round((optimalVolume - totalVolume) / totalVolume * 100)}% to capture opportunities`);
    }
    
    // Sensitivity optimization
    const highSensitivity = triggers.filter(t => t.sensitivity > 0.85);
    if (highSensitivity.length > 3) {
      optimizations.push('Reduce sensitivity on low-priority triggers to prevent alert fatigue');
    }
    
    // Priority optimization
    const urgentTriggers = triggers.filter(t => t.priority <= 2);
    if (urgentTriggers.some(t => t.currentVolume < t.optimalVolume * 0.7)) {
      optimizations.push('Increase focus on high-priority triggers with low current volume');
    }
    
    // Performance-based optimization
    if (repData.metrics.conversionRate > 0.25) {
      optimizations.push('High-performing rep - consider advanced trigger types');
    }
    
    return optimizations;
  }
  
  // ==================== Feedback Integration ====================
  
  processFeedback(triggerId: string, feedback: RepFeedbackMetrics): FeedbackAdjustment {
    const config = this.TRIGGER_CONFIGS[triggerId as keyof typeof this.TRIGGER_CONFIGS];
    if (!config) {
      throw new Error(`Unknown trigger: ${triggerId}`);
    }
    
    const currentSettings = this.getCurrentSettings(triggerId, config);
    const feedbackScore = this.calculateFeedbackScore(feedback);
    const recommendedSettings = this.adjustSettingsBasedOnFeedback(currentSettings, feedbackScore, feedback);
    const adjustmentRationale = this.generateFeedbackRationale(currentSettings, recommendedSettings, feedback);
    const expectedOutcome = this.predictFeedbackOutcome(recommendedSettings, feedbackScore);
    
    return {
      triggerType: config.name,
      currentSettings,
      recommendedSettings,
      feedbackScore,
      adjustmentRationale,
      expectedOutcome
    };
  }
  
  private getCurrentSettings(triggerId: string, config: any): TriggerSettings {
    return {
      sensitivity: config.baseSensitivity,
      threshold: config.baseThreshold,
      frequency: config.baseFrequency,
      priority: config.basePriority,
      suppressionRules: this.getSuppressionRules(triggerId)
    };
  }
  
  private getSuppressionRules(triggerId: string): string[] {
    const baseRules = [
      'Suppress if HCP on vacation',
      'Suppress if suggestion already active',
      'Suppress if rep at capacity (>4 daily)'
    ];
    
    // Trigger-specific rules
    const specificRules: Record<string, string[]> = {
      'T001': ['Suppress if speaker program >30 days ago'],
      'T002': ['Suppress if payer issue already identified'],
      'T003': ['Suppress if no eligible patients'],
      'T004': ['Suppress if seasonal variation expected'],
      'T005': ['Suppress if patient recently started'],
      'T006': ['Suppress if email bounced'],
      'T007': ['Suppress if recently engaged']
    };
    
    return [...baseRules, ...(specificRules[triggerId] || [])];
  }
  
  private calculateFeedbackScore(feedback: RepFeedbackMetrics): number {
    const weights = {
      overallSatisfaction: 0.3,
      relevanceScore: 0.3,
      timingScore: 0.2,
      actionabilityScore: 0.2
    };
    
    return (
      feedback.overallSatisfaction * weights.overallSatisfaction +
      feedback.relevanceScore * weights.relevanceScore +
      feedback.timingScore * weights.timingScore +
      feedback.actionabilityScore * weights.actionabilityScore
    );
  }
  
  private adjustSettingsBasedOnFeedback(
    current: TriggerSettings,
    feedbackScore: number,
    feedback: RepFeedbackMetrics
  ): TriggerSettings {
    const adjusted = { ...current };
    
    // Adjust sensitivity based on relevance feedback
    if (feedback.relevanceScore < 0.5) {
      adjusted.sensitivity *= 0.9; // Reduce if not relevant
    } else if (feedback.relevanceScore > 0.8) {
      adjusted.sensitivity = Math.min(adjusted.sensitivity * 1.1, 1.0);
    }
    
    // Adjust frequency based on timing feedback
    if (feedback.timingScore < 0.5) {
      adjusted.frequency = Math.max(adjusted.frequency - 1, 1);
    } else if (feedback.timingScore > 0.8 && feedbackScore > 0.7) {
      adjusted.frequency = Math.min(adjusted.frequency + 1, 10);
    }
    
    // Adjust priority based on actionability
    if (feedback.actionabilityScore > 0.8 && feedbackScore > 0.75) {
      adjusted.priority = Math.max(adjusted.priority - 1, 1);
    } else if (feedback.actionabilityScore < 0.4) {
      adjusted.priority = Math.min(adjusted.priority + 1, 7);
    }
    
    // Adjust threshold based on overall satisfaction
    if (feedback.overallSatisfaction < 0.5) {
      adjusted.threshold *= 1.1; // Make less sensitive
    } else if (feedback.overallSatisfaction > 0.8) {
      adjusted.threshold *= 0.95; // Make more sensitive
    }
    
    return adjusted;
  }
  
  private generateFeedbackRationale(
    current: TriggerSettings,
    recommended: TriggerSettings,
    feedback: RepFeedbackMetrics
  ): string[] {
    const rationale: string[] = [];
    
    if (recommended.sensitivity !== current.sensitivity) {
      const change = recommended.sensitivity > current.sensitivity ? 'increased' : 'decreased';
      rationale.push(`Sensitivity ${change} based on ${Math.round(feedback.relevanceScore * 100)}% relevance score`);
    }
    
    if (recommended.frequency !== current.frequency) {
      const change = recommended.frequency > current.frequency ? 'increased' : 'decreased';
      rationale.push(`Frequency ${change} to improve timing (current score: ${Math.round(feedback.timingScore * 100)}%)`);
    }
    
    if (recommended.priority !== current.priority) {
      const change = recommended.priority < current.priority ? 'increased' : 'decreased';
      rationale.push(`Priority ${change} based on actionability feedback`);
    }
    
    // Add feedback comments analysis
    if (feedback.comments.length > 0) {
      rationale.push(`Rep feedback indicates: "${feedback.comments[0]}"`);
    }
    
    return rationale;
  }
  
  private predictFeedbackOutcome(settings: TriggerSettings, feedbackScore: number): string {
    if (feedbackScore > 0.8) {
      return `Expected ${Math.round(settings.frequency * 0.85)}% adoption with high satisfaction`;
    } else if (feedbackScore > 0.6) {
      return `Moderate adoption expected (${Math.round(settings.frequency * 0.7)}%) with improvements`;
    } else {
      return `Settings adjustment should improve adoption from current ${Math.round(feedbackScore * 100)}%`;
    }
  }
  
  // ==================== Performance Tracking ====================
  
  trackPerformance(suggestionId: string): PerformanceMetrics {
    const fieldData = this.mockData.getFieldData();
    
    // Simulate performance data
    const triggerType = this.identifyTriggerType(suggestionId);
    const adoptionRate = this.calculateAdoptionRate(suggestionId);
    const completionRate = this.calculateCompletionRate(suggestionId);
    const timeToAction = this.calculateTimeToAction(suggestionId);
    const prescriptionImpact = this.calculatePrescriptionImpact(triggerType);
    const repFeedback = this.collectRepFeedback(suggestionId);
    const businessImpact = this.calculateBusinessImpact(triggerType, adoptionRate, completionRate);
    
    return {
      suggestionId,
      triggerType,
      adoptionRate,
      completionRate,
      timeToAction,
      prescriptionImpact,
      repFeedback,
      businessImpact
    };
  }
  
  private identifyTriggerType(suggestionId: string): string {
    // Map suggestion to trigger type
    const triggerTypes = Object.keys(this.TRIGGER_CONFIGS);
    const index = parseInt(suggestionId.replace(/\D/g, '')) % triggerTypes.length;
    return triggerTypes[index];
  }
  
  private calculateAdoptionRate(suggestionId: string): number {
    // Simulate adoption rate
    const base = 0.73; // Overall 73% adoption
    const variation = (Math.random() - 0.5) * 0.2;
    return Math.max(0.4, Math.min(0.95, base + variation));
  }
  
  private calculateCompletionRate(suggestionId: string): number {
    // Simulate completion rate
    const base = 0.89; // Overall 89% completion
    const variation = (Math.random() - 0.5) * 0.15;
    return Math.max(0.6, Math.min(0.98, base + variation));
  }
  
  private calculateTimeToAction(suggestionId: string): number {
    // Average time to action in hours
    const base = 24; // 1 day average
    const variation = Math.random() * 48 - 24; // +/- 1 day
    return Math.max(1, base + variation);
  }
  
  private calculatePrescriptionImpact(triggerType: string): number {
    const config = this.TRIGGER_CONFIGS[triggerType as keyof typeof this.TRIGGER_CONFIGS];
    if (!config) return 0.1;
    
    const baseImpact = config.prescriptionImpact;
    const variation = (Math.random() - 0.5) * 0.1;
    return Math.max(0.05, Math.min(0.4, baseImpact + variation));
  }
  
  private collectRepFeedback(suggestionId: string): RepFeedbackMetrics {
    return {
      overallSatisfaction: 0.6 + Math.random() * 0.35,
      relevanceScore: 0.65 + Math.random() * 0.3,
      timingScore: 0.55 + Math.random() * 0.4,
      actionabilityScore: 0.7 + Math.random() * 0.25,
      comments: this.generateFeedbackComments()
    };
  }
  
  private generateFeedbackComments(): string[] {
    const comments = [
      'Very helpful for prioritizing my day',
      'Timing could be better - received after call',
      'Great insight on HCP readiness',
      'Too many similar suggestions',
      'Helped close an important opportunity',
      'Would prefer more context on why triggered'
    ];
    
    // Return 1-2 random comments
    const numComments = Math.floor(Math.random() * 2) + 1;
    return comments.sort(() => Math.random() - 0.5).slice(0, numComments);
  }
  
  private calculateBusinessImpact(triggerType: string, adoptionRate: number, completionRate: number): BusinessImpactMetrics {
    const config = this.TRIGGER_CONFIGS[triggerType as keyof typeof this.TRIGGER_CONFIGS];
    
    const revenueImpact = Math.floor(50000 * adoptionRate * completionRate * (config?.prescriptionImpact || 0.15));
    const hcpEngagementLift = adoptionRate * 0.3;
    const prescriptionLift = completionRate * (config?.prescriptionImpact || 0.15);
    const efficiencyGain = (adoptionRate + completionRate) / 2 * 0.25;
    
    return {
      revenueImpact,
      hcpEngagementLift: Math.round(hcpEngagementLift * 100) / 100,
      prescriptionLift: Math.round(prescriptionLift * 100) / 100,
      efficiencyGain: Math.round(efficiencyGain * 100) / 100
    };
  }
  
  // ==================== Territory-Level Analysis ====================
  
  analyzeTerritoryTriggers(territoryId: string): TerritoryTriggerAnalysis {
    const fieldData = this.mockData.getFieldData();
    const territoryReps = fieldData.repPerformance.filter(r => r.territory === territoryId);
    
    const triggerPerformance = this.analyzeTriggerPerformanceByTerritory(territoryReps);
    const adoptionPatterns = this.analyzeAdoptionPatterns(territoryReps);
    const optimizationRecommendations = this.generateTerritoryOptimizations(triggerPerformance, adoptionPatterns);
    const benchmarkComparison = this.compareToNationalBenchmarks(triggerPerformance);
    
    return {
      territoryId,
      repCount: territoryReps.length,
      triggerPerformance,
      adoptionPatterns,
      optimizationRecommendations,
      benchmarkComparison
    };
  }
  
  private analyzeTriggerPerformanceByTerritory(reps: any[]): TriggerPerformanceByType {
    const performance: TriggerPerformanceByType = {};
    
    Object.entries(this.TRIGGER_CONFIGS).forEach(([triggerId, config]) => {
      const avgAdoption = reps.reduce((sum, r) => sum + (r.metrics.suggestionsAdopted / 20), 0) / reps.length;
      const avgCompletion = 0.85 + (Math.random() - 0.5) * 0.2;
      const avgTimeToAction = 20 + Math.random() * 20;
      
      performance[triggerId] = {
        triggerName: config.name,
        adoptionRate: avgAdoption,
        completionRate: avgCompletion,
        avgTimeToAction,
        volumeGenerated: Math.floor(config.baseFrequency * reps.length * 4), // Monthly
        successRate: avgAdoption * avgCompletion
      };
    });
    
    return performance;
  }
  
  private analyzeAdoptionPatterns(reps: any[]): AdoptionPattern[] {
    const patterns: AdoptionPattern[] = [];
    
    // High adopters pattern
    const highAdopters = reps.filter(r => r.metrics.suggestionsAdopted > 15);
    if (highAdopters.length > 0) {
      patterns.push({
        pattern: 'High Adoption Segment',
        repCount: highAdopters.length,
        characteristics: ['Experienced reps', 'High call volume', 'Strong HCP relationships'],
        recommendations: ['Increase trigger sensitivity', 'Add advanced trigger types']
      });
    }
    
    // Low adopters pattern
    const lowAdopters = reps.filter(r => r.metrics.suggestionsAdopted < 8);
    if (lowAdopters.length > 0) {
      patterns.push({
        pattern: 'Low Adoption Segment',
        repCount: lowAdopters.length,
        characteristics: ['New reps', 'Lower activity levels', 'Training needs'],
        recommendations: ['Simplify triggers', 'Provide additional training', 'Reduce volume']
      });
    }
    
    // Time-based pattern
    patterns.push({
      pattern: 'Peak Adoption Times',
      repCount: reps.length,
      characteristics: ['Morning hours (8-10 AM)', 'Tuesday-Thursday', 'Mid-month'],
      recommendations: ['Time suggestion delivery for peak hours', 'Avoid Monday mornings and Fridays']
    });
    
    return patterns;
  }
  
  private generateTerritoryOptimizations(performance: any, patterns: any[]): string[] {
    const optimizations: string[] = [];
    
    // Performance-based optimizations
    const lowPerformers = Object.values(performance).filter((p: any) => p.successRate < 0.6);
    if (lowPerformers.length > 2) {
      optimizations.push('Focus on improving adoption for underperforming trigger types');
    }
    
    // Pattern-based optimizations
    const hasLowAdopters = patterns.some(p => p.pattern.includes('Low Adoption'));
    if (hasLowAdopters) {
      optimizations.push('Implement targeted training for low-adoption rep segment');
    }
    
    // Volume optimization
    const totalVolume = Object.values(performance).reduce((sum: number, p: any) => sum + p.volumeGenerated, 0);
    const avgVolumePerRep = totalVolume / (patterns[0]?.repCount || 1);
    
    if (avgVolumePerRep > 80) {
      optimizations.push('Reduce trigger sensitivity to prevent overload');
    } else if (avgVolumePerRep < 40) {
      optimizations.push('Increase trigger sensitivity to optimize rep utilization');
    }
    
    return optimizations;
  }
  
  private compareToNationalBenchmarks(performance: any): BenchmarkComparison {
    const nationalBenchmarks = {
      adoptionRate: 0.73,
      completionRate: 0.89,
      avgTimeToAction: 24,
      successRate: 0.65
    };
    
    const territoryMetrics = {
      adoptionRate: Object.values(performance).reduce((sum: number, p: any) => sum + p.adoptionRate, 0) / Object.keys(performance).length,
      completionRate: Object.values(performance).reduce((sum: number, p: any) => sum + p.completionRate, 0) / Object.keys(performance).length,
      avgTimeToAction: Object.values(performance).reduce((sum: number, p: any) => sum + p.avgTimeToAction, 0) / Object.keys(performance).length,
      successRate: Object.values(performance).reduce((sum: number, p: any) => sum + p.successRate, 0) / Object.keys(performance).length
    };
    
    return {
      territoryMetrics,
      nationalBenchmarks,
      percentileRank: this.calculatePercentileRank(territoryMetrics, nationalBenchmarks),
      strengths: this.identifyStrengths(territoryMetrics, nationalBenchmarks),
      improvements: this.identifyImprovements(territoryMetrics, nationalBenchmarks)
    };
  }
  
  private calculatePercentileRank(territory: any, national: any): number {
    let score = 0;
    let count = 0;
    
    Object.keys(territory).forEach(metric => {
      if (territory[metric] > national[metric]) {
        score += (territory[metric] / national[metric] - 1) * 100;
      } else {
        score -= (1 - territory[metric] / national[metric]) * 100;
      }
      count++;
    });
    
    // Convert to percentile (50 = average, 100 = top, 0 = bottom)
    return Math.max(0, Math.min(100, 50 + score / count));
  }
  
  private identifyStrengths(territory: any, national: any): string[] {
    const strengths: string[] = [];
    
    if (territory.adoptionRate > national.adoptionRate * 1.1) {
      strengths.push(`Strong adoption rate (${Math.round(territory.adoptionRate * 100)}% vs ${Math.round(national.adoptionRate * 100)}% national)`);
    }
    
    if (territory.avgTimeToAction < national.avgTimeToAction * 0.9) {
      strengths.push(`Fast response time (${Math.round(territory.avgTimeToAction)}h vs ${Math.round(national.avgTimeToAction)}h national)`);
    }
    
    if (territory.successRate > national.successRate * 1.1) {
      strengths.push(`High success rate (${Math.round(territory.successRate * 100)}%)`);
    }
    
    return strengths;
  }
  
  private identifyImprovements(territory: any, national: any): string[] {
    const improvements: string[] = [];
    
    if (territory.adoptionRate < national.adoptionRate * 0.9) {
      improvements.push(`Improve adoption rate (currently ${Math.round((territory.adoptionRate / national.adoptionRate) * 100)}% of national average)`);
    }
    
    if (territory.completionRate < national.completionRate * 0.9) {
      improvements.push(`Increase completion rate through better follow-up`);
    }
    
    if (territory.avgTimeToAction > national.avgTimeToAction * 1.1) {
      improvements.push(`Reduce time to action through better prioritization`);
    }
    
    return improvements;
  }
  
  // ==================== Suggestion Configuration ====================
  
  configureTriggers(config: TriggerConfiguration): ConfigurationResult {
    const validationResult = this.validateConfiguration(config);
    
    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        projectedImpact: null
      };
    }
    
    const projectedImpact = this.projectConfigurationImpact(config);
    const implementationPlan = this.generateImplementationPlan(config);
    
    return {
      success: true,
      errors: [],
      warnings: validationResult.warnings,
      projectedImpact,
      implementationPlan
    };
  }
  
  private validateConfiguration(config: TriggerConfiguration): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate volume constraints
    const totalVolume = Object.values(config.triggers).reduce((sum: number, t: any) => 
      sum + (t.enabled ? t.frequency : 0), 0);
    
    if (totalVolume > 20) {
      errors.push(`Total volume (${totalVolume}/week) exceeds maximum capacity of 20`);
    } else if (totalVolume > 18) {
      warnings.push(`High volume (${totalVolume}/week) may cause rep fatigue`);
    }
    
    // Validate sensitivity settings
    Object.entries(config.triggers).forEach(([triggerId, settings]: [string, any]) => {
      if (settings.sensitivity > 0.95) {
        warnings.push(`${triggerId}: Very high sensitivity may generate false positives`);
      } else if (settings.sensitivity < 0.3) {
        warnings.push(`${triggerId}: Very low sensitivity may miss opportunities`);
      }
    });
    
    // Validate suppression rules
    if (config.globalSuppressionRules && config.globalSuppressionRules.length > 10) {
      warnings.push('Too many suppression rules may significantly reduce suggestion volume');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private projectConfigurationImpact(config: TriggerConfiguration): ProjectedImpact {
    let totalAdoption = 0;
    let totalPrescriptionLift = 0;
    let totalRevenue = 0;
    
    Object.entries(config.triggers).forEach(([triggerId, settings]: [string, any]) => {
      if (settings.enabled) {
        const triggerConfig = this.TRIGGER_CONFIGS[triggerId as keyof typeof this.TRIGGER_CONFIGS];
        if (triggerConfig) {
          const adoption = triggerConfig.expectedAdoption * settings.sensitivity;
          const prescriptionLift = triggerConfig.prescriptionImpact * settings.sensitivity * adoption;
          const revenue = prescriptionLift * 500000; // Estimated revenue per percentage point
          
          totalAdoption += adoption * settings.frequency;
          totalPrescriptionLift += prescriptionLift;
          totalRevenue += revenue;
        }
      }
    });
    
    return {
      expectedAdoptionRate: Math.min(0.95, totalAdoption / 20), // Normalize by max volume
      expectedCompletionRate: 0.85, // Typical completion rate
      projectedPrescriptionLift: totalPrescriptionLift,
      projectedRevenueImpact: Math.floor(totalRevenue),
      timeToImpact: 60 // days
    };
  }
  
  private generateImplementationPlan(config: TriggerConfiguration): ImplementationPlan {
    const phases: ImplementationPhase[] = [];
    
    // Phase 1: High-priority triggers
    const highPriorityTriggers = Object.entries(config.triggers)
      .filter(([id, s]: [string, any]) => s.enabled && s.priority <= 3)
      .map(([id]) => id);
    
    if (highPriorityTriggers.length > 0) {
      phases.push({
        phase: 1,
        name: 'High-Priority Trigger Activation',
        triggers: highPriorityTriggers,
        timeline: 'Week 1-2',
        successCriteria: ['75% adoption rate', '85% completion rate', 'Positive rep feedback']
      });
    }
    
    // Phase 2: Medium-priority triggers
    const mediumPriorityTriggers = Object.entries(config.triggers)
      .filter(([id, s]: [string, any]) => s.enabled && s.priority > 3 && s.priority <= 5)
      .map(([id]) => id);
    
    if (mediumPriorityTriggers.length > 0) {
      phases.push({
        phase: 2,
        name: 'Medium-Priority Trigger Rollout',
        triggers: mediumPriorityTriggers,
        timeline: 'Week 3-4',
        successCriteria: ['70% adoption rate', '80% completion rate', 'Volume within capacity']
      });
    }
    
    // Phase 3: Optimization
    phases.push({
      phase: 3,
      name: 'Optimization and Refinement',
      triggers: [],
      timeline: 'Week 5-6',
      successCriteria: ['Sensitivity adjustments based on feedback', 'Volume optimization', 'ROI validation']
    });
    
    return {
      phases,
      totalDuration: '6 weeks',
      riskMitigation: [
        'Monitor rep feedback closely in first 2 weeks',
        'Have rollback plan ready if adoption <50%',
        'Provide additional training for complex triggers'
      ]
    };
  }
}

// Type definitions
interface TerritoryTriggerAnalysis {
  territoryId: string;
  repCount: number;
  triggerPerformance: TriggerPerformanceByType;
  adoptionPatterns: AdoptionPattern[];
  optimizationRecommendations: string[];
  benchmarkComparison: BenchmarkComparison;
}

interface TriggerPerformanceByType {
  [triggerId: string]: {
    triggerName: string;
    adoptionRate: number;
    completionRate: number;
    avgTimeToAction: number;
    volumeGenerated: number;
    successRate: number;
  };
}

interface AdoptionPattern {
  pattern: string;
  repCount: number;
  characteristics: string[];
  recommendations: string[];
}

interface BenchmarkComparison {
  territoryMetrics: any;
  nationalBenchmarks: any;
  percentileRank: number;
  strengths: string[];
  improvements: string[];
}

interface TriggerConfiguration {
  triggers: Record<string, any>;
  globalSuppressionRules?: string[];
  volumeLimit?: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ConfigurationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  projectedImpact: ProjectedImpact | null;
  implementationPlan?: ImplementationPlan;
}

interface ProjectedImpact {
  expectedAdoptionRate: number;
  expectedCompletionRate: number;
  projectedPrescriptionLift: number;
  projectedRevenueImpact: number;
  timeToImpact: number;
}

interface ImplementationPlan {
  phases: ImplementationPhase[];
  totalDuration: string;
  riskMitigation: string[];
}

interface ImplementationPhase {
  phase: number;
  name: string;
  triggers: string[];
  timeline: string;
  successCriteria: string[];
}

// Export singleton instance
export const suggestionsIntelligence = SuggestionsIntelligence.getInstance();