'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import OrderForm from '../../../components/orderForm';
import { slugify } from '../../../components/ValueOfDaySection';
import { fetchProductById } from '../../../lib/api';

/** /product/4/order = order by API product id (category param is numeric). */
export default function OrderProductByCategoryOrIdPage() {
  const params = useParams();
  const categoryParam = typeof params.category === 'string' ? params.category : '';
  const isNumericId = /^\d+$/.test(categoryParam);
  const id = isNumericId ? categoryParam : '';
  const [productName, setProductName] = useState<string>('');
  const [productImage, setProductImage] = useState<string | undefined>(undefined);
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isNumericId || !id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchProductById(id)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setNotFound(true);
          return;
        }
        const name = (p.name ?? p.title ?? 'Product').toString().trim();
        const img = p.image_url ?? (Array.isArray(p.image_urls) ? p.image_urls[0] : undefined);
        const catSlug = p.category_slug
          ? String(p.category_slug).trim()
          : (p.category_name ?? p.category)
            ? slugify(String(p.category_name ?? p.category).trim())
            : '';
        setProductName(name);
        setProductImage(img);
        setCategorySlug(catSlug);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isNumericId]);

  if (!isNumericId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-800">Not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (notFound || !productName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <OrderForm
      productName={productName}
      productImage={productImage}
      productSlug={id}
      categorySlug={categorySlug}
      variant="page"
     
    />
  );
}
