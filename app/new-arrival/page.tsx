'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchProducts, type ApiProduct } from '../lib/api';
import { ValueOfDayCard, apiProductToDisplay, type DisplayProduct } from '../components/ValueOfDaySection';

const NEW_ARRIVAL_TOP_COUNT = 24;

export default function NewArrivalPage() {
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((list) => {
        if (!cancelled) setApiProducts(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const { newArrivalProducts, allProducts } = useMemo(() => {
    const newArrival = apiProducts.slice(0, NEW_ARRIVAL_TOP_COUNT).map((p) => apiProductToDisplay(p));
    const all = apiProducts.map((p) => apiProductToDisplay(p));
    return { newArrivalProducts: newArrival, allProducts: all };
  }, [apiProducts]);

  const showNewArrival = newArrivalProducts.length > 0;
  const showAllProducts = allProducts.length > 0;

  return (
    <main className="min-h-screen bg-white">
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
              Handpicked For You
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              New Arrival
            </h1>
            <p className="text-white/90 text-lg mt-4">
              Recently added products at the top; below you’ll find the full collection.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="w-full">
          <div className="container mx-auto px-4 py-10 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-48" />
              ))}
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="w-full">
          <div className="container mx-auto px-4 py-10 sm:py-12">
            <div className="max-w-lg mx-auto text-center py-12">
              <p className="text-red-600 font-medium mb-2">Unable to load products.</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Top: Recently added = New Arrival */}
          {showNewArrival && (
            <section className="w-full border-b border-gray-100 bg-white">
              <div className="container mx-auto px-4 py-8 sm:py-10">
                <h2 className="text-xl sm:text-2xl font-bold text-[#003a91] mb-6">
                  New Arrival
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {newArrivalProducts.map((product) => (
                    <ValueOfDayCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Below: All Products */}
          <section className="w-full">
            <div className="container mx-auto px-4 py-8 sm:py-12">
              <h2 className="text-xl sm:text-2xl font-bold text-[#003a91] mb-6">
                All Products
              </h2>
              {!showAllProducts ? (
                <p className="text-gray-500 py-8 text-center">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {allProducts.map((product) => (
                    <ValueOfDayCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

