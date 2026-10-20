import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
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
            <div className="w-8 h-8 rounded-md bg-[#FDF6F6] text-semantic-error border border-semantic-error/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-ink-primary">
              Reset this session?
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

        <p className="text-sm text-ink-secondary mt-3 leading-relaxed">
          All stock records and stack data will be cleared. The session will return to Day 0, and the next price entered will begin at Day 1.
        </p>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            id="cancel-reset-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-md border border-line bg-bg-surface text-ink-primary hover:bg-[#F7F7F2] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-reset-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-semantic-error text-white hover:bg-[#9B3C37] transition-colors shadow-xs cursor-pointer"
          >
            Reset session
          </button>
        </div>
      </div>
    </div>
  );
};
