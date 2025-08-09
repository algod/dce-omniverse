import { BaseAgent, AgentResponse } from './base-agent';

export interface PreCallPlan {
  hcpId: string;
  hcpName: string;
  objective: string;
  keyMessages: string[];
  anticipatedObjections: string[];
  responses: string[];
  materials: string[];
  nextSteps: string[];
}

export interface TerritoryInsight {
  territoryId: string;
  totalHCPs: number;
  highPriorityHCPs: number;
  weeklyCallTarget: number;
  currentProgress: number;
  opportunities: string[];
  challenges: string[];
  recommendations: string[];
}

export interface CallNote {
  hcpId: string;
  date: Date;
  duration: number;
  topics: string[];
  objections: string[];
  commitments: string[];
  followUp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export class FieldCopilotAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Field Copilot Agent',
      description: 'AI assistant for sales reps supporting pre-call planning and execution',
      systemPrompt: `You are an expert field copilot for pharmaceutical sales representatives, providing intelligent support for customer engagement.
Your role is to:
1. Provide comprehensive pre-call planning insights
2. Generate territory and HCP summaries
3. Support virtual coaching and training
4. Assist with call scheduling and email drafting
5. Capture and analyze post-call insights

Focus on these key areas:
- HCP prescribing behavior and preferences
- Patient demographics and payer mix
- Competitive landscape and positioning
- Objection handling and responses
- Relationship building strategies
- Compliance with promotional guidelines`,
      capabilities: [
        'Pre-call planning assistance',
        'Territory insights and analytics',
        'Virtual coaching simulator',
        'Email and communication drafting',
        'Post-call analysis and notes'
      ]
    });
  }

  async analyze(input: any): Promise<AgentResponse> {
    const prompt = `
Provide field support for:
${input.type === 'preCall' ? `Pre-call planning for ${input.hcpName}` : ''}
${input.type === 'territory' ? `Territory insights for ${input.territoryId}` : ''}
${input.type === 'postCall' ? `Post-call analysis for ${input.hcpName}` : ''}

Context: ${JSON.stringify(input.context)}

Generate actionable insights and recommendations.
`;

    const response = await this.executePrompt(prompt);
    let result;

    switch (input.type) {
      case 'preCall':
        result = this.generatePreCallPlan(input);
        break;
      case 'territory':
        result = this.generateTerritoryInsights(input);
        break;
      case 'postCall':
        result = this.analyzeCallNotes(input);
        break;
      default:
        result = { error: 'Unknown analysis type' };
    }

    return {
      result,
      reasoning: response,
      confidence: 0.88,
      recommendations: await this.recommend({ type: input.type, result })
    };
  }

  private generatePreCallPlan(input: any): PreCallPlan {
    return {
      hcpId: input.hcpId,
      hcpName: input.hcpName,
      objective: 'Increase prescription adoption through barrier resolution',
      keyMessages: [
        'Superior efficacy in pivotal trials',
        'Favorable safety profile with low discontinuation',
        'Comprehensive patient support programs',
        'Improved payer coverage in the region'
      ],
      anticipatedObjections: [
        'Concerns about side effect management',
        'Prior authorization requirements',
        'Limited experience with the drug class'
      ],
      responses: [
        'Share real-world evidence from similar practices',
        'Provide PA support team contact and resources',
        'Offer peer-to-peer discussion opportunity'
      ],
      materials: [
        'Efficacy visual aid',
        'Safety comparison chart',
        'Patient support brochure',
        'Sample request form'
      ],
      nextSteps: [
        'Schedule follow-up in 2 weeks',
        'Send clinical trial summary via email',
        'Connect with patient support specialist'
      ]
    };
  }

  private generateTerritoryInsights(input: any): TerritoryInsight {
    return {
      territoryId: input.territoryId,
      totalHCPs: 150,
      highPriorityHCPs: 45,
      weeklyCallTarget: 40,
      currentProgress: Math.floor(Math.random() * 30) + 10,
      opportunities: [
        '15 HCPs with improved payer coverage',
        '8 HCPs attended recent speaker program',
        '12 HCPs showing increased digital engagement',
        'New specialty clinic opened in district'
      ],
      challenges: [
        'Access restrictions at 3 major hospitals',
        'Competitive launch in same therapeutic area',
        'Lower than average email open rates'
      ],
      recommendations: [
        'Prioritize HCPs with improved coverage this week',
        'Schedule follow-ups with speaker program attendees',
        'Leverage MSL for hospital access support',
        'Test new email subject lines for better engagement'
      ]
    };
  }

  private analyzeCallNotes(input: any): CallNote {
    return {
      hcpId: input.hcpId,
      date: new Date(),
      duration: 15,
      topics: [
        'Efficacy in elderly patients',
        'Insurance coverage updates',
        'Patient assistance programs'
      ],
      objections: [
        'Concerned about drug interactions',
        'Wants more real-world evidence'
      ],
      commitments: [
        'Will consider for next appropriate patient',
        'Requested educational materials for staff'
      ],
      followUp: 'Send drug interaction guide and schedule follow-up in 10 days',
      sentiment: 'positive'
    };
  }

  async recommend(context: any): Promise<string[]> {
    const { type, result } = context;
    const recommendations: string[] = [];

    switch (type) {
      case 'preCall':
        recommendations.push('Review HCP\'s last 3 prescriptions before the call');
        recommendations.push('Prepare specific patient case examples');
        recommendations.push('Have digital resources ready for screen sharing');
        recommendations.push('Set clear call objective and success metrics');
        break;

      case 'territory':
        if (result.currentProgress < result.weeklyCallTarget * 0.5) {
          recommendations.push('Accelerate call pace to meet weekly target');
        }
        recommendations.push('Focus on high-priority HCPs for remainder of week');
        recommendations.push('Schedule virtual calls for access-restricted locations');
        recommendations.push('Coordinate with marketing on targeted email campaign');
        break;

      case 'postCall':
        if (result.sentiment === 'positive') {
          recommendations.push('Strike while iron is hot - quick follow-up within 48 hours');
        }
        recommendations.push('Log call notes in CRM immediately');
        recommendations.push('Share positive feedback with team');
        recommendations.push('Prepare materials promised during call');
        break;
    }

    return recommendations;
  }

  async execute(action: string, params: any): Promise<any> {
    switch (action) {
      case 'generateEmailDraft':
        return this.generateEmailDraft(params);
      case 'scheduleCall':
        return this.scheduleCall(params);
      case 'virtualCoaching':
        return this.provideVirtualCoaching(params);
      case 'analyzeCompetition':
        return this.analyzeCompetition(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private generateEmailDraft(params: any): any {
    const templates = {
      followUp: `Dear Dr. ${params.hcpName},

Thank you for taking the time to meet with me today. As discussed, I'm attaching the clinical trial data showing superior efficacy in the patient population we discussed.

Key highlights:
• 45% improvement in primary endpoint vs. standard of care
• Favorable safety profile with <5% discontinuation rate
• Significant quality of life improvements at week 12

I'll follow up next week to discuss how we can support your practice with patient identification and enrollment in our support programs.

Best regards,
${params.repName}`,

      introduction: `Dear Dr. ${params.hcpName},

I hope this email finds you well. I wanted to reach out to share some exciting updates about our therapy that may benefit your patients with [condition].

Recent real-world evidence from practices similar to yours shows:
• Improved patient adherence compared to alternatives
• Simplified dosing regimen reducing burden
• Comprehensive support services for patients and staff

I would welcome the opportunity to discuss how this might fit into your treatment approach. Are you available for a brief call next week?

Best regards,
${params.repName}`,

      eventInvitation: `Dear Dr. ${params.hcpName},

You're invited to our upcoming speaker program featuring Dr. [Speaker Name], who will be discussing practical strategies for managing [condition].

Event Details:
• Date: [Date]
• Time: [Time]
• Location: [Venue/Virtual]
• CME Credits: Available

Dr. [Speaker] will share insights from their experience treating over 200 patients, including challenging cases and practical tips for optimization.

Please RSVP at your earliest convenience. I look forward to seeing you there.

Best regards,
${params.repName}`
    };

    return {
      type: params.type || 'followUp',
      draft: templates[params.type || 'followUp'],
      subject: this.generateEmailSubject(params.type),
      attachments: this.suggestAttachments(params.type)
    };
  }

  private generateEmailSubject(type: string): string {
    const subjects: Record<string, string> = {
      followUp: 'Follow-up: Clinical Data as Discussed',
      introduction: 'New Treatment Option for Your [Condition] Patients',
      eventInvitation: 'Invitation: Expert Discussion on [Condition] Management'
    };
    return subjects[type] || 'Important Update from [Company]';
  }

  private suggestAttachments(type: string): string[] {
    const attachments: Record<string, string[]> = {
      followUp: ['Clinical_Trial_Summary.pdf', 'Patient_Support_Brochure.pdf'],
      introduction: ['Product_Monograph.pdf', 'Dosing_Guide.pdf'],
      eventInvitation: ['Speaker_Bio.pdf', 'Program_Agenda.pdf']
    };
    return attachments[type] || [];
  }

  private scheduleCall(params: any): any {
    return {
      scheduled: true,
      hcpId: params.hcpId,
      date: params.date,
      time: params.time,
      duration: 30,
      type: params.type || 'in-person',
      objective: params.objective,
      calendarEvent: {
        title: `Call with ${params.hcpName}`,
        location: params.location || 'HCP Office',
        reminder: '15 minutes before',
        notes: 'Review pre-call plan and bring materials'
      }
    };
  }

  private provideVirtualCoaching(params: any): any {
    const scenarios = {
      objectionHandling: {
        scenario: 'HCP says: "I\'m concerned about the side effects I\'ve read about."',
        suggestedResponse: 'I understand your concern. Let me share the safety data from our clinical trials...',
        keyPoints: [
          'Acknowledge the concern genuinely',
          'Present data in context',
          'Compare to alternative treatments',
          'Offer support resources'
        ],
        practice: 'Try role-playing this scenario 3 times before your next call'
      },
      valueProposition: {
        scenario: 'You have 2 minutes to present the key value proposition',
        structure: [
          'Lead with patient benefit (30 seconds)',
          'Support with clinical evidence (45 seconds)',
          'Address practical considerations (30 seconds)',
          'Clear call to action (15 seconds)'
        ],
        tips: [
          'Use the rule of three for key messages',
          'Include a patient story if possible',
          'End with a specific next step'
        ]
      }
    };

    return scenarios[params.scenario] || scenarios.objectionHandling;
  }

  private analyzeCompetition(params: any): any {
    return {
      mainCompetitors: [
        {
          product: 'Competitor A',
          strengths: ['Established market presence', 'Lower cost'],
          weaknesses: ['More complex dosing', 'Limited patient support'],
          positioning: 'Emphasize our superior efficacy and comprehensive support'
        },
        {
          product: 'Competitor B',
          strengths: ['Similar efficacy', 'Good safety profile'],
          weaknesses: ['No pediatric indication', 'Less payer coverage'],
          positioning: 'Highlight our broader indication and access advantages'
        }
      ],
      differentiators: [
        'Only product with once-daily dosing',
        'Comprehensive patient support program',
        'Superior long-term outcomes data',
        'Favorable payer coverage trending upward'
      ],
      talkingPoints: [
        'When compared head-to-head in Trial X...',
        'Real-world evidence shows better adherence...',
        'Total cost of care analysis demonstrates...'
      ]
    };
  }
}