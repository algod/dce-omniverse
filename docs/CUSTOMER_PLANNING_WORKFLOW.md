# Customer Planning Workflow - Implementation Guide

## Overview
The Customer Planning Workflow is a sophisticated multi-module agentic system that guides users through comprehensive customer prioritization and microsegmentation analysis.

## Workflow Architecture

### Entry Points
1. **Omni Agent**: Ask "Who should be my priority customers?"
2. **Customer Planning Page**: Click "Start Analysis" button
3. **Direct Navigation**: Visit `/agents/customer` and start workflow

## 5-Module Structure

### 1. Persona Analysis Module
- **Purpose**: Barrier inferencing and HCP classification
- **Tools**: 
  - Barrier Detection ML Model
  - Pattern Recognition Engine
  - HCP Behavioral Analytics
- **Output**: Distribution of 2,847 HCPs across 5 primary barriers
- **Interaction**: Review barrier distribution, adjust weights, approve

### 2. Performance Metrics Module
- **Purpose**: KPI selection and historical analysis
- **Tools**:
  - KPI Calculator
  - Trend Analysis Engine
  - Competitive Intelligence
- **Output**: HCP segmentation into High Performers, Growth Potential, and Maintain
- **Interaction**: Review KPIs, validate segments, approve

### 3. Potential Prediction Module
- **Purpose**: ML-based opportunity forecasting
- **Tools**:
  - Predictive Analytics Suite
  - Model Tuning Framework
  - Opportunity Calculator
- **Output**: Depth ($285K) and Breadth ($142K) opportunities per HCP
- **Interaction**: Review predictions, adjust thresholds, approve

### 4. Preference Mapping Module
- **Purpose**: Channel and content affinity analysis
- **Tools**:
  - Collaborative Filtering Engine
  - Engagement Analytics
  - Channel Optimizer
- **Output**: Channel preferences and optimal engagement frequency
- **Interaction**: Review preferences, validate cadence, approve

### 5. Microsegmentation Module
- **Purpose**: Strategic prioritization
- **Tools**:
  - Segmentation Engine
  - Priority Matrix Builder
  - ROI Calculator
- **Output**: 3 prioritization options (Growth, Efficiency, Balanced)
- **Interaction**: Select strategy, confirm segments, finalize

## Key Components

### 1. CustomerPlanningWorkflow.tsx
Main orchestrator component that manages the entire workflow, including:
- Module progression tracking
- Real-time status updates
- User approval flow
- Result visualization

### 2. ModuleExecutor.tsx
Handles individual module execution with:
- Step-by-step processing visualization
- Tool activation display
- Execution logging
- Progress tracking

### 3. AgentReasoningPanel.tsx
Shows agent's thinking process with:
- Real-time reasoning steps
- Confidence scores
- Tool usage display
- Processing animations

### 4. ModuleChatInterface.tsx
Interactive chat for each module allowing:
- Q&A about analysis
- Parameter adjustments
- Explainability requests
- Approval/rejection actions

## User Flow

1. **Initiation**
   - User asks "Who should be my priority customers?"
   - Omni Agent detects intent and activates workflow

2. **Brand Context**
   - System extracts therapeutic area and brand objectives
   - Confirms relevant barriers for analysis

3. **Module Progression**
   - Each module processes sequentially
   - User sees real-time reasoning and visualization
   - Chat interface available for interaction
   - User approves before moving to next module

4. **Final Output**
   - 423 prioritized HCPs identified
   - $45M total opportunity calculated
   - Microsegments created with recommendations
   - Results passed to downstream agents

## Visual Design

### Color Scheme by Module
- **Persona**: Purple (#8B5CF6)
- **Performance**: Blue (#3B82F6)
- **Potential**: Green (#10B981)
- **Preference**: Orange (#F59E0B)
- **Microsegmentation**: Red (#EF4444)

### Status Indicators
- **Pending**: Gray circle
- **Processing**: Animated pulse with module color
- **Review**: Orange badge "Review Required"
- **Approved**: Green checkmark

## Technical Implementation

### State Management
- Workflow state tracked in parent component
- Module results stored locally
- User inputs preserved across modules
- Approval status tracked per module

### Data Flow
1. Omni Agent → Customer Planning Workflow
2. Module Processing → Results Generation
3. User Approval → Next Module Activation
4. Final Results → Downstream Agents

### Performance Optimizations
- Lazy loading of module components
- Animated transitions for smooth UX
- Efficient state updates
- Debounced chat interactions

## Testing the Workflow

### Quick Test
1. Navigate to http://localhost:3001/agents/omni
2. Type: "Who should be my priority customers?"
3. Watch the workflow initiate
4. Interact with each module
5. Approve and progress through all 5 modules

### Module-Specific Testing
1. Visit http://localhost:3001/agents/customer
2. Click "Start Analysis" 
3. Test individual module interactions
4. Verify visualizations update correctly
5. Test chat Q&A functionality

## Future Enhancements

### Planned Features
- Real API integration for data processing
- Advanced ML model configuration
- Export functionality for results
- Collaborative review workflow
- Historical comparison views

### Integration Points
- Connect to real HCP databases
- Integrate with CRM systems
- Link to content management platforms
- Connect to campaign execution tools

## Troubleshooting

### Common Issues
1. **Module not progressing**: Check console for errors, ensure approval is clicked
2. **Visualization not updating**: Verify data is being passed correctly
3. **Chat not responding**: Check ModuleChatInterface props
4. **Workflow stuck**: Refresh and restart from Omni Agent

### Debug Mode
Add `?debug=true` to URL to see:
- Detailed console logs
- State transitions
- API mock responses
- Performance metrics