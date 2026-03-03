'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discountCouponModalShown';

export type DiscountCoupon = {
  id?: number | string;
  code?: string;
  coupon_code?: string;
  discount?: string;
  discount_type?: string;
  discount_value?: number | string;
  description?: string;
  valid_until?: string;
  start_date?: string;
  end_date?: string;
  min_order_value?: string;
  max_uses?: number | null;
  used_count?: number;
  status?: string;
  [key: string]: unknown;
};

function parseDate(d: string): number {
  const n = new Date(d).getTime();
  return isNaN(n) ? 0 : n;
}

function isCouponValid(c: DiscountCoupon): boolean {
  if (c.status && c.status !== 'Active') return false;
  const now = Date.now();
  if (c.start_date && parseDate(c.start_date) > now) return false;
  if (c.end_date && parseDate(c.end_date) < now) return false;
  if (c.max_uses != null && (c.used_count ?? 0) >= c.max_uses) return false;
  return true;
}

function normalizeCoupons(raw: unknown): DiscountCoupon[] {
  let list: DiscountCoupon[] = [];
  if (Array.isArray(raw)) list = raw as DiscountCoupon[];
  else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) list = obj.data as DiscountCoupon[];
    else if (Array.isArray(obj.coupons)) list = obj.coupons as DiscountCoupon[];
  }
  return list.filter(isCouponValid);
}

function getCouponCode(c: DiscountCoupon): string {
  return (c.code ?? c.coupon_code ?? 'COUPON') as string;
}

function formatDiscountValue(v: number | string): string {
  const s = String(v);
  return s.replace(/\.?0+$/, '') || s;
}

function getDiscountText(c: DiscountCoupon): string {
  if (c.discount) return String(c.discount).replace(/\s*off\s*$/i, '').trim();
  const isPercent = c.discount_type === 'percent' || c.discount_type === 'percentage';
  if (isPercent && c.discount_value != null) return `${formatDiscountValue(c.discount_value)}%`;
  if (c.discount_type === 'fixed' && c.discount_value != null) return `AED ${formatDiscountValue(c.discount_value)}`;
  if (c.discount_value != null) return formatDiscountValue(c.discount_value);
  return 'Discount';
}

export default function DiscountCouponModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = useCallback((code: string, index: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  }, []);

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setLoading(false);
      return;
    }

    fetch('/api/discount-coupons')
      .then((res) => res.json())
      .then((json) => {
        const list = normalizeCoupons(json?.data ?? json);
        setCoupons(list);
        setLoading(false);
        if (list.length > 0) setIsOpen(true);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!isOpen || coupons.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div
          className="px-6 py-8 text-white"
          style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
            <div>
              <h2 id="discount-modal-title" className="text-xl font-bold tracking-tight">
                Special Offers for You
              </h2>
              <p className="text-white/90 text-sm mt-0.5">Use these coupons at checkout</p>
            </div>
          </div>
        </div>

        {/* Coupon cards */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {coupons.map((c, i) => (
            <div
              key={c.id ?? i}
              className="relative flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-[#1658a1]/40 bg-[#f8fafc] hover:border-[#1658a1]/60 transition-colors"
            >
              <div
                className="shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-90">Save</span>
                <span className="text-lg leading-tight">{getDiscountText(c)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono font-bold text-lg text-[#282A4D] tracking-wider">
                  {getCouponCode(c)}
                </p>
                {c.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{String(c.description)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(getCouponCode(c), i)}
                className={`shrink-0 px-3 py-2 text-xs font-semibold rounded-lg transition-colors min-w-[72px] ${
                  copiedIndex === i
                    ? 'bg-green-600 text-white'
                    : 'bg-[#1658a1] text-white hover:bg-[#134a8a]'
                }`}
              >
                {copiedIndex === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-95"
            style={{ background: 'linear-gradient(90deg, #003a91 24%, #9c0303 100%)' }}
          >
            Got it, thanks!
          </button>
        </div>

        {/* Close X */}
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
