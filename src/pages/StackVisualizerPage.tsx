import React, { useState } from 'react';
import type { StackElement, StockRecord, OperationLog, ReplayStep } from '../utils/stockSpan';
import { StackDisplay } from '../components/StackDisplay';
import { OperationLogDisplay } from '../components/OperationLogDisplay';
import { PriceInput } from '../components/PriceInput';
import { Layers, Database, ArrowUpRight, BarChart2 } from 'lucide-react';

interface StackVisualizerPageProps {
  stack: StackElement[];
  records: StockRecord[];
  lastOperationLog: OperationLog | null;
  onAddPrice: (price: number) => { success: boolean; message?: string };
  isSubmitting?: boolean;
}

export const StackVisualizerPage: React.FC<StackVisualizerPageProps> = ({
  stack,
  records,
  lastOperationLog,
  onAddPrice,
  isSubmitting,
}) => {
  // If stepping through an operation, we show the snapshot stack from that replay step
  const [activeReplayStep, setActiveReplayStep] = useState<ReplayStep | null>(null);

  const displayedStack = activeReplayStep
    ? activeReplayStep.stackSnapshot
    : stack;

  const topElement = stack.length > 0 ? stack[stack.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
          Monotonic Stack Visualizer
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Inspect real-time LIFO operations, stack pop cascades, and span contributions.
        </p>
      </div>

      {/* Stack Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bg-surface border border-line rounded-lg p-3 sm:p-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded bg-[#F7F7F2] border border-line flex items-center justify-center text-brand">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono text-ink-secondary block">
              Stack Size
            </span>
            <span className="font-mono text-lg font-semibold text-ink-primary">
              {stack.length} element{stack.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-line">
          <div className="w-8 h-8 rounded bg-brand-mint border border-brand-sage flex items-center justify-center text-brand">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono text-ink-secondary block">
              Top Price
            </span>
            <span className="font-mono text-lg font-semibold text-ink-primary">
              {topElement ? `₹${topElement.price}` : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-line">
          <div className="w-8 h-8 rounded bg-[#F7F7F2] border border-line flex items-center justify-center text-ink-secondary">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono text-ink-secondary block">
              Top Span
            </span>
            <span className="font-mono text-lg font-semibold text-ink-primary">
              {topElement ? `${topElement.span} day${topElement.span === 1 ? '' : 's'}` : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-line">
          <div className="w-8 h-8 rounded bg-[#F7F7F2] border border-line flex items-center justify-center text-ink-secondary">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono text-ink-secondary block">
              Total History
            </span>
            <span className="font-mono text-lg font-semibold text-ink-primary">
              {records.length} record{records.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Direct Price Input Row */}
      <PriceInput onAddPrice={onAddPrice} isSubmitting={isSubmitting} />

      {/* Main Dual-Panel Workspace: Left (Stack) and Right (Operation Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Stack Display (5 cols) */}
        <div className="lg:col-span-5 bg-bg-surface border border-line rounded-lg p-4 sm:p-5 flex flex-col">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-ink-primary">
              Active Monotonic Stack
            </h3>
            <p className="text-xs text-ink-secondary">
              Stores strictly descending price thresholds
            </p>
          </div>

          <div className="flex-1">
            <StackDisplay
              stack={displayedStack}
              isStepping={activeReplayStep !== null}
              highlightPrice={activeReplayStep?.highlightPrice}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-line text-[11px] text-ink-secondary leading-relaxed">
            <span className="font-semibold text-ink-primary">Monotonic Invariant:</span> Prices strictly decrease from bottom to top. Any incoming price ≥ top elements causes them to pop and accumulate span.
          </div>
        </div>

        {/* Right Column: Operation Log & Step-Through Replay (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <OperationLogDisplay
            operationLog={lastOperationLog}
            onSelectReplayStep={(step) => setActiveReplayStep(step)}
          />
        </div>
      </div>
    </div>
  );
};
