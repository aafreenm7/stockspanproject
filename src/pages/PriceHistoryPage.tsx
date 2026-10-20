import React, { useState } from 'react';
import type { StockRecord } from '../utils/stockSpan';
import { Info, ArrowDownUp } from 'lucide-react';

interface PriceHistoryPageProps {
  records: StockRecord[];
}

export const PriceHistoryPage: React.FC<PriceHistoryPageProps> = ({ records }) => {
  const [isReverse, setIsReverse] = useState(false);

  const displayedRecords = isReverse ? [...records].reverse() : records;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
            Price History & Calculations
          </h2>
          <p className="text-sm text-ink-secondary mt-1">
            Permanent session ledger recording every input and its calculated span.
          </p>
        </div>

        {records.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsReverse(!isReverse)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-line bg-bg-surface text-ink-secondary hover:text-ink-primary hover:bg-[#F7F7F2] transition-colors cursor-pointer"
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
              <span>{isReverse ? 'Showing Latest First' : 'Showing Chronological (Day 1 First)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-bg-surface border border-line rounded-lg overflow-hidden">
        {records.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-ink-primary font-mono">
              [ No records stored in session ]
            </p>
            <p className="text-xs text-ink-secondary mt-1 max-w-sm mx-auto">
              Prices submitted through the Overview or Visualizer tabs will be sequentially logged here with their calculated spans.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAFBF9] border-b border-line text-ink-secondary font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Day</th>
                  <th className="py-3 px-4 font-semibold">Closing price</th>
                  <th className="py-3 px-4 font-semibold">Span</th>
                  <th className="py-3 px-4 font-semibold">Classification</th>
                  <th className="py-3 px-4 font-semibold text-right">Recorded at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70 font-mono">
                {displayedRecords.map((record) => {
                  const isBull = record.classification === 'Bull';
                  const isNeutral = record.classification === 'Neutral';

                  return (
                    <tr
                      key={`hist-row-${record.day}`}
                      className="hover:bg-[#FBFBFA] transition-colors"
                    >
                      <td className="py-3 px-4 text-ink-secondary font-medium">
                        Day {record.day}
                      </td>
                      <td className="py-3 px-4 font-semibold text-ink-primary">
                        ₹{record.price}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-brand text-sm sm:text-base">
                          {record.span}
                        </span>{' '}
                        <span className="text-xs text-ink-secondary">
                          day{record.span > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded border inline-block ${
                            isBull
                              ? 'bg-brand-mint text-semantic-success border-brand-sage'
                              : isNeutral
                              ? 'bg-[#F2F4F7] text-[#4A5568] border-[#E2E8F0]'
                              : 'bg-[#F7F7F2] text-ink-secondary border-line'
                          }`}
                        >
                          {record.classification}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-ink-secondary">
                        {record.timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Academic Classification Disclaimer Note */}
      <div className="bg-[#FAFBF9] border border-line rounded-lg p-3.5 flex items-start space-x-2.5 text-xs text-ink-secondary">
        <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-ink-primary">
            Academic classification rubric:
          </span>
          <p className="leading-relaxed">
            • <strong className="font-mono text-ink-primary">Span = 1 (Bear)</strong>: Current price was lower than the immediate previous day's price.<br />
            • <strong className="font-mono text-ink-primary">Span = 2 or 3 (Neutral)</strong>: Moderate consecutive duration of lower or equal prices.<br />
            • <strong className="font-mono text-ink-primary">Span &gt; 3 (Bull)</strong>: Strong consecutive stretch where price equaled or exceeded multiple prior trading days.<br />
            <em className="text-[11px] text-ink-secondary/80">These labels serve an educational classification purpose for this DSA project and do not represent market forecasts.</em>
          </p>
        </div>
      </div>
    </div>
  );
};
