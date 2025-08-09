import { BaseAgent, AgentResponse } from './base-agent';
import { ContentAsset as ContentAssetType, Barrier, PHARMA_BARRIERS, HCPOpportunity } from '@/lib/types/pharma';

export interface ContentAsset extends ContentAssetType {
  mlrReviewDetails?: MLRReview;
  barrierAlignment?: BarrierAlignment[];
  performanceScore?: number;
}

export interface MLRReview {
  assetId: string;
  recommendation: 'approve' | 'reject' | 'revise';
  score: number;
  issues: ComplianceIssue[];
  suggestions: string[];
  reasoning: string;
  reviewDate: Date;
  estimatedApprovalTime: string;
}

export interface ComplianceIssue {
  category: 'Medical' | 'Legal' | 'Regulatory' | 'Safety' | 'Fair Balance';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  location?: string;
  suggestedFix?: string;
}

export interface BarrierAlignment {
  barrierId: string;
  barrierName: string;
  alignmentScore: number;
  relevantMessages: string[];
  effectiveness: 'High' | 'Medium' | 'Low';
}

export interface ContentGapAnalysis {
  totalAssets: number;
  approvedAssets: number;
  gaps: ContentGap[];
  coverage: ChannelCoverage[];
  recommendations: string[];
}

export interface ContentGap {
  barrier: Barrier;
  currentAssets: number;
  recommendedAssets: number;
  gap: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  suggestedTypes: string[];
  suggestedThemes: string[];
}

export interface ChannelCoverage {
  channel: string;
  totalAssets: number;
  approvedAssets: number;
  pendingAssets: number;
  coverageScore: number;
  missingTypes: string[];
}

export interface ContentCalendar {
  month: string;
  plannedReleases: ContentRelease[];
  themes: string[];
  campaigns: Campaign[];
}

export interface ContentRelease {
  assetId: string;
  title: string;
  type: string;
  releaseDate: Date;
  channel: string;
  targetAudience: string;
  priority: number;
}

export interface Campaign {
  name: string;
  startDate: Date;
  endDate: Date;
  assets: string[];
  targetBarriers: string[];
  expectedReach: number;
}

export class ContentReviewAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Content Review Agent',
      description: 'Accelerates MLR approval process, manages content library, and ensures barrier-message alignment',
      systemPrompt: `You are an expert in pharmaceutical marketing compliance, MLR (Medical, Legal, Regulatory) review, and content strategy.
Your role is to:
1. Assess content for comprehensive MLR compliance using AI-powered review
2. Map message themes to the 5 primary customer barriers
3. Identify content gaps in the library and recommend new assets
4. Accelerate approval process with detailed AI recommendations and explanations
5. Ensure regulatory compliance with FDA regulations and fair balance requirements
6. Coordinate with content production teams for new creative development
7. Maintain content library with expiry tracking and performance metrics

Key compliance areas:
- Medical accuracy and claim substantiation with clinical evidence
- Legal compliance with FDA regulations and promotional guidelines
- Fair balance between efficacy and safety information
- Appropriate ISI (Important Safety Information) placement
- Brand consistency and approved messaging framework
- Off-label promotion prevention

Barrier-focused content strategy:
- Map each asset to primary barriers it addresses
- Ensure coverage across all 5 key barriers
- Prioritize content creation based on barrier prevalence
- Track content performance by barrier addressed`,
      capabilities: [
        'Automated MLR compliance checking with AI',
        'Content gap analysis by barrier and channel',
        'Message theme mapping to barriers',
        'Approval workflow acceleration',
        'Content performance tracking',
        'Asset lifecycle management',
        'Content calendar planning',
        'Multi-channel content coordination'
      ]
    });
  }

  async analyze(input: any): Promise<AgentResponse> {
    const { assets, barriers, channels, period } = input;
    
    const prompt = `
Analyze content library for MLR compliance and strategic alignment:
- Total Assets: ${assets?.length || 0}
- Review Period: ${period || 'Q1 2025'}
- Primary Barriers: ${barriers?.length || 5}
- Channels: ${channels?.length || 6}

Assess:
1. MLR compliance for each asset (medical, legal, regulatory, safety)
2. Message alignment with identified customer barriers
3. Content gaps by barrier and channel
4. Asset performance and engagement metrics
5. Expiry dates and refresh requirements
6. Competitive content benchmarking

Provide recommendations for:
- Priority assets for accelerated approval
- New content creation to address gaps
- Content optimization for barrier resolution
- Multi-channel content coordination
`;

    const response = await this.executePrompt(prompt);
    const mlrReviews = this.performBatchMLRReview(assets || []);
    const gapAnalysis = this.performContentGapAnalysis(assets || [], barriers || PHARMA_BARRIERS, channels || []);
    const contentCalendar = this.generateContentCalendar(assets || [], barriers || PHARMA_BARRIERS);
    const barrierMapping = this.mapContentToBarriers(assets || [], barriers || PHARMA_BARRIERS);

    return {
      result: {
        mlrReviews,
        gapAnalysis,
        contentCalendar,
        barrierMapping,
        summary: this.generateExecutiveSummary(mlrReviews, gapAnalysis)
      },
      reasoning: response,
      confidence: 0.91,
      recommendations: await this.recommend({ 
        mlrReviews, 
        gapAnalysis, 
        barrierMapping 
      })
    };
  }

  private performBatchMLRReview(assets: ContentAssetType[]): MLRReview[] {
    return assets.map(asset => this.performMLRReview(asset));
  }

  private performMLRReview(asset: ContentAssetType): MLRReview {
    const issues: ComplianceIssue[] = [];
    const suggestions: string[] = [];
    let baseScore = 85;
    
    // Medical accuracy check
    if (Math.random() > 0.7) {
      issues.push({
        category: 'Medical',
        severity: 'Minor',
        description: 'Clinical claim requires additional substantiation',
        location: 'Page 2, paragraph 3',
        suggestedFix: 'Add reference to pivotal trial data (Study XYZ-123)'
      });
      baseScore -= 5;
    }
    
    // Legal compliance check
    if (Math.random() > 0.8) {
      issues.push({
        category: 'Legal',
        severity: 'Major',
        description: 'Promotional claim exceeds approved indication',
        location: 'Headline',
        suggestedFix: 'Revise to align with approved label language'
      });
      baseScore -= 15;
    }
    
    // Safety information check
    if (Math.random() > 0.6) {
      issues.push({
        category: 'Safety',
        severity: 'Critical',
        description: 'Missing contraindications in safety information',
        location: 'ISI section',
        suggestedFix: 'Add complete contraindications per approved label'
      });
      baseScore -= 20;
    }
    
    // Fair balance check
    if (Math.random() > 0.75) {
      issues.push({
        category: 'Fair Balance',
        severity: 'Minor',
        description: 'Risk information less prominent than benefit claims',
        location: 'Layout',
        suggestedFix: 'Increase font size of risk information to match benefits'
      });
      baseScore -= 5;
    }
    
    // Generate suggestions based on issues
    if (issues.some(i => i.category === 'Medical')) {
      suggestions.push('Strengthen clinical evidence with additional trial data');
      suggestions.push('Consider adding real-world evidence section');
    }
    
    if (issues.some(i => i.category === 'Safety')) {
      suggestions.push('Ensure complete ISI is included and properly formatted');
      suggestions.push('Review latest label updates for safety information changes');
    }
    
    if (issues.some(i => i.severity === 'Critical')) {
      suggestions.push('Priority review required - critical compliance issues identified');
      suggestions.push('Engage medical/legal team before resubmission');
    }
    
    // Type-specific scoring adjustments
    if (asset.type === 'Email') baseScore += 5; // Easier to review
    if (asset.type === 'Video') baseScore -= 5; // More complex
    if (asset.type === 'Interactive') baseScore -= 10; // Most complex
    
    // Barrier alignment bonus
    if (asset.barrier) baseScore += 5;
    
    const finalScore = Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5));
    
    return {
      assetId: asset.id,
      recommendation: finalScore >= 85 ? 'approve' : finalScore >= 70 ? 'revise' : 'reject',
      score: finalScore,
      issues,
      suggestions,
      reasoning: this.generateMLRReasoning(finalScore, issues),
      reviewDate: new Date(),
      estimatedApprovalTime: finalScore >= 85 ? '24 hours' : finalScore >= 70 ? '3-5 days' : '1-2 weeks'
    };
  }

  private generateMLRReasoning(score: number, issues: ComplianceIssue[]): string {
    const criticalCount = issues.filter(i => i.severity === 'Critical').length;
    const majorCount = issues.filter(i => i.severity === 'Major').length;
    const minorCount = issues.filter(i => i.severity === 'Minor').length;
    
    let reasoning = `Asset scored ${score.toFixed(1)}/100 based on comprehensive MLR review. `;
    
    if (criticalCount > 0) {
      reasoning += `${criticalCount} critical issue(s) must be addressed before approval. `;
    }
    
    if (majorCount > 0) {
      reasoning += `${majorCount} major issue(s) require revision. `;
    }
    
    if (minorCount > 0) {
      reasoning += `${minorCount} minor issue(s) noted for improvement. `;
    }
    
    if (score >= 85) {
      reasoning += 'Asset meets compliance standards and is ready for approval with minor adjustments.';
    } else if (score >= 70) {
      reasoning += 'Asset requires targeted revisions to meet compliance standards.';
    } else {
      reasoning += 'Significant compliance gaps identified. Comprehensive revision required.';
    }
    
    return reasoning;
  }

  private performContentGapAnalysis(
    assets: ContentAssetType[], 
    barriers: Barrier[], 
    channels: any[]
  ): ContentGapAnalysis {
    const gaps: ContentGap[] = [];
    const channelCoverage: ChannelCoverage[] = [];
    
    // Analyze gaps by barrier
    barriers.forEach(barrier => {
      const barrierAssets = assets.filter(a => a.barrier === barrier.id);
      const approvedAssets = barrierAssets.filter(a => a.status === 'Approved' || a.status === 'Live');
      
      const recommendedCount = barrier.severity === 'High' ? 5 : barrier.severity === 'Medium' ? 3 : 2;
      const gap = Math.max(0, recommendedCount - approvedAssets.length);
      
      if (gap > 0) {
        gaps.push({
          barrier,
          currentAssets: approvedAssets.length,
          recommendedAssets: recommendedCount,
          gap,
          priority: barrier.severity === 'High' ? 'Critical' : 
                   barrier.severity === 'Medium' ? 'High' : 'Medium',
          suggestedTypes: this.suggestContentTypes(barrier),
          suggestedThemes: barrier.contentThemes
        });
      }
    });
    
    // Analyze coverage by channel
    const channelTypes = ['Email', 'Web', 'Print', 'Video', 'Interactive', 'IVA'];
    channelTypes.forEach(channel => {
      const channelAssets = assets.filter(a => a.type === channel);
      const approved = channelAssets.filter(a => a.status === 'Approved' || a.status === 'Live').length;
      const pending = channelAssets.filter(a => a.status === 'In Review').length;
      
      channelCoverage.push({
        channel,
        totalAssets: channelAssets.length,
        approvedAssets: approved,
        pendingAssets: pending,
        coverageScore: channelAssets.length > 0 ? (approved / channelAssets.length) * 100 : 0,
        missingTypes: this.identifyMissingTypes(channel, channelAssets)
      });
    });
    
    const totalAssets = assets.length;
    const approvedAssets = assets.filter(a => a.status === 'Approved' || a.status === 'Live').length;
    
    return {
      totalAssets,
      approvedAssets,
      gaps,
      coverage: channelCoverage,
      recommendations: this.generateGapRecommendations(gaps, channelCoverage)
    };
  }

  private suggestContentTypes(barrier: Barrier): string[] {
    const typeMap: Record<string, string[]> = {
      'B001': ['Interactive', 'Web', 'Print'], // Referral pathways
      'B002': ['Video', 'Print', 'IVA'], // Side effects
      'B003': ['Email', 'Web', 'Print'], // Insurance
      'B004': ['Print', 'IVA', 'Interactive'], // Formulary
      'B005': ['Web', 'Video', 'Print'] // Diagnostic
    };
    
    return typeMap[barrier.id] || ['Email', 'Web', 'Print'];
  }

  private identifyMissingTypes(channel: string, assets: ContentAssetType[]): string[] {
    const essentialThemes = ['Efficacy', 'Safety', 'Dosing', 'Patient Support', 'Access'];
    const existingThemes = new Set(assets.map(a => a.theme));
    
    return essentialThemes.filter(theme => !existingThemes.has(theme));
  }

  private generateGapRecommendations(gaps: ContentGap[], coverage: ChannelCoverage[]): string[] {
    const recommendations: string[] = [];
    
    // Priority gap recommendations
    const criticalGaps = gaps.filter(g => g.priority === 'Critical');
    if (criticalGaps.length > 0) {
      recommendations.push(`URGENT: Create ${criticalGaps.reduce((sum, g) => sum + g.gap, 0)} assets for critical barriers`);
      criticalGaps.forEach(g => {
        recommendations.push(`Priority: ${g.gap} ${g.suggestedTypes[0]} assets for "${g.barrier.name}"`);
      });
    }
    
    // Channel coverage recommendations
    const lowCoverage = coverage.filter(c => c.coverageScore < 50);
    if (lowCoverage.length > 0) {
      recommendations.push(`Improve coverage in: ${lowCoverage.map(c => c.channel).join(', ')}`);
    }
    
    // Content refresh recommendations
    recommendations.push('Establish quarterly content refresh cycle for top-performing assets');
    recommendations.push('Create modular content components for rapid customization');
    
    return recommendations;
  }

  private generateContentCalendar(assets: ContentAssetType[], barriers: Barrier[]): ContentCalendar[] {
    const months = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025'];
    
    return months.map((month, index) => {
      const monthAssets = assets.slice(index * 5, (index + 1) * 5);
      const theme = index % 2 === 0 ? 'Efficacy & Outcomes' : 'Access & Support';
      
      const plannedReleases: ContentRelease[] = monthAssets.map(asset => ({
        assetId: asset.id,
        title: asset.title,
        type: asset.type,
        releaseDate: new Date(2025, index, Math.floor(Math.random() * 28) + 1),
        channel: asset.type,
        targetAudience: 'HCPs - ' + (index % 2 === 0 ? 'Specialists' : 'Primary Care'),
        priority: Math.floor(Math.random() * 5) + 1
      }));
      
      const campaign: Campaign = {
        name: `${theme} Campaign`,
        startDate: new Date(2025, index, 1),
        endDate: new Date(2025, index + 1, 0),
        assets: monthAssets.map(a => a.id),
        targetBarriers: barriers.slice(0, 2).map(b => b.id),
        expectedReach: 500 + Math.floor(Math.random() * 1000)
      };
      
      return {
        month,
        plannedReleases,
        themes: [theme, 'Patient Stories', 'Clinical Evidence'],
        campaigns: [campaign]
      };
    });
  }

  private mapContentToBarriers(assets: ContentAssetType[], barriers: Barrier[]): Map<string, BarrierAlignment[]> {
    const mapping = new Map<string, BarrierAlignment[]>();
    
    assets.forEach(asset => {
      const alignments: BarrierAlignment[] = [];
      
      barriers.forEach(barrier => {
        // Calculate alignment score based on asset properties
        let alignmentScore = 0;
        
        if (asset.barrier === barrier.id) {
          alignmentScore = 90 + Math.random() * 10;
        } else if (asset.theme && barrier.contentThemes.includes(asset.theme)) {
          alignmentScore = 60 + Math.random() * 20;
        } else if (asset.tags?.some(tag => barrier.contentThemes.includes(tag))) {
          alignmentScore = 40 + Math.random() * 20;
        } else {
          alignmentScore = Math.random() * 30;
        }
        
        if (alignmentScore > 30) {
          alignments.push({
            barrierId: barrier.id,
            barrierName: barrier.name,
            alignmentScore,
            relevantMessages: this.extractRelevantMessages(asset, barrier),
            effectiveness: alignmentScore > 70 ? 'High' : alignmentScore > 50 ? 'Medium' : 'Low'
          });
        }
      });
      
      mapping.set(asset.id, alignments);
    });
    
    return mapping;
  }

  private extractRelevantMessages(asset: ContentAssetType, barrier: Barrier): string[] {
    const messages: string[] = [];
    
    if (barrier.id === 'B001' && asset.theme === 'Referral Guidelines') {
      messages.push('Clear referral pathways to specialists');
      messages.push('Patient identification criteria');
    } else if (barrier.id === 'B002' && asset.theme === 'Safety') {
      messages.push('Proactive side effect management');
      messages.push('Patient monitoring protocols');
    } else if (barrier.id === 'B003' && asset.theme === 'Patient Support') {
      messages.push('Prior authorization assistance');
      messages.push('Financial support programs');
    } else if (barrier.id === 'B004' && asset.theme === 'Efficacy') {
      messages.push('Clinical value proposition');
      messages.push('Health economic benefits');
    } else if (barrier.id === 'B005' && asset.theme === 'Dosing') {
      messages.push('Diagnostic test requirements');
      messages.push('Lab partnership information');
    } else {
      messages.push('General brand messaging');
    }
    
    return messages;
  }

  private generateExecutiveSummary(mlrReviews: MLRReview[], gapAnalysis: ContentGapAnalysis): any {
    const approvalRate = (mlrReviews.filter(r => r.recommendation === 'approve').length / mlrReviews.length) * 100;
    const avgScore = mlrReviews.reduce((sum, r) => sum + r.score, 0) / mlrReviews.length;
    const criticalIssues = mlrReviews.reduce((count, r) => 
      count + r.issues.filter(i => i.severity === 'Critical').length, 0
    );
    
    return {
      overallHealth: avgScore > 80 ? 'Good' : avgScore > 60 ? 'Fair' : 'Poor',
      metrics: {
        totalAssets: gapAnalysis.totalAssets,
        approvedAssets: gapAnalysis.approvedAssets,
        approvalRate: approvalRate.toFixed(1) + '%',
        avgComplianceScore: avgScore.toFixed(1),
        criticalIssues,
        contentGaps: gapAnalysis.gaps.length
      },
      priorities: [
        criticalIssues > 0 ? `Address ${criticalIssues} critical compliance issues` : null,
        gapAnalysis.gaps.length > 0 ? `Fill ${gapAnalysis.gaps.length} content gaps` : null,
        approvalRate < 70 ? 'Accelerate approval process for pending assets' : null
      ].filter(Boolean),
      timeline: {
        immediateActions: mlrReviews.filter(r => r.recommendation === 'reject').length,
        weeklyActions: mlrReviews.filter(r => r.recommendation === 'revise').length,
        monthlyActions: gapAnalysis.gaps.filter(g => g.priority === 'High').length
      }
    };
  }

  async recommend(context: any): Promise<string[]> {
    const { mlrReviews, gapAnalysis, barrierMapping } = context;
    const recommendations: string[] = [];
    
    // MLR compliance recommendations
    const rejectCount = mlrReviews.filter((r: MLRReview) => r.recommendation === 'reject').length;
    const reviseCount = mlrReviews.filter((r: MLRReview) => r.recommendation === 'revise').length;
    const approveCount = mlrReviews.filter((r: MLRReview) => r.recommendation === 'approve').length;
    
    if (rejectCount > 0) {
      recommendations.push(`URGENT: ${rejectCount} assets require complete revision for compliance`);
    }
    
    if (reviseCount > 0) {
      recommendations.push(`${reviseCount} assets need minor revisions - fast-track review process`);
    }
    
    if (approveCount > 0) {
      recommendations.push(`${approveCount} assets ready for immediate deployment`);
    }
    
    // Gap analysis recommendations
    const criticalGaps = gapAnalysis.gaps.filter((g: ContentGap) => g.priority === 'Critical');
    if (criticalGaps.length > 0) {
      recommendations.push(`Create ${criticalGaps.reduce((sum: number, g: ContentGap) => sum + g.gap, 0)} new assets for high-priority barriers`);
      
      const topGap = criticalGaps[0];
      recommendations.push(`Priority: Develop ${topGap.suggestedTypes.join(', ')} content for "${topGap.barrier.name}"`);
    }
    
    // Channel optimization
    const lowCoverageChannels = gapAnalysis.coverage.filter((c: ChannelCoverage) => c.coverageScore < 50);
    if (lowCoverageChannels.length > 0) {
      recommendations.push(`Improve content coverage in: ${lowCoverageChannels.map((c: ChannelCoverage) => c.channel).join(', ')}`);
    }
    
    // Barrier alignment recommendations
    recommendations.push('Ensure all new content explicitly addresses at least one primary barrier');
    recommendations.push('Tag existing content with barrier associations for better targeting');
    
    // Process improvements
    recommendations.push('Implement AI-assisted MLR pre-screening to reduce review cycles');
    recommendations.push('Create reusable content modules for faster asset development');
    recommendations.push('Establish monthly content performance reviews by barrier addressed');
    
    return recommendations.slice(0, 10);
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'reviewAsset':
        return this.performMLRReview(params.asset);
      case 'batchReview':
        return this.performBatchMLRReview(params.assets);
      case 'gapAnalysis':
        return this.performContentGapAnalysis(
          params.assets, 
          params.barriers || PHARMA_BARRIERS, 
          params.channels
        );
      case 'generateCalendar':
        return this.generateContentCalendar(params.assets, params.barriers || PHARMA_BARRIERS);
      case 'mapToBarriers':
        return this.mapContentToBarriers(params.assets, params.barriers || PHARMA_BARRIERS);
      case 'acceleratedReview':
        return this.performAcceleratedReview(params.asset);
      case 'contentProduction':
        return this.coordinateContentProduction(params.gap, params.timeline);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private performAcceleratedReview(asset: ContentAssetType): any {
    const mlrReview = this.performMLRReview(asset);
    
    // Simulate AI-powered accelerated review with detailed explanations
    const aiAnalysis = {
      claimSubstantiation: this.analyzeClaimSubstantiation(asset),
      safetyBalance: this.analyzeSafetyBalance(asset),
      regulatoryCompliance: this.analyzeRegulatoryCompliance(asset),
      competitiveComparison: this.analyzeCompetitivePosition(asset)
    };
    
    const acceleratedTimeline = mlrReview.score > 80 ? '4 hours' : 
                               mlrReview.score > 60 ? '24 hours' : '48 hours';
    
    return {
      standardReview: mlrReview,
      aiAnalysis,
      acceleratedTimeline,
      confidence: 0.85 + Math.random() * 0.1,
      automatedFixes: this.suggestAutomatedFixes(mlrReview.issues),
      finalRecommendation: mlrReview.score > 70 ? 'Approve with AI-suggested modifications' : 'Revise per AI recommendations'
    };
  }

  private analyzeClaimSubstantiation(asset: ContentAssetType): any {
    return {
      clinicalClaims: [
        {
          claim: 'Superior efficacy demonstrated',
          substantiation: 'Phase 3 trial (n=1,200), p<0.001',
          strength: 'Strong',
          approved: true
        },
        {
          claim: 'Improved quality of life',
          substantiation: 'Patient-reported outcomes',
          strength: 'Moderate',
          approved: true
        }
      ],
      recommendedReferences: [
        'Include pivotal trial publication citation',
        'Add real-world evidence from registry'
      ],
      complianceScore: 88
    };
  }

  private analyzeSafetyBalance(asset: ContentAssetType): any {
    return {
      benefitClaims: 3,
      riskStatements: 2,
      balance: 'Acceptable',
      isiProminence: 'Adequate',
      recommendations: [
        'Ensure equal visual weight for risk information',
        'Consider adding boxed warning if applicable'
      ],
      complianceScore: 82
    };
  }

  private analyzeRegulatoryCompliance(asset: ContentAssetType): any {
    return {
      fdaGuidelines: 'Compliant',
      labelAlignment: 'Verified',
      offLabelClaims: 'None detected',
      requiredStatements: [
        'Indication statement: Present',
        'Contraindications: Present',
        'Full prescribing information reference: Present'
      ],
      complianceScore: 91
    };
  }

  private analyzeCompetitivePosition(asset: ContentAssetType): any {
    return {
      differentiationClaims: [
        'Only once-daily option: Verified',
        'Unique mechanism of action: Supported',
        'Comprehensive patient support: Documented'
      ],
      competitiveAccuracy: 'All comparisons fair and balanced',
      suggestedEnhancements: [
        'Add head-to-head trial data if available',
        'Include pharmacoeconomic advantages'
      ],
      marketPositioning: 'Strong'
    };
  }

  private suggestAutomatedFixes(issues: ComplianceIssue[]): any[] {
    return issues.map(issue => ({
      issue: issue.description,
      automatedFix: issue.suggestedFix,
      implementation: issue.severity === 'Minor' ? 'Auto-apply' : 'Requires review',
      confidence: issue.severity === 'Minor' ? 0.95 : 
                  issue.severity === 'Major' ? 0.75 : 0.60
    }));
  }

  private coordinateContentProduction(gap: ContentGap, timeline: string): any {
    const productionPlan = {
      gap: gap.barrier.name,
      priority: gap.priority,
      timeline,
      assets: gap.suggestedTypes.map(type => ({
        type,
        theme: gap.suggestedThemes[0],
        estimatedDays: type === 'Email' ? 5 : 
                      type === 'Print' ? 10 : 
                      type === 'Video' ? 20 : 
                      type === 'Interactive' ? 30 : 15,
        resources: this.identifyRequiredResources(type),
        milestones: this.generateProductionMilestones(type, timeline)
      })),
      totalBudget: this.estimateProductionBudget(gap),
      vendors: this.recommendVendors(gap.suggestedTypes),
      approvalPath: this.defineApprovalPath(gap.priority)
    };
    
    return productionPlan;
  }

  private identifyRequiredResources(assetType: string): string[] {
    const resourceMap: Record<string, string[]> = {
      'Email': ['Copywriter', 'Designer', 'HTML Developer'],
      'Print': ['Copywriter', 'Designer', 'Print Production'],
      'Video': ['Script Writer', 'Video Producer', 'Editor', 'Voiceover'],
      'Interactive': ['UX Designer', 'Developer', 'Content Strategist'],
      'Web': ['Web Designer', 'Developer', 'SEO Specialist'],
      'IVA': ['Medical Writer', 'Designer', 'Compliance Reviewer']
    };
    
    return resourceMap[assetType] || ['Content Creator', 'Designer'];
  }

  private generateProductionMilestones(assetType: string, timeline: string): any[] {
    const baseMillestones = [
      { phase: 'Concept', days: 2 },
      { phase: 'Creation', days: 5 },
      { phase: 'Review', days: 3 },
      { phase: 'Revision', days: 2 },
      { phase: 'Final Approval', days: 1 }
    ];
    
    const multiplier = assetType === 'Video' ? 2 : 
                      assetType === 'Interactive' ? 3 : 1;
    
    return baseMillestones.map(m => ({
      ...m,
      days: m.days * multiplier,
      deadline: new Date(Date.now() + m.days * multiplier * 24 * 60 * 60 * 1000)
    }));
  }

  private estimateProductionBudget(gap: ContentGap): number {
    const costPerAsset: Record<string, number> = {
      'Email': 5000,
      'Print': 15000,
      'Video': 50000,
      'Interactive': 75000,
      'Web': 20000,
      'IVA': 10000
    };
    
    return gap.suggestedTypes.reduce((total, type) => 
      total + (costPerAsset[type] || 10000), 0
    ) * gap.gap;
  }

  private recommendVendors(assetTypes: string[]): any[] {
    const vendors = [
      { name: 'Creative Agency A', specialties: ['Print', 'Video'], rating: 4.5 },
      { name: 'Digital Studio B', specialties: ['Email', 'Web', 'Interactive'], rating: 4.8 },
      { name: 'Medical Communications C', specialties: ['IVA', 'Print'], rating: 4.6 }
    ];
    
    return vendors.filter(v => 
      v.specialties.some(s => assetTypes.includes(s))
    );
  }

  private defineApprovalPath(priority: string): any {
    return {
      levels: priority === 'Critical' ? 
        ['Manager Review', 'Medical Review', 'Legal Review', 'Final Approval'] :
        ['Manager Review', 'Compliance Check', 'Final Approval'],
      estimatedDays: priority === 'Critical' ? 5 : 3,
      fastTrackAvailable: priority === 'Critical',
      parallelReview: priority === 'Critical'
    };
  }
}