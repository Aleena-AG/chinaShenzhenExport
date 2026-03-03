'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from './ValueOfDaySection';
import { fetchCategories, fetchProductsByCategory, groupCategories, type ApiCategory } from '../lib/api';
import type { ApiProductByName } from '../lib/api';

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>('');
  const [products, setProducts] = useState<ApiProductByName[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const { main, byParent } = groupCategories(categories);
  const selectedMain = main.find((m) => m.id === selectedMainId) ?? main[0] ?? null;
  const subcategories = selectedMain ? byParent.get(selectedMain.id) ?? [] : [];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          const firstMain = data.find((c) => c.parent_id == null);
          if (firstMain) setSelectedMainId(firstMain.id);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load categories');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMainChange = (id: number) => {
    setSelectedMainId(id);
    setSelectedSubSlug('');
    setSelectedProductId('');
    setProducts([]);
  };

  const handleSubcategoryChange = (slug: string) => {
    setSelectedSubSlug(slug);
    setSelectedProductId('');
  };

  useEffect(() => {
    if (!selectedMain) return;
    const hasSub = Boolean(selectedSubSlug);
    setProductsLoading(true);
    // Main category only → all products in that category; subcategory selected → only that subcategory's products
    const params = hasSub
      ? { subcategory: selectedSubSlug }
      : { category: selectedMain.slug || selectedMain.id };
    fetchProductsByCategory(params)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, [selectedMain?.id, selectedMain?.slug, selectedMain, selectedSubSlug]);

  const categorySlug = selectedSubSlug || selectedMain?.slug || '';
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find((p) => String(p.id) === productId);
    if (product && categorySlug) {
      const productSlug = `${slugify(product.name)}-${product.id}`;
      router.push(`/product/${categorySlug}/${productSlug}/order`);
    }
  };

  const selectStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '1.25rem',
    paddingRight: '2.5rem',
  };

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <p className="text-center text-gray-500">Loading categories…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
          Game Changing
        </p>
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-8 max-w-3xl mx-auto">
          AI-Driven Tracking Devices & Features: GPS, Dashcam & Security
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {main.map((tab) => {
            const isActive = selectedMainId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleMainChange(tab.id)}
                className="px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400/50"
                style={
                  isActive
                    ? { background: 'linear-gradient(90deg, #003a91 24%, #9c0303 100%)', color: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
                    : { background: 'white', color: '#003a91', border: '2px solid #003a91' }
                }
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-100 py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-lg sm:text-xl font-bold text-[#1658a1] mb-6 sm:mb-8">
            Choose Your Tracking System!
          </h3>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {selectedMain?.name ?? 'Category'}
              </label>
              <select
                value={selectedSubSlug}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1658a1] focus:border-[#1658a1] appearance-none cursor-pointer"
                style={selectStyles}
              >
                <option value="">
                  Select {selectedMain?.name?.toLowerCase() ?? 'subcategory'}
                </option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Products
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                disabled={productsLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1658a1] focus:border-[#1658a1] appearance-none cursor-pointer disabled:opacity-70"
                style={selectStyles}
              >
                <option value="">
                  {productsLoading
                    ? 'Loading…'
                    : products.length === 0
                      ? 'No products'
                      : `Select product (${products.length})`}
                </option>
                {products.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
