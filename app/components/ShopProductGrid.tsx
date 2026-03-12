'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { slugify, ValueOfDayCard, apiProductToDisplay, type DisplayProduct } from './ValueOfDaySection';
import { fetchCategories, fetchProducts, groupCategories, type ApiCategory } from '../lib/api';
import type { ApiProduct } from '../lib/api';

function matchesSearch(p: ApiProduct, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase().trim();
  const name = (p.name ?? p.title ?? '').toString().toLowerCase();
  const desc = (p.description ?? p.short_description ?? '').toString().toLowerCase();
  const cat = (p.category ?? p.category_name ?? '').toString().toLowerCase();
  return name.includes(lower) || desc.includes(lower) || cat.includes(lower);
}

function matchesCategory(p: ApiProduct, mainSlug: string, mainId: number, subSlug: string): boolean {
  const r = p as Record<string, unknown>;
  const pCatSlug = (p.category_slug ?? slugify(String(p.category_name ?? p.category ?? ''))).toString().toLowerCase();
  const pCatId = r.category_id;
  const pSubSlug = (r.subcategory_slug ?? r.sub_category_slug ?? '').toString().toLowerCase();
  const mainSlugNorm = mainSlug.toLowerCase();
  const subSlugNorm = subSlug.toLowerCase();

  if (subSlugNorm) {
    return pSubSlug === subSlugNorm || pCatSlug === subSlugNorm;
  }
  return pCatSlug === mainSlugNorm || pCatId === mainId;
}

export default function ShopProductGrid() {
  const searchParams = useSearchParams();
  const searchQ = searchParams.get('q') ?? '';
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>('');
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const { main, byParent } = groupCategories(categories);
  const selectedMain = main.find((m) => m.id === selectedMainId) ?? main[0] ?? null;
  const subcategories = selectedMain ? byParent.get(selectedMain.id) ?? [] : [];
  const categorySlug = selectedSubSlug || selectedMain?.slug || '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          const first = data.find((c) => c.parent_id == null);
          if (first) setSelectedMainId(first.id);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load categories');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setProductsLoading(true);
    fetchProducts()
      .then((data) => setAllProducts(data))
      .catch(() => setAllProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  const handleMainChange = (id: number | 'all') => {
    if (id === 'all') {
      setShowAll(true);
      setSelectedSubSlug('');
      return;
    }
    setShowAll(false);
    setSelectedMainId(id);
    setSelectedSubSlug('');
  };

  const handleSubcategoryChange = (slug: string) => {
    setSelectedSubSlug(slug);
  };

  const filteredProducts = useMemo((): ApiProduct[] => {
    let list = showAll ? allProducts : selectedMain
      ? allProducts.filter((p) => matchesCategory(p, selectedMain.slug || '', selectedMain.id, selectedSubSlug))
      : [];
    if (searchQ.trim()) {
      list = list.filter((p) => matchesSearch(p, searchQ));
    }
    return list;
  }, [allProducts, showAll, selectedMain, selectedSubSlug, searchQ]);

  const displayProducts = useMemo((): DisplayProduct[] => {
    return filteredProducts.map((p) => apiProductToDisplay(p, categorySlug || undefined));
  }, [filteredProducts, categorySlug]);

  const selectStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '1.25rem',
    paddingRight: '2.5rem',
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Loading…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-4">
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

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => handleMainChange('all')}
            className="px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400/50"
            style={
              showAll
                ? { background: 'linear-gradient(90deg, #003a91 24%, #9c0303 100%)', color: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
                : { background: 'white', color: '#003a91', border: '2px solid #003a91' }
            }
          >
            All Products
          </button>
          {main.map((tab) => {
            const isActive = !showAll && selectedMainId === tab.id;
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

      {/* Subcategory filter (when a category is selected) */}
      {!showAll && selectedMain && subcategories.length > 0 && (
        <div className="bg-gray-100 py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <h3 className="text-center text-lg sm:text-xl font-bold text-[#1658a1] mb-6">
              Choose Your Tracking System!
            </h3>
            <div className="flex justify-center max-w-md mx-auto">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {selectedMain.name}
                </label>
                <select
                  value={selectedSubSlug}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1658a1] focus:border-[#1658a1] appearance-none cursor-pointer"
                  style={selectStyles}
                >
                  <option value="">
                    All {selectedMain.name?.toLowerCase() ?? 'items'}
                  </option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product cards grid */}
      <div className="container mx-auto px-4 py-10 sm:py-12">
        {searchQ.trim() && (
          <p className="text-center text-sm text-gray-600 mb-4">
            Results for &quot;<span className="font-semibold">{searchQ}</span>&quot;
            {displayProducts.length === 0 && !productsLoading && ' – no products match'}
            {' '}
            <Link href="/shop" className="text-[#1658a1] font-medium hover:underline">Clear</Link>
          </p>
        )}
        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {displayProducts.map((product, idx) => (
              <ValueOfDayCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
