// Content Review Intelligence Service
// Provides MLR compliance checking, content-barrier mapping, and performance analytics

import { mockDataService } from './mock-data-service';
import { ContentAsset } from '@/lib/types/pharma';

export interface ComplianceScore {
  contentId: string;
  overallScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  violations: ComplianceViolation[];
  recommendations: string[];
  estimatedApprovalTime: number; // days
}

export interface ComplianceViolation {
  type: string;
  severity: 'Minor' | 'Major' | 'Critical';
  description: string;
  location: string;
  suggestedFix: string;
  regulatoryReference: string;
}

export interface BarrierMapping {
  contentId: string;
  contentTitle: string;
  targetBarriers: string[];
  effectivenessScores: Record<string, number>;
  recommendedUsage: UsageRecommendation[];
  gaps: string[];
}

export interface UsageRecommendation {
  barrier: string;
  context: string;
  channel: string;
  expectedImpact: number;
  supportingData: string;
}

export interface ContentPerformance {
  contentId: string;
  engagementRate: number;
  conversionRate: number;
  hcpFeedbackScore: number;
  channelEffectiveness: Record<string, number>;
  trends: PerformanceTrend[];
  recommendations: string[];
}

export interface PerformanceTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  significance: 'Significant' | 'Moderate' | 'Minimal';
}

export class ContentIntelligence {
  private static instance: ContentIntelligence;
  private mockData = mockDataService;
  
  // FDA and regulatory guidelines
  private readonly COMPLIANCE_RULES = {
    claims: {
      unsubstantiated: { severity: 'Critical', penalty: 0.3 },
      misleading: { severity: 'Major', penalty: 0.2 },
      incomplete: { severity: 'Minor', penalty: 0.1 }
    },
    safety: {
      missingWarnings: { severity: 'Critical', penalty: 0.4 },
      inadequateRisk: { severity: 'Major', penalty: 0.25 },
      unclearInstructions: { severity: 'Minor', penalty: 0.15 }
    },
    fairBalance: {
      inadequate: { severity: 'Major', penalty: 0.2 },
      notProminant: { severity: 'Minor', penalty: 0.1 },
      missing: { severity: 'Critical', penalty: 0.35 }
    },
    indication: {
      offLabel: { severity: 'Critical', penalty: 0.5 },
      unclear: { severity: 'Major', penalty: 0.2 },
      overstated: { severity: 'Major', penalty: 0.25 }
    }
  };
  
  // Content effectiveness metrics by barrier
  private readonly BARRIER_CONTENT_EFFECTIVENESS = {
    'B001': { // Referral pathways
      'Clinical Study': 0.85,
      'Detail Aid': 0.75,
      'Video': 0.65,
      'Email Template': 0.50,
      'Website Content': 0.60,
      'Brochure': 0.55
    },
    'B002': { // Side effects management
      'Patient Guide': 0.90,
      'Clinical Study': 0.80,
      'Video': 0.85,
      'Detail Aid': 0.70,
      'Website Content': 0.75,
      'Email Template': 0.60
    },
    'B003': { // Insurance/access
      'Access Guide': 0.95,
      'Brochure': 0.75,
      'Website Content': 0.80,
      'Email Template': 0.70,
      'Detail Aid': 0.60,
      'Video': 0.55
    },
    'B004': { // Formulary
      'Economic Study': 0.90,
      'Clinical Study': 0.85,
      'Detail Aid': 0.75,
      'Brochure': 0.65,
      'Email Template': 0.60,
      'Website Content': 0.70
    },
    'B005': { // Diagnostic requirements
      'Training Material': 0.95,
      'Video': 0.85,
      'Detail Aid': 0.75,
      'Clinical Study': 0.70,
      'Website Content': 0.65,
      'Brochure': 0.60
    }
  };
  
  private constructor() {}
  
  static getInstance(): ContentIntelligence {
    if (!ContentIntelligence.instance) {
      ContentIntelligence.instance = new ContentIntelligence();
    }
    return ContentIntelligence.instance;
  }
  
  // ==================== MLR Compliance ====================
  
  checkCompliance(contentId: string, contentText?: string): ComplianceScore {
    const content = this.mockData.getContentById(contentId);
    if (!content) {
      throw new Error(`Content ${contentId} not found`);
    }
    
    const violations = this.detectViolations(content, contentText);
    const overallScore = this.calculateComplianceScore(violations);
    const riskLevel = this.determineRiskLevel(overallScore, violations);
    const recommendations = this.generateComplianceRecommendations(violations, content);
    const estimatedApprovalTime = this.estimateApprovalTime(riskLevel, violations.length);
    
    return {
      contentId,
      overallScore,
      riskLevel,
      violations,
      recommendations,
      estimatedApprovalTime
    };
  }
  
  private detectViolations(content: ContentAsset, contentText?: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    
    // Simulate violation detection based on content type and random factors
    const mlrScore = content.mlrScore || 0.85;
    const violationProbability = mlrScore < 0.9 ? 0.3 : 0.1;
    
    // Check for claim violations
    if (Math.random() < violationProbability) {
      violations.push({
        type: 'Unsubstantiated Efficacy Claim',
        severity: 'Major',
        description: 'Efficacy claim lacks adequate supporting data from pivotal trials',
        location: 'Page 2, Paragraph 3',
        suggestedFix: 'Add reference to Phase III trial data (Study NCT-2024-001)',
        regulatoryReference: '21 CFR 202.1(e)(6) - Adequate evidence requirement'
      });
    }
    
    // Check for safety information
    if (Math.random() < violationProbability * 0.8) {
      violations.push({
        type: 'Incomplete Safety Information',
        severity: 'Minor',
        description: 'Contraindications section missing drug interaction warnings',
        location: 'Safety Information Box',
        suggestedFix: 'Include complete drug interaction warnings from prescribing information',
        regulatoryReference: '21 CFR 202.1(e)(3) - Safety information requirements'
      });
    }
    
    // Check for fair balance
    if (content.type === 'Email' && Math.random() < violationProbability * 1.2) {
      violations.push({
        type: 'Fair Balance',
        severity: 'Major',
        description: 'Risk information not as prominent as benefit claims',
        location: 'Email body',
        suggestedFix: 'Increase prominence of risk information to match benefit claims',
        regulatoryReference: 'FDA Guidance on Fair Balance in Promotional Materials'
      });
    }
    
    // Check for indication accuracy
    if (Math.random() < violationProbability * 0.5) {
      violations.push({
        type: 'Indication Clarity',
        severity: 'Minor',
        description: 'Approved indication statement could be clearer',
        location: 'Header section',
        suggestedFix: 'Use exact indication language from approved labeling',
        regulatoryReference: '21 CFR 202.1(e)(3)(i) - Indication requirements'
      });
    }
    
    // Check for comparative claims
    if (content.type === 'Interactive' && Math.random() < violationProbability * 0.7) {
      violations.push({
        type: 'Comparative Claim',
        severity: 'Major',
        description: 'Comparative efficacy claim requires head-to-head trial data',
        location: 'Slide 5',
        suggestedFix: 'Remove comparative claim or add head-to-head trial reference',
        regulatoryReference: 'FDA Guidance on Comparative Advertising'
      });
    }
    
    return violations;
  }
  
  private calculateComplianceScore(violations: ComplianceViolation[]): number {
    if (violations.length === 0) return 1.0;
    
    let score = 1.0;
    
    violations.forEach(violation => {
      const penalty = violation.severity === 'Critical' ? 0.3 :
                     violation.severity === 'Major' ? 0.15 :
                     0.05;
      score -= penalty;
    });
    
    return Math.max(0, score);
  }
  
  private determineRiskLevel(score: number, violations: ComplianceViolation[]): 'Low' | 'Medium' | 'High' {
    const hasCritical = violations.some(v => v.severity === 'Critical');
    
    if (hasCritical || score < 0.6) return 'High';
    if (score < 0.8 || violations.length > 3) return 'Medium';
    return 'Low';
  }
  
  private generateComplianceRecommendations(violations: ComplianceViolation[], content: ContentAsset): string[] {
    const recommendations: string[] = [];
    
    // Priority fixes
    const criticalViolations = violations.filter(v => v.severity === 'Critical');
    if (criticalViolations.length > 0) {
      recommendations.push(`Address ${criticalViolations.length} critical violations immediately before submission`);
    }
    
    // Content type specific
    if (content.type === 'Email') {
      recommendations.push('Ensure subject line is not misleading and includes product name');
    }
    
    if (content.type === 'Interactive') {
      recommendations.push('Include complete prescribing information or clear reference to it');
    }
    
    // General improvements
    if (violations.some(v => v.type.includes('Safety'))) {
      recommendations.push('Enhance safety information prominence and completeness');
    }
    
    if (violations.some(v => v.type.includes('Claim'))) {
      recommendations.push('Strengthen claim substantiation with clinical trial references');
    }
    
    // Fast track opportunity
    if (violations.length <= 1 && !criticalViolations.length) {
      recommendations.push('Eligible for expedited MLR review process (2-3 days)');
    }
    
    return recommendations;
  }
  
  private estimateApprovalTime(riskLevel: 'Low' | 'Medium' | 'High', violationCount: number): number {
    const baseTime = {
      'Low': 3,
      'Medium': 7,
      'High': 14
    }[riskLevel];
    
    // Add time for each violation that needs correction
    const additionalTime = violationCount * 0.5;
    
    return Math.ceil(baseTime + additionalTime);
  }
  
  // ==================== Content-Barrier Mapping ====================
  
  mapContentToBarriers(contentId: string): BarrierMapping {
    const content = this.mockData.getContentById(contentId);
    if (!content) {
      throw new Error(`Content ${contentId} not found`);
    }
    
    const effectivenessScores = this.calculateBarrierEffectiveness(content);
    const recommendedUsage = this.generateUsageRecommendations(content, effectivenessScores);
    const gaps = this.identifyContentGaps(content, effectivenessScores);
    
    return {
      contentId,
      contentTitle: content.title,
      targetBarriers: content.barrier ? [content.barrier] : [],
      effectivenessScores,
      recommendedUsage,
      gaps
    };
  }
  
  private calculateBarrierEffectiveness(content: ContentAsset): Record<string, number> {
    const scores: Record<string, number> = {};
    
    // Map actual content types to effectiveness types
    const typeMapping: Record<string, string> = {
      'Email': 'Email Template',
      'Web': 'Website Content',
      'Print': 'Brochure',
      'Video': 'Video',
      'Interactive': 'Detail Aid',
      'IVA': 'Detail Aid'
    };
    
    const mappedType = typeMapping[content.type] || 'Brochure';
    const targetBarriers = content.barrier ? [content.barrier] : [];
    targetBarriers.forEach(barrier => {
      const barrierEffectiveness = this.BARRIER_CONTENT_EFFECTIVENESS[barrier as keyof typeof this.BARRIER_CONTENT_EFFECTIVENESS];
      const baseEffectiveness = barrierEffectiveness?.[mappedType as keyof typeof barrierEffectiveness] || 0.5;
      
      // Adjust based on content quality and engagement
      const qualityMultiplier = content.mlrScore || 0.85;
      // Simulate engagement multiplier
      const engagementMultiplier = 0.8 + Math.random() * 0.4;
      
      scores[barrier] = Math.min(baseEffectiveness * qualityMultiplier * engagementMultiplier, 1.0);
    });
    
    return scores;
  }
  
  private generateUsageRecommendations(content: ContentAsset, effectivenessScores: Record<string, number>): UsageRecommendation[] {
    const recommendations: UsageRecommendation[] = [];
    
    Object.entries(effectivenessScores).forEach(([barrier, score]) => {
      if (score > 0.7) {
        recommendations.push({
          barrier,
          context: this.getOptimalContext(barrier, content.type),
          channel: this.getOptimalChannel(content.type),
          expectedImpact: Math.floor(score * 100),
          supportingData: this.getSupportingData(barrier, content)
        });
      }
    });
    
    return recommendations;
  }
  
  private getOptimalContext(barrier: string, contentType: string): string {
    const contexts: Record<string, Record<string, string>> = {
      'B001': {
        'Clinical Study': 'Peer-to-peer discussions with specialists',
        'Detail Aid': 'F2F meetings with referring physicians',
        'Video': 'Educational webinars for practice staff'
      },
      'B002': {
        'Patient Guide': 'Patient consultations and follow-ups',
        'Clinical Study': 'Safety discussions with prescribers',
        'Video': 'Nurse educator training sessions'
      },
      'B003': {
        'Access Guide': 'Benefits verification discussions',
        'Brochure': 'Patient financial counseling',
        'Website Content': 'Self-service patient portal'
      },
      'B004': {
        'Economic Study': 'P&T committee presentations',
        'Clinical Study': 'Formulary review meetings',
        'Detail Aid': 'Medical director discussions'
      },
      'B005': {
        'Training Material': 'Diagnostic certification programs',
        'Video': 'Lab technician training',
        'Detail Aid': 'New technology adoption discussions'
      }
    };
    
    return contexts[barrier]?.[contentType] || 'General HCP engagement';
  }
  
  private getOptimalChannel(contentType: string): string {
    const channelMap: Record<string, string> = {
      'Detail Aid': 'Field Force',
      'Email Template': 'Email Marketing',
      'Website Content': 'Web Portals',
      'Video': 'Digital',
      'Brochure': 'Field Force',
      'Clinical Study': 'Medical Conferences'
    };
    
    return channelMap[contentType] || 'Multi-channel';
  }
  
  private getSupportingData(barrier: string, content: ContentAsset): string {
    const dataPoints: Record<string, string> = {
      'B001': `${Math.floor(Math.random() * 40 + 30)}% of specialists report improved referral efficiency`,
      'B002': `${Math.floor(Math.random() * 50 + 40)}% reduction in discontinuation due to side effects`,
      'B003': `${Math.floor(Math.random() * 35 + 25)}% improvement in prescription fulfillment rates`,
      'B004': `${Math.floor(Math.random() * 45 + 35)}% of formularies added product after review`,
      'B005': `${Math.floor(Math.random() * 60 + 30)}% increase in diagnostic test adoption`
    };
    
    return dataPoints[barrier] || 'Positive impact demonstrated in pilot programs';
  }
  
  private identifyContentGaps(content: ContentAsset, effectivenessScores: Record<string, number>): string[] {
    const gaps: string[] = [];
    
    // Check for low effectiveness barriers
    Object.entries(effectivenessScores).forEach(([barrier, score]) => {
      if (score < 0.5) {
        gaps.push(`Low effectiveness for ${this.getBarrierName(barrier)} - consider alternative content`);
      }
    });
    
    // Check for missing barrier coverage
    const allBarriers = ['B001', 'B002', 'B003', 'B004', 'B005'];
    const targetBarriers = content.barrier ? [content.barrier] : [];
    const missingBarriers = allBarriers.filter(b => !targetBarriers.includes(b));
    
    if (missingBarriers.length > 0 && content.type === 'Interactive') {
      gaps.push(`No coverage for ${missingBarriers.length} barriers in primary sales material`);
    }
    
    // Content type specific gaps
    if (content.type === 'Email' && !targetBarriers.includes('B003')) {
      gaps.push('Email campaigns should address access/insurance barriers');
    }
    
    return gaps;
  }
  
  private getBarrierName(code: string): string {
    const names: Record<string, string> = {
      'B001': 'Referral Pathways',
      'B002': 'Side Effect Management',
      'B003': 'Insurance/Access',
      'B004': 'Formulary Restrictions',
      'B005': 'Diagnostic Requirements'
    };
    
    return names[code] || code;
  }
  
  // ==================== Performance Analytics ====================
  
  analyzePerformance(contentId: string): ContentPerformance {
    const content = this.mockData.getContentById(contentId);
    if (!content) {
      throw new Error(`Content ${contentId} not found`);
    }
    
    const engagementRate = this.calculateEngagementRate(content);
    const conversionRate = this.calculateConversionRate(content);
    const hcpFeedbackScore = this.calculateFeedbackScore(content);
    const channelEffectiveness = this.analyzeChannelEffectiveness(content);
    const trends = this.analyzeTrends(content);
    const recommendations = this.generatePerformanceRecommendations(
      content,
      engagementRate,
      conversionRate,
      trends
    );
    
    return {
      contentId,
      engagementRate,
      conversionRate,
      hcpFeedbackScore,
      channelEffectiveness,
      trends,
      recommendations
    };
  }
  
  private calculateEngagementRate(content: ContentAsset): number {
    const totalReach = Math.floor(Math.random() * 10000) + 1000;
    // Simulate engagement metrics
    const engagements = Math.floor(Math.random() * 10000) + 1000;
    
    return Math.min(engagements / totalReach, 1.0);
  }
  
  private calculateConversionRate(content: ContentAsset): number {
    // Simulate conversion based on content effectiveness
    const effectiveness = content.mlrScore || 0.8;
    const baseConversion = effectiveness * 0.15;
    
    // Map actual content types to effectiveness types
    const typeMapping: Record<string, string> = {
      'Email': 'Email Template',
      'Web': 'Website Content',
      'Print': 'Brochure',
      'Video': 'Video',
      'Interactive': 'Detail Aid',
      'IVA': 'Detail Aid'
    };
    
    const mappedType = typeMapping[content.type] || 'Brochure';
    const typeMultiplier = {
      'Detail Aid': 1.2,
      'Clinical Study': 1.3,
      'Video': 1.1,
      'Email Template': 0.8,
      'Website Content': 0.9,
      'Brochure': 1.0
    }[mappedType] || 1.0;
    
    return Math.min(baseConversion * typeMultiplier, 0.25);
  }
  
  private calculateFeedbackScore(content: ContentAsset): number {
    // Simulate HCP feedback score
    const base = 0.7;
    const qualityBonus = (content.mlrScore || 0.85) * 0.2;
    // Simulate engagement bonus based on type
    const avgEngagementTime = content.type === 'Video' ? 240 : content.type === 'Interactive' ? 180 : 120;
    const engagementBonus = Math.min(avgEngagementTime / 300, 0.1);
    
    return Math.min(base + qualityBonus + engagementBonus, 1.0);
  }
  
  private analyzeChannelEffectiveness(content: ContentAsset): Record<string, number> {
    const channels = ['Field Force', 'Digital', 'Email', 'Web', 'Conference'];
    const effectiveness: Record<string, number> = {};
    
    channels.forEach(channel => {
      // Simulate channel-specific effectiveness
      const baseEffectiveness = Math.random() * 0.5 + 0.4;
      const contentChannelFit = this.getChannelContentFit(channel, content.type);
      
      effectiveness[channel] = baseEffectiveness * contentChannelFit;
    });
    
    return effectiveness;
  }
  
  private getChannelContentFit(channel: string, contentType: string): number {
    const fitMatrix: Record<string, Record<string, number>> = {
      'Field Force': {
        'Detail Aid': 1.0,
        'Brochure': 0.9,
        'Clinical Study': 0.8,
        'Video': 0.6,
        'Email Template': 0.3,
        'Website Content': 0.4
      },
      'Digital': {
        'Video': 1.0,
        'Website Content': 0.9,
        'Email Template': 0.7,
        'Detail Aid': 0.5,
        'Clinical Study': 0.6,
        'Brochure': 0.4
      },
      'Email': {
        'Email Template': 1.0,
        'Website Content': 0.7,
        'Video': 0.6,
        'Brochure': 0.5,
        'Detail Aid': 0.4,
        'Clinical Study': 0.5
      },
      'Web': {
        'Website Content': 1.0,
        'Video': 0.8,
        'Clinical Study': 0.7,
        'Email Template': 0.6,
        'Brochure': 0.5,
        'Detail Aid': 0.4
      },
      'Conference': {
        'Clinical Study': 1.0,
        'Detail Aid': 0.8,
        'Video': 0.7,
        'Brochure': 0.6,
        'Website Content': 0.4,
        'Email Template': 0.3
      }
    };
    
    return fitMatrix[channel]?.[contentType] || 0.5;
  }
  
  private analyzeTrends(content: ContentAsset): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];
    const periods = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'];
    
    // Engagement trend
    // Simulate previous engagement
    let previousEngagement = Math.floor(Math.random() * 5000) + 500;
    periods.forEach(period => {
      const currentEngagement = previousEngagement * (1 + (Math.random() - 0.5) * 0.3);
      const change = ((currentEngagement - previousEngagement) / previousEngagement) * 100;
      
      trends.push({
        period,
        metric: 'Engagement',
        value: Math.floor(currentEngagement),
        change,
        significance: Math.abs(change) > 20 ? 'Significant' : 
                      Math.abs(change) > 10 ? 'Moderate' : 'Minimal'
      });
      
      previousEngagement = currentEngagement;
    });
    
    // Conversion trend
    let previousConversion = 0.08;
    periods.forEach(period => {
      const currentConversion = previousConversion * (1 + (Math.random() - 0.5) * 0.2);
      const change = ((currentConversion - previousConversion) / previousConversion) * 100;
      
      trends.push({
        period,
        metric: 'Conversion Rate',
        value: currentConversion,
        change,
        significance: Math.abs(change) > 15 ? 'Significant' : 
                      Math.abs(change) > 8 ? 'Moderate' : 'Minimal'
      });
      
      previousConversion = currentConversion;
    });
    
    return trends;
  }
  
  private generatePerformanceRecommendations(
    content: ContentAsset,
    engagementRate: number,
    conversionRate: number,
    trends: PerformanceTrend[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Engagement recommendations
    if (engagementRate < 0.1) {
      recommendations.push('Low engagement - consider refreshing content or adjusting distribution strategy');
    } else if (engagementRate > 0.3) {
      recommendations.push('High engagement - expand distribution to similar HCP segments');
    }
    
    // Conversion recommendations
    if (conversionRate < 0.05) {
      recommendations.push('Low conversion - strengthen call-to-action and value proposition');
    } else if (conversionRate > 0.15) {
      recommendations.push('Strong conversion - use as template for similar content development');
    }
    
    // Trend-based recommendations
    const decliningTrends = trends.filter(t => t.change < -10 && t.significance !== 'Minimal');
    if (decliningTrends.length > 0) {
      recommendations.push('Declining performance detected - consider content refresh or retirement');
    }
    
    // Content age recommendations
    const approvedDate = content.approvedDate || new Date();
    const ageInDays = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (ageInDays > 180) {
      recommendations.push('Content over 6 months old - review for accuracy and relevance');
    }
    
    // Channel optimization
    if (content.type === 'Email' && engagementRate < 0.15) {
      recommendations.push('Optimize subject lines and preview text for better open rates');
    }
    
    return recommendations;
  }
  
  // ==================== Content Library Analysis ====================
  
  analyzeContentLibrary(filters?: any): ContentLibraryAnalysis {
    const allContent = this.mockData.getContentList(filters);
    
    const totalAssets = allContent.length;
    const approvedAssets = allContent.filter(c => c.status === 'Approved').length;
    const pendingAssets = allContent.filter(c => c.status === 'In Review').length;
    const expiredAssets = allContent.filter(c => c.status === 'Expired').length;
    
    const barrierCoverage = this.analyzeBarrierCoverage(allContent);
    const channelDistribution = this.analyzeChannelDistribution(allContent);
    const therapeuticCoverage = this.analyzeTherapeuticCoverage(allContent);
    const performanceMetrics = this.calculateLibraryPerformance(allContent);
    const gaps = this.identifyLibraryGaps(allContent, barrierCoverage);
    const recommendations = this.generateLibraryRecommendations(
      allContent,
      barrierCoverage,
      gaps
    );
    
    return {
      totalAssets,
      approvedAssets,
      pendingAssets,
      expiredAssets,
      approvalRate: (approvedAssets / totalAssets) * 100,
      barrierCoverage,
      channelDistribution,
      therapeuticCoverage,
      performanceMetrics,
      gaps,
      recommendations
    };
  }
  
  private analyzeBarrierCoverage(content: ContentAsset[]): Record<string, BarrierCoverageMetrics> {
    const coverage: Record<string, BarrierCoverageMetrics> = {};
    const barriers = ['B001', 'B002', 'B003', 'B004', 'B005'];
    
    barriers.forEach(barrier => {
      const relevantContent = content.filter(c => c.barrier === barrier);
      // Calculate average effectiveness from MLR scores
      const avgEffectiveness = relevantContent.reduce((sum, c) => sum + (c.mlrScore || 0.8), 0) / 
                               (relevantContent.length || 1);
      
      coverage[barrier] = {
        assetCount: relevantContent.length,
        avgEffectiveness,
        topPerformingAssets: relevantContent
          .sort((a, b) => (b.mlrScore || 0.8) - (a.mlrScore || 0.8))
          .slice(0, 3)
          .map(c => ({ id: c.id, title: c.title, effectiveness: c.mlrScore || 0.8 })),
        gaps: this.identifyBarrierGaps(barrier, relevantContent)
      };
    });
    
    return coverage;
  }
  
  private analyzeChannelDistribution(content: ContentAsset[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    content.forEach(c => {
      const channel = this.getOptimalChannel(c.type);
      distribution[channel] = (distribution[channel] || 0) + 1;
    });
    
    return distribution;
  }
  
  private analyzeTherapeuticCoverage(content: ContentAsset[]): Record<string, number> {
    const coverage: Record<string, number> = {};
    
    // Simulate therapeutic areas
    const therapeuticAreas = ['Oncology', 'Immunology', 'Neurology', 'Cardiology', 'Rare Disease'];
    
    content.forEach(c => {
      // Assign random therapeutic area for simulation
      const area = therapeuticAreas[Math.floor(Math.random() * therapeuticAreas.length)];
      coverage[area] = (coverage[area] || 0) + 1;
    });
    
    return coverage;
  }
  
  private calculateLibraryPerformance(content: ContentAsset[]): LibraryPerformanceMetrics {
    // Simulate aggregate engagement metrics
    const totalViews = content.length * (Math.floor(Math.random() * 2000) + 1000);
    const totalDownloads = content.length * (Math.floor(Math.random() * 500) + 100);
    const avgEngagementTime = 150 + Math.random() * 100;
    const avgEffectiveness = 0.7 + Math.random() * 0.2;
    
    return {
      totalViews,
      totalDownloads,
      avgEngagementTime,
      avgEffectiveness,
      topPerformers: content
        .sort(() => Math.random() - 0.5) // Random sort for simulation
        .slice(0, 5)
        .map(c => ({ id: c.id, title: c.title, engagement: Math.floor(Math.random() * 5000) + 1000 }))
    };
  }
  
  private identifyBarrierGaps(barrier: string, content: ContentAsset[]): string[] {
    const gaps: string[] = [];
    const contentTypes = ['Detail Aid', 'Email Template', 'Website Content', 'Video', 'Brochure', 'Clinical Study'];
    
    contentTypes.forEach(type => {
      const typeContent = content.filter(c => c.type === type);
      if (typeContent.length === 0) {
        gaps.push(`No ${type} content for ${this.getBarrierName(barrier)}`);
      }
    });
    
    return gaps;
  }
  
  private identifyLibraryGaps(content: ContentAsset[], barrierCoverage: any): string[] {
    const gaps: string[] = [];
    
    // Check for barrier coverage gaps
    Object.entries(barrierCoverage).forEach(([barrier, metrics]) => {
      if ((metrics as any).assetCount < 5) {
        gaps.push(`Limited content for ${this.getBarrierName(barrier)} (only ${(metrics as any).assetCount} assets)`);
      }
    });
    
    // Check for channel gaps
    const channels = ['Field Force', 'Digital', 'Email', 'Web'];
    channels.forEach(channel => {
      const channelContent = content.filter(c => this.getOptimalChannel(c.type) === channel);
      if (channelContent.length < 10) {
        gaps.push(`Insufficient content for ${channel} channel`);
      }
    });
    
    // Check for outdated content
    const outdated = content.filter(c => {
      const approvedDate = c.approvedDate || new Date();
      const ageInDays = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
      return ageInDays > 365;
    });
    
    if (outdated.length > content.length * 0.2) {
      gaps.push(`${outdated.length} assets (${Math.round(outdated.length / content.length * 100)}%) are over 1 year old`);
    }
    
    return gaps;
  }
  
  private generateLibraryRecommendations(
    content: ContentAsset[],
    barrierCoverage: any,
    gaps: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Priority content development
    if (gaps.length > 3) {
      recommendations.push(`Address ${gaps.length} content gaps through targeted development program`);
    }
    
    // Barrier-specific recommendations
    Object.entries(barrierCoverage).forEach(([barrier, metrics]) => {
      if ((metrics as any).avgEffectiveness < 0.6) {
        recommendations.push(`Improve content quality for ${this.getBarrierName(barrier)} - current effectiveness only ${Math.round((metrics as any).avgEffectiveness * 100)}%`);
      }
    });
    
    // Content refresh recommendations
    const refreshCandidates = content.filter(c => {
      const approvalDate = c.approvedDate || new Date();
      const ageInDays = Math.floor((Date.now() - approvalDate.getTime()) / (1000 * 60 * 60 * 24));
      return ageInDays > 180 && (c.mlrScore || 0.8) < 0.7;
    });
    
    if (refreshCandidates.length > 0) {
      recommendations.push(`Refresh ${refreshCandidates.length} underperforming assets over 6 months old`);
    }
    
    // MLR process improvements
    const pendingCount = content.filter(c => c.status === 'In Review').length;
    if (pendingCount > 10) {
      recommendations.push(`Expedite MLR review for ${pendingCount} pending assets to improve content availability`);
    }
    
    return recommendations;
  }
  
  // ==================== MLR Workflow Optimization ====================
  
  optimizeMLRWorkflow(contentIds: string[]): MLRWorkflowOptimization {
    const contents = contentIds.map(id => this.mockData.getContentById(id)).filter(c => c !== undefined) as ContentAsset[];
    
    const prioritization = this.prioritizeMLRReview(contents);
    const batchingStrategy = this.generateBatchingStrategy(contents);
    const expeditedCandidates = this.identifyExpeditedCandidates(contents);
    const workflowRecommendations = this.generateWorkflowRecommendations(contents);
    
    return {
      prioritization,
      batchingStrategy,
      expeditedCandidates,
      estimatedTimesSaved: this.calculateTimeSavings(batchingStrategy, expeditedCandidates),
      workflowRecommendations
    };
  }
  
  private prioritizeMLRReview(contents: ContentAsset[]): any[] {
    return contents.map(content => {
      // Calculate priority score
      let priorityScore = 0;
      
      // Business impact factor
      const targetBarriers = content.barrier ? [content.barrier] : [];
      const businessImpact = targetBarriers.length * 20;
      priorityScore += businessImpact;
      
      // Urgency factor
      const expiryDate = content.expiryDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Default 90 days
      const daysUntilExpiration = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiration < 30) priorityScore += 50;
      else if (daysUntilExpiration < 60) priorityScore += 30;
      
      // Content type factor
      const typeMapping: Record<string, string> = {
        'Email': 'Email Template',
        'Web': 'Website Content',
        'Print': 'Brochure',
        'Video': 'Video',
        'Interactive': 'Detail Aid',
        'IVA': 'Detail Aid'
      };
      
      const mappedType = typeMapping[content.type] || 'Brochure';
      const typePriority = {
        'Detail Aid': 40,
        'Clinical Study': 35,
        'Email Template': 25,
        'Video': 30,
        'Website Content': 20,
        'Brochure': 15
      }[mappedType] || 10;
      priorityScore += typePriority;
      
      return {
        contentId: content.id,
        title: content.title,
        priorityScore,
        estimatedReviewTime: this.estimateReviewTime(content),
        recommendedReviewer: this.assignReviewer(content)
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }
  
  private generateBatchingStrategy(contents: ContentAsset[]): any {
    const batches: any[] = [];
    
    // Group by content type for efficiency
    const typeGroups: Record<string, ContentAsset[]> = {};
    contents.forEach(content => {
      if (!typeGroups[content.type]) typeGroups[content.type] = [];
      typeGroups[content.type].push(content);
    });
    
    // Create batches
    Object.entries(typeGroups).forEach(([type, items]) => {
      const batchSize = type === 'Email Template' ? 10 : 5;
      
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push({
          batchId: `BATCH-${batches.length + 1}`,
          contentType: type,
          items: items.slice(i, i + batchSize).map(c => c.id),
          estimatedReviewTime: this.estimateBatchReviewTime(items.slice(i, i + batchSize)),
          reviewer: this.assignReviewer(items[0])
        });
      }
    });
    
    return batches;
  }
  
  private identifyExpeditedCandidates(contents: ContentAsset[]): string[] {
    return contents
      .filter(content => {
        // Check for expedited eligibility
        const isLowRisk = (content.mlrScore || 0.85) > 0.9;
        const isUpdateOnly = Math.random() > 0.7; // Simulate update vs new content
        const targetBarriers = content.barrier ? [content.barrier] : [];
        const isHighPriority = targetBarriers.length >= 2;
        
        return isLowRisk && (isUpdateOnly || isHighPriority);
      })
      .map(c => c.id);
  }
  
  private calculateTimeSavings(batchingStrategy: any[], expeditedCandidates: string[]): number {
    // Batching saves ~20% review time
    const batchingSavings = batchingStrategy.length * 2; // 2 days per batch
    
    // Expedited review saves ~60% time
    const expeditedSavings = expeditedCandidates.length * 5; // 5 days per expedited item
    
    return batchingSavings + expeditedSavings;
  }
  
  private generateWorkflowRecommendations(contents: ContentAsset[]): string[] {
    const recommendations: string[] = [];
    
    // Volume-based recommendations
    if (contents.length > 20) {
      recommendations.push('Implement parallel review tracks for different content types');
    }
    
    // Type-based recommendations
    const emailCount = contents.filter(c => c.type === 'Email').length;
    if (emailCount > 5) {
      recommendations.push('Use template-based review for email campaigns to reduce review time');
    }
    
    // Risk-based recommendations
    const lowRiskCount = contents.filter(c => (c.mlrScore || 0.85) > 0.9).length;
    if (lowRiskCount > contents.length * 0.6) {
      recommendations.push('Implement auto-approval for low-risk content meeting predefined criteria');
    }
    
    // Process improvements
    recommendations.push('Establish pre-review checklist to reduce revision cycles');
    recommendations.push('Create reusable claim library for faster substantiation');
    
    return recommendations;
  }
  
  private estimateReviewTime(content: ContentAsset): number {
    // Map actual content types to effectiveness types
    const typeMapping: Record<string, string> = {
      'Email': 'Email Template',
      'Web': 'Website Content',
      'Print': 'Brochure',
      'Video': 'Video',
      'Interactive': 'Detail Aid',
      'IVA': 'Detail Aid'
    };
    
    const mappedType = typeMapping[content.type] || 'Brochure';
    const baseTime = {
      'Detail Aid': 5,
      'Clinical Study': 7,
      'Email Template': 2,
      'Video': 4,
      'Website Content': 3,
      'Brochure': 3
    }[mappedType] || 4;
    
    // Adjust for compliance score
    const complianceAdjustment = (content.mlrScore || 0.85) > 0.9 ? 0.7 : 1.2;
    
    return Math.ceil(baseTime * complianceAdjustment);
  }
  
  private estimateBatchReviewTime(contents: ContentAsset[]): number {
    // Batch review is more efficient
    const individualTime = contents.reduce((sum, c) => sum + this.estimateReviewTime(c), 0);
    return Math.ceil(individualTime * 0.7); // 30% time savings
  }
  
  private assignReviewer(content: ContentAsset): string {
    const reviewers = {
      'Clinical Study': 'Medical Review Team',
      'Detail Aid': 'Marketing Review Team',
      'Email Template': 'Digital Review Team',
      'Video': 'Multimedia Review Team',
      'Website Content': 'Digital Review Team',
      'Brochure': 'Marketing Review Team'
    };
    
    return reviewers[content.type as keyof typeof reviewers] || 'General Review Team';
  }
}

// Type definitions
interface ContentLibraryAnalysis {
  totalAssets: number;
  approvedAssets: number;
  pendingAssets: number;
  expiredAssets: number;
  approvalRate: number;
  barrierCoverage: Record<string, BarrierCoverageMetrics>;
  channelDistribution: Record<string, number>;
  therapeuticCoverage: Record<string, number>;
  performanceMetrics: LibraryPerformanceMetrics;
  gaps: string[];
  recommendations: string[];
}

interface BarrierCoverageMetrics {
  assetCount: number;
  avgEffectiveness: number;
  topPerformingAssets: any[];
  gaps: string[];
}

interface LibraryPerformanceMetrics {
  totalViews: number;
  totalDownloads: number;
  avgEngagementTime: number;
  avgEffectiveness: number;
  topPerformers: any[];
}

interface MLRWorkflowOptimization {
  prioritization: any[];
  batchingStrategy: any[];
  expeditedCandidates: string[];
  estimatedTimesSaved: number;
  workflowRecommendations: string[];
}

// Export singleton instance
export const contentIntelligence = ContentIntelligence.getInstance();