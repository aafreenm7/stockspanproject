import React, { useState } from 'react';
import type { OperationLog, ReplayStep } from '../utils/stockSpan';
import { ChevronLeft, ChevronRight, Terminal } from 'lucide-react';

interface OperationLogDisplayProps {
  operationLog: OperationLog | null;
  onSelectReplayStep?: (step: ReplayStep | null) => void;
}

export const OperationLogDisplay: React.FC<OperationLogDisplayProps> = ({
  operationLog,
  onSelectReplayStep,
}) => {
  const [replayMode, setReplayMode] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  if (!operationLog) {
    return (
      <div className="bg-bg-surface border border-line rounded-lg p-5 flex flex-col justify-center items-center text-center min-h-[220px]">
        <div className="w-9 h-9 rounded-md bg-[#F7F7F2] border border-line flex items-center justify-center text-ink-secondary mb-2">
          <Terminal className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-semibold text-ink-primary font-mono uppercase tracking-wider">
          Awaiting Operation
        </h4>
        <p className="text-xs text-ink-secondary mt-1 max-w-xs">
          Operations performed on the stack (comparisons, pops, and pushes) will be logged here in real-time.
        </p>
      </div>
    );
  }

  const steps = operationLog.replaySteps || [];
  const currentStep = steps[stepIdx] || steps[0];

  const handleToggleReplay = () => {
    if (!replayMode) {
      setReplayMode(true);
      setStepIdx(0);
      if (onSelectReplayStep && steps.length > 0) {
        onSelectReplayStep(steps[0]);
      }
    } else {
      setReplayMode(false);
      if (onSelectReplayStep) {
        onSelectReplayStep(null);
      }
    }
  };

  const handlePrevStep = () => {
    if (stepIdx > 0) {
      const nextIdx = stepIdx - 1;
      setStepIdx(nextIdx);
      if (onSelectReplayStep) {
        onSelectReplayStep(steps[nextIdx]);
      }
    }
  };

  const handleNextStep = () => {
    if (stepIdx < steps.length - 1) {
      const nextIdx = stepIdx + 1;
      setStepIdx(nextIdx);
      if (onSelectReplayStep) {
        onSelectReplayStep(steps[nextIdx]);
      }
    }
  };

  return (
    <div className="bg-bg-surface border border-line rounded-lg p-4 sm:p-5 flex flex-col h-full">
      {/* Header with Title and Mode Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-brand" />
          <div>
            <h3 className="text-sm font-semibold text-ink-primary">
              Last operation log
            </h3>
            <p className="text-[11px] text-ink-secondary font-mono">
              Day {operationLog.day} · Input price ₹{operationLog.price}
            </p>
          </div>
        </div>

        {/* Calculated Span Highlight */}
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-mono text-ink-secondary">
              Span calculated
            </span>
            <span className="font-mono text-base font-bold text-brand">
              {operationLog.calculatedSpan} day{operationLog.calculatedSpan === 1 ? '' : 's'}
            </span>
          </div>

          {/* Stepper toggle button */}
          {steps.length > 0 && (
            <button
              onClick={handleToggleReplay}
              className={`text-xs px-2.5 py-1 rounded font-medium border transition-colors cursor-pointer ml-2 ${
                replayMode
                  ? 'bg-brand text-white border-brand'
                  : 'bg-[#F7F7F2] text-ink-primary border-line hover:bg-brand-mint'
              }`}
              title="Step-by-step replay through individual stack comparisons and pops"
            >
              {replayMode ? 'Live Stack' : 'Step through'}
            </button>
          )}
        </div>
      </div>

      {/* Content Area: Replay Stepper or Direct Sequential Log */}
      {replayMode ? (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Stepper Control Bar */}
          <div className="flex items-center justify-between bg-[#F7F7F2] border border-line px-3 py-1.5 rounded-md text-xs font-mono">
            <span className="text-ink-secondary">
              Step <span className="font-bold text-ink-primary">{stepIdx + 1}</span> of {steps.length}
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevStep}
                disabled={stepIdx === 0}
                className="p-1 rounded hover:bg-white text-ink-primary disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextStep}
                disabled={stepIdx === steps.length - 1}
                className="p-1 rounded hover:bg-white text-ink-primary disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Step Description Card */}
          <div className="bg-[#FAFBF9] border border-brand-sage/60 rounded-md p-3 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-ink-secondary text-[11px] border-b border-line pb-1.5">
              <span className="font-semibold text-brand">{currentStep?.title}</span>
              <span>Running Span: <span className="text-ink-primary font-bold">{currentStep?.currentSpan}</span></span>
            </div>
            <p className="font-sans text-xs text-ink-primary leading-relaxed">
              {currentStep?.description}
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-line h-1 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full transition-all duration-200"
              style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        /* Sequential Summary Log */
        <div className="flex-1 overflow-y-auto space-y-1.5 text-xs font-mono bg-[#FAFBF9] border border-line rounded-md p-3">
          {operationLog.summaryLines.map((line, idx) => {
            const isPush = line.startsWith('Pushed');
            const isPop = line.startsWith('Popped');
            const isInit = line.startsWith('Input') || line.startsWith('Span initialized');

            return (
              <div
                key={idx}
                className={`py-1 px-2 rounded flex items-start space-x-2 ${
                  isPush
                    ? 'bg-brand-mint text-brand font-semibold'
                    : isPop
                    ? 'bg-[#F9F6F0] text-[#7A5B17]'
                    : isInit
                    ? 'text-ink-secondary'
                    : 'text-ink-primary'
                }`}
              >
                <span className="text-[10px] text-ink-secondary/60 select-none">
                  {idx + 1}.
                </span>
                <span className="leading-relaxed">{line}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-footer metadata */}
      <div className="mt-3 pt-2 border-t border-line flex items-center justify-between text-[11px] text-ink-secondary font-mono">
        <span>Elements popped in this operation: {operationLog.poppedCount}</span>
        <span>Amortized cost: O(1)</span>
      </div>
    </div>
  );
};
