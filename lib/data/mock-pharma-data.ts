// Comprehensive mock pharma data generator
import { 
  HCP, PrescribingData, PatientMix, Engagement, Channel, 
  HCPOpportunity, Territory, NextBestAction, CustomerJourney,
  FieldSuggestion, ContentAsset, PHARMA_BARRIERS
} from '@/lib/types/pharma';

// Generate realistic HCP data
export function generateHCPs(count: number = 100): HCP[] {
  const specialties = ['Cardiology', 'Endocrinology', 'Neurology', 'Oncology', 'Rheumatology', 'Pulmonology'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Lisa'];
  const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Chen'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `HCP-${String(i + 1).padStart(3, '0')}`,
    name: `Dr. ${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / 8) % lastNames.length]}`,
    specialty: specialties[i % specialties.length],
    npi: `${1000000000 + i}`,
    degree: ['MD', 'DO', 'MD, PhD'][i % 3],
    address: {
      street: `${100 + i} Medical Plaza`,
      city: cities[i % cities.length],
      state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'][i % 6],
      zip: `${10000 + (i * 137) % 90000}`
    },
    practice: {
      name: `${cities[i % cities.length]} ${['Medical Center', 'Health System', 'Clinic', 'Associates'][i % 4]}`,
      type: ['Hospital', 'Private Practice', 'Clinic', 'Academic Medical Center'][i % 4] as any,
      size: ['Small', 'Medium', 'Large'][i % 3] as any
    },
    tier: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] as any,
    segment: ['High Prescriber', 'Growth Potential', 'Maintain', 'Monitor'][i % 4],
    decile: Math.floor(Math.random() * 10) + 1,
    territory: `T-${String((i % 20) + 1).padStart(2, '0')}`,
    region: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'][i % 5],
    lastCallDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    nextScheduledCall: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
  }));
}

// Generate prescribing data
export function generatePrescribingData(hcpIds: string[]): PrescribingData[] {
  return hcpIds.flatMap(hcpId => {
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
    return months.map(period => {
      const totalRx = Math.floor(Math.random() * 100) + 20;
      const newRx = Math.floor(totalRx * 0.3);
      const brandRx = Math.floor(totalRx * (0.2 + Math.random() * 0.4));
      
      return {
        hcpId,
        period,
        totalRx,
        newRx,
        refills: totalRx - newRx,
        brandRx,
        competitorRx: Math.floor(totalRx * 0.3),
        marketShare: brandRx / totalRx,
        trend: ['Increasing', 'Stable', 'Declining'][Math.floor(Math.random() * 3)] as any,
        avgDaysSupply: 30,
        discontinuationRate: Math.random() * 0.2,
        switchRate: Math.random() * 0.1
      };
    });
  });
}

// Generate patient mix data
export function generatePatientMix(hcpIds: string[]): PatientMix[] {
  return hcpIds.map(hcpId => {
    const totalPatients = Math.floor(Math.random() * 500) + 100;
    return {
      hcpId,
      totalPatients,
      newPatients: Math.floor(totalPatients * 0.2),
      demographics: {
        ageGroups: {
          '18-34': Math.floor(totalPatients * 0.15),
          '35-54': Math.floor(totalPatients * 0.35),
          '55-64': Math.floor(totalPatients * 0.25),
          '65+': Math.floor(totalPatients * 0.25)
        },
        gender: {
          male: Math.floor(totalPatients * 0.45),
          female: Math.floor(totalPatients * 0.55)
        },
        insurance: {
          commercial: Math.floor(totalPatients * 0.4),
          medicare: Math.floor(totalPatients * 0.3),
          medicaid: Math.floor(totalPatients * 0.2),
          cash: Math.floor(totalPatients * 0.1)
        }
      },
      diseaseStage: {
        early: Math.floor(totalPatients * 0.3),
        moderate: Math.floor(totalPatients * 0.5),
        severe: Math.floor(totalPatients * 0.2)
      },
      comorbidities: ['Hypertension', 'Diabetes', 'Obesity', 'Depression'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  });
}

// Generate engagement history
export function generateEngagements(hcpIds: string[], count: number = 500): Engagement[] {
  const channels = ['Field', 'Email', 'Web', 'Phone', 'Virtual', 'Conference', 'Speaker Program'];
  const types = ['Detail', 'Sample', 'Education', 'Service', 'Event'];
  const content = ['Efficacy Data', 'Safety Profile', 'Dosing Guide', 'Patient Support', 'Clinical Studies'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ENG-${String(i + 1).padStart(4, '0')}`,
    hcpId: hcpIds[Math.floor(Math.random() * hcpIds.length)],
    date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    channel: channels[Math.floor(Math.random() * channels.length)] as any,
    type: types[Math.floor(Math.random() * types.length)] as any,
    duration: Math.floor(Math.random() * 30) + 5,
    content: content.slice(0, Math.floor(Math.random() * 3) + 1),
    response: ['Positive', 'Neutral', 'Negative', 'No Response'][Math.floor(Math.random() * 4)] as any,
    nextAction: Math.random() > 0.5 ? 'Follow-up call scheduled' : undefined,
    cost: Math.random() * 500 + 50
  }));
}

// Generate channel budget data
export function generateChannels(): Channel[] {
  return [
    {
      id: 'CH001',
      name: 'Field Sales',
      vendor: 'Internal',
      type: 'Personal',
      currentBudget: 5000000,
      proposedBudget: 5500000,
      actualSpend: 4800000,
      roi: 3.2,
      mroi: 2.8,
      responseCurve: {
        points: [
          { spend: 1000000, response: 2000000 },
          { spend: 3000000, response: 8000000 },
          { spend: 5000000, response: 12000000 },
          { spend: 7000000, response: 14000000 }
        ],
        saturationPoint: 6000000
      },
      constraints: { min: 3000000, max: 7000000 }
    },
    {
      id: 'CH002',
      name: 'Email Marketing',
      vendor: 'Veeva',
      type: 'Digital',
      currentBudget: 1500000,
      proposedBudget: 1800000,
      actualSpend: 1400000,
      roi: 4.5,
      mroi: 3.8,
      responseCurve: {
        points: [
          { spend: 500000, response: 2000000 },
          { spend: 1000000, response: 4000000 },
          { spend: 1500000, response: 5500000 },
          { spend: 2000000, response: 6500000 }
        ],
        saturationPoint: 1800000
      },
      constraints: { min: 500000, max: 2500000 }
    },
    {
      id: 'CH003',
      name: 'Web/Digital',
      vendor: 'Adobe',
      type: 'Digital',
      currentBudget: 2000000,
      proposedBudget: 2200000,
      actualSpend: 1900000,
      roi: 3.8,
      mroi: 3.2,
      responseCurve: {
        points: [
          { spend: 500000, response: 1500000 },
          { spend: 1500000, response: 5000000 },
          { spend: 2500000, response: 7500000 },
          { spend: 3500000, response: 9000000 }
        ],
        saturationPoint: 3000000
      },
      constraints: { min: 1000000, max: 3500000 }
    },
    {
      id: 'CH004',
      name: 'Speaker Programs',
      vendor: 'EventCo',
      type: 'Event',
      currentBudget: 3000000,
      proposedBudget: 3200000,
      actualSpend: 2800000,
      roi: 2.5,
      mroi: 2.1,
      responseCurve: {
        points: [
          { spend: 1000000, response: 2000000 },
          { spend: 2000000, response: 4500000 },
          { spend: 3000000, response: 6000000 },
          { spend: 4000000, response: 7000000 }
        ],
        saturationPoint: 3500000
      },
      constraints: { min: 1500000, max: 4000000 }
    },
    {
      id: 'CH005',
      name: 'Conferences',
      vendor: 'Various',
      type: 'Event',
      currentBudget: 2500000,
      proposedBudget: 2700000,
      actualSpend: 2400000,
      roi: 2.8,
      mroi: 2.3,
      responseCurve: {
        points: [
          { spend: 1000000, response: 2500000 },
          { spend: 2000000, response: 5000000 },
          { spend: 3000000, response: 6500000 },
          { spend: 4000000, response: 7500000 }
        ],
        saturationPoint: 3200000
      },
      constraints: { min: 1500000, max: 3500000 }
    },
    {
      id: 'CH006',
      name: 'Non-Personal Promotion',
      vendor: 'Multi-vendor',
      type: 'Non-Personal',
      currentBudget: 1000000,
      proposedBudget: 1200000,
      actualSpend: 950000,
      roi: 3.5,
      mroi: 2.9,
      responseCurve: {
        points: [
          { spend: 300000, response: 900000 },
          { spend: 700000, response: 2200000 },
          { spend: 1200000, response: 3500000 },
          { spend: 1700000, response: 4200000 }
        ],
        saturationPoint: 1500000
      },
      constraints: { min: 500000, max: 2000000 }
    }
  ];
}

// Generate HCP opportunities with barrier analysis
export function generateHCPOpportunities(hcpIds: string[]): HCPOpportunity[] {
  return hcpIds.map(hcpId => {
    const barriers = PHARMA_BARRIERS.slice(0, Math.floor(Math.random() * 3) + 1).map(barrier => ({
      barrierId: barrier.id,
      likelihood: Math.random(),
      impact: Math.random()
    }));
    
    const depthOpp = Math.random() * 100;
    const breadthOpp = Math.random() * 100;
    const opportunityScore = (depthOpp + breadthOpp) / 2;
    
    return {
      hcpId,
      opportunityScore,
      depthOpportunity: depthOpp,
      breadthOpportunity: breadthOpp,
      barriers,
      priorityLevel: opportunityScore > 70 ? 'High' : opportunityScore > 40 ? 'Medium' : 'Low',
      recommendedChannels: ['Field', 'Email', 'Speaker Program'].slice(0, Math.floor(Math.random() * 2) + 1),
      estimatedValue: Math.floor(opportunityScore * 1000 + Math.random() * 50000)
    };
  });
}

// Generate customer journeys
export function generateCustomerJourneys(hcpIds: string[]): CustomerJourney[] {
  const stages = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'];
  
  return hcpIds.slice(0, 20).map(hcpId => {
    const currentStageIndex = Math.floor(Math.random() * 4);
    
    return {
      hcpId,
      stages: stages.map((name, index) => ({
        name: name as any,
        status: index < currentStageIndex ? 'Completed' : index === currentStageIndex ? 'In Progress' : 'Not Started',
        engagementLevel: index <= currentStageIndex ? ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as any : 'Low',
        startDate: index <= currentStageIndex ? new Date(Date.now() - (5 - index) * 30 * 24 * 60 * 60 * 1000) : undefined,
        completionDate: index < currentStageIndex ? new Date(Date.now() - (4 - index) * 30 * 24 * 60 * 60 * 1000) : undefined,
        touchpoints: index <= currentStageIndex ? Math.floor(Math.random() * 10) + 3 : 0,
        keyActivities: index <= currentStageIndex ? ['Email sent', 'Call completed', 'Sample delivered'].slice(0, Math.floor(Math.random() * 3) + 1) : []
      })),
      currentStage: stages[currentStageIndex],
      predictedNextStage: stages[Math.min(currentStageIndex + 1, 4)],
      completionProbability: 0.6 + Math.random() * 0.3,
      recommendedSequence: [
        {
          step: 1,
          channel: 'Email',
          content: 'Clinical trial results',
          timing: 'Within 48 hours',
          expectedImpact: 85,
          reasoning: 'HCP showed interest in efficacy data during last call'
        },
        {
          step: 2,
          channel: 'Field',
          content: 'Safety comparison',
          timing: 'Next week',
          expectedImpact: 78,
          reasoning: 'Follow up on email engagement with detailed discussion'
        },
        {
          step: 3,
          channel: 'Speaker Program',
          content: 'Peer experience sharing',
          timing: 'Within 2 weeks',
          expectedImpact: 72,
          reasoning: 'Peer influence effective for this HCP profile'
        }
      ],
      barriers: PHARMA_BARRIERS.slice(0, Math.floor(Math.random() * 2) + 1).map(b => b.id)
    };
  });
}

// Generate field suggestions
export function generateFieldSuggestions(hcpIds: string[]): FieldSuggestion[] {
  const triggers = [
    'HCP attended speaker program without follow-up',
    'Low prescription fulfillment rate detected',
    'Positive payer coverage change',
    'Slowed prescribing pace',
    'Email engagement spike'
  ];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `FS-${String(i + 1).padStart(3, '0')}`,
    triggerId: `TR-${String((i % 5) + 1).padStart(2, '0')}`,
    triggerName: triggers[i % triggers.length],
    hcpId: hcpIds[Math.floor(Math.random() * Math.min(hcpIds.length, 30))],
    priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as any,
    status: ['Active', 'Completed', 'Dismissed', 'Expired'][Math.floor(Math.random() * 4)] as any,
    createdDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
    insight: 'Data indicates opportunity for engagement based on recent activity patterns',
    recommendedAction: 'Schedule follow-up call to discuss clinical benefits and address any concerns',
    feedback: Math.random() > 0.3 ? {
      useful: Math.random() > 0.2,
      reason: 'Timely and relevant suggestion',
      completedDate: new Date()
    } : undefined
  }));
}

// Generate content assets
export function generateContentAssets(): ContentAsset[] {
  const themes = ['Efficacy', 'Safety', 'Dosing', 'Patient Support', 'Clinical Studies', 'MOA', 'Access'];
  const types = ['Email', 'Web', 'Print', 'Video', 'Interactive', 'IVA'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `CA-${String(i + 1).padStart(3, '0')}`,
    title: `${themes[i % themes.length]} ${types[i % types.length]} Asset ${i + 1}`,
    type: types[i % types.length] as any,
    theme: themes[i % themes.length],
    barrier: Math.random() > 0.3 ? PHARMA_BARRIERS[Math.floor(Math.random() * PHARMA_BARRIERS.length)].id : undefined,
    status: ['Draft', 'In Review', 'Approved', 'Live', 'Expired', 'Retired'][Math.floor(Math.random() * 6)] as any,
    createdDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    approvedDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 150 * 24 * 60 * 60 * 1000) : undefined,
    expiryDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000),
    mlrScore: 60 + Math.random() * 40,
    complianceIssues: Math.random() > 0.7 ? ['Missing safety information', 'Claims need substantiation'] : [],
    performanceMetrics: {
      impressions: Math.floor(Math.random() * 10000),
      clicks: Math.floor(Math.random() * 1000),
      engagement: Math.random(),
      conversions: Math.floor(Math.random() * 100)
    },
    tags: themes.slice(0, Math.floor(Math.random() * 3) + 1)
  }));
}

// Generate territories
export function generateTerritories(): Territory[] {
  const regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
  const repNames = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'Chris Brown'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const target = 40 + Math.floor(Math.random() * 20);
    const actual = Math.floor(target * (0.7 + Math.random() * 0.5));
    
    return {
      id: `T-${String(i + 1).padStart(2, '0')}`,
      name: `Territory ${i + 1}`,
      region: regions[i % regions.length],
      repId: `REP-${String(i + 1).padStart(3, '0')}`,
      repName: repNames[i % repNames.length],
      hcpCount: 50 + Math.floor(Math.random() * 100),
      targetCalls: target,
      actualCalls: actual,
      attainment: actual / target,
      topOpportunities: [
        'High-value HCPs with improved access',
        'Speaker program attendees need follow-up',
        'New prescribers showing engagement'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      challenges: [
        'Hospital access restrictions',
        'Competitive pressure',
        'HCP availability'
      ].slice(0, Math.floor(Math.random() * 2) + 1)
    };
  });
}

// Generate Next Best Actions
export function generateNextBestActions(hcpIds: string[]): NextBestAction[] {
  const actions = [
    { action: 'Send clinical trial results', channel: 'Email', timing: 'Within 48 hours' },
    { action: 'Schedule follow-up call', channel: 'Field', timing: 'Next week' },
    { action: 'Invite to speaker program', channel: 'Event', timing: 'Within 2 weeks' },
    { action: 'Share patient support materials', channel: 'Web', timing: 'Immediately' },
    { action: 'Provide dosing calculator', channel: 'Digital', timing: 'Within 3 days' }
  ];
  
  return hcpIds.slice(0, 30).map((hcpId, i) => {
    const selectedAction = actions[i % actions.length];
    return {
      hcpId,
      actionId: `NBA-${String(i + 1).padStart(3, '0')}`,
      action: selectedAction.action,
      channel: selectedAction.channel,
      content: 'Personalized content based on HCP profile',
      timing: selectedAction.timing,
      priority: Math.floor(Math.random() * 10) + 1,
      expectedImpact: 60 + Math.random() * 35,
      confidence: 0.7 + Math.random() * 0.25,
      reasoning: 'Based on recent engagement patterns and predictive modeling',
      alternativeActions: actions.slice(1, 3).map(a => ({
        action: a.action,
        impact: 50 + Math.random() * 30
      }))
    };
  });
}

// Main data export
export function generateCompletePharmaData() {
  const hcps = generateHCPs(100);
  const hcpIds = hcps.map(h => h.id);
  
  return {
    hcps,
    prescribingData: generatePrescribingData(hcpIds.slice(0, 20)),
    patientMix: generatePatientMix(hcpIds.slice(0, 20)),
    engagements: generateEngagements(hcpIds),
    channels: generateChannels(),
    hcpOpportunities: generateHCPOpportunities(hcpIds),
    customerJourneys: generateCustomerJourneys(hcpIds),
    fieldSuggestions: generateFieldSuggestions(hcpIds),
    contentAssets: generateContentAssets(),
    territories: generateTerritories(),
    nextBestActions: generateNextBestActions(hcpIds),
    barriers: PHARMA_BARRIERS
  };
}