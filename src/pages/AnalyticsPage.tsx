import React from 'react';
import { computeAnalytics, type StockRecord } from '../utils/stockSpan';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { SpanChart } from '../components/SpanChart';
import { Sparkles } from 'lucide-react';

interface AnalyticsPageProps {
  records: StockRecord[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ records }) => {
  const analytics = computeAnalytics(records);

  const stats = [
    {
      label: 'Highest price',
      value: analytics.highestPrice !== null ? `₹${analytics.highestPrice}` : '—',
      sub: 'Session high peak',
    },
    {
      label: 'Lowest price',
      value: analytics.lowestPrice !== null ? `₹${analytics.lowestPrice}` : '—',
      sub: 'Session floor price',
    },
    {
      label: 'Average price',
      value: analytics.averagePrice !== null ? `₹${analytics.averagePrice.toFixed(2)}` : '—',
      sub: 'Mean across sequence',
    },
    {
      label: 'Highest span',
      value: analytics.highestSpan !== null ? `${analytics.highestSpan} days` : '—',
      sub: 'Longest dominance span',
    },
    {
      label: 'Total trading days',
      value: `${analytics.totalDays}`,
      sub: 'Sequential observations',
    },
    {
      label: 'Latest price',
      value: analytics.latestPrice !== null ? `₹${analytics.latestPrice}` : '—',
      sub: 'Most recent close',
    },
    {
      label: 'Latest span',
      value: analytics.latestSpan !== null ? `${analytics.latestSpan} days` : '—',
      sub: 'Active day span',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
          Session Analytics & Span Distribution
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Statistical aggregations computed dynamically from chronological records.
        </p>
      </div>

      {/* Dynamic Summary Callout */}
      <div className="bg-bg-surface border border-line rounded-lg p-4 sm:p-5 flex items-start space-x-3">
        <div className="w-8 h-8 rounded-md bg-brand-mint text-brand border border-brand-sage flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-secondary font-semibold">
            Dynamic Dataset Summary
          </span>
          <p className="text-sm sm:text-base font-medium text-ink-primary mt-0.5">
            {analytics.dynamicSummary}
          </p>
        </div>
      </div>

      {/* Grid of Statistical Aggregates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-bg-surface border border-line rounded-lg p-3.5 flex flex-col justify-between"
          >
            <span className="text-[11px] font-medium text-ink-secondary uppercase tracking-wider">
              {s.label}
            </span>
            <div className="my-1.5">
              <span className="text-lg sm:text-xl font-semibold text-ink-primary font-mono">
                {s.value}
              </span>
            </div>
            <span className="text-[11px] text-ink-secondary/70">
              {s.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Dual Comparative Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PriceTrendChart records={records} height={280} />
        <SpanChart records={records} height={280} />
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-ink-secondary/70">
        Analytical metrics reflect in-session recorded samples for algorithmic evaluation. Not intended for commercial trading or predictive purposes.
      </div>
    </div>
  );
};
