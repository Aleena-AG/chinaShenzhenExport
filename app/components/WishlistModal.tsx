'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWishlistItems, removeFromWishlist, WISHLIST_UPDATED_EVENT, type WishlistItem } from '../lib/wishlist';
import GradientButton from './GradientButton';

export default function WishlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const refreshItems = () => {
    setItems(getWishlistItems());
  };

  useEffect(() => {
    refreshItems();
    const handler = () => refreshItems();
    window.addEventListener(WISHLIST_UPDATED_EVENT, handler);
    return () => window.removeEventListener(WISHLIST_UPDATED_EVENT, handler);
  }, []);

  useEffect(() => {
    if (isOpen) refreshItems();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
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
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <div>
                <h2 id="wishlist-modal-title" className="text-xl font-bold tracking-tight">
                  My Wishlist
                </h2>
                <p className="text-white/90 text-sm mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              </div>
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

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-500 text-sm">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const productUrl = item.categorySlug && item.productSlug
                  ? `/product/${item.categorySlug}/${item.productSlug}`
                  : '#';
                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:border-[#1658a1]/40 transition-colors"
                  >
                    <Link href={productUrl} className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={productUrl} className="font-semibold text-sm text-[#282A4D] hover:text-[#1658a1] line-clamp-2">
                        {item.name}
                      </Link>
                      {item.price && (
                        <p className="text-sm text-gray-600 mt-0.5">{item.price}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
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
