import React from 'react';
import { RotateCcw, PlayCircle, Layers } from 'lucide-react';

interface AppHeaderProps {
  totalRecords: number;
  stackSize: number;
  onOpenReset: () => void;
  onOpenSample: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  totalRecords,
  stackSize,
  onOpenReset,
  onOpenSample,
}) => {
  return (
    <header className="border-b border-line bg-bg-surface sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Project Metadata */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-brand text-white flex items-center justify-center font-mono font-semibold text-sm shadow-xs">
            <Layers className="w-4 h-4 text-brand-mint" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-semibold text-ink-primary tracking-tight">
                Stock Span Analyzer
              </h1>
              <span className="hidden sm:inline-block font-mono text-[11px] px-1.5 py-0.5 rounded bg-brand-mint text-brand font-medium border border-brand-sage">
                DSA LAB / STACK ALGORITHM
              </span>
            </div>
            <p className="text-xs text-ink-secondary hidden md:block">
              Monotonic stack visualization & time-series span analysis
            </p>
          </div>
        </div>

        {/* Right Session Status & Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Session Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded bg-[#F7F7F2] border border-line text-ink-secondary">
            <span
              className={`w-2 h-2 rounded-full ${
                totalRecords > 0 ? 'bg-semantic-success animate-pulse' : 'bg-ink-secondary/40'
              }`}
            />
            <span>
              {totalRecords > 0
                ? `${totalRecords} day${totalRecords === 1 ? '' : 's'} · Stack: ${stackSize}`
                : 'Session empty'}
            </span>
          </div>

          {/* Load Sample Button */}
          <button
            id="load-sample-btn"
            onClick={onOpenSample}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-line bg-bg-surface text-ink-primary hover:bg-[#F7F7F2] hover:border-ink-secondary/40 active:scale-[0.98] transition-all cursor-pointer"
            title="Load standard 7-day academic sample sequence (100, 80, 60, 70, 60, 75, 85)"
          >
            <PlayCircle className="w-3.5 h-3.5 text-brand" />
            <span>Load sample</span>
          </button>

          {/* Reset Action */}
          <button
            id="reset-session-btn"
            onClick={onOpenReset}
            disabled={totalRecords === 0}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              totalRecords === 0
                ? 'opacity-40 border-line bg-bg-surface text-ink-secondary cursor-not-allowed'
                : 'border-line bg-bg-surface text-ink-primary hover:text-semantic-error hover:border-semantic-error/40 hover:bg-[#FDF6F6] active:scale-[0.98] cursor-pointer'
            }`}
            title="Clear all recorded prices and reset stack"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
