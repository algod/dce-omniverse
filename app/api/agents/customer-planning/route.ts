import { NextRequest, NextResponse } from 'next/server';
import { CustomerPlanningAgent } from '@/lib/agents/customer-planning';
import { generateMockHCPs } from '@/lib/data/mock-data';

const agent = new CustomerPlanningAgent();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'analyzeHCP': {
        const result = await agent.analyze(data.hcp);
        return NextResponse.json(result);
      }

      case 'analyzePortfolio': {
        const hcps = data.hcps || generateMockHCPs(data.count || 20);
        const result = await agent.execute('analyzePortfolio', { hcps });
        return NextResponse.json(result);
      }

      case 'generateSegmentation': {
        const hcps = data.hcps || generateMockHCPs(data.count || 100);
        const result = await agent.execute('generateSegmentation', { hcps });
        return NextResponse.json(result);
      }

      case 'getRecommendations': {
        const recommendations = await agent.recommend(data.context);
        return NextResponse.json({ recommendations });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Customer Planning Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const mockHCPs = generateMockHCPs(10);
  
  return NextResponse.json({
    agent: agent.getName(),
    description: agent.getDescription(),
    capabilities: agent.getCapabilities(),
    sampleData: mockHCPs
  });
}