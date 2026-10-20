import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
} from 'recharts';
import type { StockRecord } from '../utils/stockSpan';

interface PriceTrendChartProps {
  records: StockRecord[];
  height?: number;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ records, height = 280 }) => {
  if (records.length === 0) {
    return (
      <div className="bg-bg-surface border border-line rounded-lg p-6 flex flex-col items-center justify-center text-center h-[280px]">
        <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-line flex items-center justify-center mb-3">
          <span className="font-mono text-sm text-ink-secondary">₹</span>
        </div>
        <h3 className="text-sm font-semibold text-ink-primary">No price data to chart</h3>
        <p className="text-xs text-ink-secondary mt-1 max-w-sm">
          Enter a closing stock price above or click <span className="font-medium text-brand">Load sample</span> to visualize the price trend line.
        </p>
      </div>
    );
  }

  const chartData = records.map((r, index) => ({
    day: `Day ${r.day}`,
    dayNum: r.day,
    price: r.price,
    span: r.span,
    isLatest: index === records.length - 1,
  }));

  // Calculate clean Y domain with slight padding
  const prices = records.map((r) => r.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = Math.max(10, Math.round((maxPrice - minPrice) * 0.15));
  const yDomain = [
    Math.max(0, minPrice - padding),
    maxPrice + padding,
  ];

  return (
    <div className="bg-bg-surface border border-line rounded-lg p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-line mb-3 gap-1">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-ink-primary">Closing prices</h2>
          <p className="text-xs text-ink-secondary">Price movement across recorded days</p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-ink-secondary font-mono">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-brand" />
            <span>Price line (₹)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span>Latest day</span>
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E5DD" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#70786F"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E1E5DD' }}
            />
            <YAxis
              domain={yDomain}
              stroke="#70786F"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E1E5DD' }}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-line p-2.5 rounded shadow-sm text-xs font-mono">
                      <div className="font-semibold text-ink-primary font-sans">{data.day}</div>
                      <div className="text-brand font-medium mt-1">Closing: ₹{data.price}</div>
                      <div className="text-ink-secondary">Calculated span: {data.span}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#245C45"
              strokeWidth={2}
              activeDot={{ r: 5, fill: '#245C45', stroke: '#FFFFFF', strokeWidth: 2 }}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy) return null;
                const isLatest = payload?.isLatest;
                return (
                  <Dot
                    key={`dot-${payload.dayNum}`}
                    cx={cx}
                    cy={cy}
                    r={isLatest ? 4.5 : 3}
                    fill={isLatest ? '#245C45' : '#FFFFFF'}
                    stroke="#245C45"
                    strokeWidth={isLatest ? 2 : 1.5}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
