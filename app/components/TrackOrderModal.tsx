'use client';

import { useState } from 'react';

export type TrackOrderData = {
  id: number;
  orderNo: number | string;
  model: string;
  estimatedQuantity: string;
  country: string;
  companyName: string;
  contactPerson: string;
  productSlug: string;
  categorySlug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function getStatusColor(status: string): string {
  const s = status?.toLowerCase() || '';
  if (s === 'completed') return 'text-green-600 bg-green-50';
  if (s === 'paid' || s === 'processing') return 'text-blue-600 bg-blue-50';
  if (s === 'cancelled') return 'text-red-600 bg-red-50';
  return 'text-amber-600 bg-amber-50';
}

export default function TrackOrderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrackOrderData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);
    if (!orderNo.trim() || !email.trim()) {
      setError('Please enter both order number and email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo: orderNo.trim(), email: email.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.message || json?.error || 'Order not found or email does not match.');
        return;
      }
      if (json?.success && json?.data) {
        setData(json.data);
      } else {
        setError('Order not found or email does not match.');
      }
    } catch {
      setError('Unable to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrderNo('');
    setEmail('');
    setError(null);
    setData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-order-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-6 text-white"
          style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  <circle cx="7" cy="18" r="2" strokeWidth={2} />
                  <circle cx="17" cy="18" r="2" strokeWidth={2} />
                </svg>
              </span>
              <div>
                <h2 id="track-order-modal-title" className="text-xl font-bold tracking-tight">
                  Track Your Order
                </h2>
                <p className="text-white/90 text-sm mt-0.5">Enter your order number and email</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {data ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order #</span>
                <span className="font-semibold text-[#1658a1]">{data.orderNo}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
                    {data.status}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <Row label="Model" value={data.model} />
                <Row label="Quantity" value={data.estimatedQuantity} />
                <Row label="Country" value={data.country} />
                <Row label="Company" value={data.companyName} />
                <Row label="Contact" value={data.contactPerson} />
                <Row label="Product" value={data.productSlug} />
                <Row label="Category" value={data.categorySlug} />
                <Row label="Created" value={formatDate(data.createdAt)} />
                <Row label="Updated" value={formatDate(data.updatedAt)} />
              </div>
              <button
                type="button"
                onClick={() => { setData(null); setError(null); }}
                className="w-full py-2.5 text-sm font-medium text-[#1658a1] hover:bg-[#1658a1]/5 rounded-lg transition-colors"
              >
                Track another order
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="track-orderNo" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  id="track-orderNo"
                  type="text"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="e.g. 123"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1] outline-none transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="track-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="track-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1] outline-none transition-colors"
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white transition-colors disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
                >
                  {loading ? 'Searching…' : 'Track Order'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-500 shrink-0 w-24">{label}</span>
      <span className="text-sm text-gray-900 break-words">{String(value)}</span>
    </div>
  );
}
