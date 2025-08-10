// Comprehensive Mock Data Service for DCE OmniVerse
// Generates realistic pharmaceutical data for all 6 agents

import { 
  HCP, 
  PrescribingData, 
  PatientMix, 
  Barrier,
  HCPOpportunity,
  Territory,
  Channel,
  ContentAsset,
  CustomerJourney,
  FieldSuggestion,
  NextBestAction,
  PHARMA_BARRIERS
} from '@/lib/types/pharma';

export class MockDataService {
  private static instance: MockDataService;
  private hcpDatabase: Map<string, HCP> = new Map();
  private prescribingHistory: Map<string, PrescribingData[]> = new Map();
  private contentLibrary: Map<string, ContentAsset> = new Map();
  private journeyData: Map<string, CustomerJourney> = new Map();
  
  // Key metrics for consistent data across agents
  private readonly TOTAL_HCPS = 2847;
  private readonly TOTAL_BUDGET = 47000000; // $47M
  private readonly TOTAL_CONTENT_ASSETS = 1247;
  private readonly TOTAL_REPS = 245;
  private readonly AVG_ROI = 3.2;
  
  private constructor() {
    this.initializeDatabase();
  }
  
  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }
  
  private initializeDatabase(): void {
    // Initialize HCP database with realistic profiles
    this.generateHCPDatabase();
    this.generatePrescribingHistory();
    this.generateContentLibrary();
    this.generateJourneyData();
  }
  
  // ==================== HCP & Customer Data ====================
  
  private generateHCPDatabase(): void {
    const specialties = ['Cardiology', 'Oncology', 'Immunology', 'Endocrinology', 'Neurology', 'Pulmonology'];
    const regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'Boston', 'Atlanta'];
    
    for (let i = 0; i < this.TOTAL_HCPS; i++) {
      const hcpId = `HCP-${String(i + 1).padStart(5, '0')}`;
      const specialty = specialties[i % specialties.length];
      const region = regions[i % regions.length];
      const city = cities[i % cities.length];
      
      const hcp: HCP = {
        id: hcpId,
        name: this.generateHCPName(i),
        npi: `${1000000000 + i}`,
        specialty,
        degree: ['MD', 'DO', 'MD, PhD'][i % 3],
        tier: this.calculateTier(i),
        segment: this.calculateSegment(i),
        decile: Math.floor(Math.random() * 10) + 1,
        territory: `T-${String((i % 20) + 1).padStart(2, '0')}`,
        region,
        address: {
          street: `${100 + i} Medical Plaza`,
          city,
          state: this.getStateForCity(city),
          zip: `${10000 + (i * 137) % 90000}`
        },
        practice: {
          name: `${city} ${['Medical Center', 'Health System', 'Clinic', 'Associates'][i % 4]}`,
          type: ['Hospital', 'Private Practice', 'Clinic', 'Academic Medical Center'][i % 4] as any,
          size: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)] as any
        },
        lastCallDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        nextScheduledCall: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      };
      
      this.hcpDatabase.set(hcpId, hcp);
    }
  }
  
  private generateHCPName(index: number): string {
    const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Lisa', 
                        'William', 'Maria', 'John', 'Patricia', 'Richard', 'Elizabeth', 'Thomas', 'Susan'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Chen',
                       'Anderson', 'Taylor', 'Martinez', 'Thompson', 'Garcia', 'Jones', 'Rodriguez', 'Lee'];
    
    return `Dr. ${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / 16) % lastNames.length]}`;
  }
  
  private calculateTier(index: number): 'A' | 'B' | 'C' | 'D' {
    const tierDistribution = index % 100;
    if (tierDistribution < 15) return 'A'; // 15% A tier
    if (tierDistribution < 40) return 'B'; // 25% B tier
    if (tierDistribution < 70) return 'C'; // 30% C tier
    return 'D'; // 30% D tier
  }
  
  private calculateSegment(index: number): string {
    const segments = ['High Prescriber', 'Growth Potential', 'Maintain', 'Monitor', 'New Opportunity'];
    const weights = [0.15, 0.25, 0.30, 0.20, 0.10]; // Distribution weights
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < segments.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return segments[i];
      }
    }
    
    return segments[segments.length - 1];
  }
  
  private getStateForCity(city: string): string {
    const cityStateMap: Record<string, string> = {
      'New York': 'NY',
      'Los Angeles': 'CA',
      'Chicago': 'IL',
      'Houston': 'TX',
      'Phoenix': 'AZ',
      'Philadelphia': 'PA',
      'Boston': 'MA',
      'Atlanta': 'GA'
    };
    return cityStateMap[city] || 'NY';
  }
  
  // ==================== Prescribing & Clinical Data ====================
  
  private generatePrescribingHistory(): void {
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
                   '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
    
    this.hcpDatabase.forEach((hcp, hcpId) => {
      const prescribingData: PrescribingData[] = [];
      let baseRx = Math.floor(Math.random() * 80) + 20; // Base prescriptions 20-100
      
      months.forEach((period, monthIndex) => {
        // Create realistic trends
        const trendFactor = 1 + (Math.random() - 0.5) * 0.2; // ±10% variation
        const seasonalFactor = 1 + Math.sin(monthIndex * Math.PI / 6) * 0.1; // Seasonal variation
        
        const totalRx = Math.floor(baseRx * trendFactor * seasonalFactor);
        const newRx = Math.floor(totalRx * (0.25 + Math.random() * 0.15)); // 25-40% new
        const brandRx = Math.floor(totalRx * (0.2 + Math.random() * 0.4)); // 20-60% brand
        
        prescribingData.push({
          hcpId,
          period,
          totalRx,
          newRx,
          refills: totalRx - newRx,
          brandRx,
          competitorRx: Math.floor(totalRx * 0.3),
          marketShare: brandRx / totalRx,
          trend: this.calculateTrend(monthIndex, prescribingData),
          avgDaysSupply: 30,
          discontinuationRate: Math.random() * 0.2,
          switchRate: Math.random() * 0.1
        });
        
        // Update base for next month
        baseRx = totalRx;
      });
      
      this.prescribingHistory.set(hcpId, prescribingData);
    });
  }
  
  private calculateTrend(currentMonth: number, history: PrescribingData[]): 'Increasing' | 'Stable' | 'Declining' {
    if (history.length < 3) return 'Stable';
    
    const recent = history.slice(-3);
    const avgRecent = recent.reduce((sum, d) => sum + d.totalRx, 0) / recent.length;
    const avgPrior = history.slice(-6, -3).reduce((sum, d) => sum + d.totalRx, 0) / 3;
    
    if (avgRecent > avgPrior * 1.1) return 'Increasing';
    if (avgRecent < avgPrior * 0.9) return 'Declining';
    return 'Stable';
  }
  
  // ==================== Barrier Analysis Data ====================
  
  getBarrierAnalysis(hcpId?: string): BarrierAnalysisResult {
    const barriers = [
      {
        code: 'B001',
        name: 'No/challenging referral pathways',
        prevalence: 0.32,
        avgImpact: 185000,
        affectedHCPs: Math.floor(this.TOTAL_HCPS * 0.32)
      },
      {
        code: 'B002',
        name: 'Managing side effects challenges',
        prevalence: 0.28,
        avgImpact: 142000,
        affectedHCPs: Math.floor(this.TOTAL_HCPS * 0.28)
      },
      {
        code: 'B003',
        name: 'Insurance denials or restrictions',
        prevalence: 0.24,
        avgImpact: 156000,
        affectedHCPs: Math.floor(this.TOTAL_HCPS * 0.24)
      },
      {
        code: 'B004',
        name: 'Product not in formulary',
        prevalence: 0.21,
        avgImpact: 198000,
        affectedHCPs: Math.floor(this.TOTAL_HCPS * 0.21)
      },
      {
        code: 'B005',
        name: 'Requires new diagnostic tool',
        prevalence: 0.18,
        avgImpact: 125000,
        affectedHCPs: Math.floor(this.TOTAL_HCPS * 0.18)
      }
    ];
    
    if (hcpId) {
      const hcp = this.hcpDatabase.get(hcpId);
      if (hcp) {
        // Generate HCP-specific barrier profile
        return {
          hcpId,
          hcpName: hcp.name,
          primaryBarriers: this.generateHCPBarriers(hcp),
          opportunityScore: this.calculateOpportunityScore(hcp),
          recommendations: this.generateBarrierRecommendations(hcp)
        };
      }
    }
    
    return {
      overallBarriers: barriers,
      topOpportunities: this.getTopOpportunityHCPs(10),
      totalBlockedRevenue: barriers.reduce((sum, b) => sum + (b.avgImpact * b.affectedHCPs), 0)
    };
  }
  
  private generateHCPBarriers(hcp: HCP): any[] {
    const barriers = [];
    const barrierTypes = ['B001', 'B002', 'B003', 'B004', 'B005'];
    
    // Each HCP has 1-3 primary barriers
    const numBarriers = Math.floor(Math.random() * 3) + 1;
    const selectedBarriers = barrierTypes.sort(() => Math.random() - 0.5).slice(0, numBarriers);
    
    selectedBarriers.forEach(code => {
      barriers.push({
        code,
        likelihood: 0.5 + Math.random() * 0.5, // 50-100% likelihood
        impact: Math.floor(100000 + Math.random() * 200000), // $100K-$300K impact
        addressable: Math.random() > 0.3 // 70% addressable
      });
    });
    
    return barriers;
  }
  
  private calculateOpportunityScore(hcp: HCP): number {
    // Complex scoring based on multiple factors
    const tierScore = { 'A': 1.0, 'B': 0.75, 'C': 0.5, 'D': 0.25 }[hcp.tier];
    const decileScore = (11 - hcp.decile) / 10;
    const segmentScore = {
      'High Prescriber': 0.9,
      'Growth Potential': 1.0,
      'Maintain': 0.6,
      'Monitor': 0.4,
      'New Opportunity': 0.8
    }[hcp.segment] || 0.5;
    
    return (tierScore * 0.4 + decileScore * 0.3 + segmentScore * 0.3);
  }
  
  private generateBarrierRecommendations(hcp: HCP): string[] {
    const recommendations = [
      'Schedule peer-to-peer discussion with KOL to address clinical concerns',
      'Provide patient assistance program information to overcome access barriers',
      'Share comparative effectiveness data for formulary committee review',
      'Offer side effect management toolkit and nurse educator support',
      'Facilitate diagnostic tool training and certification program'
    ];
    
    return recommendations.slice(0, 3);
  }
  
  // ==================== Budget & ROI Data ====================
  
  getBudgetData(): BudgetAnalysisResult {
    const channels = [
      { name: 'Field Force', budget: 28000000, roi: 3.5, saturation: 0.75 },
      { name: 'Digital', budget: 8000000, roi: 2.8, saturation: 0.45 },
      { name: 'Speaker Programs', budget: 6000000, roi: 4.2, saturation: 0.60 },
      { name: 'Medical Conferences', budget: 3000000, roi: 2.2, saturation: 0.80 },
      { name: 'Email Marketing', budget: 2000000, roi: 2.5, saturation: 0.35 }
    ];
    
    const totalBudget = channels.reduce((sum, c) => sum + c.budget, 0);
    const weightedROI = channels.reduce((sum, c) => sum + (c.roi * c.budget), 0) / totalBudget;
    
    return {
      totalBudget,
      channels,
      overallROI: weightedROI,
      optimizationPotential: this.calculateOptimizationPotential(channels),
      quarterlyBreakdown: this.generateQuarterlyBudget(channels),
      responseCurves: this.generateResponseCurves(channels)
    };
  }
  
  private calculateOptimizationPotential(channels: any[]): number {
    // Calculate potential ROI improvement through reallocation
    const undersaturated = channels.filter(c => c.saturation < 0.5);
    const oversaturated = channels.filter(c => c.saturation > 0.75);
    
    if (undersaturated.length > 0 && oversaturated.length > 0) {
      const reallocatable = oversaturated.reduce((sum, c) => sum + c.budget * 0.2, 0);
      const potentialGain = reallocatable * 0.15; // 15% improvement potential
      return potentialGain;
    }
    
    return 0;
  }
  
  private generateQuarterlyBudget(channels: any[]): any[] {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    return quarters.map(quarter => ({
      quarter,
      allocations: channels.map(c => ({
        channel: c.name,
        amount: c.budget / 4,
        plannedROI: c.roi + (Math.random() - 0.5) * 0.5
      }))
    }));
  }
  
  private generateResponseCurves(channels: any[]): any[] {
    return channels.map(channel => ({
      channel: channel.name,
      curve: this.generateLogCurve(channel.budget, channel.roi, channel.saturation)
    }));
  }
  
  private generateLogCurve(maxBudget: number, maxROI: number, saturation: number): any[] {
    const points = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const spend = (maxBudget / steps) * i;
      // Logarithmic curve with saturation
      const roi = maxROI * Math.log(1 + spend / (maxBudget * 0.2)) / Math.log(6) * (1 - saturation * 0.3);
      points.push({ spend, roi: Math.max(0, roi) });
    }
    
    return points;
  }
  
  // ==================== Content & MLR Data ====================
  
  private generateContentLibrary(): void {
    const contentTypes = ['Detail Aid', 'Email Template', 'Website Content', 'Video', 'Brochure', 'Clinical Study'];
    const therapeuticAreas = ['Cardiology', 'Oncology', 'Immunology', 'Endocrinology'];
    const barriers = ['B001', 'B002', 'B003', 'B004', 'B005'];
    
    for (let i = 0; i < this.TOTAL_CONTENT_ASSETS; i++) {
      const contentId = `CONTENT-${String(i + 1).padStart(5, '0')}`;
      
      const content: ContentAsset = {
        id: contentId,
        title: this.generateContentTitle(i),
        type: contentTypes[i % contentTypes.length],
        therapeuticArea: therapeuticAreas[i % therapeuticAreas.length],
        targetBarriers: barriers.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1),
        mlrStatus: this.generateMLRStatus(),
        approvalDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        expirationDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        engagementMetrics: {
          views: Math.floor(Math.random() * 5000),
          downloads: Math.floor(Math.random() * 1000),
          shares: Math.floor(Math.random() * 200),
          avgEngagementTime: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
        },
        effectiveness: Math.random() * 0.5 + 0.5, // 50-100% effectiveness
        complianceScore: Math.random() * 0.2 + 0.8 // 80-100% compliance
      };
      
      this.contentLibrary.set(contentId, content);
    }
  }
  
  private generateContentTitle(index: number): string {
    const prefixes = ['Clinical', 'Patient', 'Treatment', 'Efficacy', 'Safety', 'Access'];
    const topics = ['Overview', 'Guidelines', 'Outcomes', 'Benefits', 'Management', 'Support'];
    const suffixes = ['Guide', 'Resource', 'Toolkit', 'Summary', 'Update', 'Brief'];
    
    return `${prefixes[index % prefixes.length]} ${topics[Math.floor(index / 6) % topics.length]} ${suffixes[Math.floor(index / 36) % suffixes.length]}`;
  }
  
  private generateMLRStatus(): 'Approved' | 'Pending' | 'Rejected' | 'Expired' {
    const random = Math.random();
    if (random < 0.96) return 'Approved'; // 96% approval rate
    if (random < 0.98) return 'Pending';
    if (random < 0.99) return 'Rejected';
    return 'Expired';
  }
  
  getContentAnalysis(): ContentAnalysisResult {
    const contentArray = Array.from(this.contentLibrary.values());
    const approved = contentArray.filter(c => c.mlrStatus === 'Approved');
    const pending = contentArray.filter(c => c.mlrStatus === 'Pending');
    
    const barrierCoverage = this.analyzeBarrierCoverage(contentArray);
    const channelDistribution = this.analyzeChannelDistribution(contentArray);
    
    return {
      totalAssets: this.TOTAL_CONTENT_ASSETS,
      approvedAssets: approved.length,
      pendingReview: pending.length,
      approvalRate: (approved.length / this.TOTAL_CONTENT_ASSETS) * 100,
      avgReviewTime: 4.2, // days
      barrierCoverage,
      channelDistribution,
      contentGaps: this.identifyContentGaps(barrierCoverage),
      topPerformers: this.getTopPerformingContent(5)
    };
  }
  
  private analyzeBarrierCoverage(content: ContentAsset[]): any {
    const coverage: Record<string, number> = {};
    
    ['B001', 'B002', 'B003', 'B004', 'B005'].forEach(barrier => {
      coverage[barrier] = content.filter(c => c.targetBarriers.includes(barrier)).length;
    });
    
    return coverage;
  }
  
  private analyzeChannelDistribution(content: ContentAsset[]): any {
    const distribution: Record<string, number> = {};
    
    content.forEach(c => {
      distribution[c.type] = (distribution[c.type] || 0) + 1;
    });
    
    return distribution;
  }
  
  private identifyContentGaps(coverage: Record<string, number>): string[] {
    const gaps = [];
    const avgCoverage = Object.values(coverage).reduce((sum, v) => sum + v, 0) / Object.keys(coverage).length;
    
    Object.entries(coverage).forEach(([barrier, count]) => {
      if (count < avgCoverage * 0.8) {
        gaps.push(`Low content coverage for barrier ${barrier} (only ${count} assets)`);
      }
    });
    
    return gaps;
  }
  
  private getTopPerformingContent(limit: number): ContentAsset[] {
    return Array.from(this.contentLibrary.values())
      .sort((a, b) => (b.engagementMetrics.views + b.engagementMetrics.downloads) - 
                      (a.engagementMetrics.views + a.engagementMetrics.downloads))
      .slice(0, limit);
  }
  
  // ==================== Journey & Orchestration Data ====================
  
  private generateJourneyData(): void {
    this.hcpDatabase.forEach((hcp, hcpId) => {
      const journey: CustomerJourney = {
        hcpId,
        journeyId: `JOURNEY-${hcpId}`,
        stage: this.determineJourneyStage(hcp),
        touchpoints: this.generateTouchpoints(hcp),
        nextBestAction: this.generateNBA(hcp),
        predictedOutcome: {
          conversionProbability: Math.random() * 0.6 + 0.3, // 30-90%
          timeToConversion: Math.floor(Math.random() * 90) + 30, // 30-120 days
          expectedValue: Math.floor(Math.random() * 300000) + 50000 // $50K-$350K
        },
        engagementScore: Math.random() * 0.5 + 0.5, // 50-100%
        lastUpdated: new Date()
      };
      
      this.journeyData.set(hcpId, journey);
    });
  }
  
  private determineJourneyStage(hcp: HCP): string {
    const stages = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'];
    const stageWeights = [0.25, 0.30, 0.20, 0.15, 0.10];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < stages.length; i++) {
      cumulative += stageWeights[i];
      if (random < cumulative) {
        return stages[i];
      }
    }
    
    return stages[0];
  }
  
  private generateTouchpoints(hcp: HCP): any[] {
    const touchpointTypes = ['Email', 'Call', 'Meeting', 'Conference', 'Digital Ad', 'Webinar'];
    const numTouchpoints = Math.floor(Math.random() * 8) + 3; // 3-10 touchpoints
    const touchpoints = [];
    
    for (let i = 0; i < numTouchpoints; i++) {
      touchpoints.push({
        type: touchpointTypes[Math.floor(Math.random() * touchpointTypes.length)],
        date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        engagement: ['Opened', 'Clicked', 'Attended', 'No Response'][Math.floor(Math.random() * 4)],
        duration: Math.floor(Math.random() * 30) + 1 // 1-30 minutes
      });
    }
    
    return touchpoints.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  private generateNBA(hcp: HCP): NextBestAction {
    const actions = [
      { action: 'Schedule F2F Meeting', reason: 'High engagement, ready for deeper discussion' },
      { action: 'Send Clinical Data Email', reason: 'Requested efficacy information' },
      { action: 'Invite to Speaker Program', reason: 'Influence network identified' },
      { action: 'Provide Patient Support Materials', reason: 'Access barriers identified' },
      { action: 'Digital Retargeting Campaign', reason: 'Low recent engagement' }
    ];
    
    const selected = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      action: selected.action,
      channel: ['Field', 'Email', 'Digital', 'Phone'][Math.floor(Math.random() * 4)],
      timing: `Within ${Math.floor(Math.random() * 14) + 1} days`,
      reason: selected.reason,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      expectedImpact: {
        engagement: Math.random() * 0.4 + 0.2, // 20-60% improvement
        prescription: Math.random() * 0.3 + 0.1 // 10-40% lift
      }
    };
  }
  
  getJourneyAnalysis(): JourneyAnalysisResult {
    const journeys = Array.from(this.journeyData.values());
    
    const stageDistribution = this.analyzeStageDistribution(journeys);
    const channelEffectiveness = this.analyzeChannelEffectiveness(journeys);
    const conversionFunnel = this.buildConversionFunnel(journeys);
    
    return {
      totalJourneys: journeys.length,
      avgTouchpoints: journeys.reduce((sum, j) => sum + j.touchpoints.length, 0) / journeys.length,
      avgEngagementScore: journeys.reduce((sum, j) => sum + j.engagementScore, 0) / journeys.length,
      stageDistribution,
      channelEffectiveness,
      conversionFunnel,
      nbaAccuracy: 0.87, // 87% NBA accuracy
      modelPerformance: {
        precision: 0.89,
        recall: 0.85,
        f1Score: 0.87
      }
    };
  }
  
  private analyzeStageDistribution(journeys: CustomerJourney[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    journeys.forEach(j => {
      distribution[j.stage] = (distribution[j.stage] || 0) + 1;
    });
    
    return distribution;
  }
  
  private analyzeChannelEffectiveness(journeys: CustomerJourney[]): any {
    const effectiveness: Record<string, number> = {};
    const counts: Record<string, number> = {};
    
    journeys.forEach(j => {
      j.touchpoints.forEach(t => {
        effectiveness[t.type] = (effectiveness[t.type] || 0) + (t.engagement === 'Attended' || t.engagement === 'Clicked' ? 1 : 0);
        counts[t.type] = (counts[t.type] || 0) + 1;
      });
    });
    
    Object.keys(effectiveness).forEach(channel => {
      effectiveness[channel] = effectiveness[channel] / counts[channel];
    });
    
    return effectiveness;
  }
  
  private buildConversionFunnel(journeys: CustomerJourney[]): any {
    const stages = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'];
    const funnel: any[] = [];
    
    stages.forEach((stage, index) => {
      const count = journeys.filter(j => {
        const stageIndex = stages.indexOf(j.stage);
        return stageIndex >= index;
      }).length;
      
      funnel.push({
        stage,
        count,
        percentage: (count / journeys.length) * 100
      });
    });
    
    return funnel;
  }
  
  // ==================== Field & Rep Data ====================
  
  getFieldData(): FieldAnalysisResult {
    const territories = this.generateTerritoryData();
    const repPerformance = this.generateRepPerformance();
    const suggestions = this.generateFieldSuggestions();
    
    return {
      totalReps: this.TOTAL_REPS,
      territories: territories.length,
      avgCallsPerRep: 18.5,
      avgTerritoryCoverage: 0.73,
      repPerformance,
      suggestionMetrics: {
        totalGenerated: suggestions.length,
        adoptionRate: 0.73,
        completionRate: 0.89,
        avgPerRep: suggestions.length / this.TOTAL_REPS
      },
      topPerformers: this.getTopReps(repPerformance, 10),
      improvementAreas: this.identifyImprovementAreas(repPerformance)
    };
  }
  
  private generateTerritoryData(): Territory[] {
    const territories: Territory[] = [];
    
    for (let i = 0; i < 20; i++) {
      territories.push({
        id: `T-${String(i + 1).padStart(2, '0')}`,
        name: `Territory ${i + 1}`,
        region: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'][i % 5],
        hcpCount: Math.floor(this.TOTAL_HCPS / 20) + Math.floor(Math.random() * 50),
        repCount: Math.floor(this.TOTAL_REPS / 20) + Math.floor(Math.random() * 5),
        coverage: 0.6 + Math.random() * 0.35,
        performance: {
          calls: Math.floor(Math.random() * 500) + 200,
          conversions: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 5000000) + 1000000
        }
      });
    }
    
    return territories;
  }
  
  private generateRepPerformance(): any[] {
    const performance = [];
    
    for (let i = 0; i < this.TOTAL_REPS; i++) {
      performance.push({
        repId: `REP-${String(i + 1).padStart(4, '0')}`,
        name: this.generateRepName(i),
        territory: `T-${String((i % 20) + 1).padStart(2, '0')}`,
        metrics: {
          callsCompleted: Math.floor(Math.random() * 30) + 10,
          hcpsReached: Math.floor(Math.random() * 25) + 5,
          suggestionsAdopted: Math.floor(Math.random() * 20) + 5,
          conversionRate: Math.random() * 0.3 + 0.1,
          avgCallQuality: Math.random() * 0.3 + 0.7
        },
        ranking: 0 // Will be calculated
      });
    }
    
    // Calculate rankings
    performance.sort((a, b) => b.metrics.conversionRate - a.metrics.conversionRate);
    performance.forEach((rep, index) => {
      rep.ranking = index + 1;
    });
    
    return performance;
  }
  
  private generateRepName(index: number): string {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Tom', 'Emily', 'Chris', 'Lisa'];
    const lastNames = ['Wilson', 'Davis', 'Garcia', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
    
    return `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / 8) % lastNames.length]}`;
  }
  
  private generateFieldSuggestions(): FieldSuggestion[] {
    const suggestions: FieldSuggestion[] = [];
    const triggerTypes = [
      'Speaker Program Follow-up',
      'Low Prescription Fulfillment',
      'Positive Payer Coverage',
      'Slowed Prescribing Pace',
      'Single Prescription Pattern',
      'Email Engagement Signal',
      'High Potential Indicator'
    ];
    
    // Generate suggestions for each rep
    for (let i = 0; i < this.TOTAL_REPS * 18; i++) { // ~18 suggestions per rep
      suggestions.push({
        id: `SUGG-${String(i + 1).padStart(6, '0')}`,
        repId: `REP-${String((i % this.TOTAL_REPS) + 1).padStart(4, '0')}`,
        hcpId: `HCP-${String(Math.floor(Math.random() * this.TOTAL_HCPS) + 1).padStart(5, '0')}`,
        trigger: triggerTypes[i % triggerTypes.length],
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
        status: ['Pending', 'Completed', 'Dismissed'][Math.floor(Math.random() * 3)] as any,
        createdDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        expirationDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
        expectedImpact: Math.floor(Math.random() * 50000) + 10000,
        confidence: Math.random() * 0.3 + 0.7
      });
    }
    
    return suggestions;
  }
  
  private getTopReps(performance: any[], limit: number): any[] {
    return performance.slice(0, limit);
  }
  
  private identifyImprovementAreas(performance: any[]): string[] {
    const areas = [];
    
    const avgCalls = performance.reduce((sum, r) => sum + r.metrics.callsCompleted, 0) / performance.length;
    const lowPerformers = performance.filter(r => r.metrics.callsCompleted < avgCalls * 0.7);
    
    if (lowPerformers.length > performance.length * 0.2) {
      areas.push(`${lowPerformers.length} reps below call volume targets`);
    }
    
    const avgAdoption = performance.reduce((sum, r) => sum + r.metrics.suggestionsAdopted, 0) / performance.length;
    const lowAdopters = performance.filter(r => r.metrics.suggestionsAdopted < avgAdoption * 0.6);
    
    if (lowAdopters.length > performance.length * 0.15) {
      areas.push(`${lowAdopters.length} reps with low suggestion adoption`);
    }
    
    return areas;
  }
  
  // ==================== Public API Methods ====================
  
  getHCPById(hcpId: string): HCP | undefined {
    return this.hcpDatabase.get(hcpId);
  }
  
  getHCPList(filters?: any): HCP[] {
    let hcps = Array.from(this.hcpDatabase.values());
    
    if (filters) {
      if (filters.specialty) {
        hcps = hcps.filter(h => h.specialty === filters.specialty);
      }
      if (filters.tier) {
        hcps = hcps.filter(h => h.tier === filters.tier);
      }
      if (filters.segment) {
        hcps = hcps.filter(h => h.segment === filters.segment);
      }
      if (filters.territory) {
        hcps = hcps.filter(h => h.territory === filters.territory);
      }
    }
    
    return hcps;
  }
  
  getPrescribingHistory(hcpId: string): PrescribingData[] {
    return this.prescribingHistory.get(hcpId) || [];
  }
  
  getContentById(contentId: string): ContentAsset | undefined {
    return this.contentLibrary.get(contentId);
  }
  
  getContentList(filters?: any): ContentAsset[] {
    let content = Array.from(this.contentLibrary.values());
    
    if (filters) {
      if (filters.type) {
        content = content.filter(c => c.type === filters.type);
      }
      if (filters.therapeuticArea) {
        content = content.filter(c => c.therapeuticArea === filters.therapeuticArea);
      }
      if (filters.mlrStatus) {
        content = content.filter(c => c.mlrStatus === filters.mlrStatus);
      }
    }
    
    return content;
  }
  
  getJourneyByHCP(hcpId: string): CustomerJourney | undefined {
    return this.journeyData.get(hcpId);
  }
  
  getTopOpportunityHCPs(limit: number): any[] {
    const hcpsWithScores = Array.from(this.hcpDatabase.values()).map(hcp => ({
      hcp,
      score: this.calculateOpportunityScore(hcp),
      revenue: Math.floor(Math.random() * 300000) + 100000
    }));
    
    return hcpsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        ...item.hcp,
        opportunityScore: item.score,
        potentialRevenue: item.revenue
      }));
  }
  
  simulateBudgetReallocation(changes: any): any {
    const current = this.getBudgetData();
    const simulation = { ...current };
    
    // Apply changes and calculate new ROI
    Object.entries(changes).forEach(([channel, newBudget]) => {
      const channelData = simulation.channels.find(c => c.name === channel);
      if (channelData) {
        const oldBudget = channelData.budget;
        channelData.budget = newBudget as number;
        
        // Adjust ROI based on saturation
        const budgetRatio = (newBudget as number) / oldBudget;
        if (budgetRatio > 1) {
          // Increasing budget - ROI decreases with saturation
          channelData.roi *= (1 - channelData.saturation * 0.1 * (budgetRatio - 1));
        } else {
          // Decreasing budget - ROI increases slightly
          channelData.roi *= (1 + (1 - budgetRatio) * 0.05);
        }
      }
    });
    
    // Recalculate overall ROI
    const totalBudget = simulation.channels.reduce((sum, c) => sum + c.budget, 0);
    simulation.overallROI = simulation.channels.reduce((sum, c) => sum + (c.roi * c.budget), 0) / totalBudget;
    
    return simulation;
  }
}

// Type definitions for return values
interface BarrierAnalysisResult {
  hcpId?: string;
  hcpName?: string;
  primaryBarriers?: any[];
  opportunityScore?: number;
  recommendations?: string[];
  overallBarriers?: any[];
  topOpportunities?: any[];
  totalBlockedRevenue?: number;
}

interface BudgetAnalysisResult {
  totalBudget: number;
  channels: any[];
  overallROI: number;
  optimizationPotential: number;
  quarterlyBreakdown: any[];
  responseCurves: any[];
}

interface ContentAnalysisResult {
  totalAssets: number;
  approvedAssets: number;
  pendingReview: number;
  approvalRate: number;
  avgReviewTime: number;
  barrierCoverage: any;
  channelDistribution: any;
  contentGaps: string[];
  topPerformers: ContentAsset[];
}

interface JourneyAnalysisResult {
  totalJourneys: number;
  avgTouchpoints: number;
  avgEngagementScore: number;
  stageDistribution: Record<string, number>;
  channelEffectiveness: any;
  conversionFunnel: any;
  nbaAccuracy: number;
  modelPerformance: any;
}

interface FieldAnalysisResult {
  totalReps: number;
  territories: number;
  avgCallsPerRep: number;
  avgTerritoryCoverage: number;
  repPerformance: any[];
  suggestionMetrics: any;
  topPerformers: any[];
  improvementAreas: string[];
}

// Export singleton instance
export const mockDataService = MockDataService.getInstance();