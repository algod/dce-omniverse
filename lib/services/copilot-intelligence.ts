import { MockDataService } from './mock-data-service';

// Field Copilot Intelligence Service - AI assistant for sales reps
export class CopilotIntelligenceService {
  private static instance: CopilotIntelligenceService;
  private mockData: MockDataService;

  private constructor() {
    this.mockData = MockDataService.getInstance();
  }

  public static getInstance(): CopilotIntelligenceService {
    if (!CopilotIntelligenceService.instance) {
      CopilotIntelligenceService.instance = new CopilotIntelligenceService();
    }
    return CopilotIntelligenceService.instance;
  }

  // Pre-call planning with HCP insights
  async prepareCallPlan(
    hcpId: string,
    repId: string,
    meetingType: 'in-person' | 'virtual' | 'phone' = 'in-person'
  ): Promise<CallPlanningResult> {
    const hcp = this.mockData.getHCPById(hcpId);
    if (!hcp) {
      throw new Error(`HCP ${hcpId} not found`);
    }
    
    // Simulate rep data
    const rep = {
      id: repId,
      name: `Rep ${repId}`,
      territory: { id: 'T001', name: 'Northeast' }
    };
    
    // Get HCP history and profile
    const prescribingHistory = this.mockData.getPrescribingHistory(hcpId);
    const engagementHistory = this.getEngagementHistory(hcpId);
    const barriers = this.identifyHCPBarriers(hcp, prescribingHistory);
    
    // Generate call objectives
    const objectives = this.generateCallObjectives(hcp, barriers, engagementHistory);
    
    // Prepare talking points
    const talkingPoints = this.generateTalkingPoints(objectives, barriers, meetingType);
    
    // Identify relevant content
    const recommendedContent = this.selectRelevantContent(barriers, hcp.specialty);
    
    // Get competitor intelligence
    const competitorInsights = this.getCompetitorInsights(hcp, rep.territory);
    
    // Generate personalized opening
    const personalizedOpening = this.generatePersonalizedOpening(hcp, engagementHistory);
    
    return {
      hcpProfile: {
        name: hcp.name,
        specialty: hcp.specialty,
        institution: hcp.practice.name,
        decileRank: Math.floor(Math.random() * 10) + 1, // Simulate decile rank
        prescribingTrend: this.calculatePrescribingTrend(prescribingHistory),
        preferredChannels: this.identifyPreferredChannels(engagementHistory),
        lastInteraction: engagementHistory[0]?.date || null,
        keyInfluencers: this.identifyKeyInfluencers(hcp)
      },
      meetingDetails: {
        type: meetingType,
        estimatedDuration: meetingType === 'in-person' ? 15 : 10,
        bestTimeSlots: this.suggestBestTimeSlots(hcp),
        location: hcp.practice.name
      },
      barriers: barriers.map(b => ({
        code: b.code,
        description: b.description,
        severity: b.severity,
        talkingPoints: this.getBarrierTalkingPoints(b.code)
      })),
      objectives: objectives,
      talkingPoints: talkingPoints,
      recommendedContent: recommendedContent,
      personalizedOpening: personalizedOpening,
      competitorInsights: competitorInsights,
      anticipatedObjections: this.anticipateObjections(hcp, barriers),
      nextSteps: this.suggestNextSteps(hcp, objectives),
      successMetrics: {
        minimumObjectivesAchieved: Math.ceil(objectives.length * 0.6),
        targetEngagementScore: 7.5,
        followUpTimeframe: '48 hours'
      }
    };
  }

  // Territory analytics and insights
  async getTerritoryAnalytics(
    repId: string,
    timeframe: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<TerritoryAnalytics> {
    // Simulate rep and territory data
    const rep = {
      id: repId,
      name: `Rep ${repId}`,
      territory: { id: 'T001', name: 'Northeast' }
    };
    
    const hcps = this.mockData.getHCPList().slice(0, 20); // Get sample HCPs
    
    // Calculate territory metrics
    const totalPotential = hcps.reduce((sum, hcp) => sum + (Math.floor(Math.random() * 100) + 50), 0); // Simulate potential
    const avgDecile = hcps.reduce((sum, hcp) => sum + (Math.floor(Math.random() * 10) + 1), 0) / hcps.length;
    
    // Segment HCPs
    const segments = this.segmentHCPs(hcps);
    
    // Calculate coverage
    const coverage = this.calculateCoverage(hcps, timeframe);
    
    // Identify opportunities
    const opportunities = this.identifyTerritoryOpportunities(hcps, rep.territory);
    
    // Get competitive landscape
    const competitiveLandscape = this.analyzeCompetitiveLandscape(rep.territory);
    
    // Performance trends
    const performanceTrends = this.calculatePerformanceTrends(rep.territory, timeframe);
    
    return {
      summary: {
        totalHCPs: hcps.length,
        totalPotential: totalPotential,
        averageDecile: avgDecile,
        marketShare: Math.random() * 0.3 + 0.1, // Simulate market share
        growthRate: performanceTrends.growthRate,
        territoryRank: Math.floor(Math.random() * 50) + 1
      },
      segments: segments,
      coverage: coverage,
      opportunities: opportunities,
      competitiveLandscape: competitiveLandscape,
      performanceTrends: performanceTrends,
      topPerformers: this.identifyTopPerformers(hcps).slice(0, 10),
      atRiskAccounts: this.identifyAtRiskAccounts(hcps).slice(0, 10),
      whitespace: this.identifyWhitespace(rep.territory, hcps),
      recommendations: this.generateTerritoryRecommendations(rep.territory, segments, opportunities)
    };
  }

  // Virtual coaching simulator
  async runCoachingScenario(
    repId: string,
    scenarioType: 'objection-handling' | 'product-detailing' | 'closing' | 'opening'
  ): Promise<CoachingScenarioResult> {
    const scenarios = this.getScenariosByType(scenarioType);
    const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Simulate conversation flow
    const conversationFlow = this.generateConversationFlow(selectedScenario, scenarioType);
    
    // Generate best practices
    const bestPractices = this.getBestPractices(scenarioType);
    
    // Create evaluation criteria
    const evaluationCriteria = this.getEvaluationCriteria(scenarioType);
    
    // Generate feedback points
    const feedbackPoints = this.generateFeedbackPoints(scenarioType);
    
    return {
      scenario: selectedScenario,
      conversationFlow: conversationFlow,
      bestPractices: bestPractices,
      evaluationCriteria: evaluationCriteria,
      feedbackPoints: feedbackPoints,
      difficultyLevel: this.getScenarioDifficulty(scenarioType),
      estimatedDuration: this.getScenarioDuration(scenarioType),
      learningObjectives: this.getLearningObjectives(scenarioType),
      relatedContent: this.getRelatedTrainingContent(scenarioType),
      performanceScore: null, // To be filled after completion
      completionCertificate: null // To be generated after success
    };
  }

  // Email draft assistance
  async generateEmailDraft(
    repId: string,
    hcpId: string,
    purpose: 'follow-up' | 'introduction' | 'event-invite' | 'resource-share'
  ): Promise<EmailDraft> {
    const hcp = this.mockData.getHCPById(hcpId);
    if (!hcp) {
      throw new Error(`HCP ${hcpId} not found`);
    }
    
    // Simulate rep data
    const rep = {
      id: repId,
      name: `Rep ${repId}`,
      territory: { id: 'T001', name: 'Northeast' }
    };
    const engagementHistory = this.getEngagementHistory(hcpId);
    
    // Generate subject line
    const subjectLine = this.generateSubjectLine(purpose, hcp, engagementHistory);
    
    // Generate email body
    const emailBody = this.generateEmailBody(purpose, hcp, rep, engagementHistory);
    
    // Add relevant resources
    const attachments = this.selectEmailAttachments(purpose, hcp);
    
    // Generate call-to-action
    const callToAction = this.generateCallToAction(purpose, hcp);
    
    return {
      to: `${hcp.name.toLowerCase().replace(' ', '.')}@${hcp.practice.name.toLowerCase().replace(/\s+/g, '')}.com`,
      cc: [],
      subject: subjectLine,
      body: emailBody,
      attachments: attachments,
      callToAction: callToAction,
      complianceCheck: {
        passed: true,
        warnings: this.checkEmailCompliance(emailBody),
        suggestions: this.getEmailImprovementSuggestions(emailBody, purpose)
      },
      personalizationScore: this.calculatePersonalizationScore(emailBody, hcp),
      estimatedReadTime: Math.ceil(emailBody.split(' ').length / 200),
      bestSendTime: this.suggestBestSendTime(hcp, purpose),
      trackingEnabled: true
    };
  }

  // Meeting scheduler assistant
  async optimizeSchedule(
    repId: string,
    week: number
  ): Promise<ScheduleOptimization> {
    // Simulate rep and territory data
    const rep = {
      id: repId,
      name: `Rep ${repId}`,
      territory: { id: 'T001', name: 'Northeast' }
    };
    
    const hcps = this.mockData.getHCPList().slice(0, 20); // Get sample HCPs
    
    // Get existing appointments
    const existingAppointments = this.getExistingAppointments(repId, week);
    
    // Prioritize HCPs for visits
    const prioritizedHCPs = this.prioritizeHCPsForVisits(hcps, existingAppointments);
    
    // Optimize route
    const optimizedRoute = this.optimizeVisitRoute(prioritizedHCPs, 'Territory Center'); // Simulate location
    
    // Generate time blocks
    const timeBlocks = this.generateOptimalTimeBlocks(optimizedRoute, existingAppointments);
    
    // Calculate metrics
    const metrics = this.calculateScheduleMetrics(timeBlocks, prioritizedHCPs);
    
    return {
      weekNumber: week,
      proposedSchedule: timeBlocks,
      routeOptimization: {
        totalDistance: optimizedRoute.totalDistance,
        estimatedDriveTime: optimizedRoute.driveTime,
        fuelCost: optimizedRoute.totalDistance * 0.15,
        co2Saved: optimizedRoute.co2Saved
      },
      coverageMetrics: metrics,
      recommendations: [
        'Focus on high-decile HCPs in the morning when engagement is highest',
        'Batch virtual calls on Tuesday afternoon to maximize efficiency',
        'Reserve Friday afternoon for administrative tasks and planning'
      ],
      conflicts: this.identifyScheduleConflicts(timeBlocks, existingAppointments),
      bufferTime: this.calculateBufferTime(timeBlocks),
      flexibilityScore: this.calculateFlexibilityScore(timeBlocks)
    };
  }

  // Private helper methods
  private getEngagementHistory(hcpId: string): any[] {
    const activities = ['Email Sent', 'Call Completed', 'Sample Dropped', 'Event Attended', 'Virtual Meeting'];
    const history: any[] = [];
    
    for (let i = 0; i < 10; i++) {
      history.push({
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        type: activities[Math.floor(Math.random() * activities.length)],
        outcome: Math.random() > 0.3 ? 'Positive' : 'Neutral',
        notes: 'Discussed efficacy data and patient outcomes',
        duration: Math.floor(Math.random() * 30) + 5
      });
    }
    
    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private identifyHCPBarriers(hcp: any, prescribingHistory: any[]): any[] {
    const barriers: any[] = [];
    const barrierTypes = [
      { code: 'B001', description: 'No/challenging referral pathways', severity: 'high' },
      { code: 'B002', description: 'Managing side effects challenges', severity: 'medium' },
      { code: 'B003', description: 'Insurance denials/restrictions', severity: 'high' },
      { code: 'B004', description: 'Not in formulary', severity: 'medium' },
      { code: 'B005', description: 'Requires new diagnostic test', severity: 'low' }
    ];
    
    // Randomly assign 1-3 barriers
    const numBarriers = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numBarriers; i++) {
      barriers.push(barrierTypes[Math.floor(Math.random() * barrierTypes.length)]);
    }
    
    return barriers;
  }

  private generateCallObjectives(hcp: any, barriers: any[], history: any[]): string[] {
    const objectives = [
      `Address ${barriers[0]?.description || 'key concerns'} with new clinical data`,
      'Reinforce efficacy benefits vs competitor products',
      'Discuss patient identification criteria',
      'Share patient support program details',
      'Secure commitment for trial with next eligible patient'
    ];
    
    return objectives.slice(0, 3 + Math.floor(Math.random() * 2));
  }

  private generateTalkingPoints(objectives: string[], barriers: any[], meetingType: string): string[] {
    const points = [
      'Open with recent conference insights relevant to their practice',
      `Focus on ${barriers[0]?.description || 'primary barrier'} resolution strategies`,
      'Share peer success stories from similar institutions',
      'Demonstrate patient journey mapping tool',
      'Highlight improved patient outcomes from recent studies',
      'Discuss reimbursement support services',
      'Provide clinical calculator for patient selection'
    ];
    
    return points.slice(0, 4 + Math.floor(Math.random() * 3));
  }

  private selectRelevantContent(barriers: any[], specialty: string): any[] {
    const content = this.mockData.getContentList();
    return content
      .filter(c => c.status === 'Approved')
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        relevanceScore: Math.random() * 0.3 + 0.7,
        barrierAlignment: barriers[0]?.code || 'B001'
      }));
  }

  private getCompetitorInsights(hcp: any, territory: any): any {
    return {
      mainCompetitors: ['Product A', 'Product B', 'Product C'],
      marketShare: {
        ourProduct: 32,
        productA: 28,
        productB: 25,
        productC: 15
      },
      competitorStrengths: {
        productA: 'Lower cost, established presence',
        productB: 'Simpler dosing regimen',
        productC: 'Fewer side effects'
      },
      counterStrategies: [
        'Emphasize superior efficacy in clinical trials',
        'Highlight comprehensive patient support program',
        'Focus on long-term outcomes and quality of life'
      ],
      switchingTrends: 'Increasing switches from Product A due to efficacy concerns'
    };
  }

  private generatePersonalizedOpening(hcp: any, history: any[]): string {
    const lastInteraction = history[0];
    const openings = [
      `Dr. ${hcp.name.split(' ')[1]}, I hope you found the recent conference insights I shared helpful for your ${hcp.specialty} practice.`,
      `Good to see you again, Dr. ${hcp.name.split(' ')[1]}. I wanted to follow up on our discussion about managing challenging patients.`,
      `Dr. ${hcp.name.split(' ')[1]}, I've been thinking about the patient case you mentioned last time and have some new resources that might help.`
    ];
    
    return openings[Math.floor(Math.random() * openings.length)];
  }

  private calculatePrescribingTrend(history: any[]): string {
    const recent = history.slice(0, 3).reduce((sum, h) => sum + h.rxCount, 0);
    const older = history.slice(3, 6).reduce((sum, h) => sum + h.rxCount, 0);
    
    if (recent > older * 1.1) return 'increasing';
    if (recent < older * 0.9) return 'decreasing';
    return 'stable';
  }

  private identifyPreferredChannels(history: any[]): string[] {
    const channels = new Set(history.map(h => h.type));
    return Array.from(channels).slice(0, 3);
  }

  private identifyKeyInfluencers(hcp: any): string[] {
    return [
      'Dr. Johnson (Department Head)',
      'Dr. Smith (KOL in ' + hcp.specialty + ')',
      'Hospital P&T Committee'
    ];
  }

  private getBarrierTalkingPoints(barrierCode: string): string[] {
    const talkingPointsMap: Record<string, string[]> = {
      'B001': [
        'We have established referral networks with specialists',
        'Our patient navigator program facilitates connections',
        'Digital referral platform reduces administrative burden'
      ],
      'B002': [
        'Comprehensive side effect management protocols available',
        'Nurse educator support for patient counseling',
        'Prophylactic measures proven to reduce incidence by 40%'
      ],
      'B003': [
        'Prior authorization support team with 95% approval rate',
        'Financial assistance programs for eligible patients',
        'Appeal letter templates with clinical justification'
      ],
      'B004': [
        'Working with P&T committee on formulary inclusion',
        'Exception process support available',
        'Value dossier demonstrates cost-effectiveness'
      ],
      'B005': [
        'Diagnostic test now covered by major insurers',
        'Training available for test interpretation',
        'Partnership with labs for streamlined processing'
      ]
    };
    
    return talkingPointsMap[barrierCode] || ['Address specific barrier concerns'];
  }

  private suggestBestTimeSlots(hcp: any): string[] {
    return [
      'Tuesday 10:00 AM - 11:00 AM',
      'Wednesday 2:00 PM - 3:00 PM',
      'Thursday 9:00 AM - 10:00 AM'
    ];
  }

  private anticipateObjections(hcp: any, barriers: any[]): any[] {
    return [
      {
        objection: 'Cost concerns for patients',
        response: 'Our patient assistance program covers up to 100% of costs for eligible patients'
      },
      {
        objection: 'Efficacy compared to current treatment',
        response: 'Head-to-head trial showed 35% better outcomes at 12 months'
      },
      {
        objection: 'Complex administration',
        response: 'Simplified dosing with auto-injector, 98% patient satisfaction'
      }
    ];
  }

  private suggestNextSteps(hcp: any, objectives: string[]): string[] {
    return [
      'Send follow-up email with clinical trial data',
      'Schedule lunch-and-learn for practice staff',
      'Provide patient identification tools',
      'Connect with our Medical Science Liaison for deep clinical discussion'
    ];
  }

  private segmentHCPs(hcps: any[]): any {
    const segments = {
      highValue: hcps.filter(h => h.decileRank >= 8).length,
      mediumValue: hcps.filter(h => h.decileRank >= 5 && h.decileRank < 8).length,
      lowValue: hcps.filter(h => h.decileRank < 5).length,
      growth: hcps.filter(h => h.potential > 50000).length,
      maintenance: hcps.filter(h => h.potential > 20000 && h.potential <= 50000).length,
      monitor: hcps.filter(h => h.potential <= 20000).length
    };
    
    return segments;
  }

  private calculateCoverage(hcps: any[], timeframe: string): any {
    const targetCalls = timeframe === 'week' ? 20 : timeframe === 'month' ? 80 : 240;
    const actualCalls = Math.floor(targetCalls * (0.7 + Math.random() * 0.3));
    
    return {
      targetCalls,
      actualCalls,
      coverageRate: (actualCalls / targetCalls * 100).toFixed(1) + '%',
      reachRate: ((hcps.length * 0.6) / hcps.length * 100).toFixed(1) + '%',
      frequencyAverage: (actualCalls / (hcps.length * 0.6)).toFixed(1)
    };
  }

  private identifyTerritoryOpportunities(hcps: any[], territory: any): any[] {
    return [
      {
        type: 'New Practice Opening',
        description: '3 new cardiology practices identified in territory',
        potentialValue: 125000,
        priority: 'high',
        actionRequired: 'Initial outreach and credentialing'
      },
      {
        type: 'Formulary Win',
        description: 'Regional health system added to preferred formulary',
        potentialValue: 450000,
        priority: 'high',
        actionRequired: 'Rapid engagement with affiliated HCPs'
      },
      {
        type: 'Competitor Vulnerability',
        description: 'Product B facing supply issues in territory',
        potentialValue: 200000,
        priority: 'medium',
        actionRequired: 'Target Product B prescribers for switching'
      }
    ];
  }

  private analyzeCompetitiveLandscape(territory: any): any {
    return {
      marketShareTrend: 'gaining',
      shareChange: '+2.3%',
      competitorActivity: {
        productA: { activity: 'high', tactics: ['Speaker programs', 'Sample drops'] },
        productB: { activity: 'medium', tactics: ['Digital engagement', 'Webinars'] },
        productC: { activity: 'low', tactics: ['Email campaigns'] }
      },
      competitiveThreats: [
        'Product A launching new indication next quarter',
        'Product B increasing field force by 20%'
      ],
      competitiveAdvantages: [
        'Only product with pediatric indication',
        'Best safety profile in class',
        'Strongest patient support program'
      ]
    };
  }

  private calculatePerformanceTrends(territory: any, timeframe: string): any {
    return {
      prescriptions: {
        current: Math.floor(1000 + Math.random() * 500),
        previous: Math.floor(900 + Math.random() * 400),
        change: '+12.3%'
      },
      newPatientStarts: {
        current: Math.floor(50 + Math.random() * 30),
        previous: Math.floor(45 + Math.random() * 25),
        change: '+8.7%'
      },
      persistency: {
        current: 76.5,
        previous: 74.2,
        change: '+2.3pp'
      },
      growthRate: 12.3,
      shareOfVoice: 28.5
    };
  }

  private identifyTopPerformers(hcps: any[]): any[] {
    return hcps
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 10)
      .map(hcp => ({
        name: hcp.name,
        specialty: hcp.specialty,
        potential: Math.floor(Math.random() * 100) + 50, // Simulate potential
        currentRx: Math.floor((Math.random() * 100 + 50) * 0.3),
        growth: '+' + (Math.random() * 30 + 10).toFixed(1) + '%'
      }));
  }

  private identifyAtRiskAccounts(hcps: any[]): any[] {
    return hcps
      .filter(h => Math.random() > 0.8)
      .slice(0, 10)
      .map(hcp => ({
        name: hcp.name,
        riskLevel: Math.random() > 0.5 ? 'high' : 'medium',
        reason: 'Declining prescription volume',
        lastEngagement: '3 weeks ago',
        recommendedAction: 'Priority outreach with value proposition'
      }));
  }

  private identifyWhitespace(territory: any, hcps: any[]): any {
    return {
      untappedHCPs: Math.floor(hcps.length * 0.15),
      potentialValue: Math.floor(territory.potential * 0.2),
      topOpportunities: [
        'Pediatric specialists not currently prescribing',
        'New residents/fellows in territory',
        'Recently relocated practices'
      ],
      accessChallenges: [
        'No-see HCPs requiring peer-to-peer approach',
        'Group practices with restrictive policies'
      ]
    };
  }

  private generateTerritoryRecommendations(territory: any, segments: any, opportunities: any[]): string[] {
    return [
      `Focus on ${segments.highValue} high-value HCPs for maximum impact`,
      `Capitalize on formulary win with targeted campaign to ${opportunities[1].description}`,
      'Implement digital engagement for low-touch segments',
      'Schedule peer-to-peer programs for no-see targets',
      'Increase frequency to at-risk accounts to prevent losses'
    ];
  }

  private getScenariosByType(type: string): any[] {
    const scenarios = {
      'objection-handling': [
        {
          title: 'Cost Objection from Community Physician',
          setup: 'Dr. Smith is concerned about patient affordability',
          hcpProfile: 'Conservative prescriber, cost-conscious',
          objection: "I like the efficacy, but my patients can't afford this medication"
        },
        {
          title: 'Efficacy Doubt from Academic Physician',
          setup: 'Dr. Johnson questions real-world effectiveness',
          hcpProfile: 'Data-driven, research-oriented',
          objection: 'The clinical trial results don\'t reflect my patient population'
        }
      ],
      'product-detailing': [
        {
          title: 'First Detail to Cardiology Practice',
          setup: 'Initial product presentation to 5-physician group',
          hcpProfile: 'Mixed experience levels, busy practice',
          objective: 'Establish product differentiation and value'
        }
      ],
      'closing': [
        {
          title: 'Securing Trial Commitment',
          setup: 'Following up after positive reception',
          hcpProfile: 'Interested but cautious adopter',
          objective: 'Get commitment for next 3 eligible patients'
        }
      ],
      'opening': [
        {
          title: 'Re-engaging Lapsed Prescriber',
          setup: 'HCP stopped prescribing 6 months ago',
          hcpProfile: 'Previously high prescriber',
          objective: 'Understand issues and re-establish relationship'
        }
      ]
    };
    
    return scenarios[type as keyof typeof scenarios] || scenarios['objection-handling'];
  }

  private generateConversationFlow(scenario: any, type: string): any[] {
    return [
      {
        speaker: 'Rep',
        message: this.getOpeningStatement(type, scenario),
        bestPractice: 'Strong, relevant opening'
      },
      {
        speaker: 'HCP',
        message: scenario.objection || scenario.challenge || 'Tell me more about your product',
        expectedResponse: 'Acknowledge and probe'
      },
      {
        speaker: 'Rep',
        message: 'I understand your concern. Can you tell me more about...',
        bestPractice: 'Active listening and clarification'
      },
      {
        speaker: 'HCP',
        message: 'Well, specifically...',
        expectedResponse: 'Address with evidence'
      },
      {
        speaker: 'Rep',
        message: 'Based on what you\'ve shared, let me show you...',
        bestPractice: 'Data-driven response'
      }
    ];
  }

  private getOpeningStatement(type: string, scenario: any): string {
    const openings: Record<string, string> = {
      'objection-handling': 'I appreciate you sharing that concern. Many physicians initially had similar questions...',
      'product-detailing': `Thank you for your time today. I'd like to share how our product addresses the key challenges in ${scenario.hcpProfile}...`,
      'closing': 'Based on our discussion, it seems like this could really benefit your patients who...',
      'opening': `Dr. ${scenario.hcpProfile}, it's been a while since we connected. I wanted to check in and see how things are going...`
    };
    
    return openings[type] || 'Thank you for your time today...';
  }

  private getBestPractices(type: string): string[] {
    const practices: Record<string, string[]> = {
      'objection-handling': [
        'Listen completely before responding',
        'Acknowledge the validity of their concern',
        'Use peer examples and clinical evidence',
        'Confirm understanding before moving forward',
        'Follow up with supporting materials'
      ],
      'product-detailing': [
        'Start with unmet needs in their practice',
        'Use visual aids effectively',
        'Encourage questions throughout',
        'Relate features to patient benefits',
        'Summarize key points at the end'
      ],
      'closing': [
        'Summarize agreed-upon points',
        'Be specific about next steps',
        'Set clear timelines',
        'Address any final concerns',
        'Confirm commitment before leaving'
      ],
      'opening': [
        'Be warm but professional',
        'Reference previous interactions positively',
        'Ask open-ended questions',
        'Show genuine interest in their practice',
        'Establish agenda collaboratively'
      ]
    };
    
    return practices[type] || practices['objection-handling'];
  }

  private getEvaluationCriteria(type: string): any[] {
    return [
      { criteria: 'Opening effectiveness', weight: 20, description: 'Engaging and relevant start' },
      { criteria: 'Active listening', weight: 25, description: 'Understanding HCP perspective' },
      { criteria: 'Evidence utilization', weight: 20, description: 'Appropriate use of data/studies' },
      { criteria: 'Objection handling', weight: 20, description: 'Addressing concerns effectively' },
      { criteria: 'Closing strength', weight: 15, description: 'Clear next steps and commitment' }
    ];
  }

  private generateFeedbackPoints(type: string): any[] {
    return [
      { type: 'strength', message: 'Good use of open-ended questions to understand needs' },
      { type: 'improvement', message: 'Could reference more specific clinical data' },
      { type: 'strength', message: 'Excellent acknowledgment of HCP concerns' },
      { type: 'improvement', message: 'Remember to confirm understanding before moving on' },
      { type: 'tip', message: 'Try using patient stories to make data more relatable' }
    ];
  }

  private getScenarioDifficulty(type: string): string {
    const difficulties: Record<string, string> = {
      'objection-handling': 'intermediate',
      'product-detailing': 'beginner',
      'closing': 'advanced',
      'opening': 'intermediate'
    };
    return difficulties[type] || 'intermediate';
  }

  private getScenarioDuration(type: string): number {
    const durations: Record<string, number> = {
      'objection-handling': 15,
      'product-detailing': 20,
      'closing': 10,
      'opening': 10
    };
    return durations[type] || 15;
  }

  private getLearningObjectives(type: string): string[] {
    const objectives: Record<string, string[]> = {
      'objection-handling': [
        'Identify and categorize common objections',
        'Apply evidence-based responses',
        'Build confidence in difficult conversations'
      ],
      'product-detailing': [
        'Master core product messages',
        'Effectively use visual aids',
        'Tailor message to audience needs'
      ],
      'closing': [
        'Recognize buying signals',
        'Create urgency without pressure',
        'Secure specific commitments'
      ],
      'opening': [
        'Establish rapport quickly',
        'Set collaborative agenda',
        'Uncover current challenges'
      ]
    };
    return objectives[type] || objectives['objection-handling'];
  }

  private getRelatedTrainingContent(type: string): any[] {
    return [
      { title: `Advanced ${type} Techniques`, format: 'video', duration: 30 },
      { title: 'Peer Best Practices Webinar', format: 'webinar', duration: 45 },
      { title: `${type} Quick Reference Guide`, format: 'pdf', pages: 5 },
      { title: 'Role Play Practice Sessions', format: 'live', duration: 60 }
    ];
  }

  private generateSubjectLine(purpose: string, hcp: any, history: any[]): string {
    const subjects: Record<string, string[]> = {
      'follow-up': [
        `Following up on our discussion about ${hcp.specialty} patient outcomes`,
        'Clinical data you requested - as promised',
        `Next steps for implementing our ${hcp.specialty} protocol`
      ],
      'introduction': [
        `Introducing breakthrough therapy for your ${hcp.specialty} patients`,
        `Dr. ${hcp.name.split(' ')[1]} - New treatment option now available`,
        'Addressing unmet needs in ' + hcp.specialty
      ],
      'event-invite': [
        `Exclusive invitation: ${hcp.specialty} Expert Symposium`,
        'Join us for dinner symposium with Dr. Johnson - May 15th',
        `Your expertise needed: ${hcp.specialty} Advisory Board`
      ],
      'resource-share': [
        'New patient education materials for your practice',
        `${hcp.specialty} dosing calculator and clinical tools`,
        'Updated treatment guidelines and protocols'
      ]
    };
    
    const options = subjects[purpose] || subjects['follow-up'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateEmailBody(purpose: string, hcp: any, rep: any, history: any[]): string {
    const templates: Record<string, string> = {
      'follow-up': `Dear Dr. ${hcp.name.split(' ')[1]},

Thank you for taking the time to meet with me yesterday. As promised, I'm sending you the clinical trial data we discussed regarding efficacy in patients with comorbidities.

Key highlights from the ADVANCE trial:
• 43% improvement in primary endpoint vs. standard of care
• Well-tolerated with manageable side effect profile
• Significant quality of life improvements at 12 months

I've attached the full publication and a patient selection tool that may be helpful for identifying appropriate candidates in your practice.

Would you be available for a brief call next week to discuss how we can support your first patients?

Best regards,
${rep.name}`,

      'introduction': `Dear Dr. ${hcp.name.split(' ')[1]},

I hope this email finds you well. I'm ${rep.name}, your new representative for [Product Name], and I'm excited to support your ${hcp.specialty} practice.

I understand you're seeing an increasing number of patients with [condition], and I wanted to share information about our recently approved treatment option that addresses many of the challenges you may be facing.

I'd welcome the opportunity to briefly discuss how we can support your practice and patients. Would you have 15 minutes available next week?

Best regards,
${rep.name}`,

      'event-invite': `Dear Dr. ${hcp.name.split(' ')[1]},

You're invited to an exclusive dinner symposium featuring Dr. Sarah Johnson presenting "Optimizing Outcomes in ${hcp.specialty}: New Perspectives."

Event Details:
• Date: Thursday, May 15th
• Time: 6:30 PM - 8:30 PM
• Location: The Capital Grille, Downtown
• CME Credits: 1.5 hours

Space is limited to ensure an intimate, discussion-focused environment. Please RSVP by May 8th.

Best regards,
${rep.name}`,

      'resource-share': `Dear Dr. ${hcp.name.split(' ')[1]},

Based on our recent discussion about patient education challenges, I wanted to share some new resources that might be helpful for your practice:

• Updated patient starter kit with simplified instructions
• Digital dosing calculator (mobile-friendly)
• Video tutorials for patient self-administration
• Insurance navigation checklist

All materials are available in English and Spanish. Would you like me to send physical copies for your office?

Best regards,
${rep.name}`
    };
    
    return templates[purpose] || templates['follow-up'];
  }

  private selectEmailAttachments(purpose: string, hcp: any): any[] {
    const attachments: Record<string, any[]> = {
      'follow-up': [
        { name: 'ADVANCE_Trial_Publication.pdf', size: '2.3 MB' },
        { name: 'Patient_Selection_Tool.pdf', size: '456 KB' }
      ],
      'introduction': [
        { name: 'Product_Overview.pdf', size: '1.8 MB' },
        { name: 'Dosing_Guide.pdf', size: '234 KB' }
      ],
      'event-invite': [
        { name: 'Event_Agenda.pdf', size: '156 KB' },
        { name: 'Speaker_Bio.pdf', size: '89 KB' }
      ],
      'resource-share': [
        { name: 'Patient_Education_Kit.pdf', size: '3.4 MB' },
        { name: 'Insurance_Checklist.pdf', size: '234 KB' },
        { name: 'Dosing_Calculator_Link.txt', size: '1 KB' }
      ]
    };
    
    return attachments[purpose] || [];
  }

  private generateCallToAction(purpose: string, hcp: any): string {
    const ctas: Record<string, string> = {
      'follow-up': 'Schedule a 15-minute call to discuss next steps',
      'introduction': 'Book a brief introductory meeting',
      'event-invite': 'RSVP for the dinner symposium',
      'resource-share': 'Download additional resources from our portal'
    };
    
    return ctas[purpose] || 'Learn more about our solutions';
  }

  private checkEmailCompliance(body: string): string[] {
    const warnings: any[] = [];
    
    if (body.toLowerCase().includes('guarantee')) {
      warnings.push('Avoid absolute guarantees about outcomes');
    }
    if (body.toLowerCase().includes('only')) {
      warnings.push('Be careful with exclusive claims');
    }
    if (!body.includes('side effect') && body.includes('efficacy')) {
      warnings.push('Consider mentioning balanced safety information');
    }
    
    return warnings;
  }

  private getEmailImprovementSuggestions(body: string, purpose: string): string[] {
    const suggestions: any[] = [];
    
    if (body.length > 500) {
      suggestions.push('Consider shortening for better engagement');
    }
    if (!body.includes('?')) {
      suggestions.push('Add a question to encourage response');
    }
    if (purpose === 'follow-up' && !body.includes('thank')) {
      suggestions.push('Add appreciation for their time');
    }
    
    return suggestions;
  }

  private calculatePersonalizationScore(body: string, hcp: any): number {
    let score = 60; // Base score
    
    if (body.includes(hcp.name)) score += 10;
    if (body.includes(hcp.specialty)) score += 10;
    if (body.includes(hcp.institution)) score += 10;
    if (body.includes('our discussion') || body.includes('you mentioned')) score += 10;
    
    return Math.min(score, 100);
  }

  private suggestBestSendTime(hcp: any, purpose: string): string {
    const times: Record<string, string> = {
      'follow-up': 'Tuesday-Thursday, 10:00 AM - 11:00 AM',
      'introduction': 'Tuesday-Wednesday, 8:00 AM - 9:00 AM',
      'event-invite': 'Monday-Tuesday, 2:00 PM - 3:00 PM',
      'resource-share': 'Wednesday-Thursday, 11:00 AM - 12:00 PM'
    };
    
    return times[purpose] || 'Tuesday-Thursday, 10:00 AM - 11:00 AM';
  }

  private getExistingAppointments(repId: string, week: number): any[] {
    const appointments: any[] = [];
    const types = ['In-Person Visit', 'Virtual Call', 'Lunch Meeting', 'Conference'];
    
    for (let i = 0; i < 5 + Math.floor(Math.random() * 10); i++) {
      appointments.push({
        day: Math.floor(Math.random() * 5) + 1,
        time: `${9 + Math.floor(Math.random() * 8)}:00`,
        duration: 30 + Math.floor(Math.random() * 60),
        type: types[Math.floor(Math.random() * types.length)],
        hcpName: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`
      });
    }
    
    return appointments;
  }

  private prioritizeHCPsForVisits(hcps: any[], existing: any[]): any[] {
    return hcps
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 20)
      .map(hcp => ({
        ...hcp,
        priority: hcp.decileRank >= 8 ? 'high' : hcp.decileRank >= 5 ? 'medium' : 'low',
        lastVisit: Math.floor(Math.random() * 30) + ' days ago',
        preferredTime: this.suggestBestTimeSlots(hcp)[0]
      }));
  }

  private optimizeVisitRoute(hcps: any[], homeLocation: string): any {
    // Simulate route optimization
    const totalDistance = 50 + Math.random() * 100;
    
    return {
      totalDistance: totalDistance,
      driveTime: totalDistance * 1.5,
      stops: hcps.length,
      efficiency: 85 + Math.random() * 10,
      co2Saved: (totalDistance * 0.1).toFixed(2) + ' kg',
      suggestedOrder: hcps.map(h => h.name)
    };
  }

  private generateOptimalTimeBlocks(route: any, existing: any[]): any[] {
    const blocks: any[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    days.forEach((day, index) => {
      const dayBlocks: any[] = [];
      let currentTime = 9;
      
      while (currentTime < 17) {
        if (Math.random() > 0.3) {
          dayBlocks.push({
            day: day,
            startTime: `${currentTime}:00`,
            endTime: `${currentTime + 1}:00`,
            activity: Math.random() > 0.5 ? 'HCP Visit' : 'Admin/Travel',
            location: 'Various',
            notes: 'Optimized for efficiency'
          });
        }
        currentTime += 1;
      }
      
      blocks.push(...dayBlocks);
    });
    
    return blocks;
  }

  private calculateScheduleMetrics(blocks: any[], hcps: any[]): any {
    const hcpVisits = blocks.filter(b => b.activity === 'HCP Visit').length;
    
    return {
      totalHCPsScheduled: hcpVisits,
      coverageRate: ((hcpVisits / hcps.length) * 100).toFixed(1) + '%',
      highValueCoverage: '85%',
      averageCallsPerDay: (hcpVisits / 5).toFixed(1),
      productivityScore: 82 + Math.random() * 10,
      utilizationRate: '78%'
    };
  }

  private identifyScheduleConflicts(proposed: any[], existing: any[]): any[] {
    // Simulate conflict detection
    if (Math.random() > 0.7) {
      return [{
        day: 'Tuesday',
        time: '2:00 PM',
        conflict: 'Double-booked with existing appointment',
        resolution: 'Suggest rescheduling to 3:00 PM'
      }];
    }
    return [];
  }

  private calculateBufferTime(blocks: any[]): string {
    const totalBlocks = blocks.length;
    const bufferBlocks = blocks.filter(b => b.activity === 'Admin/Travel').length;
    return ((bufferBlocks / totalBlocks) * 100).toFixed(1) + '%';
  }

  private calculateFlexibilityScore(blocks: any[]): number {
    // Score based on how much flexibility is built into schedule
    const bufferTime = blocks.filter(b => b.activity === 'Admin/Travel').length;
    const totalTime = blocks.length;
    
    return Math.min(100, (bufferTime / totalTime) * 200 + 60);
  }
}

// Type definitions
interface CallPlanningResult {
  hcpProfile: {
    name: string;
    specialty: string;
    institution: string;
    decileRank: number;
    prescribingTrend: string;
    preferredChannels: string[];
    lastInteraction: Date | null;
    keyInfluencers: string[];
  };
  meetingDetails: {
    type: string;
    estimatedDuration: number;
    bestTimeSlots: string[];
    location: string;
  };
  barriers: Array<{
    code: string;
    description: string;
    severity: string;
    talkingPoints: string[];
  }>;
  objectives: string[];
  talkingPoints: string[];
  recommendedContent: any[];
  personalizedOpening: string;
  competitorInsights: any;
  anticipatedObjections: any[];
  nextSteps: string[];
  successMetrics: {
    minimumObjectivesAchieved: number;
    targetEngagementScore: number;
    followUpTimeframe: string;
  };
}

interface TerritoryAnalytics {
  summary: any;
  segments: any;
  coverage: any;
  opportunities: any[];
  competitiveLandscape: any;
  performanceTrends: any;
  topPerformers: any[];
  atRiskAccounts: any[];
  whitespace: any;
  recommendations: string[];
}

interface CoachingScenarioResult {
  scenario: any;
  conversationFlow: any[];
  bestPractices: string[];
  evaluationCriteria: any[];
  feedbackPoints: any[];
  difficultyLevel: string;
  estimatedDuration: number;
  learningObjectives: string[];
  relatedContent: any[];
  performanceScore: number | null;
  completionCertificate: any | null;
}

interface EmailDraft {
  to: string;
  cc: string[];
  subject: string;
  body: string;
  attachments: any[];
  callToAction: string;
  complianceCheck: {
    passed: boolean;
    warnings: string[];
    suggestions: string[];
  };
  personalizationScore: number;
  estimatedReadTime: number;
  bestSendTime: string;
  trackingEnabled: boolean;
}

interface ScheduleOptimization {
  weekNumber: number;
  proposedSchedule: any[];
  routeOptimization: {
    totalDistance: number;
    estimatedDriveTime: number;
    fuelCost: number;
    co2Saved: string;
  };
  coverageMetrics: any;
  recommendations: string[];
  conflicts: any[];
  bufferTime: string;
  flexibilityScore: number;
}

// Export singleton instance
export const copilotIntelligence = CopilotIntelligenceService.getInstance();