import React from 'react';
import { BookOpen, CheckCircle, HelpCircle, Code } from 'lucide-react';

export const AlgorithmGuidePage: React.FC = () => {
  const workedExample = [
    { day: 1, price: 100, stackBefore: '[] (Empty)', action: 'Push (100, 1)', span: 1, stackAfter: '[(100, 1)]' },
    { day: 2, price: 80, stackBefore: '[(100, 1)]', action: '100 > 80: Push (80, 1)', span: 1, stackAfter: '[(100, 1), (80, 1)]' },
    { day: 3, price: 60, stackBefore: '[(100, 1), (80, 1)]', action: '80 > 60: Push (60, 1)', span: 1, stackAfter: '[(100, 1), (80, 1), (60, 1)]' },
    { day: 4, price: 70, stackBefore: '[(100, 1), (80, 1), (60, 1)]', action: 'Pop (60, 1) -> span 1+1=2. 80 > 70 stop. Push (70, 2)', span: 2, stackAfter: '[(100, 1), (80, 1), (70, 2)]' },
    { day: 5, price: 60, stackBefore: '[(100, 1), (80, 1), (70, 2)]', action: '70 > 60: Push (60, 1)', span: 1, stackAfter: '[(100, 1), (80, 1), (70, 2), (60, 1)]' },
    { day: 6, price: 75, stackBefore: '[(100, 1), (80, 1), (70, 2), (60, 1)]', action: 'Pop (60, 1)->span=2; Pop (70, 2)->span=4. 80 > 75 stop. Push (75, 4)', span: 4, stackAfter: '[(100, 1), (80, 1), (75, 4)]' },
    { day: 7, price: 85, stackBefore: '[(100, 1), (80, 1), (75, 4)]', action: 'Pop (75, 4)->span=5; Pop (80, 1)->span=6. 100 > 85 stop. Push (85, 6)', span: 6, stackAfter: '[(100, 1), (85, 6)]' },
  ];

  const vivaQuestions = [
    {
      q: 'What is a Stack and what is LIFO?',
      a: 'A Stack is a linear data structure following Last-In, First-Out (LIFO) order. The most recently added element is the first one removed. Operations include Push (insert at top) and Pop (remove from top).',
    },
    {
      q: 'What is a Monotonic Stack?',
      a: 'A monotonic stack maintains its elements in a strictly increasing or strictly decreasing sorted order. In the stock span algorithm, prices in the stack are strictly decreasing from bottom to top. If a new price is greater than or equal to the top, elements are popped until monotonicity is restored.',
    },
    {
      q: 'Why are equal prices popped (<= rather than <)?',
      a: 'The problem definition states: consecutive days where prices were "less than or equal to" the current price. When prices are equal, the current day spans over the previous identical day, so the previous element is popped and its span is accumulated.',
    },
    {
      q: 'Why do popped prices remain in the historical records?',
      a: 'The algorithmic stack only keeps unresolved barrier prices needed for future span calculations. Popping an element means the current price dominates it; however, the historical price series remains true chronological fact, which is preserved in the separate historical ledger.',
    },
    {
      q: 'What is the difference between stack size and total trading days?',
      a: 'Total trading days is the total number of days observed since Day 1 (size of history). Stack size is only the number of active, un-popped barrier prices currently in the monotonic stack. For example, after 7 days, history has 7 records while the stack only has 2 elements: (100, 1) and (85, 6).',
    },
    {
      q: 'Why is the overall time complexity O(n) instead of O(n²)?',
      a: 'While a single price insertion might pop multiple elements in O(n) time, every element is pushed onto the stack exactly once and popped at most once across the entire sequence of n elements. The total number of push and pop operations across all n prices is bounded by 2n, yielding an amortized time complexity of O(1) per price and O(n) overall.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight">
          Algorithm Guide & Viva Reference
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Theoretical foundation, pseudocode, amortized analysis, and common viva questions.
        </p>
      </div>

      {/* 1. Problem Definition & Why a Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-brand font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Problem Definition</span>
          </div>
          <blockquote className="border-l-2 border-brand pl-3 text-sm text-ink-primary italic bg-[#FAFBF9] py-2 pr-2 rounded-r">
            "The stock span of a day is the number of consecutive days ending on that day for which the stock price was less than or equal to the current day's price."
          </blockquote>
          <p className="text-xs text-ink-secondary leading-relaxed">
            The current day is always included, meaning the minimum span for any day is always <strong>1</strong>.
          </p>
        </div>

        <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-brand font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Why use a Monotonic Stack?</span>
          </div>
          <p className="text-xs text-ink-primary leading-relaxed">
            A naive brute-force approach compares each day against all preceding days, requiring <strong>O(n²)</strong> time.
          </p>
          <p className="text-xs text-ink-secondary leading-relaxed">
            By storing pairs of <code className="font-mono bg-[#F7F7F2] px-1 py-0.5 rounded text-ink-primary">{'price, span'}</code> in a monotonic stack, previously calculated spans allow the algorithm to <strong>skip large blocks of earlier days in a single step</strong> rather than inspecting each individual day sequentially.
          </p>
        </div>
      </div>

      {/* 2. Pseudocode */}
      <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div className="flex items-center space-x-2 text-brand font-semibold text-sm">
            <Code className="w-4 h-4" />
            <span>Algorithmic Pseudocode</span>
          </div>
          <span className="text-[11px] font-mono text-ink-secondary">
            Language-agnostic · Monotonic Stack
          </span>
        </div>

        <pre className="bg-[#1D241D] text-[#EAF3EA] p-4 rounded-md font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
{`span = 1

while stack is not empty AND stack.top.price <= price:
    span = span + stack.top.span
    stack.pop()

stack.push(price, span)`}
        </pre>

        <p className="text-xs text-ink-secondary">
          Notice how the popped element's stored span contributes directly to the current span: <code className="font-mono text-brand font-semibold">span = span + stack.top.span</code>. This leapfrogs previously calculated sub-chains.
        </p>
      </div>

      {/* 3. Worked Example Table */}
      <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-ink-primary">
            Worked Example Walkthrough
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Sample Input: <code className="font-mono text-brand font-medium">100, 80, 60, 70, 60, 75, 85</code> → Output Spans: <code className="font-mono text-brand font-medium">1, 1, 1, 2, 1, 4, 6</code>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#FAFBF9] border-b border-line text-ink-secondary text-[11px] uppercase">
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Stack Before</th>
                <th className="py-2.5 px-3 font-sans">Operation Details</th>
                <th className="py-2.5 px-3">Span</th>
                <th className="py-2.5 px-3">Stack After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {workedExample.map((step) => (
                <tr key={step.day} className="hover:bg-[#FBFBFA]">
                  <td className="py-2.5 px-3 text-ink-secondary">Day {step.day}</td>
                  <td className="py-2.5 px-3 font-semibold text-ink-primary">₹{step.price}</td>
                  <td className="py-2.5 px-3 text-ink-secondary text-[11px]">{step.stackBefore}</td>
                  <td className="py-2.5 px-3 font-sans text-xs text-ink-primary">{step.action}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-brand">{step.span}</span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-primary text-[11px] font-medium">{step.stackAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Complexity Analysis */}
      <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-3">
        <h3 className="text-base font-semibold text-ink-primary">
          Complexity Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="bg-[#FAFBF9] border border-line p-3 rounded">
            <span className="text-[11px] uppercase text-ink-secondary font-mono block">Amortized Time</span>
            <span className="font-mono text-base font-bold text-brand mt-1 block">O(1) per price</span>
            <span className="text-[11px] text-ink-secondary mt-1 block">Average cost per step</span>
          </div>
          <div className="bg-[#FAFBF9] border border-line p-3 rounded">
            <span className="text-[11px] uppercase text-ink-secondary font-mono block">Total Time</span>
            <span className="font-mono text-base font-bold text-brand mt-1 block">O(n)</span>
            <span className="text-[11px] text-ink-secondary mt-1 block">For n sequential prices</span>
          </div>
          <div className="bg-[#FAFBF9] border border-line p-3 rounded">
            <span className="text-[11px] uppercase text-ink-secondary font-mono block">Auxiliary Stack</span>
            <span className="font-mono text-base font-bold text-brand mt-1 block">O(n)</span>
            <span className="text-[11px] text-ink-secondary mt-1 block">In worst-case decreasing sequence</span>
          </div>
          <div className="bg-[#FAFBF9] border border-line p-3 rounded">
            <span className="text-[11px] uppercase text-ink-secondary font-mono block">History Storage</span>
            <span className="font-mono text-base font-bold text-brand mt-1 block">O(n)</span>
            <span className="text-[11px] text-ink-secondary mt-1 block">Chronological price ledger</span>
          </div>
        </div>

        <p className="text-xs text-ink-secondary leading-relaxed pt-2">
          <strong>Amortization Explanation:</strong> Even though an individual price insertion (such as Day 7 with price ₹85) can pop multiple elements in O(k) steps, each element can be pushed onto the stack at most once and popped at most once over its lifetime. Thus, the total operations across all n prices is strictly bounded by 2n, ensuring an aggregate <strong>O(n)</strong> running time.
        </p>
      </div>

      {/* 5. Viva-Friendly Core DSA Concepts */}
      <div className="bg-bg-surface border border-line rounded-lg p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-line pb-2.5">
          <CheckCircle className="w-4 h-4 text-brand" />
          <h3 className="text-base font-semibold text-ink-primary">
            Viva-Ready Conceptual Checklist
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="bg-[#FAFBF9] border border-line rounded-md p-3.5 space-y-1.5">
              <h4 className="text-xs font-semibold text-ink-primary flex items-start space-x-1.5">
                <span className="font-mono text-brand">Q{idx + 1}.</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed pl-5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
