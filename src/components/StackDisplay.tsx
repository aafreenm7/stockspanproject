import React from 'react';
import type { StackElement } from '../utils/stockSpan';
import { Layers } from 'lucide-react';

interface StackDisplayProps {
  stack: StackElement[];
  isStepping?: boolean;
  highlightPrice?: number;
}

export const StackDisplay: React.FC<StackDisplayProps> = ({
  stack,
  isStepping = false,
}) => {
  // Stack in memory is an array where index 0 is bottom, and index length-1 is top.
  // We need to display the TOP element at the TOP of the visual container!
  // So we reverse the array for top-to-bottom rendering.
  const visualStack = [...stack].reverse();

  return (
    <div className="flex flex-col h-full">
      {/* Header boundary marker */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-line text-xs">
        <div className="flex items-center space-x-1.5 font-mono text-ink-secondary">
          <Layers className="w-3.5 h-3.5 text-brand" />
          <span className="font-semibold text-ink-primary">STACK MEMORY</span>
          {isStepping && (
            <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/20 rounded">
              REPLAY SNAPSHOT
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-brand-mint text-brand border border-brand-sage font-medium">
          TOP POINTER
        </span>
      </div>

      {/* Main Stack Container */}
      <div className="flex-1 min-h-[220px] bg-[#FBFBFA] border border-line rounded-md p-3 flex flex-col justify-end space-y-2 overflow-y-auto">
        {visualStack.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs font-mono text-ink-secondary">
              [ Stack is empty ]
            </span>
            <p className="text-[11px] text-ink-secondary/70 mt-1">
              Add a closing price to push elements onto the stack.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 w-full">
            {visualStack.map((element, visualIdx) => {
              const isTop = visualIdx === 0;
              const isBottom = visualIdx === visualStack.length - 1;

              return (
                <div
                  key={element.id || `stack-el-${element.day}-${visualIdx}`}
                  className={`w-full rounded border px-3 py-2 text-xs transition-all ${
                    isTop
                      ? 'bg-brand-mint border-brand text-ink-primary shadow-xs'
                      : 'bg-white border-line text-ink-primary'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          isTop
                            ? 'bg-brand text-white'
                            : isBottom
                            ? 'bg-line text-ink-secondary'
                            : 'bg-line-subtle text-ink-secondary'
                        }`}
                      >
                        {isTop ? 'TOP' : isBottom ? 'BOTTOM' : `STACK[${stack.length - 1 - visualIdx}]`}
                      </span>
                      <span className="text-ink-secondary text-[11px]">
                        Day {element.day}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-secondary">
                      Span: <span className="font-semibold text-brand">{element.span}</span>
                    </div>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-ink-secondary text-[11px]">Closing Price</span>
                    <span className="font-mono text-sm sm:text-base font-semibold text-ink-primary">
                      ₹{element.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stack Base Boundary */}
        <div className="pt-2 border-t border-dashed border-line flex items-center justify-between text-[10px] font-mono text-ink-secondary uppercase tracking-wider">
          <span>Stack Base (Index 0)</span>
          <span>Size: {stack.length} element{stack.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};
