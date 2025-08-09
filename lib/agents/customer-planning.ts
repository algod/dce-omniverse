import { BaseAgent, AgentResponse } from './base-agent';

export interface HCPBarrier {
  type: 'insurance_denial' | 'side_effects' | 'referral_pathway' | 'formulary' | 'diagnostic_tool';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface HCP {
  id: string;
  name: string;
  specialty: string;
  prescribingVolume: number;
  barriers: HCPBarrier[];
  opportunityScore?: number;
  segment?: string;
}

export class CustomerPlanningAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Customer Planning Agent',
      description: 'Prioritizes high opportunity customers using barrier analysis and predictive models',
      systemPrompt: `You are an expert in pharmaceutical customer strategy, data science, and barrier analysis.
Your role is to:
1. Identify and analyze barriers affecting HCP prescribing behavior
2. Calculate opportunity scores based on barrier severity and prescribing potential
3. Recommend targeted engagement strategies for each HCP segment
4. Provide data-driven prioritization of customers

Focus on these 5 key barriers:
- Insurance denials or restrictions
- Managing side effects challenges
- No/challenging referral pathways
- Product not in formulary
- Requires new diagnostic tool`,
      capabilities: [
        'Barrier identification and analysis',
        'HCP opportunity scoring',
        'Predictive modeling for sales depth/breadth',
        'Customer segmentation',
        'Engagement strategy recommendations'
      ]
    });
  }

  async analyze(hcp: HCP): Promise<AgentResponse> {
    const prompt = `
Analyze this HCP profile and provide opportunity assessment:
- ID: ${hcp.id}
- Name: ${hcp.name}
- Specialty: ${hcp.specialty}
- Current Prescribing Volume: ${hcp.prescribingVolume}
- Identified Barriers: ${JSON.stringify(hcp.barriers)}

Calculate:
1. Opportunity score (0-100)
2. Barrier impact assessment
3. Growth potential
4. Recommended engagement approach
`;

    const response = await this.executePrompt(prompt);
    
    const opportunityScore = this.calculateOpportunityScore(hcp);
    const segment = this.determineSegment(opportunityScore, hcp.barriers);

    return {
      result: {
        hcpId: hcp.id,
        opportunityScore,
        segment,
        barrierAnalysis: response,
        growthPotential: this.calculateGrowthPotential(hcp)
      },
      reasoning: response,
      confidence: 0.85,
      recommendations: await this.recommend({ hcp, opportunityScore, segment })
    };
  }

  private calculateOpportunityScore(hcp: HCP): number {
    let baseScore = Math.min(100, hcp.prescribingVolume / 10);
    
    hcp.barriers.forEach(barrier => {
      const impact = barrier.severity === 'high' ? 0.7 : 
                     barrier.severity === 'medium' ? 0.85 : 0.95;
      baseScore *= impact;
    });

    const specialtyBonus = ['Oncology', 'Cardiology', 'Neurology'].includes(hcp.specialty) ? 10 : 0;
    
    return Math.round(Math.min(100, baseScore + specialtyBonus));
  }

  private calculateGrowthPotential(hcp: HCP): string {
    const score = this.calculateOpportunityScore(hcp);
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Minimal';
  }

  private determineSegment(score: number, barriers: HCPBarrier[]): string {
    const highSeverityBarriers = barriers.filter(b => b.severity === 'high').length;
    
    if (score >= 80 && highSeverityBarriers === 0) return 'Champions';
    if (score >= 60 && highSeverityBarriers <= 1) return 'Growth';
    if (score >= 40) return 'Maintain';
    return 'Monitor';
  }

  async recommend(context: any): Promise<string[]> {
    const { hcp, opportunityScore, segment } = context;
    const recommendations: string[] = [];

    if (segment === 'Champions') {
      recommendations.push('Schedule monthly in-person visits');
      recommendations.push('Invite to speaker programs');
      recommendations.push('Provide premium educational content');
    } else if (segment === 'Growth') {
      recommendations.push('Bi-weekly digital engagement');
      recommendations.push('Address specific barriers with targeted content');
      recommendations.push('Connect with peer champions for testimonials');
    } else if (segment === 'Maintain') {
      recommendations.push('Monthly digital touchpoints');
      recommendations.push('Automated email campaigns');
      recommendations.push('Quarterly check-ins');
    } else {
      recommendations.push('Quarterly digital updates');
      recommendations.push('Include in mass communication');
    }

    hcp.barriers.forEach((barrier: HCPBarrier) => {
      if (barrier.severity === 'high') {
        recommendations.push(`Priority: Address ${barrier.type} through specialized support program`);
      }
    });

    return recommendations;
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'analyzePortfolio':
        return this.analyzePortfolio(params.hcps);
      case 'generateSegmentation':
        return this.generateSegmentation(params.hcps);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async analyzePortfolio(hcps: HCP[]): Promise<any> {
    const analyses = await Promise.all(hcps.map(hcp => this.analyze(hcp)));
    
    return {
      totalHCPs: hcps.length,
      averageOpportunityScore: analyses.reduce((sum, a) => sum + a.result.opportunityScore, 0) / hcps.length,
      segmentDistribution: this.getSegmentDistribution(analyses),
      topOpportunities: analyses
        .sort((a, b) => b.result.opportunityScore - a.result.opportunityScore)
        .slice(0, 10)
    };
  }

  private generateSegmentation(hcps: HCP[]): any {
    const segments: Record<string, HCP[]> = {
      Champions: [],
      Growth: [],
      Maintain: [],
      Monitor: []
    };

    hcps.forEach(hcp => {
      const score = this.calculateOpportunityScore(hcp);
      const segment = this.determineSegment(score, hcp.barriers);
      segments[segment].push(hcp);
    });

    return segments;
  }

  private getSegmentDistribution(analyses: AgentResponse[]): Record<string, number> {
    const distribution: Record<string, number> = {
      Champions: 0,
      Growth: 0,
      Maintain: 0,
      Monitor: 0
    };

    analyses.forEach(analysis => {
      const segment = analysis.result.segment;
      distribution[segment] = (distribution[segment] || 0) + 1;
    });

    return distribution;
  }
}