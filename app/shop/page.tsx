'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import ShopProductGrid from '../components/ShopProductGrid';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero – background image */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dstnwi5iq/image/upload/v1769668522/abstract-blurred-blue-purple-colorful-rays-moving-opposite-each-other.jpg_cemgvf.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" aria-hidden />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-2">
              Worldwide China Shenzhen Export Store
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Shop
            </h1>
            <p className="text-white/90 text-lg mt-4">
              Explore our range of AI-driven tracking devices, GPS systems, dashcams & security solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Category tabs, subcategory filter, product cards */}
      <Suspense fallback={<div className="container mx-auto px-4 py-10 text-center text-gray-500">Loading…</div>}>
        <ShopProductGrid />
      </Suspense>

      {/* CTA strip */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 text-sm">
            Can&apos;t find what you need?{' '}
            <Link href="/contact" className="text-[#1658a1] font-semibold hover:underline">
              Contact us
            </Link>{' '}
            for custom solutions.
          </p>
        </div>
      </section>
    </div>
  );
}
