import { BaseAgent, AgentResponse } from './base-agent';
import { 
  FieldSuggestion as FieldSuggestionType,
  FieldSuggestionTrigger,
  HCP as HCPType,
  PrescribingData,
  Engagement,
  HCPOpportunity
} from '@/lib/types/pharma';

// The 7 primary triggers from requirements
export const PHARMA_SUGGESTION_TRIGGERS: FieldSuggestionTrigger[] = [
  {
    id: 'TR001',
    name: 'Speaker Program Follow-up',
    description: 'HCP attended speaker program without follow-up within 7 days',
    criteria: [
      {
        metric: 'speaker_program_attendance',
        operator: '>',
        value: 0,
        lookbackDays: 30
      },
      {
        metric: 'follow_up_call',
        operator: '=',
        value: 0,
        lookbackDays: 7
      }
    ],
    priority: 1,
    isActive: true,
    maxWeeklyVolume: 5,
    suppressionRules: ['recent_contact_within_3_days'],
    sensitivity: {
      threshold: 0.9,
      adjustment: 0.1
    }
  },
  {
    id: 'TR002',
    name: 'Low Prescription Fulfillment',
    description: 'Low/declining prescription fulfillment rate detected',
    criteria: [
      {
        metric: 'fulfillment_rate',
        operator: '<',
        value: 0.6,
        lookbackDays: 30
      },
      {
        metric: 'fulfillment_trend',
        operator: '=',
        value: 'declining',
        lookbackDays: 90
      }
    ],
    priority: 2,
    isActive: true,
    maxWeeklyVolume: 4,
    suppressionRules: ['patient_support_engaged'],
    sensitivity: {
      threshold: 0.6,
      adjustment: 0.05
    }
  },
  {
    id: 'TR003',
    name: 'Positive Payer Coverage',
    description: 'High volume of patients with recent positive payer coverage',
    criteria: [
      {
        metric: 'patient_volume',
        operator: '>',
        value: 50,
        lookbackDays: 30
      },
      {
        metric: 'payer_coverage_improvement',
        operator: '>',
        value: 0.2,
        lookbackDays: 14
      }
    ],
    priority: 3,
    isActive: true,
    maxWeeklyVolume: 3,
    suppressionRules: ['formulary_discussion_recent'],
    sensitivity: {
      threshold: 0.7,
      adjustment: 0.1
    }
  },
  {
    id: 'TR004',
    name: 'Slowed Prescribing Pace',
    description: 'Slowed prescribing pace compared to historical average',
    criteria: [
      {
        metric: 'current_prescribing_rate',
        operator: '<',
        value: 0.7,
        lookbackDays: 30
      },
      {
        metric: 'historical_average',
        operator: 'between',
        value: [0.8, 1.2],
        lookbackDays: 180
      }
    ],
    priority: 4,
    isActive: true,
    maxWeeklyVolume: 3,
    suppressionRules: ['vacation_period', 'seasonal_low'],
    sensitivity: {
      threshold: 0.7,
      adjustment: 0.15
    }
  },
  {
    id: 'TR005',
    name: 'Single Prescription',
    description: 'Single prescription without continuation in expected timeframe',
    criteria: [
      {
        metric: 'new_prescriptions',
        operator: '=',
        value: 1,
        lookbackDays: 60
      },
      {
        metric: 'refills',
        operator: '=',
        value: 0,
        lookbackDays: 30
      }
    ],
    priority: 5,
    isActive: true,
    maxWeeklyVolume: 2,
    suppressionRules: ['patient_discontinued', 'switched_therapy'],
    sensitivity: {
      threshold: 0.8,
      adjustment: 0.1
    }
  },
  {
    id: 'TR006',
    name: 'Email Engagement Spike',
    description: 'Email engagement indicating readiness to prescribe',
    criteria: [
      {
        metric: 'email_opens',
        operator: '>',
        value: 3,
        lookbackDays: 7
      },
      {
        metric: 'content_clicks',
        operator: '>',
        value: 2,
        lookbackDays: 7
      },
      {
        metric: 'clinical_content_view',
        operator: '>',
        value: 0,
        lookbackDays: 3
      }
    ],
    priority: 6,
    isActive: true,
    maxWeeklyVolume: 2,
    suppressionRules: ['call_scheduled', 'recent_detail'],
    sensitivity: {
      threshold: 0.85,
      adjustment: 0.1
    }
  },
  {
    id: 'TR007',
    name: 'High Potential Indicator',
    description: 'Early high-potential indicators based on peer and specialty patterns',
    criteria: [
      {
        metric: 'peer_adoption_rate',
        operator: '>',
        value: 0.4,
        lookbackDays: 90
      },
      {
        metric: 'specialty_growth',
        operator: '>',
        value: 0.15,
        lookbackDays: 60
      },
      {
        metric: 'hcp_tier',
        operator: 'contains',
        value: ['A', 'B'],
        lookbackDays: 0
      }
    ],
    priority: 7,
    isActive: true,
    maxWeeklyVolume: 1,
    suppressionRules: ['already_high_prescriber'],
    sensitivity: {
      threshold: 0.75,
      adjustment: 0.2
    }
  }
];

export interface FeedbackLoop {
  suggestionId: string;
  repId: string;
  repName: string;
  feedback: {
    useful: boolean;
    relevance: 'High' | 'Medium' | 'Low' | 'Not Relevant';
    timing: 'Perfect' | 'Good' | 'Too Early' | 'Too Late';
    actionTaken: boolean;
    outcome?: 'Positive' | 'Neutral' | 'Negative';
    comments?: string;
  };
  completedDate?: Date;
  prescriptionImpact?: number;
  followUpRequired: boolean;
}

export interface TriggerPerformance {
  triggerId: string;
  triggerName: string;
  period: string;
  metrics: {
    totalTriggered: number;
    totalCompleted: number;
    totalDismissed: number;
    totalExpired: number;
    completionRate: number;
    dismissalRate: number;
    avgTimeToAction: number; // hours
    feedbackScore: number; // 0-100
    roiMultiple: number;
  };
  topDismissalReasons: { reason: string; percentage: number }[];
  successStories: {
    hcpName: string;
    action: string;
    outcome: string;
    value: number;
  }[];
  recommendations: string[];
}

export interface SuggestionOptimization {
  currentConfiguration: {
    triggers: FieldSuggestionTrigger[];
    weeklyVolume: number;
    prioritizationWeights: {
      repFeedback: number;
      strategicPriority: number;
      behaviorSeverity: number;
    };
  };
  proposedChanges: {
    triggerAdjustments: {
      triggerId: string;
      currentThreshold: number;
      proposedThreshold: number;
      rationale: string;
    }[];
    volumeAdjustment: {
      current: number;
      proposed: number;
      distribution: Record<string, number>;
    };
    prioritizationUpdate: {
      repFeedback: number;
      strategicPriority: number;
      behaviorSeverity: number;
    };
  };
  expectedImpact: {
    completionRateIncrease: number;
    roiImprovement: number;
    repSatisfactionIncrease: number;
  };
}

export class FieldSuggestionsAgent extends BaseAgent {
  private triggers: FieldSuggestionTrigger[];
  private feedbackWeights: {
    repFeedback: number;
    strategicPriority: number;
    behaviorSeverity: number;
  };
  
  constructor() {
    super({
      name: 'Field Suggestions Agent',
      description: 'Advanced field suggestion system with 7 configurable triggers and comprehensive feedback loop',
      systemPrompt: `You are an expert in pharmaceutical field strategy, sales operations, and AI-driven suggestion systems.
Your role is to:
1. Manage 7 primary suggestion triggers with sensitivity adjustments
2. Apply sophisticated prioritization using 40/40/20 formula
3. Integrate comprehensive feedback loop for continuous improvement
4. Monitor performance and ROI of each trigger
5. Ensure suggestions align with brand objectives and field capacity
6. Implement suppression rules to prevent suggestion fatigue

Key trigger categories:
1. Speaker Program Follow-up - Capitalize on peer influence events
2. Low Prescription Fulfillment - Address patient access barriers
3. Positive Payer Coverage - Leverage improved market access
4. Slowed Prescribing Pace - Re-engage declining prescribers
5. Single Prescription - Convert trialists to regular prescribers
6. Email Engagement Spike - Strike while interest is high
7. High Potential Indicators - Identify emerging opportunities

Prioritization formula: 40% rep feedback + 40% strategic priority + 20% behavior severity
Weekly volume limit: 20 suggestions per rep
Expiration: 14 days from creation
Suppression: Prevent redundant or conflicting suggestions`,
      capabilities: [
        '7 configurable trigger management',
        'Sensitivity threshold adjustment',
        'Real-time prioritization with feedback integration',
        'Performance monitoring and ROI tracking',
        'Suppression rule enforcement',
        'Feedback loop analysis',
        'Volume management and distribution',
        'Success pattern identification'
      ]
    });
    
    this.triggers = PHARMA_SUGGESTION_TRIGGERS;
    this.feedbackWeights = {
      repFeedback: 0.4,
      strategicPriority: 0.4,
      behaviorSeverity: 0.2
    };
  }

  async analyze(input: any): Promise<AgentResponse> {
    const { hcps, prescribingData, engagements, territories } = input;
    
    const prompt = `
Analyze field suggestion system performance:
- Active Triggers: ${this.triggers.filter(t => t.isActive).length}/7
- Total HCPs: ${hcps?.length || 0}
- Territories: ${territories?.length || 0}
- Time Period: Current week

Evaluate:
1. Trigger effectiveness and firing rates
2. Suggestion quality and relevance
3. Rep adoption and feedback patterns
4. ROI by trigger type
5. Optimization opportunities

Apply 40/40/20 prioritization formula and respect:
- Weekly volume limit: 20 suggestions per rep
- Expiration: 14 days
- Suppression rules for each trigger
`;

    const response = await this.executePrompt(prompt);
    const suggestions = this.generateFieldSuggestions(hcps, prescribingData, engagements);
    const performance = this.analyzePerformance(suggestions);
    const optimization = this.optimizeConfiguration(performance);
    const feedbackAnalysis = this.analyzeFeedbackLoop(suggestions);

    return {
      result: {
        activeSuggestions: suggestions,
        triggerPerformance: performance,
        optimization,
        feedbackAnalysis,
        weeklyDashboard: this.generateWeeklyDashboard(suggestions, performance)
      },
      reasoning: response,
      confidence: 0.88,
      recommendations: await this.recommend({ 
        suggestions, 
        performance, 
        optimization,
        feedbackAnalysis 
      })
    };
  }

  private generateFieldSuggestions(
    hcps: HCPType[], 
    prescribingData: PrescribingData[],
    engagements: Engagement[]
  ): FieldSuggestionType[] {
    const suggestions: FieldSuggestionType[] = [];
    const weeklyLimit = 20;
    const territoryLimits = new Map<string, number>();
    
    // Process each trigger
    this.triggers.forEach(trigger => {
      if (!trigger.isActive) return;
      
      const eligibleHCPs = this.identifyEligibleHCPs(
        hcps, 
        prescribingData, 
        engagements, 
        trigger
      );
      
      eligibleHCPs.forEach(hcp => {
        const territory = hcp.territory;
        const currentCount = territoryLimits.get(territory) || 0;
        
        // Respect weekly limit per territory
        if (currentCount >= weeklyLimit) return;
        
        // Check suppression rules
        if (this.shouldSuppress(hcp, trigger, engagements)) return;
        
        const priority = this.calculateSuggestionPriority(hcp, trigger, prescribingData);
        
        suggestions.push({
          id: `FS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          triggerId: trigger.id,
          triggerName: trigger.name,
          hcpId: hcp.id,
          priority: priority as any,
          status: 'Active',
          createdDate: new Date(),
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          insight: this.generateInsight(hcp, trigger, prescribingData),
          recommendedAction: this.generateAction(hcp, trigger)
        });
        
        territoryLimits.set(territory, currentCount + 1);
      });
    });
    
    // Sort by priority and apply final limits
    return suggestions
      .sort((a, b) => {
        const priorityA = typeof a.priority === 'string' ? 
          ['Low', 'Medium', 'High', 'Critical'].indexOf(a.priority) : 0;
        const priorityB = typeof b.priority === 'string' ? 
          ['Low', 'Medium', 'High', 'Critical'].indexOf(b.priority) : 0;
        return priorityB - priorityA;
      })
      .slice(0, weeklyLimit * (territoryLimits.size || 1));
  }

  private identifyEligibleHCPs(
    hcps: HCPType[],
    prescribingData: PrescribingData[],
    engagements: Engagement[],
    trigger: FieldSuggestionTrigger
  ): HCPType[] {
    // Simulate eligibility check based on trigger criteria
    return hcps.filter(hcp => {
      // Apply sensitivity threshold
      const randomScore = Math.random();
      if (randomScore > trigger.sensitivity.threshold) return false;
      
      // Simulate criteria matching
      const meetsAllCriteria = trigger.criteria.every(criterion => {
        // Simplified criteria evaluation
        if (criterion.metric === 'hcp_tier' && criterion.operator === 'contains') {
          return (criterion.value as string[]).includes(hcp.tier);
        }
        
        // Random simulation for other criteria
        return Math.random() > 0.3;
      });
      
      return meetsAllCriteria;
    }).slice(0, trigger.maxWeeklyVolume);
  }

  private shouldSuppress(
    hcp: HCPType,
    trigger: FieldSuggestionTrigger,
    engagements: Engagement[]
  ): boolean {
    // Check suppression rules
    const recentEngagements = engagements.filter(e => 
      e.hcpId === hcp.id && 
      e.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    for (const rule of trigger.suppressionRules || []) {
      switch (rule) {
        case 'recent_contact_within_3_days':
          if (recentEngagements.some(e => 
            e.date > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          )) return true;
          break;
        
        case 'call_scheduled':
          if (hcp.nextScheduledCall && 
            hcp.nextScheduledCall > new Date() && 
            hcp.nextScheduledCall < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          ) return true;
          break;
        
        case 'already_high_prescriber':
          // Simulate check
          if (hcp.tier === 'A' && Math.random() > 0.5) return true;
          break;
      }
    }
    
    return false;
  }

  private calculateSuggestionPriority(
    hcp: HCPType,
    trigger: FieldSuggestionTrigger,
    prescribingData: PrescribingData[]
  ): string {
    // Apply 40/40/20 formula
    const repFeedbackScore = this.feedbackWeights.repFeedback * (80 + Math.random() * 20);
    const strategicScore = this.feedbackWeights.strategicPriority * (trigger.priority * 14);
    const behaviorScore = this.feedbackWeights.behaviorSeverity * this.calculateBehaviorSeverity(hcp, prescribingData);
    
    const totalScore = repFeedbackScore + strategicScore + behaviorScore;
    
    if (totalScore > 80) return 'Critical';
    if (totalScore > 60) return 'High';
    if (totalScore > 40) return 'Medium';
    return 'Low';
  }

  private calculateBehaviorSeverity(hcp: HCPType, prescribingData: PrescribingData[]): number {
    const hcpRx = prescribingData.filter(p => p.hcpId === hcp.id);
    if (hcpRx.length === 0) return 50;
    
    const latestRx = hcpRx[hcpRx.length - 1];
    let severity = 50;
    
    if (latestRx.trend === 'Declining') severity += 30;
    if (latestRx.discontinuationRate > 0.3) severity += 20;
    if (latestRx.marketShare < 0.2) severity += 10;
    
    return Math.min(100, severity);
  }

  private generateInsight(
    hcp: HCPType,
    trigger: FieldSuggestionTrigger,
    prescribingData: PrescribingData[]
  ): string {
    const insights: Record<string, string> = {
      'TR001': `Dr. ${hcp.name} attended speaker program on [Date] but hasn't been contacted. High engagement opportunity.`,
      'TR002': `Dr. ${hcp.name} shows 40% fulfillment rate, down from 75% last quarter. Patient access issues likely.`,
      'TR003': `${hcp.practice.name} now has Tier 2 formulary status for 80% of patients. Coverage barrier removed.`,
      'TR004': `Dr. ${hcp.name}'s prescribing decreased 35% in past month vs. 6-month average. Re-engagement needed.`,
      'TR005': `Dr. ${hcp.name} prescribed for 1 new patient 6 weeks ago with no refill. Trial conversion opportunity.`,
      'TR006': `Dr. ${hcp.name} opened 4 emails and clicked clinical data twice this week. High interest signals.`,
      'TR007': `3 peers in Dr. ${hcp.name}'s network increased prescribing 40%. Influence opportunity identified.`
    };
    
    return insights[trigger.id] || `Opportunity identified for Dr. ${hcp.name} based on ${trigger.name}`;
  }

  private generateAction(hcp: HCPType, trigger: FieldSuggestionTrigger): string {
    const actions: Record<string, string> = {
      'TR001': 'Schedule follow-up within 48 hours to discuss key takeaways and address questions',
      'TR002': 'Share patient support program details and offer to connect office with reimbursement hub',
      'TR003': 'Deliver formulary win announcement and updated prior auth simplification guide',
      'TR004': 'Conduct needs assessment call to identify barriers and refresh clinical value proposition',
      'TR005': 'Follow up on initial patient experience and provide titration guidance materials',
      'TR006': 'Strike while hot - call today with targeted discussion on viewed clinical content',
      'TR007': 'Share peer success stories and invite to upcoming speaker program'
    };
    
    return actions[trigger.id] || `Engage Dr. ${hcp.name} regarding ${trigger.name}`;
  }

  private analyzePerformance(suggestions: FieldSuggestionType[]): TriggerPerformance[] {
    return this.triggers.map(trigger => {
      const triggerSuggestions = suggestions.filter(s => s.triggerId === trigger.id);
      const completed = triggerSuggestions.filter(s => s.status === 'Completed').length;
      const dismissed = triggerSuggestions.filter(s => s.status === 'Dismissed').length;
      const expired = triggerSuggestions.filter(s => s.status === 'Expired').length;
      const total = triggerSuggestions.length;
      
      return {
        triggerId: trigger.id,
        triggerName: trigger.name,
        period: 'Last 30 days',
        metrics: {
          totalTriggered: total,
          totalCompleted: completed,
          totalDismissed: dismissed,
          totalExpired: expired,
          completionRate: total > 0 ? completed / total : 0,
          dismissalRate: total > 0 ? dismissed / total : 0,
          avgTimeToAction: 48 + Math.random() * 72, // hours
          feedbackScore: 70 + Math.random() * 25,
          roiMultiple: 2.5 + Math.random() * 2
        },
        topDismissalReasons: [
          { reason: 'Already contacted recently', percentage: 35 },
          { reason: 'HCP not available', percentage: 25 },
          { reason: 'Higher priority targets', percentage: 20 },
          { reason: 'Incorrect trigger', percentage: 20 }
        ],
        successStories: this.generateSuccessStories(trigger),
        recommendations: this.generatePerformanceRecommendations(trigger, completed / (total || 1))
      };
    });
  }

  private generateSuccessStories(trigger: FieldSuggestionTrigger): any[] {
    const stories = {
      'TR001': [
        {
          hcpName: 'Dr. Smith',
          action: 'Called within 24 hours of speaker program',
          outcome: 'Started 3 new patients on therapy',
          value: 45000
        }
      ],
      'TR002': [
        {
          hcpName: 'Dr. Johnson',
          action: 'Connected office with patient support',
          outcome: 'Fulfillment rate increased to 85%',
          value: 32000
        }
      ],
      'TR003': [
        {
          hcpName: 'Dr. Williams',
          action: 'Shared formulary update immediately',
          outcome: 'Resumed prescribing for 5 patients',
          value: 60000
        }
      ]
    };
    
    return (stories as any)[trigger.id] || [];
  }

  private generatePerformanceRecommendations(trigger: FieldSuggestionTrigger, completionRate: number): string[] {
    const recommendations: string[] = [];
    
    if (completionRate < 0.5) {
      recommendations.push('Low completion rate - simplify action steps');
      recommendations.push('Consider rep training on this trigger type');
    } else if (completionRate > 0.8) {
      recommendations.push('High performing trigger - expand volume');
      recommendations.push('Share best practices across teams');
    }
    
    if (trigger.sensitivity.threshold < 0.7) {
      recommendations.push('Tighten threshold to reduce false positives');
    } else if (trigger.sensitivity.threshold > 0.9) {
      recommendations.push('Loosen threshold to capture more opportunities');
    }
    
    return recommendations;
  }

  private optimizeConfiguration(performance: TriggerPerformance[]): SuggestionOptimization {
    const currentVolume = this.triggers.reduce((sum, t) => sum + t.maxWeeklyVolume, 0);
    
    // Identify optimization opportunities
    const triggerAdjustments = performance.map(perf => {
      const trigger = this.triggers.find(t => t.id === perf.triggerId)!;
      let proposedThreshold = trigger.sensitivity.threshold;
      let rationale = '';
      
      if (perf.metrics.completionRate < 0.4 && trigger.sensitivity.threshold < 0.85) {
        proposedThreshold = Math.min(0.95, trigger.sensitivity.threshold + 0.1);
        rationale = 'Increase threshold to improve suggestion quality';
      } else if (perf.metrics.completionRate > 0.7 && trigger.sensitivity.threshold > 0.65) {
        proposedThreshold = Math.max(0.5, trigger.sensitivity.threshold - 0.1);
        rationale = 'Decrease threshold to capture more opportunities';
      }
      
      return {
        triggerId: trigger.id,
        currentThreshold: trigger.sensitivity.threshold,
        proposedThreshold,
        rationale: rationale || 'No change recommended'
      };
    }).filter(adj => adj.currentThreshold !== adj.proposedThreshold);
    
    // Optimize volume distribution
    const proposedVolume = 20;
    const distribution: Record<string, number> = {};
    performance
      .sort((a, b) => b.metrics.roiMultiple - a.metrics.roiMultiple)
      .forEach((perf, index) => {
        distribution[perf.triggerId] = Math.max(1, Math.floor(proposedVolume * (0.3 - index * 0.05)));
      });
    
    return {
      currentConfiguration: {
        triggers: this.triggers,
        weeklyVolume: currentVolume,
        prioritizationWeights: this.feedbackWeights
      },
      proposedChanges: {
        triggerAdjustments,
        volumeAdjustment: {
          current: currentVolume,
          proposed: proposedVolume,
          distribution
        },
        prioritizationUpdate: {
          repFeedback: 0.4,
          strategicPriority: 0.4,
          behaviorSeverity: 0.2
        }
      },
      expectedImpact: {
        completionRateIncrease: 0.15,
        roiImprovement: 0.22,
        repSatisfactionIncrease: 0.18
      }
    };
  }

  private analyzeFeedbackLoop(suggestions: FieldSuggestionType[]): any {
    // Simulate feedback analysis
    const feedbackData: FeedbackLoop[] = suggestions.slice(0, 20).map(suggestion => ({
      suggestionId: suggestion.id,
      repId: `REP-${Math.floor(Math.random() * 100)}`,
      repName: `Rep ${Math.floor(Math.random() * 100)}`,
      feedback: {
        useful: Math.random() > 0.3,
        relevance: ['High', 'Medium', 'Low', 'Not Relevant'][Math.floor(Math.random() * 4)] as any,
        timing: ['Perfect', 'Good', 'Too Early', 'Too Late'][Math.floor(Math.random() * 4)] as any,
        actionTaken: Math.random() > 0.4,
        outcome: Math.random() > 0.5 ? 
          ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)] as any : 
          undefined,
        comments: Math.random() > 0.7 ? 'Very helpful suggestion, led to productive conversation' : undefined
      },
      completedDate: Math.random() > 0.5 ? new Date() : undefined,
      prescriptionImpact: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : undefined,
      followUpRequired: Math.random() > 0.6
    }));
    
    const analysis = {
      totalFeedback: feedbackData.length,
      feedbackRate: feedbackData.length / suggestions.length,
      sentimentBreakdown: {
        positive: feedbackData.filter(f => f.feedback.useful).length,
        negative: feedbackData.filter(f => !f.feedback.useful).length,
        neutral: 0
      },
      relevanceDistribution: {
        high: feedbackData.filter(f => f.feedback.relevance === 'High').length,
        medium: feedbackData.filter(f => f.feedback.relevance === 'Medium').length,
        low: feedbackData.filter(f => f.feedback.relevance === 'Low').length,
        notRelevant: feedbackData.filter(f => f.feedback.relevance === 'Not Relevant').length
      },
      timingAnalysis: {
        perfect: feedbackData.filter(f => f.feedback.timing === 'Perfect').length,
        good: feedbackData.filter(f => f.feedback.timing === 'Good').length,
        tooEarly: feedbackData.filter(f => f.feedback.timing === 'Too Early').length,
        tooLate: feedbackData.filter(f => f.feedback.timing === 'Too Late').length
      },
      actionRate: feedbackData.filter(f => f.feedback.actionTaken).length / feedbackData.length,
      averagePrescriptionImpact: feedbackData
        .filter(f => f.prescriptionImpact)
        .reduce((sum, f) => sum + (f.prescriptionImpact || 0), 0) / 
        feedbackData.filter(f => f.prescriptionImpact).length || 0,
      topComments: feedbackData
        .filter(f => f.feedback.comments)
        .map(f => f.feedback.comments)
        .slice(0, 5),
      improvementThemes: [
        'More context on patient specifics needed',
        'Timing of speaker program follow-ups is excellent',
        'Payer coverage updates very valuable',
        'Some suggestions feel redundant with recent activities'
      ]
    };
    
    return analysis;
  }

  private generateWeeklyDashboard(
    suggestions: FieldSuggestionType[], 
    performance: TriggerPerformance[]
  ): any {
    const totalSuggestions = suggestions.length;
    const byPriority = {
      critical: suggestions.filter(s => s.priority === 'Critical').length,
      high: suggestions.filter(s => s.priority === 'High').length,
      medium: suggestions.filter(s => s.priority === 'Medium').length,
      low: suggestions.filter(s => s.priority === 'Low').length
    };
    
    return {
      week: `Week of ${new Date().toLocaleDateString()}`,
      summary: {
        totalGenerated: totalSuggestions,
        totalDelivered: Math.floor(totalSuggestions * 0.95),
        totalActioned: Math.floor(totalSuggestions * 0.6),
        totalCompleted: Math.floor(totalSuggestions * 0.45),
        completionRate: 0.45,
        avgTimeToAction: '52 hours'
      },
      byPriority,
      byTrigger: this.triggers.map(t => ({
        triggerName: t.name,
        count: suggestions.filter(s => s.triggerId === t.id).length,
        percentage: (suggestions.filter(s => s.triggerId === t.id).length / totalSuggestions * 100).toFixed(1)
      })),
      topPerformers: [
        { trigger: 'Speaker Program Follow-up', roi: 4.2, completion: 0.78 },
        { trigger: 'Positive Payer Coverage', roi: 3.8, completion: 0.65 },
        { trigger: 'Email Engagement Spike', roi: 3.5, completion: 0.72 }
      ],
      alerts: [
        'TR004 (Slowed Prescribing) showing low completion - review action language',
        'Territory T-05 at weekly limit - high opportunity area',
        'Consider increasing sensitivity for TR007 (High Potential) - high ROI'
      ]
    };
  }

  async recommend(context: any): Promise<string[]> {
    const { suggestions, performance, optimization, feedbackAnalysis } = context;
    const recommendations: string[] = [];
    
    // Performance-based recommendations
    const topPerformer = performance.reduce((best: any, current: any) => 
      current.metrics.roiMultiple > best.metrics.roiMultiple ? current : best
    );
    recommendations.push(`Expand volume for ${topPerformer.triggerName} - highest ROI at ${topPerformer.metrics.roiMultiple.toFixed(1)}x`);
    
    // Feedback-based recommendations
    if (feedbackAnalysis.actionRate < 0.5) {
      recommendations.push('Low action rate - simplify suggestion actions and provide clearer next steps');
    }
    
    if (feedbackAnalysis.relevanceDistribution.notRelevant > feedbackAnalysis.totalFeedback * 0.2) {
      recommendations.push('High irrelevance rate - review trigger criteria and suppression rules');
    }
    
    // Optimization recommendations
    if (optimization.proposedChanges.triggerAdjustments.length > 0) {
      recommendations.push(`Adjust ${optimization.proposedChanges.triggerAdjustments.length} trigger thresholds for ${(optimization.expectedImpact.completionRateIncrease * 100).toFixed(0)}% completion improvement`);
    }
    
    // Volume recommendations
    const totalVolume = suggestions.length;
    const weeklyTarget = 20 * 10; // 20 per territory, assume 10 territories
    if (totalVolume < weeklyTarget * 0.7) {
      recommendations.push('Below target volume - loosen high-ROI trigger thresholds');
    } else if (totalVolume > weeklyTarget * 1.2) {
      recommendations.push('Above target volume - tighten low-performing triggers');
    }
    
    // Timing recommendations
    if (feedbackAnalysis.timingAnalysis.tooLate > feedbackAnalysis.timingAnalysis.perfect) {
      recommendations.push('Suggestions arriving too late - reduce trigger detection latency');
    }
    
    // Strategic recommendations
    recommendations.push('Implement A/B testing on action language for top 3 triggers');
    recommendations.push('Create trigger-specific training modules for field teams');
    recommendations.push('Establish monthly calibration sessions with high-performing reps');
    recommendations.push('Consider ML model for dynamic threshold adjustment');
    
    return recommendations.slice(0, 10);
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'generateSuggestions':
        return this.generateFieldSuggestions(params.hcps, params.prescribingData, params.engagements);
      case 'analyzeFeedback':
        return this.processFeedback(params.feedback);
      case 'optimizeTriggers':
        return this.optimizeTriggers(params.performance);
      case 'adjustSensitivity':
        return this.adjustSensitivity(params.triggerId, params.adjustment);
      case 'measureROI':
        return this.measureTriggerROI(params.suggestions, params.outcomes);
      case 'exportPerformance':
        return this.exportPerformanceReport(params.period);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private processFeedback(feedback: FeedbackLoop[]): any {
    const processed = {
      totalReceived: feedback.length,
      incorporated: 0,
      triggerAdjustments: [] as any[],
      priorityUpdates: [] as any[],
      insights: [] as string[]
    };
    
    // Group feedback by trigger
    const byTrigger = new Map<string, FeedbackLoop[]>();
    feedback.forEach(f => {
      const suggestion = { triggerId: 'TR001' }; // Simplified
      const existing = byTrigger.get(suggestion.triggerId) || [];
      existing.push(f);
      byTrigger.set(suggestion.triggerId, existing);
    });
    
    // Process each trigger's feedback
    byTrigger.forEach((triggerFeedback, triggerId) => {
      const useful = triggerFeedback.filter(f => f.feedback.useful).length;
      const total = triggerFeedback.length;
      const usefulness = useful / total;
      
      if (usefulness < 0.5) {
        processed.triggerAdjustments.push({
          triggerId,
          action: 'increase_threshold',
          reason: `Low usefulness rate: ${(usefulness * 100).toFixed(0)}%`
        });
      }
      
      processed.incorporated += useful;
    });
    
    // Generate insights
    if (feedback.filter(f => f.feedback.timing === 'Too Late').length > feedback.length * 0.3) {
      processed.insights.push('Reduce trigger detection frequency to hourly');
    }
    
    if (feedback.filter(f => f.feedback.relevance === 'High').length > feedback.length * 0.6) {
      processed.insights.push('Current triggers showing high relevance - maintain configuration');
    }
    
    return processed;
  }

  private optimizeTriggers(performance: TriggerPerformance[]): any {
    const optimizations = performance.map(perf => {
      const trigger = this.triggers.find(t => t.id === perf.triggerId);
      if (!trigger) return null;
      
      const optimization = {
        triggerId: perf.triggerId,
        currentSettings: {
          threshold: trigger.sensitivity.threshold,
          maxVolume: trigger.maxWeeklyVolume,
          priority: trigger.priority
        },
        proposedSettings: {
          threshold: trigger.sensitivity.threshold,
          maxVolume: trigger.maxWeeklyVolume,
          priority: trigger.priority
        },
        expectedImpact: {
          volumeChange: 0,
          completionChange: 0,
          roiChange: 0
        }
      };
      
      // Optimize based on performance
      if (perf.metrics.completionRate < 0.4) {
        optimization.proposedSettings.threshold += 0.1;
        optimization.expectedImpact.volumeChange = -0.2;
        optimization.expectedImpact.completionChange = 0.15;
      } else if (perf.metrics.completionRate > 0.7 && perf.metrics.roiMultiple > 3) {
        optimization.proposedSettings.maxVolume = Math.min(5, trigger.maxWeeklyVolume + 1);
        optimization.proposedSettings.threshold -= 0.05;
        optimization.expectedImpact.volumeChange = 0.3;
        optimization.expectedImpact.roiChange = 0.1;
      }
      
      return optimization;
    }).filter(Boolean);
    
    return {
      optimizations,
      expectedOverallImpact: {
        completionRateIncrease: 0.12,
        volumeIncrease: 0.15,
        roiIncrease: 0.18
      },
      implementationPlan: [
        'Apply threshold adjustments in next release',
        'Monitor for 2 weeks',
        'Collect feedback',
        'Fine-tune based on results'
      ]
    };
  }

  private adjustSensitivity(triggerId: string, adjustment: number): any {
    const trigger = this.triggers.find(t => t.id === triggerId);
    if (!trigger) throw new Error(`Trigger ${triggerId} not found`);
    
    const oldThreshold = trigger.sensitivity.threshold;
    const newThreshold = Math.max(0.1, Math.min(1.0, oldThreshold + adjustment));
    
    trigger.sensitivity.threshold = newThreshold;
    
    return {
      triggerId,
      triggerName: trigger.name,
      oldThreshold,
      newThreshold,
      adjustment,
      expectedImpact: {
        volumeChange: adjustment < 0 ? 'Increase' : 'Decrease',
        qualityChange: adjustment > 0 ? 'Increase' : 'Decrease',
        estimatedWeeklyTriggers: Math.floor(trigger.maxWeeklyVolume * (adjustment < 0 ? 1.3 : 0.8))
      },
      status: 'Applied successfully'
    };
  }

  private measureTriggerROI(suggestions: FieldSuggestionType[], outcomes: any[]): any {
    const roiByTrigger = new Map<string, any>();
    
    this.triggers.forEach(trigger => {
      const triggerSuggestions = suggestions.filter(s => s.triggerId === trigger.id);
      const triggerOutcomes = outcomes.filter(o => 
        triggerSuggestions.some(s => s.id === o.suggestionId)
      );
      
      const totalValue = triggerOutcomes.reduce((sum, o) => sum + (o.value || 0), 0);
      const totalCost = triggerSuggestions.length * 200; // Assume $200 per suggestion
      const roi = totalCost > 0 ? totalValue / totalCost : 0;
      
      roiByTrigger.set(trigger.id, {
        triggerName: trigger.name,
        suggestions: triggerSuggestions.length,
        completed: triggerOutcomes.filter(o => o.completed).length,
        totalValue,
        totalCost,
        roi,
        topOutcome: triggerOutcomes
          .sort((a, b) => (b.value || 0) - (a.value || 0))[0]
      });
    });
    
    return {
      byTrigger: Array.from(roiByTrigger.values()),
      overall: {
        totalSuggestions: suggestions.length,
        totalValue: Array.from(roiByTrigger.values()).reduce((sum, t) => sum + t.totalValue, 0),
        totalCost: Array.from(roiByTrigger.values()).reduce((sum, t) => sum + t.totalCost, 0),
        averageROI: Array.from(roiByTrigger.values()).reduce((sum, t) => sum + t.roi, 0) / roiByTrigger.size
      },
      recommendations: [
        'Increase investment in top ROI triggers',
        'Review and potentially sunset bottom quartile',
        'Share success patterns across territories'
      ]
    };
  }

  private exportPerformanceReport(period: string): any {
    return {
      reportId: `PERF-${Date.now()}`,
      period,
      generatedDate: new Date(),
      sections: {
        executiveSummary: {
          totalSuggestions: 2450,
          completionRate: 0.58,
          averageROI: 3.2,
          repSatisfaction: 4.2
        },
        triggerPerformance: this.triggers.map(t => ({
          trigger: t.name,
          volume: Math.floor(Math.random() * 500) + 100,
          completion: 0.4 + Math.random() * 0.4,
          roi: 2 + Math.random() * 3
        })),
        territoryBreakdown: Array.from({ length: 10 }, (_, i) => ({
          territory: `T-${String(i + 1).padStart(2, '0')}`,
          suggestions: Math.floor(Math.random() * 100) + 50,
          actionRate: 0.5 + Math.random() * 0.4,
          feedback: 3.5 + Math.random() * 1.5
        })),
        recommendations: [
          'Top performing trigger: Speaker Program Follow-up',
          'Optimization opportunity: Slowed Prescribing trigger',
          'Volume increase recommended for high-ROI territories'
        ]
      },
      exportFormat: 'PDF',
      distribution: ['VP Sales', 'Regional Managers', 'Analytics Team']
    };
  }
}