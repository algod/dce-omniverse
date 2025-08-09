import { BaseAgent, AgentResponse } from './base-agent';
import { 
  HCP as HCPType, 
  Barrier, 
  HCPOpportunity, 
  PrescribingData, 
  PatientMix,
  PHARMA_BARRIERS 
} from '@/lib/types/pharma';

export interface HCPPortfolio {
  totalHCPs: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  averageOpportunityScore: number;
  topBarriers: BarrierAnalysis[];
  recommendedActions: string[];
  segmentDistribution: Record<string, number>;
  opportunityMatrix: OpportunityMatrix;
}

export interface BarrierAnalysis {
  barrier: Barrier;
  affectedHCPs: number;
  avgLikelihood: number;
  avgImpact: number;
  priorityScore: number;
  recommendedPlay: EngagementPlay;
}

export interface EngagementPlay {
  goal: string;
  role: string;
  insights: string[];
  materials: string[];
  channels: string[];
  nextSteps: string[];
}

export interface OpportunityMatrix {
  highDepthHighBreadth: HCPType[];
  highDepthLowBreadth: HCPType[];
  lowDepthHighBreadth: HCPType[];
  lowDepthLowBreadth: HCPType[];
}

export interface CustomerPlanningInput {
  hcps: HCPType[];
  prescribingData: PrescribingData[];
  patientMix: PatientMix[];
  opportunities: HCPOpportunity[];
  territory?: string;
  period?: string;
}

export class CustomerPlanningAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Customer Planning Agent',
      description: 'Prioritizes high opportunity customers using comprehensive barrier analysis and predictive models',
      systemPrompt: `You are an expert in pharmaceutical customer strategy, data science, and barrier analysis.
Your role is to:
1. Identify and analyze the 5 primary barriers affecting HCP prescribing behavior
2. Run predictive models for sales depth and breadth opportunities
3. Provide barrier-specific engagement recommendations using "The Play" framework
4. Prioritize HCPs based on opportunity score and accessibility
5. Map barriers to KPIs and recommend data-driven interventions

Key barriers to analyze:
- No/challenging referral pathways
- Managing side effects challenges  
- Insurance denials or restrictions
- Product not in formulary
- Requires new diagnostic tool

Use advanced analytics to identify HCP opportunity sensitivity to promotion and determine optimal channel mix.`,
      capabilities: [
        'Comprehensive barrier analysis with KPI mapping',
        'Sales depth and breadth prediction modeling',
        'HCP opportunity scoring and prioritization',
        'Engagement play recommendations',
        'Customer segmentation and targeting',
        'Predictive analytics for opportunity identification'
      ]
    });
  }

  async analyze(input: CustomerPlanningInput): Promise<AgentResponse> {
    const { hcps, prescribingData, opportunities, territory, period } = input;
    
    const prompt = `
Analyze the HCP portfolio for strategic customer planning:
- Total HCPs: ${hcps?.length || 0}
- Territory: ${territory || 'All'}
- Time Period: ${period || 'Q1 2025'}

Key Analysis Areas:
1. Barrier prevalence and impact assessment across 5 primary barriers
2. Sales depth (increase per patient) and breadth (new patients) opportunity prediction
3. HCP prioritization based on value, barriers, and accessibility
4. Channel sensitivity and optimal engagement mix
5. Competitive positioning and share growth potential

Provide actionable recommendations using "The Play" framework for top barriers.
`;

    const response = await this.executePrompt(prompt);
    const portfolio = this.analyzePortfolio(input);
    const barrierAnalysis = this.performBarrierAnalysis(hcps, opportunities);
    const opportunityMatrix = this.createOpportunityMatrix(hcps, opportunities);

    return {
      result: {
        ...portfolio,
        topBarriers: barrierAnalysis,
        opportunityMatrix
      },
      reasoning: response,
      confidence: 0.89,
      recommendations: await this.recommend({ portfolio, barrierAnalysis, opportunityMatrix })
    };
  }

  private analyzePortfolio(input: CustomerPlanningInput): Omit<HCPPortfolio, 'topBarriers' | 'opportunityMatrix'> {
    const { hcps = [], opportunities = [] } = input;
    
    // Calculate priority distribution based on opportunity scores
    const highPriority = opportunities.filter(o => o.priorityLevel === 'High').length;
    const mediumPriority = opportunities.filter(o => o.priorityLevel === 'Medium').length;
    const lowPriority = opportunities.filter(o => o.priorityLevel === 'Low').length;
    
    // Calculate average opportunity score
    const avgScore = opportunities.reduce((sum, o) => sum + o.opportunityScore, 0) / (opportunities.length || 1);
    
    // Segment distribution analysis
    const segmentDistribution: Record<string, number> = {};
    hcps.forEach(hcp => {
      segmentDistribution[hcp.segment] = (segmentDistribution[hcp.segment] || 0) + 1;
    });
    
    return {
      totalHCPs: hcps.length,
      highPriority,
      mediumPriority,
      lowPriority,
      averageOpportunityScore: avgScore,
      recommendedActions: this.generateStrategicActions(opportunities, avgScore),
      segmentDistribution
    };
  }

  private performBarrierAnalysis(hcps: HCPType[], opportunities: HCPOpportunity[]): BarrierAnalysis[] {
    const barrierMap = new Map<string, {
      barrier: Barrier;
      hcps: Set<string>;
      totalLikelihood: number;
      totalImpact: number;
      count: number;
    }>();

    // Aggregate barrier data from opportunities
    opportunities.forEach(opp => {
      opp.barriers.forEach(b => {
        if (!barrierMap.has(b.barrierId)) {
          const barrier = PHARMA_BARRIERS.find(pb => pb.id === b.barrierId);
          if (!barrier) return;
          
          barrierMap.set(b.barrierId, {
            barrier,
            hcps: new Set(),
            totalLikelihood: 0,
            totalImpact: 0,
            count: 0
          });
        }
        
        const data = barrierMap.get(b.barrierId)!;
        data.hcps.add(opp.hcpId);
        data.totalLikelihood += b.likelihood;
        data.totalImpact += b.impact;
        data.count++;
      });
    });

    // Convert to BarrierAnalysis array with engagement plays
    return Array.from(barrierMap.values())
      .map(data => ({
        barrier: data.barrier,
        affectedHCPs: data.hcps.size,
        avgLikelihood: data.totalLikelihood / data.count,
        avgImpact: data.totalImpact / data.count,
        priorityScore: (data.totalLikelihood / data.count) * (data.totalImpact / data.count) * data.hcps.size,
        recommendedPlay: this.generateEngagementPlay(data.barrier)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5);
  }

  private generateEngagementPlay(barrier: Barrier): EngagementPlay {
    const plays: Record<string, EngagementPlay> = {
      'B001': { // No/challenging referral pathways
        goal: 'Drive awareness of disease with broader audience of HCPs who these patients initially see',
        role: 'Rep deployed as primary; digital channel for secondary',
        insights: [
          'Map of referral network in 100-mile radius of customers',
          'Referral guidelines for disease, including symptom presentations',
          'Potential misdiagnosed patients based on claims data/predictive modeling'
        ],
        materials: [
          'Referral guidelines fact sheet (printout)',
          'Disease State Specialists search tool (web)',
          'Referral pathway optimization guide'
        ],
        channels: ['Field', 'Email', 'Web', 'Virtual'],
        nextSteps: [
          'Alert patient navigator of patient cases in need of referral',
          'Share broader HCP education through digital channels',
          'Establish referral partnerships with key specialists'
        ]
      },
      'B002': { // Managing side effects
        goal: 'Build confidence in side effect management and patient monitoring',
        role: 'MSL for complex cases; rep for standard management protocols',
        insights: [
          'Common side effect patterns in similar patient populations',
          'Management protocols from leading KOLs',
          'Patient support program enrollment and outcomes data'
        ],
        materials: [
          'Side effect management algorithm',
          'Patient monitoring checklist',
          'Nurse support program enrollment kit'
        ],
        channels: ['Field', 'Virtual', 'Phone', 'Print'],
        nextSteps: [
          'Schedule MSL consultation for complex cases',
          'Enroll practice in nurse educator program',
          'Provide 24/7 clinician support hotline access'
        ]
      },
      'B003': { // Insurance denials
        goal: 'Streamline prior authorization process and reduce denial rates',
        role: 'Access team primary; field rep for follow-up and support',
        insights: [
          'Payer coverage by plan type in territory',
          'Common denial reasons and successful appeal strategies',
          'Average time to approval by payer'
        ],
        materials: [
          'Prior authorization checklist and forms',
          'Coding and billing guide with tips',
          'Appeals letter templates with supporting data'
        ],
        channels: ['Phone', 'Email', 'Portal', 'Field'],
        nextSteps: [
          'Connect office staff with reimbursement hub',
          'Schedule payer education session',
          'Implement electronic prior auth submission'
        ]
      },
      'B004': { // Formulary restrictions
        goal: 'Achieve formulary inclusion and optimize tier placement',
        role: 'Account management lead; MSL for P&T presentations',
        insights: [
          'P&T committee meeting schedule and members',
          'Formulary status across major health systems',
          'Value dossier and health economics data'
        ],
        materials: [
          'Formulary kit with clinical and economic data',
          'P&T presentation deck',
          'Peer-reviewed publications package'
        ],
        channels: ['Field', 'Virtual', 'Email'],
        nextSteps: [
          'Schedule P&T presentation with MSL support',
          'Provide value dossier to decision makers',
          'Arrange KOL peer-to-peer discussions'
        ]
      },
      'B005': { // Diagnostic requirements
        goal: 'Facilitate diagnostic test adoption and accessibility',
        role: 'Field and lab partnership teams collaborate',
        insights: [
          'Diagnostic test availability by geography',
          'Lab partnership opportunities',
          'Testing protocol best practices'
        ],
        materials: [
          'Diagnostic testing guidelines',
          'Lab partnership directory',
          'Sample collection and handling guide'
        ],
        channels: ['Field', 'Web', 'Email'],
        nextSteps: [
          'Establish lab partnerships for easy testing access',
          'Provide diagnostic education to office staff',
          'Create testing protocol for practice'
        ]
      }
    };
    
    return plays[barrier.id] || {
      goal: 'Address barrier through targeted multi-channel engagement',
      role: 'Coordinated field and digital approach',
      insights: barrier.kpiMapping,
      materials: ['Educational materials', 'Support resources'],
      channels: ['Field', 'Digital', 'Virtual'],
      nextSteps: barrier.recommendedActions
    };
  }

  private createOpportunityMatrix(hcps: HCPType[], opportunities: HCPOpportunity[]): OpportunityMatrix {
    const matrix: OpportunityMatrix = {
      highDepthHighBreadth: [],
      highDepthLowBreadth: [],
      lowDepthHighBreadth: [],
      lowDepthLowBreadth: []
    };

    opportunities.forEach(opp => {
      const hcp = hcps.find(h => h.id === opp.hcpId);
      if (!hcp) return;

      const depthHigh = opp.depthOpportunity > 50;
      const breadthHigh = opp.breadthOpportunity > 50;

      if (depthHigh && breadthHigh) {
        matrix.highDepthHighBreadth.push(hcp);
      } else if (depthHigh && !breadthHigh) {
        matrix.highDepthLowBreadth.push(hcp);
      } else if (!depthHigh && breadthHigh) {
        matrix.lowDepthHighBreadth.push(hcp);
      } else {
        matrix.lowDepthLowBreadth.push(hcp);
      }
    });

    // Limit to top 5 in each quadrant for visualization
    Object.keys(matrix).forEach(key => {
      (matrix as any)[key] = (matrix as any)[key].slice(0, 5);
    });

    return matrix;
  }

  private generateStrategicActions(opportunities: HCPOpportunity[], avgScore: number): string[] {
    const actions: string[] = [];
    
    const highPriorityCount = opportunities.filter(o => o.priorityLevel === 'High').length;
    const avgDepth = opportunities.reduce((sum, o) => sum + o.depthOpportunity, 0) / (opportunities.length || 1);
    const avgBreadth = opportunities.reduce((sum, o) => sum + o.breadthOpportunity, 0) / (opportunities.length || 1);
    
    if (highPriorityCount > 20) {
      actions.push(`Deploy field resources to ${highPriorityCount} high-priority HCPs with weekly touchpoints`);
    }
    
    if (avgDepth > avgBreadth) {
      actions.push('Focus on prescription depth through adherence and persistency programs');
    } else {
      actions.push('Expand prescriber base through awareness campaigns and peer influence');
    }
    
    if (avgScore < 60) {
      actions.push('Implement intensive barrier resolution program for bottom quartile');
    }
    
    actions.push('Execute barrier-specific engagement plays for top 3 identified barriers');
    actions.push('Leverage predictive models monthly to identify emerging opportunities');
    actions.push('Coordinate MSL support for high-value targets with clinical barriers');
    
    return actions;
  }

  async recommend(context: any): Promise<string[]> {
    const { portfolio, barrierAnalysis, opportunityMatrix } = context;
    const recommendations: string[] = [];

    // Priority-based recommendations
    if (portfolio.highPriority > 30) {
      recommendations.push(`Allocate 60% of field resources to ${portfolio.highPriority} high-priority HCPs`);
      recommendations.push('Implement "white glove" service model for top decile prescribers');
    }

    // Barrier-based recommendations
    if (barrierAnalysis && barrierAnalysis.length > 0) {
      const topBarrier = barrierAnalysis[0];
      recommendations.push(`PRIORITY: "${topBarrier.barrier.name}" affecting ${topBarrier.affectedHCPs} HCPs (${(topBarrier.avgLikelihood * 100).toFixed(0)}% likelihood)`);
      recommendations.push(`Deploy: "${topBarrier.recommendedPlay.goal}"`);
      
      if (barrierAnalysis.length > 1) {
        const secondBarrier = barrierAnalysis[1];
        recommendations.push(`Secondary focus: "${secondBarrier.barrier.name}" with ${secondBarrier.affectedHCPs} HCPs affected`);
      }
    }

    // Opportunity matrix recommendations
    if (opportunityMatrix.highDepthHighBreadth.length > 0) {
      recommendations.push(`${opportunityMatrix.highDepthHighBreadth.length} HCPs in optimal quadrant - maintain momentum with premium support`);
    }
    
    if (opportunityMatrix.lowDepthHighBreadth.length > 0) {
      recommendations.push(`${opportunityMatrix.lowDepthHighBreadth.length} HCPs show breadth opportunity - focus on patient identification`);
    }

    // Segment-specific recommendations
    if (portfolio.segmentDistribution) {
      const growthSegment = portfolio.segmentDistribution['Growth Potential'] || 0;
      if (growthSegment > 15) {
        recommendations.push(`Accelerate engagement for ${growthSegment} growth potential HCPs`);
      }
    }

    // Channel optimization
    recommendations.push('Optimize channel mix: 40% field, 30% digital, 20% virtual, 10% events');
    recommendations.push('Implement trigger-based engagement for real-time opportunity capture');

    return recommendations.slice(0, 10);
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'prioritizeHCPs':
        return this.prioritizeHCPs(params.hcps, params.opportunities);
      case 'runOpportunityModel':
        return this.runOpportunityPredictionModel(params.hcps, params.prescribingData);
      case 'analyzeBarriers':
        return this.analyzeBarriersDetailed(params.opportunities);
      case 'generateEngagementPlan':
        return this.generateEngagementPlan(params.hcp, params.barriers, params.opportunity);
      case 'segmentAnalysis':
        return this.performSegmentAnalysis(params.hcps, params.prescribingData);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private prioritizeHCPs(hcps: HCPType[], opportunities: HCPOpportunity[]): any {
    const prioritized = opportunities
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .map(opp => {
        const hcp = hcps.find(h => h.id === opp.hcpId);
        return {
          ...hcp,
          opportunityScore: opp.opportunityScore,
          depthOpportunity: opp.depthOpportunity,
          breadthOpportunity: opp.breadthOpportunity,
          priorityLevel: opp.priorityLevel,
          estimatedValue: opp.estimatedValue,
          barriers: opp.barriers
        };
      });

    return {
      highPriority: prioritized.filter(h => h.priorityLevel === 'High'),
      mediumPriority: prioritized.filter(h => h.priorityLevel === 'Medium'),
      lowPriority: prioritized.filter(h => h.priorityLevel === 'Low'),
      totalEstimatedValue: prioritized.reduce((sum, h) => sum + h.estimatedValue, 0),
      topOpportunities: prioritized.slice(0, 10)
    };
  }

  private runOpportunityPredictionModel(hcps: HCPType[], prescribingData: PrescribingData[]): any {
    // Simulate predictive model for depth and breadth opportunities
    const predictions = hcps.slice(0, 20).map(hcp => {
      const hcpRx = prescribingData.filter(p => p.hcpId === hcp.id);
      const currentVolume = hcpRx.reduce((sum, p) => sum + p.totalRx, 0);
      const trend = hcpRx[0]?.trend || 'Stable';
      
      const depthPotential = trend === 'Increasing' ? 70 + Math.random() * 30 : 40 + Math.random() * 30;
      const breadthPotential = hcp.tier === 'A' ? 60 + Math.random() * 40 : 30 + Math.random() * 40;
      
      return {
        hcpId: hcp.id,
        hcpName: hcp.name,
        currentVolume,
        predictedVolume: currentVolume * (1 + (depthPotential + breadthPotential) / 200),
        depthOpportunity: depthPotential,
        breadthOpportunity: breadthPotential,
        confidence: 0.7 + Math.random() * 0.25,
        timeToImpact: '3-6 months',
        keyDrivers: [
          depthPotential > breadthPotential ? 'Increase per-patient dosing' : 'Expand patient base',
          'Barrier resolution',
          'Peer influence'
        ]
      };
    });

    return {
      modelVersion: '2.5.0',
      modelType: 'BERT-based prediction with barrier context',
      runDate: new Date(),
      predictions,
      aggregateMetrics: {
        totalOpportunity: predictions.reduce((sum, p) => sum + (p.predictedVolume - p.currentVolume), 0),
        avgConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
        highConfidencePredictions: predictions.filter(p => p.confidence > 0.85).length
      }
    };
  }

  private analyzeBarriersDetailed(opportunities: HCPOpportunity[]): any {
    const barrierStats = new Map<string, any>();
    
    opportunities.forEach(opp => {
      opp.barriers.forEach(b => {
        if (!barrierStats.has(b.barrierId)) {
          const barrier = PHARMA_BARRIERS.find(pb => pb.id === b.barrierId);
          barrierStats.set(b.barrierId, {
            barrier,
            hcpCount: 0,
            totalLikelihood: 0,
            totalImpact: 0,
            severityDistribution: { low: 0, medium: 0, high: 0 }
          });
        }
        
        const stats = barrierStats.get(b.barrierId);
        stats.hcpCount++;
        stats.totalLikelihood += b.likelihood;
        stats.totalImpact += b.impact;
        
        if (b.impact > 0.7) stats.severityDistribution.high++;
        else if (b.impact > 0.4) stats.severityDistribution.medium++;
        else stats.severityDistribution.low++;
      });
    });
    
    return Array.from(barrierStats.values())
      .map(stats => ({
        ...stats,
        avgLikelihood: stats.totalLikelihood / stats.hcpCount,
        avgImpact: stats.totalImpact / stats.hcpCount,
        priorityScore: (stats.totalLikelihood / stats.hcpCount) * stats.hcpCount
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  private generateEngagementPlan(hcp: HCPType, barriers: any[], opportunity: HCPOpportunity): any {
    const tier = hcp.tier;
    const frequency = tier === 'A' ? 'Weekly' : tier === 'B' ? 'Bi-weekly' : tier === 'C' ? 'Monthly' : 'Quarterly';
    const channels = tier === 'A' ? ['Field', 'Email', 'Virtual', 'Events'] : 
                     tier === 'B' ? ['Field', 'Email', 'Web'] : 
                     ['Email', 'Web'];
    
    return {
      hcpId: hcp.id,
      hcpName: hcp.name,
      tier,
      segment: hcp.segment,
      plan: {
        frequency,
        channels,
        touchpointsPerQuarter: tier === 'A' ? 13 : tier === 'B' ? 6 : tier === 'C' ? 3 : 1,
        messages: this.selectMessages(barriers, opportunity),
        materials: this.selectMaterials(barriers),
        estimatedInvestment: tier === 'A' ? 18000 : tier === 'B' ? 9000 : tier === 'C' ? 4000 : 1000,
        expectedROI: tier === 'A' ? 3.8 : tier === 'B' ? 3.2 : tier === 'C' ? 2.5 : 1.8
      },
      barriers: barriers.map(b => ({
        name: b.barrier?.name || b.name,
        interventions: b.barrier?.recommendedActions || []
      })),
      expectedOutcome: {
        volumeIncrease: `${Math.round(opportunity.depthOpportunity * 0.4 + opportunity.breadthOpportunity * 0.3)}%`,
        timeframe: '6 months',
        confidence: opportunity.opportunityScore / 100
      }
    };
  }

  private selectMessages(barriers: any[], opportunity: HCPOpportunity): string[] {
    const messages = ['Superior efficacy in real-world evidence'];
    
    if (opportunity.depthOpportunity > opportunity.breadthOpportunity) {
      messages.push('Improved patient outcomes with optimized dosing');
    } else {
      messages.push('Expanded indication for broader patient population');
    }
    
    barriers.forEach(b => {
      const barrier = PHARMA_BARRIERS.find(pb => pb.id === b.barrierId);
      if (barrier?.category === 'Safety') {
        messages.push('Favorable safety profile with manageable AEs');
      } else if (barrier?.category === 'Access') {
        messages.push('Comprehensive patient support and access programs');
      }
    });
    
    return [...new Set(messages)];
  }

  private selectMaterials(barriers: any[]): string[] {
    const materials = ['Clinical trial data summary', 'Dosing guide'];
    
    barriers.forEach(b => {
      const barrier = PHARMA_BARRIERS.find(pb => pb.id === b.barrierId);
      if (barrier) {
        materials.push(...barrier.contentThemes.map(theme => `${theme} materials`));
      }
    });
    
    return [...new Set(materials)].slice(0, 5);
  }

  private performSegmentAnalysis(hcps: HCPType[], prescribingData: PrescribingData[]): any {
    const segments: Record<string, any> = {};
    
    hcps.forEach(hcp => {
      if (!segments[hcp.segment]) {
        segments[hcp.segment] = {
          name: hcp.segment,
          count: 0,
          totalRx: 0,
          avgDecile: 0,
          tiers: { A: 0, B: 0, C: 0, D: 0 },
          specialties: new Set<string>()
        };
      }
      
      const segment = segments[hcp.segment];
      segment.count++;
      segment.tiers[hcp.tier]++;
      segment.specialties.add(hcp.specialty);
      segment.avgDecile = (segment.avgDecile * (segment.count - 1) + hcp.decile) / segment.count;
      
      const hcpRx = prescribingData.filter(p => p.hcpId === hcp.id);
      segment.totalRx += hcpRx.reduce((sum, p) => sum + p.totalRx, 0);
    });
    
    return {
      segments: Object.values(segments).map(s => ({
        ...s,
        specialties: Array.from(s.specialties),
        avgRxPerHCP: s.totalRx / s.count,
        strategy: this.determineSegmentStrategy(s.name),
        investmentPriority: this.calculateInvestmentPriority(s)
      })),
      recommendations: [
        'Customize engagement frequency by segment value and growth potential',
        'Develop segment-specific value propositions and messaging',
        'Align channel mix to segment preferences and accessibility'
      ]
    };
  }

  private determineSegmentStrategy(segmentName: string): string {
    const strategies: Record<string, string> = {
      'High Prescriber': 'Defend and grow share through premium service',
      'Growth Potential': 'Accelerate adoption with intensive engagement',
      'Maintain': 'Efficient touch-points to sustain current prescribing',
      'Monitor': 'Digital-first approach with trigger-based intervention'
    };
    return strategies[segmentName] || 'Standard engagement protocol';
  }

  private calculateInvestmentPriority(segment: any): string {
    const score = segment.tiers.A * 4 + segment.tiers.B * 3 + segment.tiers.C * 2 + segment.tiers.D;
    if (score > 50) return 'High';
    if (score > 25) return 'Medium';
    return 'Low';
  }
}