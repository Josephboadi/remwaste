import * as React from 'react';

import { cn } from '@/lib/utils';
import { progressType } from '@/pages/SkipSizePage';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: string;
  progressSteps: progressType[];
}

export const Progress = ({ activeStep, progressSteps }: ProgressProps) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 backdrop-blur-md bg-white/10 border-white/20 shadow-md dark:bg-gray-900/30 dark:border-gray-700/40">
      <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 relative">
        {progressSteps.map((step, index) => {
          const isActive = step.label === activeStep;
          const isCompleted = index < progressSteps.findIndex((s) => s.label === activeStep);
          const isLast = index === progressSteps.length - 1;

          return (
            <div key={index} className="relative flex flex-col items-center min-w-[80px] flex-1 max-w-[130px]">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute top-5 left-1 transform translate-x-1/2 w-full h-[2px] z-0 border-t border-dashed',
                    isCompleted ? 'border-blue-300' : 'border-gray-500'
                  )}
                />
              )}

              {/* Circle with icon */}
              <div
                className={cn(
                  'z-10 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300',
                  isActive
                    ? 'bg-gray-800 border-blue-300 text-white'
                    : isCompleted
                      ? 'bg-blue-800 border-blue-300 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400'
                )}
              >
                <span className="text-lg">{step.icon}</span>
              </div>

              {/* Label on the line */}
              <span className="text-xs text-gray-200 mt-2 text-center">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
Progress.displayName = 'Progress';
