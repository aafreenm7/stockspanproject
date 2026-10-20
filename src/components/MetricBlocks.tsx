import React from 'react';
import type { StockRecord } from '../utils/stockSpan';

interface MetricBlocksProps {
  records: StockRecord[];
}

export const MetricBlocks: React.FC<MetricBlocksProps> = ({ records }) => {
  const hasRecords = records.length > 0;
  const latestRecord = hasRecords ? records[records.length - 1] : null;

  const highestPrice = hasRecords
    ? Math.max(...records.map((r) => r.price))
    : null;

  const metrics = [
    {
      id: 'metric-latest-price',
      label: 'Latest price',
      value: latestRecord ? `₹${latestRecord.price}` : '—',
      detail: latestRecord ? `Day ${latestRecord.day}` : 'Awaiting input',
    },
    {
      id: 'metric-latest-span',
      label: 'Latest span',
      value: latestRecord ? `${latestRecord.span} day${latestRecord.span === 1 ? '' : 's'}` : '—',
      detail: latestRecord ? `Classification: ${latestRecord.classification}` : 'Consecutive days',
    },
    {
      id: 'metric-highest-price',
      label: 'Highest recorded price',
      value: highestPrice !== null ? `₹${highestPrice}` : '—',
      detail: hasRecords ? `Peak across session` : 'Session high',
    },
    {
      id: 'metric-trading-days',
      label: 'Trading days',
      value: `${records.length}`,
      detail: records.length === 0 ? 'Empty sequence' : `${records.length} sequential input${records.length === 1 ? '' : 's'}`,
    },
  ];

  return (
    <div className="bg-bg-surface border border-line rounded-lg p-3 sm:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line">
        {metrics.map((metric, idx) => (
          <div
            key={metric.id}
            id={metric.id}
            className={`flex flex-col justify-between ${
              idx === 0
                ? 'pr-3 pb-3 md:pb-0'
                : idx === 1
                ? 'pl-3 pb-3 md:pb-0'
                : idx === 2
                ? 'pr-3 pt-3 md:pt-0 md:px-3'
                : 'pl-3 pt-3 md:pt-0'
            }`}
          >
            <span className="text-[11px] font-medium text-ink-secondary uppercase tracking-wider">
              {metric.label}
            </span>
            <div className="mt-1">
              <span className="text-xl sm:text-2xl font-semibold text-ink-primary font-mono tracking-tight">
                {metric.value}
              </span>
            </div>
            <span className="mt-0.5 text-[11px] text-ink-secondary/80">
              {metric.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
