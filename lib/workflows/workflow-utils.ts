import { Workflow, WorkflowStep } from './engagement-planning-workflow';

export function executeWorkflowStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'active';
    updatedWorkflow.currentStep = stepIndex;
  }
  return updatedWorkflow;
}

export function processModuleStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'review';
  }
  return updatedWorkflow;
}

export function approveModuleStep(workflow: Workflow, stepIndex: number, adjustments?: any): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'approved';
    if (adjustments) {
      updatedWorkflow.steps[stepIndex].userInput = adjustments;
    }
    
    // Move to next step
    if (stepIndex + 1 < updatedWorkflow.steps.length) {
      updatedWorkflow.currentStep = stepIndex + 1;
      updatedWorkflow.steps[stepIndex + 1].status = 'active';
    }
  }
  return updatedWorkflow;
}

export function resetWorkflow(workflow: Workflow): Workflow {
  const updatedWorkflow = { ...workflow };
  updatedWorkflow.currentStep = 0;
  updatedWorkflow.steps.forEach(step => {
    step.status = 'pending';
    step.userInput = undefined;
    step.output = undefined;
  });
  return updatedWorkflow;
}

export function getActiveModule(workflow: Workflow): string | null {
  const activeStep = workflow.steps[workflow.currentStep];
  return activeStep?.module || null;
}

export function getWorkflowProgress(workflow: Workflow): number {
  const completedSteps = workflow.steps.filter(
    s => s.status === 'approved' || s.status === 'completed'
  ).length;
  return Math.round((completedSteps / workflow.steps.length) * 100);
}