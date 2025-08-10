// API endpoint for agent-specific visualization data
// Supports real-time chart updates based on user interactions

import { NextRequest, NextResponse } from 'next/server';
import { visualizationDataService } from '@/lib/services/visualization-data-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    
    // Validate agent ID
    const validAgents = ['customer', 'budget', 'content', 'orchestration', 'suggestions', 'copilot'];
    if (!validAgents.includes(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    // Get query parameters for customization
    const searchParams = request.nextUrl.searchParams;
    const chartType = searchParams.get('chart');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const hcpIds = searchParams.get('hcpIds')?.split(',');
    const territoryId = searchParams.get('territoryId');

    // Build interaction data
    const interactionData = {
      limit,
      hcpIds,
      territoryId,
      chartType
    };

    // Get visualization data
    let data;
    if (chartType) {
      // Return specific chart data
      data = getSpecificChartData(agentId, chartType, interactionData);
    } else {
      // Return all visualizations for the agent
      data = visualizationDataService.getAllVisualizationsForAgent(agentId);
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No visualization data available for this agent' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agentId,
      timestamp: new Date().toISOString(),
      data
    });

  } catch (error) {
    console.error('Visualization API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate visualization data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();

    // Update visualization data based on user interaction
    const updatedData = visualizationDataService.updateVisualizationData(
      agentId, 
      body.interactionData
    );

    return NextResponse.json({
      success: true,
      agentId,
      timestamp: new Date().toISOString(),
      data: updatedData
    });

  } catch (error) {
    console.error('Visualization update error:', error);
    return NextResponse.json(
      { error: 'Failed to update visualization data' },
      { status: 500 }
    );
  }
}

function getSpecificChartData(agentId: string, chartType: string, interactionData: any) {
  const service = visualizationDataService;

  switch (agentId) {
    case 'customer':
      switch (chartType) {
        case 'barriers':
          return service.generateBarrierAnalysisChart(interactionData.hcpIds);
        case 'opportunities':
          return service.generateHCPOpportunityScatter(interactionData.limit);
        case 'territories':
          return service.generateTerritoryPerformanceChart();
        default:
          return null;
      }

    case 'budget':
      switch (chartType) {
        case 'roi':
          return service.generateChannelROIChart();
        case 'allocation':
          return service.generateBudgetAllocationPie();
        case 'efficiency':
          return service.generateSpendEfficiencyChart();
        default:
          return null;
      }

    case 'content':
      switch (chartType) {
        case 'compliance':
          return service.generateMLRComplianceChart();
        case 'heatmap':
          return service.generateContentBarrierHeatmap();
        case 'performance':
          return service.generateContentPerformanceTimeSeries();
        default:
          return null;
      }

    case 'orchestration':
      switch (chartType) {
        case 'funnel':
          return service.generateJourneyFunnelChart();
        case 'effectiveness':
          return service.generateChannelEffectivenessChart();
        case 'confidence':
          return service.generateModelConfidenceChart();
        default:
          return null;
      }

    case 'suggestions':
      switch (chartType) {
        case 'triggers':
          return service.generateTriggerPerformanceChart();
        case 'sentiment':
          return service.generateFieldFeedbackSentiment();
        case 'territories':
          return service.generateTerritoryComparisonChart();
        default:
          return null;
      }

    case 'copilot':
      switch (chartType) {
        case 'activity':
          return service.generateCallActivityChart();
        case 'prioritization':
          return service.generateHCPPrioritizationChart();
        case 'metrics':
          return service.generatePerformanceMetricsChart();
        default:
          return null;
      }

    default:
      return null;
  }
}