import { NextRequest, NextResponse } from 'next/server';
import { AgentChatSession, checkRateLimit, withRetry } from '@/lib/ai/gemini-client';
import { getAgentSystemPrompt, AGENT_CONTEXTS } from '@/lib/ai/system-prompts';

// Agent endpoint for intelligent Q&A with streaming support
export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const agentId = params.agentId;
  
  try {
    // Validate agent ID
    if (!AGENT_CONTEXTS[agentId as keyof typeof AGENT_CONTEXTS]) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(agentId);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter 
        },
        { 
          status: 429,
          headers: rateLimitCheck.retryAfter 
            ? { 'Retry-After': Math.ceil(rateLimitCheck.retryAfter / 1000).toString() }
            : {}
        }
      );
    }

    const body = await request.json();
    const { 
      message, 
      conversationHistory = [], 
      stream = false,
      contextData = null 
    } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get agent-specific system prompt
    const systemPrompt = getAgentSystemPrompt(agentId);
    
    // Create enhanced prompt with context
    let enhancedMessage = message;
    if (contextData) {
      enhancedMessage = `Context from visualization panel: ${JSON.stringify(contextData)}\n\nUser question: ${message}`;
    }

    // Initialize agent chat session
    const chatSession = new AgentChatSession({
      systemPrompt,
      agentId,
      conversationHistory,
      temperature: 0.7
    });

    if (stream) {
      // Return streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of chatSession.sendMessageStream(enhancedMessage)) {
              const data = JSON.stringify({ 
                chunk, 
                agentId,
                timestamp: new Date().toISOString()
              }) + '\n';
              controller.enqueue(encoder.encode(data));
            }
          } catch (error) {
            console.error(`Streaming error for agent ${agentId}:`, error);
            const errorData = JSON.stringify({ 
              error: 'Streaming failed',
              fallbackMessage: getFallbackResponse(agentId, message)
            }) + '\n';
            controller.enqueue(encoder.encode(errorData));
          } finally {
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Agent-ID': agentId,
        },
      });
    } else {
      // Return standard JSON response with retry logic
      const response = await withRetry(
        () => chatSession.sendMessage(enhancedMessage),
        3,
        1000
      );

      return NextResponse.json({
        response,
        agentId,
        conversationHistory: chatSession.getConversationHistory(),
        timestamp: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        quickActions: AGENT_CONTEXTS[agentId as keyof typeof AGENT_CONTEXTS].quickActions
      });
    }
  } catch (error) {
    console.error(`Agent ${agentId} API error:`, error);
    
    // Return fallback response for graceful degradation
    return NextResponse.json({
      response: getFallbackResponse(agentId, 'fallback'),
      agentId,
      fallback: true,
      error: 'AI service temporarily unavailable',
      timestamp: new Date().toISOString()
    }, { status: 200 }); // Return 200 to avoid UI errors
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const agentId = params.agentId;
  
  if (!AGENT_CONTEXTS[agentId as keyof typeof AGENT_CONTEXTS]) {
    return NextResponse.json(
      { error: 'Invalid agent ID' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    agentId,
    status: 'ready',
    capabilities: [
      'Natural language Q&A',
      'Streaming responses',
      'Context-aware analysis',
      'Pharmaceutical expertise',
      'Visual context integration'
    ],
    quickActions: AGENT_CONTEXTS[agentId as keyof typeof AGENT_CONTEXTS].quickActions,
    sampleQuestions: AGENT_CONTEXTS[agentId as keyof typeof AGENT_CONTEXTS].sampleQuestions,
    model: 'gemini-2.0-flash-exp',
    timestamp: new Date().toISOString()
  });
}

// Fallback responses for graceful degradation
function getFallbackResponse(agentId: string, message: string): string {
  const fallbackResponses: Record<string, string> = {
    'customer': `As the Customer Planning Agent, I'm currently experiencing connectivity issues with my AI system. However, I can tell you that we're managing 2,847 HCPs with a focus on barrier analysis across 5 primary categories. For immediate assistance with HCP prioritization or barrier analysis, please check the visualization panel or try again in a moment.`,
    
    'budget': `As the Budget Planning Agent, I'm temporarily unable to access my full AI capabilities. I normally manage $47M in promotional budget with 3.2x average ROI across all channels. For urgent budget optimization questions, please refer to the current allocation shown in the visualization or retry your request.`,
    
    'content': `As the Content Review Agent, my AI-powered MLR compliance system is momentarily unavailable. I typically maintain a 96% first-pass approval rate across 1,247 promotional materials. For immediate content guidance, please check the compliance dashboard or try again shortly.`,
    
    'orchestration': `As the AI Orchestration Agent, I'm experiencing temporary connectivity issues with my ML models. I usually optimize customer journeys for 2,847 HCPs with 87% NBA accuracy. Please check the journey visualization for current recommendations or retry your question.`,
    
    'suggestions': `As the Field Suggestion Design Agent, my trigger system is temporarily offline. I normally provide suggestions to 245 reps with 73% effectiveness rates. For immediate field guidance, please refer to the current suggestions panel or try again soon.`,
    
    'copilot': `As the Field Copilot Agent, I'm currently unable to access my full coaching database. I typically support 245 reps with call preparation and territory insights. For immediate field support, please check the territory analytics or retry your request.`
  };

  return fallbackResponses[agentId] || "I apologize, but I'm temporarily unavailable. Please try again in a moment.";
}