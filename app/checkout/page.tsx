'use client';

import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600 mb-6">
          Checkout flow can be connected to your payment provider here.
        </p>
        <Link
          href="/cart"
          className="inline-block py-3 px-6 rounded-lg font-semibold text-white bg-[#1658a1] hover:opacity-90"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}
