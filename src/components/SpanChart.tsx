import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import type { StockRecord } from '../utils/stockSpan';

interface SpanChartProps {
  records: StockRecord[];
  height?: number;
}

export const SpanChart: React.FC<SpanChartProps> = ({ records, height = 280 }) => {
  if (records.length === 0) {
    return (
      <div className="bg-bg-surface border border-line rounded-lg p-6 flex flex-col items-center justify-center text-center h-[280px]">
        <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-line flex items-center justify-center mb-3">
          <span className="font-mono text-sm text-ink-secondary">S</span>
        </div>
        <h3 className="text-sm font-semibold text-ink-primary">No span data available</h3>
        <p className="text-xs text-ink-secondary mt-1 max-w-sm">
          Calculated spans will appear as a bar chart showing consecutive trading days less than or equal to each price.
        </p>
      </div>
    );
  }

  const chartData = records.map((r, index) => ({
    day: `Day ${r.day}`,
    dayNum: r.day,
    price: r.price,
    span: r.span,
    classification: r.classification,
    isLatest: index === records.length - 1,
  }));

  const maxSpan = Math.max(...records.map((r) => r.span));

  return (
    <div className="bg-bg-surface border border-line rounded-lg p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-line mb-3 gap-1">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-ink-primary">Stock spans</h2>
          <p className="text-xs text-ink-secondary">Calculated consecutive days (Span) per trading session</p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-ink-secondary font-mono">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-brand" />
            <span>Span (days)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#738BA0]" />
            <span>Prior days</span>
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E5DD" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#70786F"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E1E5DD' }}
            />
            <YAxis
              domain={[0, Math.max(4, maxSpan + 1)]}
              stroke="#70786F"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E1E5DD' }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-line p-2.5 rounded shadow-sm text-xs font-mono">
                      <div className="font-semibold text-ink-primary font-sans">{data.day}</div>
                      <div className="text-ink-primary mt-1">Price: ₹{data.price}</div>
                      <div className="text-brand font-semibold">Span: {data.span} day{data.span > 1 ? 's' : ''}</div>
                      <div className="text-ink-secondary text-[11px] mt-0.5">Classification: {data.classification}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="span" radius={[3, 3, 0, 0]} maxBarSize={36}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isLatest ? '#245C45' : '#738BA0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
