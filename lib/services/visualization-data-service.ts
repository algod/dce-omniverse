// Visualization Data Service for DCE OmniVerse
// Generates chart-ready data for all 6 agents with real-time updates

import { customerIntelligence } from './customer-intelligence';
import { budgetIntelligence } from './budget-intelligence';
import { contentIntelligence } from './content-intelligence';
import { orchestrationIntelligence } from './orchestration-intelligence';
import { suggestionsIntelligence } from './suggestions-intelligence';
import { copilotIntelligence } from './copilot-intelligence';
import { StatisticsUtils } from './statistics-utils';

// Chart data interfaces for consistent visualization
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: any;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  category?: string;
}

export interface ScatterPoint {
  x: number;
  y: number;
  label: string;
  size?: number;
  color?: string;
}

export interface HeatmapCell {
  row: string;
  col: string;
  value: number;
  intensity: number; // 0-1 normalized
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  conversion: number;
}

// Agent-specific visualization configurations
export class VisualizationDataService {
  private static instance: VisualizationDataService;

  private constructor() {}

  static getInstance(): VisualizationDataService {
    if (!VisualizationDataService.instance) {
      VisualizationDataService.instance = new VisualizationDataService();
    }
    return VisualizationDataService.instance;
  }

  // ==================== Customer Planning Visualizations ====================

  generateBarrierAnalysisChart(hcpIds?: string[]): ChartDataPoint[] {
    const targetHCPs = hcpIds || this.getSampleHCPIds(50);
    const barrierCounts: Record<string, number> = {};
    const barrierImpacts: Record<string, number> = {};

    targetHCPs.forEach(hcpId => {
      try {
        const analysis = customerIntelligence.analyzeBarriers(hcpId);
        analysis.primaryBarriers.forEach(barrier => {
          barrierCounts[barrier.code] = (barrierCounts[barrier.code] || 0) + 1;
          barrierImpacts[barrier.code] = (barrierImpacts[barrier.code] || 0) + barrier.impact;
        });
      } catch (error) {
        // Skip invalid HCP IDs
      }
    });

    const barrierDefinitions = {
      'B001': { name: 'Referral Pathways', color: '#FF6B6B' },
      'B002': { name: 'Side Effects', color: '#4ECDC4' },
      'B003': { name: 'Insurance Issues', color: '#45B7D1' },
      'B004': { name: 'Formulary Status', color: '#96CEB4' },
      'B005': { name: 'Diagnostics', color: '#FECA57' }
    };

    return Object.entries(barrierCounts).map(([code, count]) => ({
      label: barrierDefinitions[code as keyof typeof barrierDefinitions]?.name || code,
      value: count,
      color: barrierDefinitions[code as keyof typeof barrierDefinitions]?.color,
      metadata: {
        code,
        totalImpact: barrierImpacts[code] || 0,
        avgImpact: barrierImpacts[code] ? Math.floor(barrierImpacts[code] / count) : 0
      }
    })).sort((a, b) => b.value - a.value);
  }

  generateHCPOpportunityScatter(limit: number = 100): ScatterPoint[] {
    const sampleHCPs = this.getSampleHCPIds(limit);
    const opportunities: ScatterPoint[] = [];

    sampleHCPs.forEach(hcpId => {
      try {
        const insights = customerIntelligence.generateStrategicInsights([hcpId]);
        const barriers = customerIntelligence.analyzeBarriers(hcpId);
        
        opportunities.push({
          x: insights.totalOpportunity / 1000, // Convert to thousands
          y: barriers.addressability * 100, // Convert to percentage
          label: `HCP-${hcpId.slice(-3)}`,
          size: Math.min(barriers.totalImpact / 50000, 20), // Size based on impact
          color: this.getOpportunityColor(insights.totalOpportunity, barriers.addressability)
        });
      } catch (error) {
        // Skip invalid HCP IDs
      }
    });

    return opportunities.sort((a, b) => b.x - a.x);
  }

  generateTerritoryPerformanceChart(): ChartDataPoint[] {
    const territories = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05'];
    return territories.map(territory => {
      try {
        const analysis = customerIntelligence.analyzeTerritoryOpportunities(territory);
        return {
          label: `Territory ${territory.slice(-2)}`,
          value: Math.floor(analysis.totalOpportunity / 1000), // Convert to thousands
          metadata: {
            territoryId: territory,
            hcpCount: analysis.totalHCPs,
            avgOpportunity: Math.floor(analysis.totalOpportunity / analysis.totalHCPs)
          }
        };
      } catch (error) {
        return {
          label: `Territory ${territory.slice(-2)}`,
          value: Math.floor(Math.random() * 5000) + 2000,
          metadata: { territoryId: territory }
        };
      }
    }).sort((a, b) => b.value - a.value);
  }

  // ==================== Budget Planning Visualizations ====================

  generateChannelROIChart(): ChartDataPoint[] {
    try {
      const optimization = budgetIntelligence.optimizeBudget(47000000);
      
      return optimization.optimizedAllocation.map(allocation => ({
        label: allocation.channel,
        value: Math.round((allocation.projectedROI || 3.0) * 100) / 100,
        color: this.getChannelColor(allocation.channel),
        metadata: {
          budget: allocation.currentBudget,
          efficiency: allocation.efficiency || 0.75,
          saturationLevel: allocation.saturation || 0.80
        }
      })).sort((a, b) => b.value - a.value);
    } catch (error) {
      // Fallback data
      return [
        { label: 'Field Sales', value: 4.2, color: '#FF6B6B' },
        { label: 'Speaker Programs', value: 3.8, color: '#4ECDC4' },
        { label: 'Digital Ads', value: 2.9, color: '#45B7D1' },
        { label: 'Conferences', value: 2.5, color: '#96CEB4' },
        { label: 'Email', value: 2.1, color: '#FECA57' },
        { label: 'Web Content', value: 1.8, color: '#FD79A8' }
      ];
    }
  }

  generateBudgetAllocationPie(): ChartDataPoint[] {
    try {
      const optimization = budgetIntelligence.optimizeBudget(47000000);
      const totalBudget = optimization.optimizedAllocation.reduce((sum, c) => sum + c.currentBudget, 0);
      
      return optimization.optimizedAllocation.map(allocation => ({
        label: allocation.channel,
        value: Math.round((allocation.currentBudget / totalBudget) * 100),
        color: this.getChannelColor(allocation.channel),
        metadata: {
          budget: allocation.currentBudget,
          roi: allocation.projectedROI || 3.0
        }
      }));
    } catch (error) {
      // Fallback data
      return [
        { label: 'Field Sales', value: 35, color: '#FF6B6B' },
        { label: 'Speaker Programs', value: 25, color: '#4ECDC4' },
        { label: 'Digital Ads', value: 15, color: '#45B7D1' },
        { label: 'Conferences', value: 12, color: '#96CEB4' },
        { label: 'Email', value: 8, color: '#FECA57' },
        { label: 'Web Content', value: 5, color: '#FD79A8' }
      ];
    }
  }

  generateSpendEfficiencyChart(): ScatterPoint[] {
    try {
      const optimization = budgetIntelligence.optimizeBudget(47000000);
      
      return optimization.optimizedAllocation.map(allocation => ({
        x: allocation.currentBudget / 1000000, // Convert to millions
        y: allocation.projectedROI || 3.0,
        label: allocation.channel,
        size: (allocation.saturation || 0.8) * 20,
        color: this.getEfficiencyColor(allocation.efficiency || 0.75)
      }));
    } catch (error) {
      // Fallback data
      return [
        { x: 16.5, y: 4.2, label: 'Field Sales', size: 18, color: '#FF6B6B' },
        { x: 11.8, y: 3.8, label: 'Speaker Programs', size: 14, color: '#4ECDC4' },
        { x: 7.1, y: 2.9, label: 'Digital Ads', size: 12, color: '#45B7D1' },
        { x: 5.6, y: 2.5, label: 'Conferences', size: 16, color: '#96CEB4' },
        { x: 3.8, y: 2.1, label: 'Email', size: 8, color: '#FECA57' },
        { x: 2.4, y: 1.8, label: 'Web Content', size: 10, color: '#FD79A8' }
      ];
    }
  }

  // ==================== Content Review Visualizations ====================

  generateMLRComplianceChart(): ChartDataPoint[] {
    try {
      const analysis = contentIntelligence.analyzeContentLibrary();
      const complianceRanges = {
        'Excellent (90-100%)': 0,
        'Good (80-89%)': 0,
        'Fair (70-79%)': 0,
        'Poor (<70%)': 0
      };

      // Simulate compliance distribution based on analysis
      const totalAssets = analysis.totalAssets;
      complianceRanges['Excellent (90-100%)'] = Math.floor(totalAssets * 0.45);
      complianceRanges['Good (80-89%)'] = Math.floor(totalAssets * 0.35);
      complianceRanges['Fair (70-79%)'] = Math.floor(totalAssets * 0.15);
      complianceRanges['Poor (<70%)'] = totalAssets - complianceRanges['Excellent (90-100%)'] - complianceRanges['Good (80-89%)'] - complianceRanges['Fair (70-79%)'];

      const colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336'];
      return Object.entries(complianceRanges).map(([range, count], index) => ({
        label: range,
        value: count,
        color: colors[index],
        metadata: { 
          percentage: Math.round((count / totalAssets) * 100),
          complianceLevel: index + 1 
        }
      }));
    } catch (error) {
      // Fallback data
      return [
        { label: 'Excellent (90-100%)', value: 561, color: '#4CAF50' },
        { label: 'Good (80-89%)', value: 436, color: '#FFC107' },
        { label: 'Fair (70-79%)', value: 187, color: '#FF9800' },
        { label: 'Poor (<70%)', value: 63, color: '#F44336' }
      ];
    }
  }

  generateContentBarrierHeatmap(): HeatmapCell[] {
    const barriers = ['B001', 'B002', 'B003', 'B004', 'B005'];
    const contentTypes = ['Email', 'Web', 'Print', 'Video', 'Interactive', 'IVA'];
    const heatmapData: HeatmapCell[] = [];

    barriers.forEach(barrier => {
      contentTypes.forEach(type => {
        try {
          // Get content coverage for this barrier-type combination
          const analysis = contentIntelligence.analyzeContentLibrary({ 
            barrier: barrier,
            type: type 
          });
          const coverage = (typeof analysis.barrierCoverage[barrier] === 'number') 
            ? analysis.barrierCoverage[barrier] 
            : Math.floor(Math.random() * 50) + 10;
          
          heatmapData.push({
            row: barrier,
            col: type,
            value: coverage,
            intensity: Math.min(coverage / 50, 1) // Normalize to 0-1
          });
        } catch (error) {
          // Fallback random data
          const coverage = Math.floor(Math.random() * 50) + 10;
          heatmapData.push({
            row: barrier,
            col: type,
            value: coverage,
            intensity: Math.min(coverage / 50, 1)
          });
        }
      });
    });

    return heatmapData;
  }

  generateContentPerformanceTimeSeries(): TimeSeriesPoint[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const series: TimeSeriesPoint[] = [];

    months.forEach((month, index) => {
      // Approved content trend
      series.push({
        date: month,
        value: 180 + (index * 15) + (Math.random() * 20 - 10),
        category: 'Approved'
      });

      // Pending review trend
      series.push({
        date: month,
        value: 45 - (index * 3) + (Math.random() * 10 - 5),
        category: 'Pending Review'
      });

      // Rejected/Revision needed trend
      series.push({
        date: month,
        value: 25 - (index * 2) + (Math.random() * 8 - 4),
        category: 'Needs Revision'
      });
    });

    return series;
  }

  // ==================== Orchestration Visualizations ====================

  generateJourneyFunnelChart(): FunnelStage[] {
    // Generate simulated funnel data based on typical pharmaceutical journey patterns
    const stages = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'];
    let currentCount = 1000;
    
    return stages.map((stage, index) => {
      const dropoffRate = [0.1, 0.28, 0.30, 0.30, 0.40][index]; // Realistic dropoff rates per stage
      if (index > 0) currentCount = Math.floor(currentCount * (1 - dropoffRate));
      
      return {
        stage,
        count: currentCount,
        percentage: Math.round((currentCount / 1000) * 100),
        conversion: index === 0 ? 100 : Math.round(((1 - dropoffRate) * 100))
      };
    });
  }

  generateChannelEffectivenessChart(): ChartDataPoint[] {
    const channels = ['Field', 'Email', 'Conference', 'Digital', 'Speaker Program'];
    
    return channels.map(channel => {
      const effectiveness = 0.3 + (Math.random() * 0.5); // 30-80% range
      return {
        label: channel,
        value: Math.round(effectiveness * 100),
        color: this.getChannelColor(channel),
        metadata: {
          engagementRate: Math.round((effectiveness * 1.2) * 100) / 100,
          conversionRate: Math.round((effectiveness * 0.8) * 100) / 100
        }
      };
    }).sort((a, b) => b.value - a.value);
  }

  generateModelConfidenceChart(): ChartDataPoint[] {
    const models = ['BERT Behavior', 'Journey Optimization', 'NBA Prediction', 'Sequence Planning'];
    const accuracies = [89, 87, 85, 82];
    
    return models.map((model, index) => ({
      label: model,
      value: accuracies[index],
      color: this.getConfidenceColor(accuracies[index]),
      metadata: {
        precision: (accuracies[index] + Math.random() * 4 - 2) / 100,
        recall: (accuracies[index] - 2 + Math.random() * 4) / 100
      }
    }));
  }

  // ==================== Field Suggestions Visualizations ====================

  generateTriggerPerformanceChart(): ChartDataPoint[] {
    const triggers = [
      'Speaker Program Follow-up',
      'Declining Fulfillment',
      'Positive Payer Coverage',
      'Slowed Prescribing',
      'Single Prescription',
      'Email Engagement',
      'High Potential Indicators'
    ];

    return triggers.map((trigger, index) => {
      const completionRate = 0.85 - (index * 0.05) + (Math.random() * 0.1 - 0.05);
      return {
        label: trigger,
        value: Math.round(completionRate * 100),
        color: this.getTriggerColor(completionRate),
        metadata: {
          priority: index + 1,
          volume: Math.floor(Math.random() * 200) + 50,
          avgImpact: Math.floor(Math.random() * 30000) + 20000
        }
      };
    }).sort((a, b) => b.value - a.value);
  }

  generateFieldFeedbackSentiment(): ChartDataPoint[] {
    return [
      { 
        label: 'Very Helpful', 
        value: 42, 
        color: '#4CAF50',
        metadata: { sentiment: 'positive', score: 4.5 }
      },
      { 
        label: 'Helpful', 
        value: 31, 
        color: '#8BC34A',
        metadata: { sentiment: 'positive', score: 3.8 }
      },
      { 
        label: 'Neutral', 
        value: 18, 
        color: '#FFC107',
        metadata: { sentiment: 'neutral', score: 2.5 }
      },
      { 
        label: 'Not Helpful', 
        value: 9, 
        color: '#F44336',
        metadata: { sentiment: 'negative', score: 1.2 }
      }
    ];
  }

  generateTerritoryComparisonChart(): ChartDataPoint[] {
    const territories = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
    
    return territories.map(territory => ({
      label: territory,
      value: Math.round((0.6 + Math.random() * 0.3) * 100), // 60-90% completion rate
      color: this.getTerritoryColor(territory),
      metadata: {
        repCount: Math.floor(Math.random() * 30) + 35,
        avgSuggestions: Math.floor(Math.random() * 10) + 12,
        topTrigger: 'Speaker Program Follow-up'
      }
    })).sort((a, b) => b.value - a.value);
  }

  // ==================== Field Copilot Visualizations ====================

  generateCallActivityChart(): TimeSeriesPoint[] {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const series: TimeSeriesPoint[] = [];

    weeks.forEach(week => {
      series.push(
        { date: week, value: Math.floor(Math.random() * 20) + 80, category: 'Completed Calls' },
        { date: week, value: Math.floor(Math.random() * 15) + 25, category: 'Scheduled Calls' },
        { date: week, value: Math.floor(Math.random() * 10) + 15, category: 'Rescheduled' }
      );
    });

    return series;
  }

  generateHCPPrioritizationChart(): ScatterPoint[] {
    const sampleHCPs = this.getSampleHCPIds(25);
    
    return sampleHCPs.map(hcpId => {
      const prescribingVolume = Math.floor(Math.random() * 100) + 20;
      const engagementLevel = Math.random() * 100;
      
      return {
        x: prescribingVolume,
        y: engagementLevel,
        label: `HCP-${hcpId.slice(-3)}`,
        size: Math.floor(Math.random() * 15) + 8,
        color: this.getPriorityColor(prescribingVolume, engagementLevel)
      };
    });
  }

  generatePerformanceMetricsChart(): ChartDataPoint[] {
    const metrics = [
      'Call Completion Rate',
      'Email Response Rate', 
      'Meeting Conversion',
      'Follow-up Timeliness',
      'Goal Attainment'
    ];

    return metrics.map(metric => ({
      label: metric,
      value: Math.round((0.65 + Math.random() * 0.3) * 100),
      color: this.getMetricColor(metric),
      metadata: {
        target: Math.round((0.75 + Math.random() * 0.15) * 100),
        trend: Math.random() > 0.5 ? 'increasing' : 'stable'
      }
    }));
  }

  // ==================== Utility Methods ====================

  private getSampleHCPIds(count: number): string[] {
    const ids: string[] = [];
    for (let i = 1; i <= count; i++) {
      ids.push(`HCP-${String(i).padStart(5, '0')}`);
    }
    return ids;
  }

  private getOpportunityColor(opportunity: number, addressability: number): string {
    if (opportunity > 200000 && addressability > 0.7) return '#4CAF50'; // High opportunity, high addressability
    if (opportunity > 100000 && addressability > 0.5) return '#FFC107'; // Medium opportunity
    return '#FF5722'; // Lower opportunity
  }

  private getChannelColor(channel: string): string {
    const colors: Record<string, string> = {
      'Field': '#FF6B6B',
      'Field Sales': '#FF6B6B',
      'Speaker Programs': '#4ECDC4',
      'Speaker Program': '#4ECDC4',
      'Digital': '#45B7D1',
      'Digital Ads': '#45B7D1',
      'Conference': '#96CEB4',
      'Conferences': '#96CEB4',
      'Email': '#FECA57',
      'Web': '#FD79A8',
      'Web Content': '#FD79A8'
    };
    return colors[channel] || '#95A5A6';
  }

  private getEfficiencyColor(efficiency: number): string {
    if (efficiency > 0.8) return '#4CAF50';
    if (efficiency > 0.6) return '#FFC107';
    return '#F44336';
  }

  private getConfidenceColor(confidence: number): string {
    if (confidence > 85) return '#4CAF50';
    if (confidence > 75) return '#8BC34A';
    if (confidence > 65) return '#FFC107';
    return '#FF9800';
  }

  private getTriggerColor(completionRate: number): string {
    if (completionRate > 0.8) return '#4CAF50';
    if (completionRate > 0.6) return '#8BC34A';
    if (completionRate > 0.4) return '#FFC107';
    return '#F44336';
  }

  private getTerritoryColor(territory: string): string {
    const colors: Record<string, string> = {
      'Northeast': '#3498DB',
      'Southeast': '#E74C3C', 
      'Midwest': '#F39C12',
      'Southwest': '#9B59B6',
      'West': '#1ABC9C'
    };
    return colors[territory] || '#95A5A6';
  }

  private getPriorityColor(volume: number, engagement: number): string {
    const score = (volume / 120) + (engagement / 100);
    if (score > 1.4) return '#E74C3C'; // High priority - red
    if (score > 1.0) return '#F39C12'; // Medium priority - orange  
    return '#3498DB'; // Lower priority - blue
  }

  private getMetricColor(metric: string): string {
    const colors: Record<string, string> = {
      'Call Completion Rate': '#3498DB',
      'Email Response Rate': '#2ECC71',
      'Meeting Conversion': '#E74C3C',
      'Follow-up Timeliness': '#F39C12',
      'Goal Attainment': '#9B59B6'
    };
    return colors[metric] || '#95A5A6';
  }

  // ==================== Real-time Data Updates ====================

  updateVisualizationData(agentId: string, interactionData?: any): any {
    // This method would be called when users interact with agents
    // to update visualizations in real-time based on their queries
    
    switch (agentId) {
      case 'customer':
        return {
          barrierAnalysis: this.generateBarrierAnalysisChart(interactionData?.hcpIds),
          opportunityScatter: this.generateHCPOpportunityScatter(interactionData?.limit),
          territoryPerformance: this.generateTerritoryPerformanceChart()
        };
        
      case 'budget':
        return {
          channelROI: this.generateChannelROIChart(),
          budgetAllocation: this.generateBudgetAllocationPie(),
          spendEfficiency: this.generateSpendEfficiencyChart()
        };
        
      case 'content':
        return {
          mlrCompliance: this.generateMLRComplianceChart(),
          barrierHeatmap: this.generateContentBarrierHeatmap(),
          performanceTimeSeries: this.generateContentPerformanceTimeSeries()
        };
        
      case 'orchestration':
        return {
          journeyFunnel: this.generateJourneyFunnelChart(),
          channelEffectiveness: this.generateChannelEffectivenessChart(),
          modelConfidence: this.generateModelConfidenceChart()
        };
        
      case 'suggestions':
        return {
          triggerPerformance: this.generateTriggerPerformanceChart(),
          feedbackSentiment: this.generateFieldFeedbackSentiment(),
          territoryComparison: this.generateTerritoryComparisonChart()
        };
        
      case 'copilot':
        return {
          callActivity: this.generateCallActivityChart(),
          hcpPrioritization: this.generateHCPPrioritizationChart(),
          performanceMetrics: this.generatePerformanceMetricsChart()
        };
        
      default:
        return null;
    }
  }

  // Get all visualization data for an agent
  getAllVisualizationsForAgent(agentId: string): any {
    return this.updateVisualizationData(agentId);
  }
}

// Export singleton instance
export const visualizationDataService = VisualizationDataService.getInstance();