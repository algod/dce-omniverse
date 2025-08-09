import { HCP, HCPBarrier } from '@/lib/agents/customer-planning';

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const specialties = ['Cardiology', 'Oncology', 'Neurology', 'Endocrinology', 'Rheumatology', 'Pulmonology', 'Gastroenterology', 'Nephrology'];

const barrierTypes: HCPBarrier['type'][] = ['insurance_denial', 'side_effects', 'referral_pathway', 'formulary', 'diagnostic_tool'];
const severities: HCPBarrier['severity'][] = ['low', 'medium', 'high'];

const barrierDescriptions: Record<HCPBarrier['type'], string> = {
  insurance_denial: 'Insurance denials or restrictions due to administrative confusion',
  side_effects: 'Managing side effects is challenging, requiring additional resources',
  referral_pathway: 'No/challenging referral pathways to get to the right specialist',
  formulary: 'Product not yet approved in organizational formulary',
  diagnostic_tool: 'Requires a new diagnostic test/tool not widely recognized'
};

export function generateMockHCPs(count: number = 100): HCP[] {
  const hcps: HCP[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    
    const numBarriers = Math.floor(Math.random() * 3) + 1;
    const barriers: HCPBarrier[] = [];
    const usedTypes = new Set<HCPBarrier['type']>();

    for (let j = 0; j < numBarriers; j++) {
      let type: HCPBarrier['type'];
      do {
        type = barrierTypes[Math.floor(Math.random() * barrierTypes.length)];
      } while (usedTypes.has(type));
      
      usedTypes.add(type);
      
      barriers.push({
        type,
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: barrierDescriptions[type]
      });
    }

    hcps.push({
      id: `HCP-${String(i + 1).padStart(4, '0')}`,
      name: `Dr. ${firstName} ${lastName}`,
      specialty,
      prescribingVolume: Math.floor(Math.random() * 500) + 50,
      barriers
    });
  }

  return hcps;
}

export interface Channel {
  name: string;
  currentBudget: number;
  minBudget: number;
  maxBudget: number;
  roi: number;
  mroi: number;
}

export const mockChannels: Channel[] = [
  { name: 'Field Sales', currentBudget: 2000000, minBudget: 1500000, maxBudget: 3000000, roi: 3.2, mroi: 2.8 },
  { name: 'Email Marketing', currentBudget: 500000, minBudget: 200000, maxBudget: 800000, roi: 4.5, mroi: 3.9 },
  { name: 'Web/Digital', currentBudget: 800000, minBudget: 400000, maxBudget: 1200000, roi: 5.1, mroi: 4.2 },
  { name: 'Speaker Programs', currentBudget: 1200000, minBudget: 800000, maxBudget: 1800000, roi: 2.9, mroi: 2.3 },
  { name: 'Conferences', currentBudget: 600000, minBudget: 300000, maxBudget: 1000000, roi: 2.5, mroi: 2.1 },
  { name: 'Digital Ads', currentBudget: 400000, minBudget: 100000, maxBudget: 700000, roi: 3.8, mroi: 3.2 }
];

export interface ContentAsset {
  id: string;
  title: string;
  type: 'email' | 'web' | 'print' | 'video' | 'interactive';
  theme: string;
  barrier: HCPBarrier['type'] | 'general';
  status: 'approved' | 'pending' | 'rejected' | 'expired';
  createdDate: Date;
  expiryDate: Date;
  mlrScore?: number;
  complianceIssues?: string[];
}

export function generateMockContent(count: number = 20): ContentAsset[] {
  const themes = ['Efficacy', 'Safety', 'Dosing', 'MOA', 'Clinical Studies', 'Patient Support', 'Access'];
  const types: ContentAsset['type'][] = ['email', 'web', 'print', 'video', 'interactive'];
  const statuses: ContentAsset['status'][] = ['approved', 'pending', 'rejected', 'expired'];

  const content: ContentAsset[] = [];

  for (let i = 0; i < count; i++) {
    const createdDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(createdDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    content.push({
      id: `CONT-${String(i + 1).padStart(4, '0')}`,
      title: `${themes[Math.floor(Math.random() * themes.length)]} ${types[Math.floor(Math.random() * types.length)]} Asset`,
      type: types[Math.floor(Math.random() * types.length)],
      theme: themes[Math.floor(Math.random() * themes.length)],
      barrier: Math.random() > 0.3 ? barrierTypes[Math.floor(Math.random() * barrierTypes.length)] : 'general',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdDate,
      expiryDate,
      mlrScore: Math.random() * 100,
      complianceIssues: Math.random() > 0.7 ? ['Missing safety information', 'Unclear claims'] : undefined
    });
  }

  return content;
}

export interface FieldSuggestionTrigger {
  id: string;
  name: string;
  description: string;
  criteria: string;
  insightLanguage: string;
  actionLanguage: string;
  priority: number;
  threshold: number;
  currentValue?: number;
  isActive: boolean;
}

export const fieldSuggestionTriggers: FieldSuggestionTrigger[] = [
  {
    id: 'TRIG-001',
    name: 'Speaker Program Follow-up',
    description: 'HCP attended speaker program without follow-up',
    criteria: 'Days since program > 7 AND no follow-up call',
    insightLanguage: 'Dr. [Name] attended our speaker program on [Date] but hasn\'t been contacted since',
    actionLanguage: 'Schedule a follow-up call to discuss key takeaways and address any questions',
    priority: 1,
    threshold: 7,
    currentValue: 12,
    isActive: true
  },
  {
    id: 'TRIG-002',
    name: 'Low Fulfillment Rate',
    description: 'Low/declining prescription fulfillment rate',
    criteria: 'Fulfillment rate < 60% OR declined > 10% MoM',
    insightLanguage: 'Prescription fulfillment rate has dropped to [X]% for Dr. [Name]\'s patients',
    actionLanguage: 'Discuss patient support programs and access solutions',
    priority: 2,
    threshold: 60,
    currentValue: 45,
    isActive: true
  },
  {
    id: 'TRIG-003',
    name: 'Positive Payer Coverage',
    description: 'High volume of patients with recent positive payer coverage',
    criteria: 'Covered lives > 1000 AND coverage improved in last 30 days',
    insightLanguage: '[Payer] recently improved coverage affecting [X] of Dr. [Name]\'s patients',
    actionLanguage: 'Share the positive coverage update and updated access resources',
    priority: 3,
    threshold: 1000,
    currentValue: 1500,
    isActive: true
  },
  {
    id: 'TRIG-004',
    name: 'Slowed Prescribing',
    description: 'Slowed prescribing pace',
    criteria: 'Prescriptions declined > 25% vs 3-month average',
    insightLanguage: 'Dr. [Name]\'s prescribing has decreased by [X]% over the past month',
    actionLanguage: 'Understand any concerns or barriers affecting prescribing decisions',
    priority: 4,
    threshold: 25,
    currentValue: 30,
    isActive: true
  },
  {
    id: 'TRIG-005',
    name: 'Single Prescription',
    description: 'Single prescription without continuation',
    criteria: 'One Rx in last 60 days AND no refills',
    insightLanguage: 'Dr. [Name] prescribed once [X] days ago but patient hasn\'t continued',
    actionLanguage: 'Follow up on initial patient experience and offer support resources',
    priority: 5,
    threshold: 60,
    currentValue: 45,
    isActive: true
  },
  {
    id: 'TRIG-006',
    name: 'Email Engagement',
    description: 'Email engagement indicating readiness to prescribe',
    criteria: 'Email clicks > 3 in last 14 days AND content = dosing/efficacy',
    insightLanguage: 'Dr. [Name] has engaged with [X] clinical emails recently',
    actionLanguage: 'Reach out to address specific clinical questions and provide samples',
    priority: 6,
    threshold: 3,
    currentValue: 5,
    isActive: true
  },
  {
    id: 'TRIG-007',
    name: 'High Potential',
    description: 'Early high-potential indicators',
    criteria: 'New prescriber AND specialty match AND high patient volume',
    insightLanguage: 'Dr. [Name] shows high potential based on specialty and patient demographics',
    actionLanguage: 'Introduce comprehensive product information and support programs',
    priority: 7,
    threshold: 100,
    currentValue: 150,
    isActive: true
  }
];