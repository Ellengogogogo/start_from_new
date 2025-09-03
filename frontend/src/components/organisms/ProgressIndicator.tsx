import React from 'react';

export interface ProgressStep {
  id: number;
  title: string;
  isCompleted: boolean;
  isValid: boolean;
  isRequired: boolean;
  errorCount: number;
  warningCount: number;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  totalSteps: number;
  showDetails?: boolean;
  className?: string;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  totalSteps,
  showDetails = false,
  className = '',
}: ProgressIndicatorProps) {
  // 计算完成度
  const completedSteps = steps.filter(step => step.isCompleted).length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  // 计算验证状态
  const validSteps = steps.filter(step => step.isValid).length;
  const validationPercentage = Math.round((validSteps / totalSteps) * 100);
  
  // 计算错误和警告总数
  const totalErrors = steps.reduce((sum, step) => sum + step.errorCount, 0);
  const totalWarnings = steps.reduce((sum, step) => sum + step.warningCount, 0);

  // 获取当前步骤状态
  const currentStepData = steps[currentStep];
  const isCurrentStepValid = currentStepData?.isValid ?? false;
  const currentStepErrors = currentStepData?.errorCount ?? 0;
  const currentStepWarnings = currentStepData?.warningCount ?? 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* 标题和总体进度 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Formular-Fortschritt
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-500">Vervollständigt</div>
          </div>
        </div>

        {/* 总体进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 验证状态 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Validierung
          </h4>
          <div className="flex items-center space-x-2">
            {totalErrors > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {totalErrors} Fehler
              </span>
            )}
            {totalWarnings > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {totalWarnings} Warnungen
              </span>
            )}
          </div>
        </div>

        {/* 验证进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              validationPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${validationPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 当前步骤状态 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Aktueller Schritt: {steps[currentStep]?.title}
        </h4>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Status:</span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isCurrentStepValid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isCurrentStepValid ? 'Gültig' : 'Ungültig'}
            </span>
          </div>
          
          {currentStepErrors > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fehler:</span>
              <span className="text-sm font-medium text-red-600">
                {currentStepErrors} Fehler gefunden
              </span>
            </div>
          )}
          
          {currentStepWarnings > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warnungen:</span>
              <span className="text-sm font-medium text-yellow-600">
                {currentStepWarnings} Warnungen
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 详细步骤状态（可选显示） */}
      {showDetails && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Schritt-Details
          </h4>
          
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  step.id === currentStep
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* 步骤状态图标 */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.isCompleted
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{step.id + 1}</span>
                    )}
                  </div>
                  
                  {/* 步骤标题 */}
                  <span
                    className={`text-sm font-medium ${
                      step.id === currentStep
                        ? 'text-blue-700'
                        : step.isCompleted
                        ? 'text-green-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                
                {/* 步骤状态指示器 */}
                <div className="flex items-center space-x-2">
                  {step.errorCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {step.errorCount}
                    </span>
                  )}
                  {step.warningCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {step.warningCount}
                    </span>
                  )}
                  {step.isValid && step.errorCount === 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 快速操作提示 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Tipp: Alle erforderlichen Felder müssen ausgefüllt werden, um fortzufahren.</p>
          <p className="mt-1">Verwenden Sie die Navigation, um zwischen den Schritten zu wechseln.</p>
        </div>
      </div>
    </div>
  );
}
