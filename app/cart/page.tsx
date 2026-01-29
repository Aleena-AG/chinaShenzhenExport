'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { getCartItems, getCartTotal } from '../lib/cart';

function CartContent() {
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get('checkout') === '1';
  const [items, setItems] = useState<ReturnType<typeof getCartItems>>([]);
  const [total, setTotal] = useState('0.00');

  useEffect(() => {
    setItems(getCartItems());
    setTotal(getCartTotal());
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add items from the store to see them here.</p>
          <Link
            href="/"
            className="inline-block py-3 px-6 rounded-lg font-semibold text-white bg-[#1658a1] hover:opacity-90"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isCheckout ? 'Review your order' : 'Shopping cart'}
        </h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.name}`}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="relative w-24 h-24 shrink-0 bg-white rounded overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">{item.name}</h2>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  <p className="text-[#1658a1] font-semibold mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 sticky top-4">
              <h2 className="font-bold text-gray-900 mb-4">Summary</h2>
              <p className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">${total}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">Shipping & tax calculated at checkout.</p>
              <Link
                href="/checkout"
                className="mt-6 w-full block py-3 rounded-lg text-center font-semibold text-white bg-[#FB8C00] hover:bg-[#e88b00] transition-colors"
              >
                Proceed to checkout
              </Link>
              <Link
                href="/"
                className="mt-3 w-full block py-3 rounded-lg text-center font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
