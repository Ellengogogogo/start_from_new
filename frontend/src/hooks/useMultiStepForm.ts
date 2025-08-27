import { useState, useCallback } from 'react';

export interface FormStep {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  isCompleted?: boolean;
  isValid?: boolean;
  isRequired?: boolean;
}

export interface UseMultiStepFormOptions<T> {
  steps: FormStep[];
  initialData?: Partial<T>;
  onStepChange?: (currentStep: number, data: T) => void;
}

export function useMultiStepForm<T>({
  steps,
  initialData = {},
  onStepChange,
}: UseMultiStepFormOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData as T);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep, formData);
    }
  }, [currentStep, steps.length, formData, onStepChange]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep, formData);
    }
  }, [currentStep, formData, onStepChange]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex, formData);
    }
  }, [steps.length, formData, onStepChange]);

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData as T);
  }, [initialData]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canGoNext = currentStep < steps.length - 1;
  const canGoPrev = currentStep > 0;

  return {
    currentStep,
    currentStepData: steps[currentStep],
    totalSteps: steps.length,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    resetForm,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrev,
  };
}
