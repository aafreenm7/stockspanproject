import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { AppNavigation, type NavTab } from './components/AppNavigation';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { SampleConfirmModal } from './components/SampleConfirmModal';
import { OverviewPage } from './pages/OverviewPage';
import { StackVisualizerPage } from './pages/StackVisualizerPage';
import { PriceHistoryPage } from './pages/PriceHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlgorithmGuidePage } from './pages/AlgorithmGuidePage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import {
  type StockRecord,
  type StackElement,
  type OperationLog,
  processNextPrice,
  SAMPLE_PRICES,
} from './utils/stockSpan';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  // Single consistent source of truth
  const [records, setRecords] = useState<StockRecord[]>([]);
  const [stack, setStack] = useState<StackElement[]>([]);
  const [lastOperationLog, setLastOperationLog] = useState<OperationLog | null>(null);

  // Dialog states
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Adds a single price using the monotonic stack algorithm.
   */
  const handleAddPrice = (price: number): { success: boolean; message?: string } => {
    setIsSubmitting(true);
    try {
      const nextDay = records.length + 1;
      const { newStack, record, operationLog } = processNextPrice(stack, price, nextDay);

      setStack(newStack);
      setRecords((prev) => [...prev, record]);
      setLastOperationLog(operationLog);

      const popNote =
        operationLog.poppedCount > 0
          ? ` (${operationLog.poppedCount} stack element${operationLog.poppedCount > 1 ? 's' : ''} popped)`
          : '';

      return {
        success: true,
        message: `Day ${nextDay} recorded: ₹${price} · Calculated span: ${record.span}${popNote}`,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Sequentially processes standard sample dataset:
   * [100, 80, 60, 70, 60, 75, 85] -> spans [1, 1, 1, 2, 1, 4, 6]
   */
  const handleLoadSample = () => {
    let currentStack: StackElement[] = [];
    const sampleRecords: StockRecord[] = [];
    let latestLog: OperationLog | null = null;

    SAMPLE_PRICES.forEach((price, idx) => {
      const day = idx + 1;
      const { newStack, record, operationLog } = processNextPrice(currentStack, price, day);
      currentStack = newStack;
      sampleRecords.push(record);
      latestLog = operationLog;
    });

    setStack(currentStack);
    setRecords(sampleRecords);
    setLastOperationLog(latestLog);
  };

  /**
   * Resets entire session data to pristine initial state.
   */
  const handleResetSession = () => {
    setRecords([]);
    setStack([]);
    setLastOperationLog(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#202820] flex flex-col selection:bg-brand-sage selection:text-ink-primary">
      {/* Compact Top Header */}
      <AppHeader
        totalRecords={records.length}
        stackSize={stack.length}
        onOpenReset={() => setIsResetModalOpen(true)}
        onOpenSample={() => setIsSampleModalOpen(true)}
      />

      {/* Main Tab Navigation Rail */}
      <AppNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        recordCount={records.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewPage
            records={records}
            stack={stack}
            lastOperationLog={lastOperationLog}
            onAddPrice={handleAddPrice}
            onNavigate={setActiveTab}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'visualizer' && (
          <StackVisualizerPage
            stack={stack}
            records={records}
            lastOperationLog={lastOperationLog}
            onAddPrice={handleAddPrice}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'history' && <PriceHistoryPage records={records} />}

        {activeTab === 'analytics' && <AnalyticsPage records={records} />}

        {activeTab === 'guide' && <AlgorithmGuidePage />}

        {activeTab === 'about' && <AboutProjectPage />}
      </main>

      {/* Confirmation Modals */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetSession}
      />

      <SampleConfirmModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onConfirm={handleLoadSample}
        recordCount={records.length}
      />
    </div>
  );
};

export default App;
