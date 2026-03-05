'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCompareItems, removeFromCompare, COMPARE_UPDATED_EVENT, type CompareItem } from '../lib/wishlist';

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function CompareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const refreshItems = () => {
    setItems(getCompareItems());
  };

  useEffect(() => {
    refreshItems();
    const handler = () => refreshItems();
    window.addEventListener(COMPARE_UPDATED_EVENT, handler);
    return () => window.removeEventListener(COMPARE_UPDATED_EVENT, handler);
  }, []);

  useEffect(() => {
    if (isOpen) refreshItems();
  }, [isOpen]);

  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    items.forEach((item) => {
      if (item.specs) Object.keys(item.specs).forEach((k) => keys.add(k));
    });
    return Array.from(keys).sort();
  }, [items]);

  const baseRows = [
    { key: 'price' as const, label: 'Price' },
    { key: 'sku' as const, label: 'SKU' },
    { key: 'availability' as const, label: 'Availability' },
  ];

  if (!isOpen) return null;

  const handleRemove = (productId: string) => {
    removeFromCompare(productId);
  };

  const getValue = (item: CompareItem, rowKey: string): React.ReactNode => {
    if (rowKey === 'price') {
      const price = item.price ?? '-';
      const orig = item.originalPrice;
      if (orig && orig !== price) {
        return (
          <span>
            <span className="text-red-600 font-semibold">{price}</span>
            <span className="ml-1.5 text-gray-400 line-through text-sm">{orig}</span>
          </span>
        );
      }
      return <span>{price}</span>;
    }
    if (rowKey === 'sku') return item.sku ?? item.productSlug ?? item.productId ?? '-';
    if (rowKey === 'availability') return item.availability ?? 'In stock';

    const specVal = item.specs?.[rowKey];
    return specVal && String(specVal).trim() ? specVal : '-';
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 id="compare-modal-title" className="text-xl font-bold tracking-tight">
                Compare products
              </h2>
              <p className="text-white/90 text-sm mt-0.5">
                {items.length} {items.length === 1 ? 'product' : 'products'} – using your product details
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content – comparison table */}
        <div className="p-6 overflow-auto flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-gray-500 text-sm">No products to compare. Add items from product pages.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 pr-4 text-gray-500 font-medium w-36 align-top" />
                    {items.map((item) => {
                      const productUrl = item.productId ? `/product/${item.productId}` : '#';
                      return (
                        <th key={item.productId} className="text-center py-3 px-2 align-top w-40 min-w-[140px]">
                          <div className="flex flex-col items-center">
                            <Link
                              href={productUrl}
                              className="block w-24 h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 shrink-0"
                            >
                              {item.imageSrc ? (
                                <Image
                                  src={item.imageSrc}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </Link>
                            <Link
                              href={productUrl}
                              className="font-semibold text-[#282A4D] hover:text-[#1658a1] line-clamp-2 text-center mb-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemove(item.productId)}
                              className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                              aria-label="Remove from compare"
                            >
                              Remove
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {baseRows.map(({ key, label }) => (
                    <tr key={key} className={`border-t border-gray-100 ${key === 'availability' ? 'bg-green-50/60' : ''}`}>
                      <td className="py-3 pr-4 text-gray-500 font-medium align-middle">{label}</td>
                      {items.map((item) => (
                        <td key={item.productId} className="py-3 px-2 text-center align-middle">
                          {getValue(item, key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {allSpecKeys.map((specKey) => (
                    <tr key={specKey} className="border-t border-gray-100">
                      <td className="py-3 pr-4 text-gray-500 font-medium align-middle">{formatLabel(specKey)}</td>
                      {items.map((item) => (
                        <td key={item.productId} className="py-3 px-2 text-center align-middle text-gray-700">
                          {getValue(item, specKey)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
