import React from 'react';
import { PriceInput } from '../components/PriceInput';
import { MetricBlocks } from '../components/MetricBlocks';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { StackDisplay } from '../components/StackDisplay';
import type { StockRecord, StackElement, OperationLog } from '../utils/stockSpan';
import type { NavTab } from '../components/AppNavigation';
import { ArrowRight } from 'lucide-react';

interface OverviewPageProps {
  records: StockRecord[];
  stack: StackElement[];
  lastOperationLog: OperationLog | null;
  onAddPrice: (price: number) => { success: boolean; message?: string };
  onNavigate: (tab: NavTab) => void;
  isSubmitting?: boolean;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  records,
  stack,
  lastOperationLog,
  onAddPrice,
  onNavigate,
  isSubmitting,
}) => {
  const recentRecords = records.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
          Stock Span Workspace
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Enter a closing price to calculate its span and see how the monotonic stack changes.
        </p>
      </div>

      {/* Input Row */}
      <PriceInput onAddPrice={onAddPrice} isSubmitting={isSubmitting} />

      {/* 4 Summary Metric Blocks */}
      <MetricBlocks records={records} />

      {/* Asymmetrical Main Workspace: Chart (60%) + Stack Snapshot (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Price Trend Chart */}
        <div className="lg:col-span-7 xl:col-span-8">
          <PriceTrendChart records={records} height={310} />
        </div>

        {/* Right: Stack Preview & Last Operation Highlights */}
        <div className="lg:col-span-5 xl:col-span-4 bg-bg-surface border border-line rounded-lg p-4 sm:p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <h3 className="text-sm font-semibold text-ink-primary">
                Current stack snapshot
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Active elements in monotonic order
              </p>
            </div>
            <button
              onClick={() => onNavigate('visualizer')}
              className="text-xs text-brand font-medium hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View stack</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Stack preview component */}
          <div className="h-[210px] overflow-hidden">
            <StackDisplay stack={stack} />
          </div>

          {/* Quick Last Operation Snippet */}
          {lastOperationLog && (
            <div className="pt-3 border-t border-line text-xs font-mono space-y-1">
              <span className="text-[10px] uppercase text-ink-secondary tracking-wider block">
                Last calculated span
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-ink-primary">
                  Day {lastOperationLog.day} (₹{lastOperationLog.price})
                </span>
                <span className="font-semibold text-brand">
                  Span: {lastOperationLog.calculatedSpan}
                </span>
              </div>
              <p className="font-sans text-[11px] text-ink-secondary truncate">
                {lastOperationLog.summaryLines[lastOperationLog.summaryLines.length - 1]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lower Section: Recent Historical Records */}
      <div className="bg-bg-surface border border-line rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-ink-primary">
              Recent recorded prices
            </h3>
            <p className="text-xs text-ink-secondary">
              Latest sequential calculations stored in session history
            </p>
          </div>
          {records.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center space-x-1 text-xs text-brand font-medium hover:underline cursor-pointer"
            >
              <span>View full history ({records.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="py-8 text-center text-ink-secondary text-xs">
            No historical records yet. Enter a price above to begin session.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-secondary font-mono text-[11px] uppercase">
                  <th className="py-2 px-3 font-semibold">Day</th>
                  <th className="py-2 px-3 font-semibold">Closing price</th>
                  <th className="py-2 px-3 font-semibold">Span</th>
                  <th className="py-2 px-3 font-semibold">Classification</th>
                  <th className="py-2 px-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 font-mono">
                {recentRecords.map((r) => {
                  const isBull = r.classification === 'Bull';
                  const isNeutral = r.classification === 'Neutral';
                  return (
                    <tr key={`recent-${r.day}`} className="hover:bg-[#FBFBFA]">
                      <td className="py-2.5 px-3 text-ink-secondary font-medium">
                        Day {r.day}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-ink-primary">
                        ₹{r.price}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-brand">{r.span}</span> day{r.span > 1 ? 's' : ''}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                            isBull
                              ? 'bg-brand-mint text-semantic-success border border-brand-sage'
                              : isNeutral
                              ? 'bg-[#F2F4F7] text-[#4A5568] border border-[#E2E8F0]'
                              : 'bg-[#F7F7F2] text-ink-secondary border border-line'
                          }`}
                        >
                          {r.classification}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-ink-secondary text-[11px]">
                        {r.timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
