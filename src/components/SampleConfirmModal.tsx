import React from 'react';
import { PlayCircle, X } from 'lucide-react';
import { SAMPLE_PRICES } from '../utils/stockSpan';

interface SampleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordCount: number;
}

export const SampleConfirmModal: React.FC<SampleConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recordCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="bg-bg-surface border border-line rounded-lg shadow-lg max-w-md w-full p-6 animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-3 border-b border-line">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-mint text-brand border border-brand-sage flex items-center justify-center shrink-0">
              <PlayCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-ink-primary">
              Load sample dataset?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-primary p-1 rounded hover:bg-[#F7F7F2] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-3 text-sm text-ink-secondary">
          <p>
            {recordCount > 0 ? (
              <>
                Your current session contains <strong className="text-ink-primary font-mono">{recordCount}</strong> recorded days. Loading the sample will <span className="text-semantic-warning font-semibold">replace your existing records</span> with the standard academic 7-day dataset.
              </>
            ) : (
              'Load the standard 7-day academic DSA dataset to demonstrate sequential monotonic stack calculations.'
            )}
          </p>

          <div className="bg-[#FAFBF9] border border-line rounded p-2.5 font-mono text-xs">
            <span className="text-ink-secondary block text-[10px] uppercase tracking-wider mb-1">
              Sample Sequence
            </span>
            <span className="text-brand font-semibold">
              {SAMPLE_PRICES.join(' → ')}
            </span>
            <span className="block text-[11px] text-ink-secondary mt-1">
              Expected spans: 1, 1, 1, 2, 1, 4, 6
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-md border border-line bg-bg-surface text-ink-primary hover:bg-[#F7F7F2] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-sample-load-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-brand text-white hover:bg-brand-hover transition-colors shadow-xs cursor-pointer"
          >
            {recordCount > 0 ? 'Replace & load sample' : 'Load sample'}
          </button>
        </div>
      </div>
    </div>
  );
};
