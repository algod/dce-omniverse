import { BaseAgent, AgentResponse } from './base-agent';

export interface ContentAsset {
  id: string;
  title: string;
  type: 'email' | 'web' | 'print' | 'video' | 'interactive';
  theme: string;
  barrier?: string;
  status: 'approved' | 'pending' | 'rejected' | 'expired';
  createdDate: Date;
  expiryDate: Date;
  mlrScore?: number;
  complianceIssues?: string[];
  messageAlignment?: number;
}

export interface MLRReview {
  assetId: string;
  recommendation: 'approve' | 'reject' | 'revise';
  score: number;
  issues: string[];
  suggestions: string[];
  reasoning: string;
}

export class ContentReviewAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Content Review Agent',
      description: 'Accelerates MLR approval process and manages content library',
      systemPrompt: `You are an expert in pharmaceutical marketing compliance, MLR (Medical, Legal, Regulatory) review, and content management.
Your role is to:
1. Assess content for MLR compliance
2. Map message themes to customer barriers
3. Identify content gaps in the library
4. Accelerate approval process with AI recommendations
5. Ensure regulatory compliance and accuracy

Focus on these key areas:
- Medical accuracy and claim substantiation
- Legal compliance with FDA regulations
- Fair balance in promotional materials
- Appropriate safety information
- Brand consistency and messaging alignment`,
      capabilities: [
        'Automated MLR compliance checking',
        'Content gap analysis',
        'Message theme mapping',
        'Approval workflow acceleration',
        'Content performance tracking'
      ]
    });
  }

  async analyze(asset: ContentAsset): Promise<AgentResponse> {
    const prompt = `
Review this content asset for MLR compliance:
- Title: ${asset.title}
- Type: ${asset.type}
- Theme: ${asset.theme}
- Target Barrier: ${asset.barrier || 'General'}
- Current Status: ${asset.status}

Assess for:
1. Medical accuracy
2. Legal compliance
3. Regulatory requirements
4. Safety information completeness
5. Claims substantiation

Provide approval recommendation and specific feedback.
`;

    const response = await this.executePrompt(prompt);
    const mlrReview = this.performMLRReview(asset);

    return {
      result: mlrReview,
      reasoning: response,
      confidence: 0.92,
      recommendations: await this.recommend({ asset, mlrReview })
    };
  }

  private performMLRReview(asset: ContentAsset): MLRReview {
    // Simulate MLR scoring
    const baseScore = 75;
    const typeBonus = asset.type === 'print' ? 10 : asset.type === 'email' ? 5 : 0;
    const themeBonus = ['Efficacy', 'Safety', 'Dosing'].includes(asset.theme) ? 10 : 5;
    const randomVariation = Math.random() * 10 - 5;
    
    const score = Math.min(100, Math.max(0, baseScore + typeBonus + themeBonus + randomVariation));
    
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (score < 70) {
      issues.push('Missing required safety information');
      issues.push('Claims need additional substantiation');
      suggestions.push('Add complete prescribing information link');
      suggestions.push('Include clinical trial data references');
    } else if (score < 85) {
      issues.push('Minor formatting inconsistencies');
      suggestions.push('Enhance visual hierarchy for safety information');
    }

    if (!asset.barrier) {
      suggestions.push('Consider targeting specific HCP barriers for better engagement');
    }

    return {
      assetId: asset.id,
      recommendation: score >= 85 ? 'approve' : score >= 70 ? 'revise' : 'reject',
      score,
      issues,
      suggestions,
      reasoning: `Asset scored ${score.toFixed(1)}/100 based on compliance criteria. ${
        score >= 85 ? 'Ready for approval.' : 
        score >= 70 ? 'Minor revisions needed.' : 
        'Significant compliance issues identified.'
      }`
    };
  }

  async recommend(context: any): Promise<string[]> {
    const { asset, mlrReview } = context;
    const recommendations: string[] = [];

    if (mlrReview.recommendation === 'approve') {
      recommendations.push('Fast-track this asset for immediate deployment');
      recommendations.push('Use as template for similar content development');
    } else if (mlrReview.recommendation === 'revise') {
      recommendations.push('Address identified issues within 48 hours');
      recommendations.push('Schedule expedited re-review after revisions');
      mlrReview.suggestions.forEach(s => recommendations.push(s));
    } else {
      recommendations.push('Requires significant revision before resubmission');
      recommendations.push('Consider consulting medical/legal team');
      recommendations.push('Review against approved content templates');
    }

    if (asset.barrier) {
      recommendations.push(`Optimize messaging for ${asset.barrier} barrier resolution`);
    }

    if (asset.type === 'digital' || asset.type === 'email') {
      recommendations.push('A/B test different versions for engagement optimization');
    }

    return recommendations;
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'batchReview':
        return this.batchReview(params.assets);
      case 'contentGapAnalysis':
        return this.contentGapAnalysis(params.library, params.barriers);
      case 'generateContentCalendar':
        return this.generateContentCalendar(params.approvedAssets);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async batchReview(assets: ContentAsset[]): Promise<any> {
    const reviews = await Promise.all(assets.map(asset => this.analyze(asset)));
    
    return {
      totalAssets: assets.length,
      approved: reviews.filter(r => r.result.recommendation === 'approve').length,
      needsRevision: reviews.filter(r => r.result.recommendation === 'revise').length,
      rejected: reviews.filter(r => r.result.recommendation === 'reject').length,
      averageScore: reviews.reduce((sum, r) => sum + r.result.score, 0) / reviews.length,
      reviews
    };
  }

  private contentGapAnalysis(library: ContentAsset[], barriers: string[]): any {
    const gaps: any[] = [];
    const contentByBarrier: Record<string, ContentAsset[]> = {};

    library.forEach(asset => {
      if (asset.barrier) {
        if (!contentByBarrier[asset.barrier]) {
          contentByBarrier[asset.barrier] = [];
        }
        contentByBarrier[asset.barrier].push(asset);
      }
    });

    barriers.forEach(barrier => {
      const content = contentByBarrier[barrier] || [];
      if (content.length < 3) {
        gaps.push({
          barrier,
          currentAssets: content.length,
          recommended: 3,
          gap: 3 - content.length,
          priority: 'High',
          suggestedTypes: ['email', 'web', 'print']
        });
      }
    });

    return {
      totalBarriers: barriers.length,
      coveredBarriers: Object.keys(contentByBarrier).length,
      gaps,
      recommendations: [
        'Prioritize content creation for high-impact barriers',
        'Develop multi-channel assets for comprehensive coverage',
        'Create modular content for rapid customization'
      ]
    };
  }

  private generateContentCalendar(approvedAssets: ContentAsset[]): any {
    const calendar: any[] = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June'];
    
    months.forEach((month, index) => {
      const monthAssets = approvedAssets.slice(index * 4, (index + 1) * 4);
      calendar.push({
        month,
        week1: monthAssets[0] || null,
        week2: monthAssets[1] || null,
        week3: monthAssets[2] || null,
        week4: monthAssets[3] || null,
        theme: index % 2 === 0 ? 'Efficacy Focus' : 'Access & Support'
      });
    });

    return calendar;
  }
}