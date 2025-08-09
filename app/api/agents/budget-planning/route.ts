import { NextRequest, NextResponse } from 'next/server';
import { BudgetPlanningAgent } from '@/lib/agents/budget-planning';
import { mockChannels } from '@/lib/data/mock-data';

const agent = new BudgetPlanningAgent();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'optimize': {
        const scenario = {
          totalBudget: data.totalBudget || 5500000,
          channels: data.channels || mockChannels,
          constraints: data.constraints
        };
        const result = await agent.analyze(scenario);
        return NextResponse.json(result);
      }

      case 'runScenarios': {
        const scenarios = data.scenarios || [
          { totalBudget: 5000000, channels: mockChannels },
          { totalBudget: 5500000, channels: mockChannels },
          { totalBudget: 6000000, channels: mockChannels }
        ];
        const result = await agent.execute('runScenarios', { scenarios });
        return NextResponse.json(result);
      }

      case 'generateQuarterlyPlan': {
        const result = await agent.execute('generateQuarterlyPlan', { 
          optimization: data.optimization 
        });
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Budget Planning Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    agent: 'Budget Planning Agent',
    description: 'Optimizes budget allocation across promotional channels',
    capabilities: [
      'Budget optimization',
      'ROI calculation',
      'Scenario planning',
      'Quarterly planning'
    ],
    sampleChannels: mockChannels
  });
}