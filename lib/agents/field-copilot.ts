import { BaseAgent, AgentResponse } from './base-agent';
import { 
  HCP as HCPType,
  PrescribingData,
  PatientMix,
  Engagement,
  Territory,
  Barrier,
  PHARMA_BARRIERS,
  NextBestAction,
  HCPOpportunity
} from '@/lib/types/pharma';

export interface PreCallPlan {
  hcpId: string;
  hcpName: string;
  hcpProfile: {
    specialty: string;
    tier: string;
    segment: string;
    prescribingTrend: string;
    lastInteraction: Date | null;
    preferredChannels: string[];
  };
  objective: {
    primary: string;
    secondary: string[];
    successMetrics: string[];
  };
  insights: {
    prescribingBehavior: string[];
    patientPopulation: string[];
    barriers: { barrier: Barrier; likelihood: number; impact: number }[];
    opportunities: string[];
  };
  keyMessages: {
    opening: string;
    core: string[];
    closing: string;
  };
  anticipatedObjections: {
    objection: string;
    probability: number;
    response: string;
    supportingData: string[];
  }[];
  materials: {
    required: string[];
    optional: string[];
    digital: string[];
  };
  nextSteps: {
    immediate: string[];
    followUp: string[];
    timeline: string;
  };
  competitiveIntel: {
    currentProducts: string[];
    switchingBarriers: string[];
    advantages: string[];
  };
}

export interface TerritoryInsight {
  territoryId: string;
  territoryName: string;
  period: string;
  metrics: {
    totalHCPs: number;
    activeHCPs: number;
    highPriorityHCPs: number;
    weeklyCallTarget: number;
    currentProgress: number;
    attainmentRate: number;
    rxGrowth: number;
    marketShare: number;
  };
  segmentation: {
    byTier: Record<string, number>;
    bySegment: Record<string, number>;
    bySpecialty: Record<string, number>;
  };
  opportunities: {
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    actionRequired: string;
    deadline?: Date;
  }[];
  challenges: {
    description: string;
    severity: 'Critical' | 'Major' | 'Minor';
    mitigation: string;
  }[];
  topPerformers: {
    hcpName: string;
    growth: number;
    volume: number;
  }[];
  recommendations: {
    action: string;
    priority: number;
    expectedImpact: string;
  }[];
}

export interface VirtualCoaching {
  sessionId: string;
  repId: string;
  topic: string;
  scenario: {
    situation: string;
    hcpType: string;
    objective: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  guidance: {
    approach: string[];
    keyPoints: string[];
    avoidPitfalls: string[];
  };
  rolePlay: {
    hcpStatement: string;
    suggestedResponses: {
      response: string;
      effectiveness: number;
      rationale: string;
    }[];
    feedback: string;
  };
  resources: {
    videos: string[];
    articles: string[];
    bestPractices: string[];
  };
  assessment: {
    strengths: string[];
    improvements: string[];
    score: number;
    nextSteps: string[];
  };
}

export interface CallScheduler {
  weekView: {
    date: Date;
    scheduledCalls: {
      time: string;
      hcpName: string;
      type: 'In-Person' | 'Virtual' | 'Phone';
      priority: 'High' | 'Medium' | 'Low';
      objective: string;
    }[];
    openSlots: string[];
    routeOptimization?: {
      suggestedOrder: string[];
      estimatedDriveTime: number;
      efficiency: number;
    };
  }[];
  suggestions: {
    hcpName: string;
    reason: string;
    proposedTime: string;
  }[];
}

export interface EmailAssistant {
  templates: {
    type: string;
    subject: string;
    body: string;
    personalization: string[];
    attachments: string[];
    complianceChecked: boolean;
  }[];
  drafts: {
    to: string;
    subject: string;
    body: string;
    tone: 'Professional' | 'Friendly' | 'Urgent';
    callToAction: string;
    estimatedReadTime: string;
  }[];
  optimization: {
    bestSendTime: string;
    subjectLineScore: number;
    readabilityScore: number;
    suggestions: string[];
  };
}

export interface PostCallAnalysis {
  callId: string;
  hcpId: string;
  date: Date;
  duration: number;
  transcript?: string;
  analysis: {
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    engagementLevel: number; // 0-100
    keyTopics: string[];
    objections: {
      stated: string;
      addressed: boolean;
      effectiveness: number;
    }[];
    commitments: {
      hcpCommitment: string;
      repCommitment: string;
      deadline?: Date;
    }[];
    barrierProgress: {
      barrier: string;
      previousStatus: string;
      currentStatus: string;
      progress: number;
    }[];
  };
  followUpPlan: {
    nextInteraction: Date;
    channel: string;
    objective: string;
    materials: string[];
    preparationNotes: string[];
  };
  aiInsights: {
    strengths: string[];
    missedOpportunities: string[];
    recommendations: string[];
    predictedOutcome: string;
    confidenceScore: number;
  };
}

export class FieldCopilotAgent extends BaseAgent {
  private coachingScenarios: Map<string, any>;
  private emailTemplates: Map<string, any>;
  
  constructor() {
    super({
      name: 'Field Copilot Agent',
      description: 'Comprehensive AI assistant for pharmaceutical sales representatives',
      systemPrompt: `You are an expert AI field copilot for pharmaceutical sales representatives, providing comprehensive support for all aspects of field activities.
Your role is to:
1. Provide detailed pre-call planning with HCP insights and barrier analysis
2. Generate territory summaries with actionable recommendations
3. Deliver virtual coaching with role-play scenarios and feedback
4. Optimize call scheduling with route planning
5. Draft personalized, compliant email communications
6. Analyze post-call data for continuous improvement
7. Predict outcomes and suggest next best actions

Key capabilities:
- Pre-call planning: HCP profiling, barrier identification, message customization
- Territory management: Performance tracking, opportunity identification, resource optimization
- Virtual coaching: Objection handling, value proposition delivery, negotiation skills
- Scheduling: Route optimization, priority balancing, time management
- Communication: Email drafting, compliance checking, personalization
- Analytics: Sentiment analysis, engagement tracking, outcome prediction

Always ensure:
- Compliance with promotional guidelines and regulations
- Evidence-based recommendations
- Personalization based on HCP preferences
- Actionable insights with clear next steps
- Continuous learning from outcomes`,
      capabilities: [
        'Comprehensive pre-call planning with insights',
        'Territory performance analysis and optimization',
        'Virtual coaching with interactive scenarios',
        'Intelligent call scheduling and routing',
        'Compliant email drafting and optimization',
        'Post-call analysis with AI insights',
        'Predictive analytics for outcomes',
        'Real-time field support and guidance'
      ]
    });
    
    this.coachingScenarios = this.initializeCoachingScenarios();
    this.emailTemplates = this.initializeEmailTemplates();
  }

  private initializeCoachingScenarios(): Map<string, any> {
    const scenarios = new Map();
    
    scenarios.set('side_effects', {
      situation: 'HCP expresses strong concerns about side effect profile',
      difficulty: 'Advanced',
      approach: [
        'Acknowledge concern with empathy',
        'Present data in clinical context',
        'Compare to class alternatives',
        'Discuss management strategies',
        'Offer support resources'
      ]
    });
    
    scenarios.set('access_barriers', {
      situation: 'HCP frustrated with prior authorization requirements',
      difficulty: 'Intermediate',
      approach: [
        'Validate frustration',
        'Explain support services',
        'Provide PA assistance contacts',
        'Share success stories',
        'Offer to facilitate process'
      ]
    });
    
    scenarios.set('competitor_preference', {
      situation: 'HCP strongly prefers competitor product',
      difficulty: 'Advanced',
      approach: [
        'Understand specific reasons',
        'Acknowledge competitor strengths',
        'Highlight unique differentiators',
        'Share comparative data',
        'Suggest trial with appropriate patient'
      ]
    });
    
    return scenarios;
  }

  private initializeEmailTemplates(): Map<string, any> {
    const templates = new Map();
    
    templates.set('clinical_update', {
      subject: 'New Clinical Data: [Study Name] Results',
      tone: 'Professional',
      structure: ['Greeting', 'Key finding', 'Clinical relevance', 'Supporting data', 'Call to action', 'Closing']
    });
    
    templates.set('access_update', {
      subject: 'Important Coverage Update for Your Patients',
      tone: 'Urgent',
      structure: ['Greeting', 'Coverage news', 'Patient impact', 'Action items', 'Support resources', 'Closing']
    });
    
    templates.set('event_followup', {
      subject: 'Thank You - Follow-up from [Event Name]',
      tone: 'Friendly',
      structure: ['Greeting', 'Event reference', 'Key takeaways', 'Promised materials', 'Next steps', 'Closing']
    });
    
    return templates;
  }

  async analyze(input: any): Promise<AgentResponse> {
    const { type, hcp, territory, data } = input;
    
    const prompt = `
Provide comprehensive field support for:
Type: ${type}
${hcp ? `HCP: ${hcp.name} (${hcp.specialty}, Tier ${hcp.tier})` : ''}
${territory ? `Territory: ${territory.name}` : ''}
Context: ${JSON.stringify(data || {})}

Generate detailed, actionable insights with specific recommendations.
Consider barriers, opportunities, competitive landscape, and best practices.
`;

    const response = await this.executePrompt(prompt);
    let result;

    switch (type) {
      case 'preCall':
        result = this.generateComprehensivePreCallPlan(hcp, data);
        break;
      case 'territory':
        result = this.generateTerritoryInsights(territory, data);
        break;
      case 'coaching':
        result = this.provideVirtualCoaching(data);
        break;
      case 'scheduling':
        result = this.optimizeCallSchedule(data);
        break;
      case 'email':
        result = this.generateEmailDraft(hcp, data);
        break;
      case 'postCall':
        result = this.analyzePostCall(hcp, data);
        break;
      default:
        result = { error: 'Unknown analysis type' };
    }

    return {
      result,
      reasoning: response,
      confidence: 0.89,
      recommendations: await this.recommend({ type, result, hcp, territory })
    };
  }

  private generateComprehensivePreCallPlan(hcp: HCPType, data: any): PreCallPlan {
    const prescribingData: PrescribingData[] = data.prescribingData || [];
    const barriers = data.barriers || [];
    const opportunities: HCPOpportunity = data.opportunity;
    
    const hcpRx = prescribingData.filter(p => p.hcpId === hcp.id);
    const trend = hcpRx.length > 0 ? hcpRx[hcpRx.length - 1].trend : 'Unknown';
    
    return {
      hcpId: hcp.id,
      hcpName: hcp.name,
      hcpProfile: {
        specialty: hcp.specialty,
        tier: hcp.tier,
        segment: hcp.segment,
        prescribingTrend: trend,
        lastInteraction: hcp.lastCallDate || null,
        preferredChannels: this.identifyPreferredChannels(data.engagements)
      },
      objective: {
        primary: this.determinePrimaryObjective(hcp, opportunities),
        secondary: [
          'Strengthen relationship and trust',
          'Identify new patient opportunities',
          'Gather competitive intelligence'
        ],
        successMetrics: [
          'Commitment to prescribe for next appropriate patient',
          'Agreement to review clinical data',
          'Scheduled follow-up interaction'
        ]
      },
      insights: {
        prescribingBehavior: this.analyzePrescribingBehavior(hcpRx),
        patientPopulation: this.analyzePatientPopulation(data.patientMix),
        barriers: this.identifyHCPBarriers(barriers, opportunities),
        opportunities: this.identifyOpportunities(hcp, opportunities, data)
      },
      keyMessages: {
        opening: this.generateOpening(hcp, trend),
        core: this.generateCoreMessages(hcp, barriers, opportunities),
        closing: 'I appreciate your time today. Based on our discussion, I\'ll [specific follow-up action]. How does [specific timeframe] work for our next conversation?'
      },
      anticipatedObjections: this.generateObjectionHandling(hcp, barriers),
      materials: {
        required: ['Product detail aid', 'Efficacy data summary', 'Safety profile'],
        optional: ['Patient case studies', 'Payer coverage guide', 'Dosing calculator'],
        digital: ['Interactive MOA video', 'Clinical trial dashboard', 'Patient support portal demo']
      },
      nextSteps: {
        immediate: [
          'Document call outcomes in CRM',
          'Send promised materials within 24 hours',
          'Alert patient support team if enrollment discussed'
        ],
        followUp: [
          'Email clinical trial summary',
          'Schedule lunch-and-learn for practice',
          'Coordinate MSL visit for deep clinical discussion'
        ],
        timeline: '7-10 days'
      },
      competitiveIntel: {
        currentProducts: this.identifyCurrentProducts(hcpRx),
        switchingBarriers: ['Familiarity with current therapy', 'Stable patients', 'Formulary restrictions'],
        advantages: ['Superior efficacy in key endpoints', 'Better tolerability profile', 'Comprehensive support program']
      }
    };
  }

  private identifyPreferredChannels(engagements: Engagement[]): string[] {
    if (!engagements || engagements.length === 0) return ['Field', 'Email'];
    
    const channelCounts = new Map<string, number>();
    engagements.forEach(e => {
      const count = channelCounts.get(e.channel) || 0;
      channelCounts.set(e.channel, count + 1);
    });
    
    return Array.from(channelCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([channel]) => channel);
  }

  private determinePrimaryObjective(hcp: HCPType, opportunity?: HCPOpportunity): string {
    if (!opportunity) return 'Introduce product value proposition and assess interest';
    
    if (opportunity.depthOpportunity > opportunity.breadthOpportunity) {
      return 'Increase prescription depth - optimize dosing and expand appropriate patient types';
    } else {
      return 'Expand prescription breadth - identify new patient opportunities';
    }
  }

  private analyzePrescribingBehavior(prescribingData: PrescribingData[]): string[] {
    if (prescribingData.length === 0) return ['No recent prescribing history'];
    
    const insights: string[] = [];
    const latest = prescribingData[prescribingData.length - 1];
    
    if (latest.trend === 'Increasing') {
      insights.push('Prescribing trending upward - capitalize on momentum');
    } else if (latest.trend === 'Declining') {
      insights.push('Prescribing declining - identify and address barriers');
    }
    
    if (latest.marketShare < 0.2) {
      insights.push('Low market share - significant growth opportunity');
    }
    
    if (latest.discontinuationRate > 0.3) {
      insights.push('High discontinuation rate - focus on adherence support');
    }
    
    insights.push(`Average days supply: ${latest.avgDaysSupply} days`);
    insights.push(`New vs. continuing: ${latest.newRx}/${latest.refills} ratio`);
    
    return insights;
  }

  private analyzePatientPopulation(patientMix?: PatientMix): string[] {
    if (!patientMix) return ['Patient demographics unknown - gather during call'];
    
    const insights: string[] = [];
    
    // Age distribution insights
    const seniorPercentage = ((patientMix.demographics.ageGroups['55-64'] + 
                              patientMix.demographics.ageGroups['65+']) / 
                              patientMix.totalPatients) * 100;
    if (seniorPercentage > 50) {
      insights.push(`${seniorPercentage.toFixed(0)}% patients 55+ - emphasize safety and drug interactions`);
    }
    
    // Insurance mix insights
    const commercialPercentage = (patientMix.demographics.insurance.commercial / patientMix.totalPatients) * 100;
    if (commercialPercentage > 40) {
      insights.push(`Strong commercial insurance mix (${commercialPercentage.toFixed(0)}%) - good coverage expected`);
    }
    
    // Disease severity insights
    if (patientMix.diseaseStage.severe > patientMix.diseaseStage.early) {
      insights.push('Higher severe patient population - emphasize efficacy in advanced disease');
    }
    
    // Comorbidity insights
    if (patientMix.comorbidities.length > 0) {
      insights.push(`Common comorbidities: ${patientMix.comorbidities.slice(0, 3).join(', ')}`);
    }
    
    return insights;
  }

  private identifyHCPBarriers(barriers: any[], opportunity?: HCPOpportunity): any[] {
    const hcpBarriers: any[] = [];
    
    if (opportunity && opportunity.barriers) {
      opportunity.barriers.forEach(b => {
        const barrier = PHARMA_BARRIERS.find(pb => pb.id === b.barrierId);
        if (barrier) {
          hcpBarriers.push({
            barrier,
            likelihood: b.likelihood,
            impact: b.impact
          });
        }
      });
    }
    
    // Add default barriers if none identified
    if (hcpBarriers.length === 0) {
      hcpBarriers.push(
        { barrier: PHARMA_BARRIERS[0], likelihood: 0.5, impact: 0.5 },
        { barrier: PHARMA_BARRIERS[2], likelihood: 0.4, impact: 0.6 }
      );
    }
    
    return hcpBarriers.sort((a, b) => (b.likelihood * b.impact) - (a.likelihood * a.impact));
  }

  private identifyOpportunities(hcp: HCPType, opportunity?: HCPOpportunity, data?: any): string[] {
    const opportunities: string[] = [];
    
    if (hcp.tier === 'A' || hcp.tier === 'B') {
      opportunities.push('High-value prescriber - prioritize for premium support');
    }
    
    if (opportunity) {
      if (opportunity.depthOpportunity > 70) {
        opportunities.push('Strong depth opportunity - focus on dosing optimization');
      }
      if (opportunity.breadthOpportunity > 70) {
        opportunities.push('Strong breadth opportunity - expand patient identification');
      }
    }
    
    if (data?.payerCoverage?.improved) {
      opportunities.push('Recent formulary win - leverage improved access');
    }
    
    if (data?.speakerProgram?.attended) {
      opportunities.push('Recent speaker program attendee - high engagement');
    }
    
    opportunities.push('Digital engagement indicates interest in clinical data');
    
    return opportunities;
  }

  private generateOpening(hcp: HCPType, trend: string): string {
    const openings = {
      'Increasing': `Dr. ${hcp.name}, I noticed you've been having success with our therapy. I'd love to hear about your experience and discuss how we can support even better outcomes.`,
      'Declining': `Dr. ${hcp.name}, I wanted to check in and see if there have been any challenges with our therapy that I can help address.`,
      'Stable': `Dr. ${hcp.name}, thank you for your continued confidence in our therapy. I have some new data that might interest you.`,
      'Unknown': `Dr. ${hcp.name}, I appreciate you taking the time to meet. I'd like to share how our therapy is helping similar ${hcp.specialty} practices improve patient outcomes.`
    };
    
    return openings[trend as keyof typeof openings] || openings['Unknown'];
  }

  private generateCoreMessages(hcp: HCPType, barriers: any[], opportunity?: HCPOpportunity): string[] {
    const messages: string[] = [];
    
    // Efficacy message
    messages.push('Superior efficacy demonstrated in head-to-head trial with 45% improvement in primary endpoint');
    
    // Safety message  
    if (barriers.some(b => b.barrier?.category === 'Safety')) {
      messages.push('Favorable safety profile with <5% discontinuation rate due to adverse events');
    }
    
    // Access message
    if (barriers.some(b => b.barrier?.category === 'Access')) {
      messages.push('Comprehensive patient support program with co-pay assistance and nurse educators');
    }
    
    // Specialty-specific message
    if (hcp.specialty === 'Cardiology') {
      messages.push('Cardiovascular safety established with no increased MACE risk');
    } else if (hcp.specialty === 'Endocrinology') {
      messages.push('Significant A1C reduction maintained over 52 weeks');
    }
    
    return messages;
  }

  private generateObjectionHandling(hcp: HCPType, barriers: any[]): any[] {
    const objections: any[] = [];
    
    // Side effects objection
    objections.push({
      objection: 'I\'m concerned about the side effect profile',
      probability: 0.6,
      response: 'I understand your concern. Let me share the safety data from our 5,000 patient registry showing that most side effects are mild and transient, occurring in the first 2 weeks.',
      supportingData: ['Safety comparison chart', 'Real-world evidence report', 'Management algorithm']
    });
    
    // Cost/access objection
    objections.push({
      objection: 'My patients can\'t afford this medication',
      probability: 0.7,
      response: 'We have a comprehensive patient support program that ensures no eligible patient pays more than $10/month. Let me connect you with our access team.',
      supportingData: ['Co-pay card details', 'Patient assistance program', 'Prior auth support']
    });
    
    // Experience objection
    objections.push({
      objection: 'I need more experience with this class before prescribing',
      probability: 0.5,
      response: 'That\'s completely understandable. Would you be interested in hearing from Dr. Smith who has treated over 100 patients? We also have detailed protocols to ensure a smooth start.',
      supportingData: ['KOL experience video', 'Starting protocol', 'Peer publications']
    });
    
    return objections.sort((a, b) => b.probability - a.probability);
  }

  private identifyCurrentProducts(prescribingData: PrescribingData[]): string[] {
    if (prescribingData.length === 0) return ['Unknown current therapies'];
    
    // Simulate competitive products based on market share
    const products: string[] = [];
    const latest = prescribingData[prescribingData.length - 1];
    
    if (latest.competitorRx > 0) {
      products.push('Competitor A', 'Competitor B');
    }
    if (latest.brandRx > latest.competitorRx) {
      products.push('Our Product (primary)');
    }
    
    return products;
  }

  private generateTerritoryInsights(territory: Territory, data: any): TerritoryInsight {
    const hcps: HCPType[] = data.hcps || [];
    const prescribingData: PrescribingData[] = data.prescribingData || [];
    
    const tierDistribution = hcps.reduce((acc, hcp) => {
      acc[hcp.tier] = (acc[hcp.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const segmentDistribution = hcps.reduce((acc, hcp) => {
      acc[hcp.segment] = (acc[hcp.segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const specialtyDistribution = hcps.reduce((acc, hcp) => {
      acc[hcp.specialty] = (acc[hcp.specialty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      territoryId: territory.id,
      territoryName: territory.name,
      period: 'Current Quarter',
      metrics: {
        totalHCPs: territory.hcpCount,
        activeHCPs: Math.floor(territory.hcpCount * 0.6),
        highPriorityHCPs: Math.floor(territory.hcpCount * 0.3),
        weeklyCallTarget: territory.targetCalls,
        currentProgress: territory.actualCalls,
        attainmentRate: territory.attainment,
        rxGrowth: 15 + Math.random() * 20,
        marketShare: 20 + Math.random() * 15
      },
      segmentation: {
        byTier: tierDistribution,
        bySegment: segmentDistribution,
        bySpecialty: specialtyDistribution
      },
      opportunities: [
        {
          description: '15 HCPs with recent positive formulary change',
          impact: 'High',
          actionRequired: 'Immediate outreach with coverage update',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          description: '8 speaker program attendees need follow-up',
          impact: 'High',
          actionRequired: 'Schedule calls within 48 hours',
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        {
          description: 'New specialty clinic opened with 5 target HCPs',
          impact: 'Medium',
          actionRequired: 'Establish relationships and assess opportunity',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      ],
      challenges: [
        {
          description: 'Hospital system restricting access',
          severity: 'Major',
          mitigation: 'Leverage MSL support and virtual engagement'
        },
        {
          description: 'Competitor launch causing noise',
          severity: 'Major',
          mitigation: 'Emphasize differentiators and real-world evidence'
        },
        {
          description: 'Below target for Q1 calls',
          severity: 'Minor',
          mitigation: 'Increase daily call rate and use virtual options'
        }
      ],
      topPerformers: [
        { hcpName: 'Dr. Johnson', growth: 45, volume: 85 },
        { hcpName: 'Dr. Smith', growth: 38, volume: 72 },
        { hcpName: 'Dr. Williams', growth: 32, volume: 68 }
      ],
      recommendations: [
        {
          action: 'Focus on formulary win HCPs this week',
          priority: 1,
          expectedImpact: '20-30 additional prescriptions'
        },
        {
          action: 'Schedule virtual lunch-and-learn for restricted facilities',
          priority: 2,
          expectedImpact: 'Re-engage 10+ HCPs'
        },
        {
          action: 'Leverage top performers for peer referrals',
          priority: 3,
          expectedImpact: 'Access to 5-8 new HCPs'
        }
      ]
    };
  }

  private provideVirtualCoaching(data: any): VirtualCoaching {
    const topic = data.topic || 'objection_handling';
    const scenario = this.coachingScenarios.get(topic) || this.coachingScenarios.get('side_effects');
    
    return {
      sessionId: `COACH-${Date.now()}`,
      repId: data.repId || 'REP-001',
      topic: topic,
      scenario: {
        situation: scenario.situation,
        hcpType: 'Skeptical specialist with 20 years experience',
        objective: 'Convert skepticism to trial commitment',
        difficulty: scenario.difficulty
      },
      guidance: {
        approach: scenario.approach,
        keyPoints: [
          'Listen actively and validate concerns',
          'Use data to support, not overwhelm',
          'Focus on patient outcomes',
          'Offer specific support solutions',
          'Secure clear next step'
        ],
        avoidPitfalls: [
          'Don\'t dismiss concerns',
          'Avoid being defensive',
          'Don\'t overwhelm with data',
          'Avoid comparisons that belittle competition',
          'Don\'t make promises you can\'t keep'
        ]
      },
      rolePlay: {
        hcpStatement: 'I\'ve seen too many patients discontinue due to GI issues. Why would yours be different?',
        suggestedResponses: [
          {
            response: 'I appreciate you sharing that concern. In our trials, GI events were mostly mild and transient. Let me show you the discontinuation data and management strategies that have worked well.',
            effectiveness: 0.9,
            rationale: 'Acknowledges concern, provides specific data, offers solutions'
          },
          {
            response: 'Our GI profile is actually better than alternatives. Here\'s the data.',
            effectiveness: 0.5,
            rationale: 'Too direct, may seem dismissive of concern'
          },
          {
            response: 'That hasn\'t been an issue with our product.',
            effectiveness: 0.2,
            rationale: 'Dismissive, provides no value, damages credibility'
          }
        ],
        feedback: 'Good acknowledgment of concern. Remember to ask follow-up questions about their specific experience before presenting data.'
      },
      resources: {
        videos: [
          'Master Class: Objection Handling Techniques',
          'Real HCP Interactions: Learning from the Best',
          'Data Presentation Skills for Impact'
        ],
        articles: [
          'Top 10 Objections and How to Handle Them',
          'Building Trust Through Empathy',
          'Using Clinical Data Effectively'
        ],
        bestPractices: [
          'Always acknowledge before responding',
          'Use the feel-felt-found framework',
          'Have 3 supporting data points ready',
          'End with a question to confirm understanding'
        ]
      },
      assessment: {
        strengths: [
          'Good use of empathy in responses',
          'Strong clinical knowledge demonstrated',
          'Clear communication style'
        ],
        improvements: [
          'Pause more before responding',
          'Ask clarifying questions',
          'Customize data to HCP specialty'
        ],
        score: 78,
        nextSteps: [
          'Practice with 3 more scenarios this week',
          'Review competitive positioning guide',
          'Shadow top performer on difficult calls'
        ]
      }
    };
  }

  private optimizeCallSchedule(data: any): CallScheduler {
    const weekDays = 5;
    const weekView = Array.from({ length: weekDays }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      return {
        date,
        scheduledCalls: this.generateScheduledCalls(date),
        openSlots: ['8:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'],
        routeOptimization: {
          suggestedOrder: ['Dr. Smith (Hospital)', 'Dr. Jones (Clinic)', 'Dr. Brown (Office)'],
          estimatedDriveTime: 120,
          efficiency: 0.85
        }
      };
    });
    
    return {
      weekView,
      suggestions: [
        {
          hcpName: 'Dr. Anderson',
          reason: 'High priority - formulary win follow-up needed',
          proposedTime: 'Tuesday 10:00 AM'
        },
        {
          hcpName: 'Dr. Martinez',
          reason: 'Speaker program attendee - strike while hot',
          proposedTime: 'Wednesday 2:00 PM'
        },
        {
          hcpName: 'Dr. Taylor',
          reason: 'Quarterly touch-base overdue',
          proposedTime: 'Friday 11:00 AM'
        }
      ]
    };
  }

  private generateScheduledCalls(date: Date): any[] {
    const calls = [
      {
        time: '9:00 AM',
        hcpName: 'Dr. Johnson',
        type: 'In-Person' as const,
        priority: 'High' as const,
        objective: 'Present new efficacy data'
      },
      {
        time: '10:30 AM',
        hcpName: 'Dr. Williams',
        type: 'In-Person' as const,
        priority: 'Medium' as const,
        objective: 'Quarterly relationship touch-base'
      },
      {
        time: '1:00 PM',
        hcpName: 'Dr. Davis',
        type: 'Virtual' as const,
        priority: 'High' as const,
        objective: 'Address discontinuation concerns'
      }
    ];
    
    return calls;
  }

  private generateEmailDraft(hcp: HCPType, data: any): EmailAssistant {
    const emailType = data.type || 'clinical_update';
    const template = this.emailTemplates.get(emailType);
    
    const draft = {
      to: `${hcp.name}@hospital.com`,
      subject: this.personalizeSubject(template.subject, hcp),
      body: this.generateEmailBody(hcp, emailType, data),
      tone: template.tone || 'Professional' as const,
      callToAction: 'Schedule a brief call to discuss how this applies to your patients',
      estimatedReadTime: '2 minutes'
    };
    
    return {
      templates: Array.from(this.emailTemplates.entries()).map(([type, template]) => ({
        type,
        subject: template.subject,
        body: 'Template body content...',
        personalization: ['HCP name', 'Specialty reference', 'Recent interaction'],
        attachments: ['Clinical study PDF', 'Product monograph'],
        complianceChecked: true
      })),
      drafts: [draft],
      optimization: {
        bestSendTime: 'Tuesday 10:00 AM - highest open rate',
        subjectLineScore: 85,
        readabilityScore: 92,
        suggestions: [
          'Consider shorter subject line',
          'Add patient case example',
          'Include clear next step'
        ]
      }
    };
  }

  private personalizeSubject(template: string, hcp: HCPType): string {
    return template
      .replace('[Study Name]', 'PARADIGM-HF')
      .replace('[Event Name]', 'Regional Symposium')
      .replace('[Specialty]', hcp.specialty);
  }

  private generateEmailBody(hcp: HCPType, emailType: string, data: any): string {
    const greeting = `Dear Dr. ${hcp.name},\n\n`;
    
    const bodies: Record<string, string> = {
      clinical_update: `I hope this message finds you well. I wanted to share exciting new data from the PARADIGM-HF trial that's particularly relevant to your ${hcp.specialty} practice.

Key Finding: 45% reduction in primary endpoint vs. standard of care (p<0.001)

This translates to preventing 1 event for every 8 patients treated over 2 years - a meaningful difference for your patients.

The full publication is attached, but I'd be happy to discuss how these results apply to your specific patient population.

Would you have 15 minutes next week for a brief call?`,
      
      access_update: `Great news for your patients! As of this week, our therapy has achieved preferred formulary status with BlueCross BlueShield in your region.

What this means:
• Tier 2 coverage for 80% of your patients
• Simplified prior authorization process
• Co-pay assistance program can reduce out-of-pocket to $10/month

I'd like to ensure your office has all the resources needed to take advantage of this improved access.

Can we schedule a brief call to review the streamlined prescription process?`,
      
      event_followup: `Thank you for attending yesterday's dinner symposium on advances in treatment. It was great to see your engagement during Dr. Smith's presentation.

As promised, I'm attaching:
• Dr. Smith's slide deck
• The clinical algorithm discussed
• Patient identification checklist

You mentioned interest in the dosing optimization protocol - I've included that as well.

I'll follow up next week to see if you have any questions and discuss potential patients who might benefit.`
    };
    
    const closing = `\n\nBest regards,\n${data.repName || 'Your Sales Representative'}\n[Contact Information]`;
    
    return greeting + (bodies[emailType] || bodies.clinical_update) + closing;
  }

  private analyzePostCall(hcp: HCPType, data: any): PostCallAnalysis {
    const callData = data.callData || {};
    const barriers = data.barriers || [];
    
    return {
      callId: `CALL-${Date.now()}`,
      hcpId: hcp.id,
      date: new Date(),
      duration: callData.duration || 20,
      transcript: callData.transcript,
      analysis: {
        sentiment: this.analyzeSentiment(callData),
        engagementLevel: 75 + Math.random() * 20,
        keyTopics: [
          'Efficacy in elderly patients',
          'Side effect management',
          'Insurance coverage',
          'Patient support programs'
        ],
        objections: [
          {
            stated: 'Concerned about GI tolerability',
            addressed: true,
            effectiveness: 0.8
          },
          {
            stated: 'Prior authorization burden',
            addressed: true,
            effectiveness: 0.9
          }
        ],
        commitments: [
          {
            hcpCommitment: 'Will try with next appropriate patient',
            repCommitment: 'Send GI management protocol',
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          }
        ],
        barrierProgress: barriers.map((b: any) => ({
          barrier: b.name,
          previousStatus: 'Significant concern',
          currentStatus: 'Partially addressed',
          progress: 40 + Math.random() * 30
        }))
      },
      followUpPlan: {
        nextInteraction: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        channel: 'Field',
        objective: 'Check on first patient experience',
        materials: ['Titration guide', 'Patient diary', 'Lab monitoring checklist'],
        preparationNotes: [
          'Review patient case discussed',
          'Prepare side effect management resources',
          'Bring patient success stories from similar practice'
        ]
      },
      aiInsights: {
        strengths: [
          'Excellent rapport building in opening',
          'Effective use of clinical data',
          'Strong close with clear next steps'
        ],
        missedOpportunities: [
          'Could have probed deeper on patient types',
          'Missed chance to discuss peer experience',
          'Didn\'t mention upcoming speaker program'
        ],
        recommendations: [
          'Follow up within 48 hours while engagement is high',
          'Prepare specific patient profile for next call',
          'Consider inviting to peer discussion forum'
        ],
        predictedOutcome: 'High likelihood of trial prescription within 2 weeks',
        confidenceScore: 0.82
      }
    };
  }

  private analyzeSentiment(callData: any): 'Positive' | 'Neutral' | 'Negative' {
    // Simulate sentiment analysis
    const random = Math.random();
    if (random > 0.6) return 'Positive';
    if (random > 0.3) return 'Neutral';
    return 'Negative';
  }

  async recommend(context: any): Promise<string[]> {
    const { type, result, hcp, territory } = context;
    const recommendations: string[] = [];

    switch (type) {
      case 'preCall':
        recommendations.push('Review last 3 interactions in CRM before call');
        recommendations.push('Print barrier-specific materials identified in plan');
        recommendations.push('Practice objection responses with virtual coach');
        if (result.insights?.barriers?.[0]?.barrier.category === 'Access') {
          recommendations.push('Have reimbursement hub contact ready');
        }
        break;

      case 'territory':
        const metrics = result.metrics;
        if (metrics && metrics.attainmentRate < 0.8) {
          recommendations.push('Increase daily call rate to meet quarterly target');
        }
        recommendations.push('Prioritize high-opportunity HCPs identified');
        recommendations.push('Schedule team meeting to address challenges');
        recommendations.push('Leverage top performers for best practice sharing');
        break;

      case 'coaching':
        if (result.assessment && result.assessment.score < 80) {
          recommendations.push('Schedule additional practice session this week');
        }
        recommendations.push('Review recorded top performer calls');
        recommendations.push('Focus on identified improvement areas');
        break;

      case 'scheduling':
        recommendations.push('Confirm all appointments 24 hours in advance');
        recommendations.push('Build in buffer time for high-priority calls');
        recommendations.push('Prepare materials night before for efficiency');
        break;

      case 'email':
        recommendations.push('Send at optimal time identified by analytics');
        recommendations.push('Follow up if no response within 3 days');
        recommendations.push('Track open and click rates for optimization');
        break;

      case 'postCall':
        if (result.analysis?.sentiment === 'Positive') {
          recommendations.push('Strike while iron is hot - accelerate follow-up');
        }
        recommendations.push('Complete CRM update within 1 hour');
        recommendations.push('Send promised materials within 24 hours');
        recommendations.push('Share success insights with team');
        break;
    }

    return recommendations.slice(0, 10);
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'generatePreCallPlan':
        return this.generateComprehensivePreCallPlan(params.hcp, params.data);
      case 'analyzeTerritory':
        return this.generateTerritoryInsights(params.territory, params.data);
      case 'provideCoaching':
        return this.provideVirtualCoaching(params);
      case 'optimizeSchedule':
        return this.optimizeCallSchedule(params);
      case 'draftEmail':
        return this.generateEmailDraft(params.hcp, params);
      case 'analyzeCall':
        return this.analyzePostCall(params.hcp, params);
      case 'generateTalkingPoints':
        return this.generateTalkingPoints(params.topic, params.hcp);
      case 'competitiveIntel':
        return this.provideCompetitiveIntelligence(params.competitor);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private generateTalkingPoints(topic: string, hcp: HCPType): any {
    const talkingPoints: Record<string, any> = {
      efficacy: {
        opener: 'I wanted to share some compelling efficacy data that\'s particularly relevant to your patient population',
        keyPoints: [
          'Primary endpoint: 45% improvement vs SOC (p<0.001)',
          'Consistent results across all subgroups',
          'Onset of action within 2 weeks',
          'Sustained benefit over 52 weeks'
        ],
        supporting: 'Real-world data confirms clinical trial results',
        close: 'How do these outcomes align with your treatment goals?'
      },
      safety: {
        opener: 'I know safety is always a top priority for you and your patients',
        keyPoints: [
          'Discontinuation rate <5% due to AEs',
          'No black box warnings',
          'Well-tolerated in elderly patients',
          'Manageable side effect profile'
        ],
        supporting: '5,000 patient registry data available',
        close: 'What specific safety concerns do you have that I can address?'
      },
      access: {
        opener: 'I have great news about improved access for your patients',
        keyPoints: [
          'Now covered on 80% of commercial plans',
          'Tier 2 formulary status achieved',
          'Simplified PA process - 24 hour turnaround',
          'Co-pay assistance available'
        ],
        supporting: 'Dedicated reimbursement team support',
        close: 'How can we help streamline the prescription process for your office?'
      }
    };
    
    return talkingPoints[topic] || talkingPoints.efficacy;
  }

  private provideCompetitiveIntelligence(competitor: string): any {
    return {
      competitor,
      analysis: {
        strengths: [
          'Established market presence',
          'Lower acquisition cost',
          'Familiar to prescribers'
        ],
        weaknesses: [
          'Inferior efficacy in head-to-head trial',
          'More complex dosing regimen',
          'Limited patient support services',
          'Higher discontinuation rate'
        ],
        positioning: {
          primary: 'Superior efficacy with better tolerability',
          supporting: [
            'Comprehensive patient support program',
            'Simplified dosing improves adherence',
            'Better long-term outcomes data'
          ]
        }
      },
      battleCards: {
        efficacy: 'Our 45% improvement vs their 28% in similar populations',
        safety: 'Lower discontinuation rate (5% vs 12%)',
        convenience: 'Once-daily vs twice-daily dosing',
        support: 'Full patient support vs limited assistance',
        access: 'Improving formulary coverage trajectory'
      },
      handling: {
        ifAsked: 'I appreciate you considering all options for your patients. Let me show you how we compare...',
        proactive: 'You may have seen [competitor]\'s recent data. Here\'s how we differentiate...',
        defensive: 'Both are good options. Our advantages are particularly important for [specific patient type]'
      }
    };
  }
}