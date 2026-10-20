/**
 * Stock Span Algorithm Engine & Types
 * Implements monotonic stack calculations for the Stock Span problem in O(n) total time.
 */

export interface StackElement {
  id: string;
  price: number;
  span: number;
  day: number;
}

export type SpanClassification = 'Bear' | 'Neutral' | 'Bull';

export interface StockRecord {
  day: number;
  price: number;
  span: number;
  classification: SpanClassification;
  timestamp: string;
}

export interface ReplayStep {
  stepNumber: number;
  type: 'init' | 'compare_pop' | 'compare_stop' | 'push' | 'empty_stop';
  title: string;
  description: string;
  currentSpan: number;
  topElement?: StackElement;
  poppedElement?: StackElement;
  stackSnapshot: StackElement[];
  highlightPrice?: number;
}

export interface OperationLog {
  day: number;
  price: number;
  calculatedSpan: number;
  poppedCount: number;
  summaryLines: string[];
  replaySteps: ReplayStep[];
}

export interface AnalyticsSummary {
  highestPrice: number | null;
  lowestPrice: number | null;
  averagePrice: number | null;
  highestSpan: number | null;
  totalDays: number;
  latestPrice: number | null;
  latestSpan: number | null;
  dynamicSummary: string;
}

/**
 * Classifies span value based on academic criteria:
 * - Span = 1: Bear (price didn't exceed yesterday's price)
 * - Span = 2 or 3: Neutral (modest span)
 * - Span > 3: Bull (price exceeded multiple preceding days)
 */
export function getSpanClassification(span: number): SpanClassification {
  if (span === 1) return 'Bear';
  if (span <= 3) return 'Neutral';
  return 'Bull';
}

/**
 * Calculates span for a single new price using the existing monotonic stack.
 * Returns the updated stack (new array reference), the record created, and the detailed operation log.
 */
export function processNextPrice(
  currentStack: StackElement[],
  price: number,
  dayNumber: number
): {
  newStack: StackElement[];
  record: StockRecord;
  operationLog: OperationLog;
} {
  // Working clone of stack for incremental mutation
  const workingStack: StackElement[] = currentStack.map((item) => ({ ...item }));
  const replaySteps: ReplayStep[] = [];
  const summaryLines: string[] = [];

  let span = 1;
  let poppedCount = 0;

  summaryLines.push(`Input price: ₹${price} (Day ${dayNumber})`);
  summaryLines.push(`Span initialized to 1`);

  // Step 0: Init
  replaySteps.push({
    stepNumber: 1,
    type: 'init',
    title: 'Initialize span',
    description: `Begin Day ${dayNumber} calculation for price ₹${price}. Initial span = 1 (current day itself is counted).`,
    currentSpan: span,
    stackSnapshot: workingStack.map((item) => ({ ...item })),
    highlightPrice: price,
  });

  // Step 1..k: While stack not empty and top.price <= price
  let stepCounter = 2;

  while (workingStack.length > 0) {
    const top = workingStack[workingStack.length - 1];

    if (top.price <= price) {
      // Must pop
      const popped = workingStack.pop()!;
      poppedCount++;
      const oldSpan = span;
      span += popped.span;

      summaryLines.push(
        `Popped price ₹${popped.price} (Day ${popped.day}) — its span contributes ${popped.span} (cumulative span: ${oldSpan} + ${popped.span} = ${span})`
      );

      replaySteps.push({
        stepNumber: stepCounter++,
        type: 'compare_pop',
        title: `Pop: ₹${popped.price} ≤ ₹${price}`,
        description: `Top element price ₹${popped.price} (Day ${popped.day}) is less than or equal to current price ₹${price}. Pop it and add its stored span (${popped.span}) to current span. Span increases from ${oldSpan} to ${span}.`,
        currentSpan: span,
        topElement: top,
        poppedElement: popped,
        stackSnapshot: workingStack.map((item) => ({ ...item })),
        highlightPrice: price,
      });
    } else {
      // Top price > price: stopping condition
      summaryLines.push(
        `Top price ₹${top.price} (Day ${top.day}) > current price ₹${price} — stopping monotonic comparison`
      );

      replaySteps.push({
        stepNumber: stepCounter++,
        type: 'compare_stop',
        title: `Stop: ₹${top.price} > ₹${price}`,
        description: `Top element price ₹${top.price} is greater than current price ₹${price}. Monotonic property preserved. No further pops needed.`,
        currentSpan: span,
        topElement: top,
        stackSnapshot: workingStack.map((item) => ({ ...item })),
        highlightPrice: price,
      });
      break;
    }
  }

  if (workingStack.length === 0 && poppedCount > 0) {
    summaryLines.push(`Stack is now empty — current price ₹${price} dominates all prior active stack elements`);
  }

  // Push current price and span
  const newElement: StackElement = {
    id: `stack-${dayNumber}-${price}-${Date.now()}`,
    price,
    span,
    day: dayNumber,
  };

  workingStack.push(newElement);

  summaryLines.push(`Pushed price ₹${price} with calculated span ${span} onto stack`);

  replaySteps.push({
    stepNumber: stepCounter,
    type: 'push',
    title: `Push: (₹${price}, Span ${span})`,
    description: `Pushed current Day ${dayNumber} pair (₹${price}, span ${span}) onto the top of the monotonic stack.`,
    currentSpan: span,
    topElement: newElement,
    stackSnapshot: workingStack.map((item) => ({ ...item })),
    highlightPrice: price,
  });

  const classification = getSpanClassification(span);

  const record: StockRecord = {
    day: dayNumber,
    price,
    span,
    classification,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };

  const operationLog: OperationLog = {
    day: dayNumber,
    price,
    calculatedSpan: span,
    poppedCount,
    summaryLines,
    replaySteps,
  };

  return {
    newStack: workingStack,
    record,
    operationLog,
  };
}

/**
 * Computes complete analytics from historical records.
 */
export function computeAnalytics(records: StockRecord[]): AnalyticsSummary {
  if (records.length === 0) {
    return {
      highestPrice: null,
      lowestPrice: null,
      averagePrice: null,
      highestSpan: null,
      totalDays: 0,
      latestPrice: null,
      latestSpan: null,
      dynamicSummary: 'No trading records entered yet. Add a closing price or load sample data to begin analysis.',
    };
  }

  const prices = records.map((r) => r.price);
  const spans = records.map((r) => r.span);

  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);
  const sumPrices = prices.reduce((acc, curr) => acc + curr, 0);
  const averagePrice = Number((sumPrices / records.length).toFixed(2));
  const highestSpan = Math.max(...spans);
  const totalDays = records.length;
  const latest = records[records.length - 1];

  const daysText = totalDays === 1 ? 'One trading day recorded.' : `${totalDays} trading days recorded.`;
  const dynamicSummary = `${daysText} The highest price is ₹${highestPrice}, and the highest calculated span is ${highestSpan}.`;

  return {
    highestPrice,
    lowestPrice,
    averagePrice,
    highestSpan,
    totalDays,
    latestPrice: latest.price,
    latestSpan: latest.span,
    dynamicSummary,
  };
}

/**
 * Standard sample prices as mandated by project requirements:
 * [100, 80, 60, 70, 60, 75, 85]
 */
export const SAMPLE_PRICES = [100, 80, 60, 70, 60, 75, 85];
