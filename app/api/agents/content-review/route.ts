import { NextRequest, NextResponse } from 'next/server';
import { ContentReviewAgent } from '@/lib/agents/content-review';
import { generateMockContent } from '@/lib/data/mock-data';

const agent = new ContentReviewAgent();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'reviewAsset': {
        const result = await agent.analyze(data.asset);
        return NextResponse.json(result);
      }

      case 'batchReview': {
        const assets = data.assets || generateMockContent(10);
        const result = await agent.execute('batchReview', { assets });
        return NextResponse.json(result);
      }

      case 'contentGapAnalysis': {
        const library = data.library || generateMockContent(20);
        const barriers = data.barriers || [
          'insurance_denial',
          'side_effects',
          'referral_pathway',
          'formulary',
          'diagnostic_tool'
        ];
        const result = await agent.execute('contentGapAnalysis', { library, barriers });
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Content Review Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const mockContent = generateMockContent(5);
  
  return NextResponse.json({
    agent: 'Content Review Agent',
    description: 'Accelerates MLR approval and content management',
    capabilities: [
      'MLR compliance checking',
      'Content gap analysis',
      'Batch review',
      'Message alignment'
    ],
    sampleContent: mockContent
  });
}