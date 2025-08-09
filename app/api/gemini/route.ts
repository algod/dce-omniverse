import { NextRequest, NextResponse } from 'next/server';
import { geminiPro } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemContext } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const fullPrompt = systemContext ? `${systemContext}\n\n${prompt}` : prompt;
    
    const result = await geminiPro.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      response: text,
      model: 'gemini-2.5-pro',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    model: 'gemini-2.5-pro',
    capabilities: [
      'Text generation',
      'Multi-modal understanding',
      'Function calling',
      'Code execution',
      '1M token context'
    ]
  });
}