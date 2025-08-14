# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**DCE OmniVerse** is a next-generation omnichannel agentic AI solution for pharmaceutical companies in the US, featuring 6 intelligent AI agents in an interconnected agent-verse. This demonstration application showcases advanced AI capabilities for omnichannel planning and execution through a connected flow of agents, designed for presentation to senior pharmaceutical commercial leaders.

**Live Application**: https://dce-omniverse.vercel.app  
**GitHub Repository**: https://github.com/algod/dce-omniverse

## Agent-Verse Architecture

The DCE OmniVerse follows a logical flow where each agent's outputs feed into the next, creating a comprehensive omnichannel strategy:

```
Omni Agent (Master Orchestrator)
    ↓
Customer Planning (5-Module Workflow) → Budget Planning → Content Review → 
Omnichannel Orchestration → Field Suggestions → Field Copilot
```

### Omni Agent - Master Orchestrator
**Purpose**: Intelligent routing and orchestration across all agents
**Key Capabilities**:
- Detects user intent from natural language queries
- Extracts brand context and strategic objectives
- Activates appropriate agent workflows
- Manages inter-agent communication
- Visualizes workflow progression

**Workflow Detection**:
- "Who should be my priority customers?" → Activates Customer Planning Workflow
- "How should I allocate my budget?" → Routes to Budget Planning
- "Review content for approval" → Activates Content Review

### Design Philosophy
- **Barrier-Led Engagement**: Focus on identifying and resolving the 5 primary barriers preventing HCP adoption
- **Connected Intelligence**: Each agent builds upon insights from upstream agents
- **Interactive Q&A**: Users can interact with each agent through natural language queries
- **Real-time Visualization**: Dynamic charts and graphs update based on user interactions

## Technology Stack

- **AI Model**: Advanced AI Engine with explainable reasoning
- **Framework**: Next.js 14 with TypeScript
- **Deployment**: Vercel (serverless, auto-scaling)
- **Database**: Vercel Postgres + Vercel KV (Redis)
- **UI**: React, Tailwind CSS, Framer Motion, Recharts
- **Agent Framework**: Custom agent architecture with inter-agent communication
- **Design System**: ZS-inspired professional interface

## Core Modules (6 Agentic AI Agents)

### 1. Customer Planning Agent
**Position**: Start of flow - Intelligence Gathering
**Purpose**: Prioritization of high opportunity customers using barrier analysis through 5-module workflow
**Agent Reasoning**: Analyzes secondary data and field feedback to identify HCP barriers and predict sales opportunities

#### 5-Module Workflow Structure:

##### Module 1: Persona Analysis
- **Purpose**: Barrier inferencing and HCP classification
- **Tools**: Barrier Detection ML Model, Pattern Recognition Engine, HCP Behavioral Analytics
- **Process**: 
  - Analyzes 2,847 HCPs for barrier patterns
  - Runs probabilistic barrier detection
  - Maps HCPs to 5 primary barriers
  - Calculates barrier prevalence and severity
- **User Interaction**: Review distribution, adjust weights, approve

##### Module 2: Performance Metrics
- **Purpose**: KPI selection and historical analysis
- **Tools**: KPI Calculator, Trend Analysis Engine, Competitive Intelligence
- **Process**:
  - Selects KPIs based on brand objectives
  - Processes 24 months of historical data
  - Segments HCPs into performance quintiles
  - Identifies trends and patterns
- **User Interaction**: Review KPIs, validate segments, approve

##### Module 3: Potential Prediction
- **Purpose**: ML-based opportunity forecasting
- **Tools**: Predictive Analytics Suite, Model Tuning Framework, Opportunity Calculator
- **Process**:
  - Configures breadth and depth prediction models
  - Trains ensemble models (Random Forest + XGBoost)
  - Generates opportunity predictions per HCP
  - Validates against holdout dataset
- **Output**: Depth ($285K avg) and Breadth ($142K avg) opportunities

##### Module 4: Preference Mapping
- **Purpose**: Channel and content affinity analysis
- **Tools**: Collaborative Filtering Engine, Engagement Analytics, Channel Optimizer
- **Process**:
  - Analyzes historical engagement data
  - Runs collaborative filtering algorithms
  - Scores channel preferences (Field, Email, Virtual, Web)
  - Maps content type affinity
- **Output**: Optimal engagement frequency (2.3 touches/month)

##### Module 5: Microsegmentation
- **Purpose**: Strategic prioritization using 4P framework
- **Tools**: Segmentation Engine, Priority Matrix Builder, ROI Calculator
- **Process**:
  - Combines all 4P factors (Persona, Performance, Potential, Preference)
  - Creates 5 distinct microsegments
  - Generates 3 prioritization options:
    - Growth Focus: Champions, Growers, Converters (+45% expected growth)
    - Efficiency Focus: Champions, Maintainers, Defenders (+32% ROI improvement)
    - Balanced Approach: All segments weighted (+28% overall performance)
- **User Interaction**: Select strategy, confirm segments, finalize

**Key Actions**:
- Identifies and analyzes 5 primary barriers affecting HCP prescribing
- Runs predictive models for sales depth/breadth opportunities
- Prioritizes customers for field and/or digital promotion
- Generates "The Play" framework for barrier-specific engagement

**Interactive Q&A Examples**:
- "Which barriers are most prevalent in my territory?"
- "Show me high-opportunity HCPs with referral pathway barriers"
- "Adjust the relative importance of side effects barrier"

**Business Inputs**:
- Brand objectives and priorities
- Relevant barriers confirmation
- Relative importance weights

**Outputs** → Budget Planning:
- Prioritized HCP list with opportunity scores
- Barrier analysis by HCP
- Engagement recommendations

**Visualizations**:
- Barrier prevalence heatmap
- HCP opportunity scatter plot (depth vs breadth)
- Barrier distribution by segment

### 2. Budget Planning Agent
**Position**: Second in flow - Resource Allocation
**Purpose**: Optimal budget allocation across promotional channels with ROI maximization
**Agent Reasoning**: Uses impact attribution analysis and response curves to optimize channel mix
**Key Actions**:
- Analyzes historical response curves for each channel
- Optimizes budget allocation with constraints
- Calculates ROI and mROI for each scenario
- Breaks down to quarterly HCP-level engagement plans

**Interactive Q&A Examples**:
- "What's the optimal allocation for $15M budget?"
- "Show ROI impact of shifting $500K from conferences to digital"
- "Which channels are approaching saturation?"

**Business Inputs**:
- Channel constraints (min/max budgets)
- Optimization scenarios
- Forward-looking assumptions

**Outputs** → Content Review:
- Optimal channel budgets
- Expected ROI by channel
- HCP engagement frequency plans

**Visualizations**:
- Response curves by channel
- ROI waterfall chart
- Budget allocation pie chart
- Saturation analysis gauges

### 3. Content Review Agent
**Position**: Third in flow - Message Preparation
**Purpose**: Content management and accelerated MLR approval process
**Agent Reasoning**: Maps content to barriers and ensures compliance while identifying gaps
**Key Actions**:
- Maps message themes to customer barriers
- Conducts MLR compliance assessment
- Identifies content gaps by barrier and channel
- Coordinates new content production

**Interactive Q&A Examples**:
- "Which content addresses referral pathway barriers?"
- "Show MLR approval status for pending assets"
- "What content gaps exist for email channel?"

**Business Inputs**:
- Message theme priorities
- Content approval criteria
- Asset retirement decisions

**Outputs** → Orchestration:
- Approved content library
- Content-barrier mapping
- Gap analysis recommendations

**Visualizations**:
- Content coverage heatmap
- MLR compliance dashboard
- Content calendar timeline
- Gap analysis by barrier

### 4. AI-based Orchestration Agent
**Position**: Fourth in flow - Journey Optimization
**Purpose**: Customer journey optimization and Next Best Action recommendations
**Agent Reasoning**: Uses BERT model for behavior prediction and genetic algorithms for sequence optimization
**Key Actions**:
- Trains customer behavior models
- Optimizes engagement sequences
- Generates explainable NBA recommendations
- Visualizes customer journeys

**Interactive Q&A Examples**:
- "Explain why this sequence was recommended for Dr. Smith"
- "Show model performance metrics"
- "What's the expected conversion rate for this journey?"

**Business Inputs**:
- Model training parameters
- Journey constraints
- Success metrics definition

**Outputs** → Field Suggestions:
- Optimized customer journeys
- NBA recommendations
- Model explainability insights

**Visualizations**:
- Customer journey flow diagrams
- Model performance metrics
- Feature importance charts
- Conversion funnel analysis

### 5. Field Suggestion Design Agent for HQ
**Position**: Fifth in flow - Field Enablement
**Purpose**: Design and monitor field suggestions aligned with brand objectives
**Agent Reasoning**: Balances trigger volume, quality, and field capacity while incorporating feedback
**Key Actions**:
- Configures 7 trigger types with thresholds
- Monitors field feedback and adoption
- Adjusts triggers based on performance
- Implements 40/40/20 prioritization (rep feedback/strategic priority/behavior severity)

**Interactive Q&A Examples**:
- "Which triggers have highest completion rates?"
- "Show field feedback sentiment by trigger"
- "Adjust speaker program follow-up sensitivity"

**Business Inputs**:
- Trigger activation decisions
- Volume constraints
- Priority adjustments

**Outputs** → Field Copilot:
- Active trigger configurations
- Prioritized suggestions
- Performance insights

**Visualizations**:
- Trigger performance dashboard
- Feedback sentiment analysis
- Volume trend charts
- Adoption heatmap by territory

### 6. Field Copilot Agent
**Position**: End of flow - Execution Support
**Purpose**: AI assistant for sales reps supporting field activities
**Agent Reasoning**: Synthesizes all upstream intelligence for actionable field guidance
**Key Actions**:
- Generates pre-call planning summaries
- Provides virtual coaching scenarios
- Assists with scheduling and email drafting
- Records call notes and feedback

**Interactive Q&A Examples**:
- "Prepare pre-call plan for my 2pm appointment"
- "What are the key barriers for this HCP?"
- "Draft follow-up email addressing formulary concerns"

**Business Inputs**:
- Rep queries and requests
- Call notes and feedback
- Territory priorities

**Outputs** → Customer Planning (Feedback Loop):
- Field feedback on barriers
- Engagement outcomes
- Customer insights

**Visualizations**:
- Territory performance map
- HCP profile cards
- Call calendar view
- Coaching scenario results

## The 5 Primary Barriers

All agents reference and work to address these core barriers:

1. **B001**: No/challenging referral pathways to get to the right specialist
2. **B002**: Managing side effects is challenging, requiring additional resources
3. **B003**: Insurance denials or restrictions due to administrative confusion
4. **B004**: Product/brand not yet approved in organizational formulary
5. **B005**: Requires a new diagnostic test/tool not widely recognized

## Design System (ZS-Inspired)

### Color Palette
```css
--primary: #002B5C;      /* Deep Navy Blue */
--secondary: #0075BE;    /* Bright Blue */
--accent: #00A3E0;       /* Light Blue */
--success: #4CAF50;      /* Green */
--warning: #FF9800;      /* Orange */
--error: #F44336;        /* Red */
--background: #FFFFFF;   /* White */
--surface: #F5F5F5;      /* Light Gray */
--text-primary: #212121; /* Dark Gray */
--text-secondary: #757575; /* Medium Gray */
```

### Typography
- **Headings**: Inter, -apple-system, Helvetica Neue
- **Body**: Open Sans, Source Sans Pro, sans-serif
- **Code**: JetBrains Mono, Roboto Mono, monospace

## Interactive Features

### Workflow Execution
**Module Progression**:
- Status tracking: `pending` → `active` → `review` → `approved`
- Real-time progress bars with percentage completion
- Visual indicators for each module state
- User approval required before progression

### Agent Q&A Interface
Each agent page features a split-view layout:
- **Left Panel (40%)**: Interactive chat for Q&A, parameter adjustments, and scenario exploration
- **Right Panel (60%)**: Dynamic visualizations that update based on interactions

### Agent Reasoning Panel
**Real-time Thinking Display**:
- Shows step-by-step agent reasoning
- Confidence scores for each decision
- Tool usage indicators
- Processing animations
- Expandable/collapsible interface

### Module Executor
**Execution Visualization**:
- Step-by-step processing display
- Tool activation tracking
- Execution logging with timestamps
- Progress bars and metrics
- Live status updates

### Re-run Capabilities
Users can modify parameters and re-run analyses in real-time:
- Adjust barrier weights
- Change budget constraints
- Modify trigger sensitivities
- Update model parameters

### Downstream Impact Preview
Before confirming changes, users can preview how modifications will affect downstream agents

## Field Suggestion Triggers

Seven prioritized triggers configured for the field suggestion system:
1. HCP attended speaker program without follow-up (Priority 1)
2. Low/declining prescription fulfillment rate (Priority 2)
3. High volume of patients with recent positive payer coverage (Priority 3)
4. Slowed prescribing pace (Priority 4)
5. Single prescription without continuation (Priority 5)
6. Email engagement indicating readiness to prescribe (Priority 6)
7. Early high-potential indicators (Priority 7)

## Key Data Sources

- HCP prescribing data (24 months historical)
- Patient claims and specialty pharmacy data
- Referral networks and hub data
- Practice economics and workflows
- Promotional activity and engagement metrics
- Digital engagement signals
- Field feedback and CRM data

## Application Architecture

### Frontend Structure
```
/app
  /page.tsx              # Agent-verse dashboard with flow visualization
  /agents
    /omni                # Omni Agent master orchestrator
    /customer            # Customer Planning with 5-module workflow
    /engagement          # Budget Planning (formerly /budget)
    /content             # Content Review
    /orchestration       # AI-based Orchestration
    /activation          # Digital Activation
    /copilot             # Field Copilot
  /api
    /agents              # Agent-specific endpoints
    /chat                # Q&A processing endpoints
/components
  /agents
    CustomerPlanningWorkflow.tsx  # 5-module workflow orchestrator
    ModuleExecutor.tsx            # Individual module execution engine
    AgentReasoningPanel.tsx       # Real-time agent reasoning display
    ModuleChatInterface.tsx       # Interactive chat for each module
  /agent-verse           # Agent flow and interaction components
    FlowVisualizationClean.tsx    # Main dashboard visualization
    WorkflowVisualization.tsx     # Workflow progress display
  /design-system         # ZS-inspired UI components
  /charts                # Interactive visualizations
/lib
  /workflows
    customer-priority-workflow.ts  # Customer planning workflow logic
    content-approval-workflow.ts   # Content approval workflow
  /contexts              # React contexts for state management
  /agents                # Agent logic and reasoning
  /types                 # TypeScript definitions
  /data                  # Mock data generators
```

## Demo Features

### Executive Presentation Mode
- Agent-verse flow visualization
- Interactive Q&A demonstrations
- Real-time impact analysis
- Barrier-led engagement showcase

### Customer Planning Workflow Demo
1. **Initiation**: User asks "Who should be my priority customers?"
2. **Brand Context**: System extracts therapeutic area and objectives
3. **Module Progression**: 
   - Each module processes with visible reasoning
   - User sees real-time visualizations
   - Chat interface for Q&A at each step
   - Approval before next module
4. **Final Output**:
   - 423 prioritized HCPs identified
   - $45M total opportunity calculated
   - 3 microsegmentation strategies presented
   - Results passed to downstream agents

### Interactive Capabilities
- Natural language queries
- Parameter adjustments
- Scenario comparisons
- What-if analysis
- Feedback incorporation

## Development Guidelines

### Performance Requirements
- Page load time < 2 seconds
- Q&A response time < 1 second
- Smooth animations at 60fps
- Real-time visualization updates

### User Experience Principles
- Clear visual hierarchy
- Consistent interaction patterns
- Progressive disclosure of complexity
- Contextual help and explanations

## Important Notes

- **Target Audience**: Senior pharmaceutical commercial leaders
- **Demo Focus**: Interactive exploration of connected AI agents
- **Key Differentiator**: Barrier-led approach with explainable AI reasoning
- **Presentation Ready**: Optimized for live demonstrations with Q&A
- **Workflow Innovation**: 5-module Customer Planning with real-time agent reasoning
- **User Control**: Approval workflow at each module for transparency
- **Visual Excellence**: Dynamic visualizations update based on module outputs

## Deployment

- **Production URL**: https://dce-omniverse.vercel.app
- **Platform**: Vercel (automatic deployments from main branch)
- **GitHub**: https://github.com/algod/dce-omniverse
- **Environment**: Next.js 14, TypeScript, Tailwind CSS

## Success Metrics

- **User Engagement**: Interactive Q&A usage rate
- **System Performance**: Real-time response and visualization updates
- **Demo Effectiveness**: Clear demonstration of agent interconnections
- **Business Value**: ROI improvement and barrier resolution rates