import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PriceInputProps {
  onAddPrice: (price: number) => { success: boolean; message?: string };
  isSubmitting?: boolean;
}

export const PriceInput: React.FC<PriceInputProps> = ({ onAddPrice, isSubmitting = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setSuccessNotice(null);

    const trimmed = inputValue.trim();

    // 1. Check empty
    if (!trimmed) {
      setError('Please enter a closing stock price.');
      return;
    }

    // 2. Reject decimal / non-integers
    if (trimmed.includes('.') || trimmed.includes(',')) {
      setError('Please enter a whole integer without decimals.');
      return;
    }

    // 3. Reject non-numeric characters
    if (!/^-?\d+$/.test(trimmed)) {
      setError('Invalid price. Please enter digits only.');
      return;
    }

    const num = Number(trimmed);

    // 4. Reject zero or negative
    if (num <= 0) {
      setError('Closing price must be a strictly positive integer (> 0).');
      return;
    }

    // 5. Check reasonable upper limit for display clarity (e.g., 10,000,000)
    if (num > 10000000) {
      setError('Please enter a price under ₹10,000,000 for realistic demonstration.');
      return;
    }

    const result = onAddPrice(num);
    if (result.success) {
      setInputValue('');
      setSuccessNotice(result.message || `Price ₹${num} processed successfully.`);
      setTimeout(() => {
        setSuccessNotice(null);
      }, 5000);
    } else {
      setError(result.message || 'Error processing price.');
    }
  };

  return (
    <div className="bg-bg-surface border border-line rounded-lg p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="closing-price-input"
              className="block text-xs font-semibold text-ink-primary uppercase tracking-wider mb-1.5"
            >
              Closing price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink-secondary font-mono text-sm pointer-events-none select-none">
                ₹
              </span>
              <input
                id="closing-price-input"
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter a positive integer"
                disabled={isSubmitting}
                className="w-full pl-7 pr-4 py-2 text-sm bg-[#FBFBFA] border border-line rounded-md text-ink-primary font-mono placeholder:font-sans placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            id="add-price-btn"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add price</span>
          </button>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div
            id="input-validation-error"
            className="flex items-center space-x-2 text-xs text-semantic-error bg-[#FDF6F6] border border-semantic-error/20 px-3 py-1.5 rounded-md transition-all animate-fadeIn"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Subtle Success Indicator */}
        {successNotice && (
          <div
            id="input-success-notice"
            className="flex items-center space-x-2 text-xs text-semantic-success bg-brand-mint border border-brand-sage px-3 py-1.5 rounded-md transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
      </form>
    </div>
  );
};
