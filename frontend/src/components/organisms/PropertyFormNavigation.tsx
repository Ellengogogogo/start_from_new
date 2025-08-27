import React from 'react';
import { PropertyFormData } from '@/types/property';

export interface FormStep {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  isCompleted?: boolean;
  isValid?: boolean;
  isRequired?: boolean;
}

export interface PropertyFormNavigationProps {
  currentStep: number;
  steps: FormStep[];
  onStepClick: (stepIndex: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  canGoToNext: boolean;
  canGoToPrev: boolean;
  isSubmitting?: boolean;
  totalSteps: number;
}

export default function PropertyFormNavigation({
  currentStep,
  steps,
  onStepClick,
  onNextStep,
  onPrevStep,
  canGoToNext,
  canGoToPrev,
  isSubmitting = false,
  totalSteps,
}: PropertyFormNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 步骤指示器 */}
        <div className="py-6">
          <div className="flex items-center justify-between">
            {/* 步骤标题 */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Exposé erstellen
              </h1>
              <span className="ml-3 text-sm text-gray-500">
                Schritt {currentStep + 1} von {totalSteps}
              </span>
            </div>

            {/* 进度百分比 */}
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Vervollständigt</div>
            </div>
          </div>

          {/* 步骤导航条 */}
          <div className="mt-6">
            <nav className="flex space-x-8" aria-label="Steps">
              {steps.map((step, index) => {
                const isCurrent = index === currentStep;
                const isCompleted = step.isCompleted;
                const isAccessible = index <= currentStep || isCompleted;
                const isLast = index === steps.length - 1;

                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && onStepClick(index)}
                    disabled={!isAccessible}
                    className={`group flex items-center transition-all ${
                      isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    {/* 步骤圆圈 */}
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">
                          {step.icon || index + 1}
                        </span>
                      )}
                    </div>

                    {/* 步骤信息 */}
                    <div className="ml-4 min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium transition-colors ${
                          isCurrent
                            ? 'text-blue-600'
                            : isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>

                    {/* 连接线 */}
                    {!isLast && (
                      <div
                        className={`ml-4 h-0.5 w-8 transition-colors ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* 左侧：后退按钮 */}
            <div>
              {canGoToPrev && (
                <button
                  type="button"
                  onClick={onPrevStep}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>
              )}
            </div>

            {/* 右侧：前进按钮 */}
            <div className="flex items-center space-x-3">
              {/* 保存草稿按钮 */}
              <button
                type="button"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Als Entwurf speichern
              </button>

              {/* 下一步按钮 */}
              {canGoToNext && (
                <button
                  type="button"
                  onClick={onNextStep}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Wird verarbeitet...
                    </>
                  ) : (
                    <>
                      Weiter
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}

              {/* 完成按钮（最后一步） */}
              {currentStep === totalSteps - 1 && (
                <button
                  type="submit"
                  disabled={isSubmitting || !canGoToNext}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Exposé erstellen
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
