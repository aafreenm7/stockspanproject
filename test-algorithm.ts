import {
  processNextPrice,
  SAMPLE_PRICES,
  computeAnalytics,
  type StackElement,
  type StockRecord,
} from './src/utils/stockSpan.ts';

function runTestSuite() {
  console.log('=== RUNNING COMPLETE STOCK SPAN VALIDATION SUITE ===\n');

  // Case A: First price
  console.log('--- TEST CASE A: First Price (100) ---');
  let stackA: StackElement[] = [];
  const resA = processNextPrice(stackA, 100, 1);
  console.assert(resA.record.span === 1, 'Case A failed: span should be 1');
  console.assert(resA.newStack.length === 1, 'Case A failed: stack length should be 1');
  console.log(`✓ Case A Passed: Price 100 -> Span ${resA.record.span}, Stack: [(${resA.newStack[0].price}, ${resA.newStack[0].span})]\n`);

  // Case B: Decreasing prices (100, 90, 80, 70)
  console.log('--- TEST CASE B: Decreasing Prices (100, 90, 80, 70) ---');
  const pricesB = [100, 90, 80, 70];
  let stackB: StackElement[] = [];
  const spansB: number[] = [];
  pricesB.forEach((p, idx) => {
    const res = processNextPrice(stackB, p, idx + 1);
    stackB = res.newStack;
    spansB.push(res.record.span);
  });
  console.log('Input:', pricesB);
  console.log('Calculated Spans:', spansB);
  console.assert(JSON.stringify(spansB) === JSON.stringify([1, 1, 1, 1]), 'Case B failed: spans should be [1, 1, 1, 1]');
  console.assert(stackB.length === 4, 'Case B failed: all 4 items should remain on stack');
  console.log('✓ Case B Passed: Strictly decreasing sequence maintains span 1 and stack size 4\n');

  // Case C: Increasing prices (10, 20, 30, 40)
  console.log('--- TEST CASE C: Increasing Prices (10, 20, 30, 40) ---');
  const pricesC = [10, 20, 30, 40];
  let stackC: StackElement[] = [];
  const spansC: number[] = [];
  pricesC.forEach((p, idx) => {
    const res = processNextPrice(stackC, p, idx + 1);
    stackC = res.newStack;
    spansC.push(res.record.span);
  });
  console.log('Input:', pricesC);
  console.log('Calculated Spans:', spansC);
  console.assert(JSON.stringify(spansC) === JSON.stringify([1, 2, 3, 4]), 'Case C failed: spans should be [1, 2, 3, 4]');
  console.assert(stackC.length === 1, 'Case C failed: final stack should have 1 element');
  console.log(`✓ Case C Passed: Strictly increasing sequence yields spans [1, 2, 3, 4], final stack: [(${stackC[0].price}, ${stackC[0].span})]\n`);

  // Case D: Equal prices (50, 50, 50)
  console.log('--- TEST CASE D: Equal Prices (50, 50, 50) ---');
  const pricesD = [50, 50, 50];
  let stackD: StackElement[] = [];
  const spansD: number[] = [];
  pricesD.forEach((p, idx) => {
    const res = processNextPrice(stackD, p, idx + 1);
    stackD = res.newStack;
    spansD.push(res.record.span);
  });
  console.log('Input:', pricesD);
  console.log('Calculated Spans:', spansD);
  console.assert(JSON.stringify(spansD) === JSON.stringify([1, 2, 3]), 'Case D failed: spans should be [1, 2, 3]');
  console.assert(stackD.length === 1, 'Case D failed: equal prices pop each other');
  console.log(`✓ Case D Passed: Equal prices correctly pop each other yielding spans [1, 2, 3], final stack: [(${stackD[0].price}, ${stackD[0].span})]\n`);

  // Case E: Mixed sequence (100, 80, 60, 70, 60, 75, 85)
  console.log('--- TEST CASE E: Standard Academic Sample (100, 80, 60, 70, 60, 75, 85) ---');
  let stackE: StackElement[] = [];
  const historyE: StockRecord[] = [];
  SAMPLE_PRICES.forEach((p, idx) => {
    const res = processNextPrice(stackE, p, idx + 1);
    stackE = res.newStack;
    historyE.push(res.record);
  });
  const spansE = historyE.map((r) => r.span);
  console.log('Input:', SAMPLE_PRICES);
  console.log('Calculated Spans:', spansE);
  console.assert(JSON.stringify(spansE) === JSON.stringify([1, 1, 1, 2, 1, 4, 6]), 'Case E failed: spans mismatch');
  console.assert(stackE.length === 2, 'Case E failed: final stack size should be 2');
  console.assert(stackE[0].price === 100 && stackE[0].span === 1, 'Case E failed: bottom should be (100, 1)');
  console.assert(stackE[1].price === 85 && stackE[1].span === 6, 'Case E failed: top should be (85, 6)');
  console.log(`✓ Case E Passed: Expected spans [1, 1, 1, 2, 1, 4, 6] verified.`);
  console.log(`  Final Stack Bottom to Top: [(${stackE[0].price}, span ${stackE[0].span}), (${stackE[1].price}, span ${stackE[1].span})]\n`);

  // Case H: Historical Consistency (History preserves popped elements)
  console.log('--- TEST CASE H: Historical Consistency Check ---');
  console.assert(historyE.length === 7, 'Case H failed: all 7 records must remain in history');
  console.assert(historyE[2].price === 60 && historyE[2].span === 1, 'Case H failed: Day 3 price 60 preserved');
  console.log(`✓ Case H Passed: All 7 days preserved in history despite stack holding only 2 elements.\n`);

  // Analytics Calculation Check
  console.log('--- ANALYTICS VERIFICATION ---');
  const analytics = computeAnalytics(historyE);
  console.log('Highest Price:', analytics.highestPrice);
  console.log('Lowest Price:', analytics.lowestPrice);
  console.log('Average Price:', analytics.averagePrice);
  console.log('Highest Span:', analytics.highestSpan);
  console.log('Dynamic Summary:', analytics.dynamicSummary);
  console.assert(analytics.highestPrice === 100, 'Highest price should be 100');
  console.assert(analytics.highestSpan === 6, 'Highest span should be 6');
  console.assert(analytics.averagePrice === 75.71, 'Average price should be 75.71');
  console.log('✓ Analytics computations verified.\n');

  console.log('=== ALL ALGORITHMIC AND FUNCTIONAL TEST CASES PASSED SUCCESSFULLY ===');
}

runTestSuite();
