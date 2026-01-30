'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getGpsSubCategories,
  getGpsSubCategoryBySlug,
  getGpsProductUrl,
  type GpsProduct,
  type GpsSubCategory,
} from '../../../lib/gps-products';
import { getAccessoriesImageUrl, getAccessoriesMainImageUrl } from '../../../lib/accessories-images';

const PARENT_CATEGORY_NAMES: Record<string, string> = {
  'gps-tracker-accessories': 'Gps Tracker & Accessories',
};

function getParentCategoryName(parentSlug: string): string {
  return PARENT_CATEGORY_NAMES[parentSlug] || parentSlug.replace(/-/g, ' ');
}

function ProductCard({ product, subSlug, categoryLabel, imageIndex }: { product: GpsProduct; subSlug: string; categoryLabel: string; imageIndex: number }) {
  const fromSubFolder = getAccessoriesImageUrl(subSlug, imageIndex);
  const imageSrc = product.image?.startsWith('http')
    ? product.image
    : fromSubFolder ?? `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
  const price = product.price || '$0.00';
  const description =
    product.fullDescription ||
    product.description ||
    `${product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;
  const specs = product.specs as Record<string, string> | undefined;

  return (
    <div className="group/card relative bg-white rounded-xl border-2 border-gray-200 overflow-visible flex flex-col py-6 px-5 text-center min-h-[340px]">
      {/* Default card */}
      <div className="overflow-hidden rounded-xl flex flex-col flex-1 min-h-0">
        <h3 className="text-[#555] font-semibold text-base sm:text-lg tracking-wide">{product.name}</h3>
        <p className="text-[#999] text-xs sm:text-sm uppercase tracking-wide mt-1">{categoryLabel}</p>
        <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center my-6">
          <Image
            src={imageSrc}
            alt={product.name}
            width={400}
            height={220}
            className="object-contain w-full max-h-48"
            unoptimized={imageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <p className="text-[#555] font-semibold text-lg sm:text-xl mb-2">{price}</p>
        <Link
          href={getGpsProductUrl(subSlug, product)}
          className="mt-auto  w-full max-w-[180px] mx-auto py-2.5 rounded-full border-0 text-white font-semibold text-sm uppercase tracking-wide transition-colors hover:opacity-95 flex items-center justify-center"
          style={{ background: 'linear-gradient(90deg,rgba(0, 58, 145, 1) 24%, rgba(156, 3, 3, 1) 100%)' }}
        >
          Buy Now
        </Link>
      </div>

      {/* Hover overlay – same UI as home page cards */}
      <Link
        href={getGpsProductUrl(subSlug, product)}
        className="absolute inset-0 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 bg-gray-100 rounded-xl py-0 overflow-visible pointer-events-none group-hover/card:pointer-events-auto"
      >
        <div className="w-full flex items-end justify-center min-h-[140px] sm:min-h-[160px] pt-0 pb-2 -mt-[40px] shrink-0 relative">
          <Image
            src={imageSrc}
            alt={product.name}
            width={160}
            height={200}
            className="object-contain max-h-44 sm:max-h-52 w-auto drop-shadow-lg -translate-y-2"
            unoptimized={imageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <div className="flex-1 flex flex-col py-4 px-4 text-center overflow-hidden">
          <h3 className="text-[#555] font-semibold text-lg tracking-wide">{product.name}</h3>
          <p className="text-[#999] text-xs uppercase tracking-wide mt-0.5">{categoryLabel}</p>
          <p className="text-[#555] font-semibold text-base mt-2">{price}</p>
          <p className="text-[#888] text-xs leading-snug mt-2 line-clamp-3">{description}</p>
          <div className="mt-3 rounded-lg border border-[#e5e5e5] bg-white/60 py-2.5 px-3 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-[#999]">Origin</span>
              <span className="text-[#555] font-medium">{specs?.origin ?? 'China'}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Type</span>
              <span className="text-[#555] font-medium">{specs?.type ?? categoryLabel}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Spec</span>
              <span className="text-[#555] font-medium">{specs?.rating ?? specs?.awg ?? '—'}</span>
            </div>
          </div>
          <span className="mt-4 w-full py-2.5 rounded-lg border border-[#1658a1] bg-[#dae3ef] text-[#1658a1] font-medium text-sm uppercase tracking-wide text-center block">
            Buy Now
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function CategorySubPage() {
  const params = useParams();
  const parentSlug = typeof params.parentSlug === 'string' ? params.parentSlug : '';
  const subSlug = typeof params.subSlug === 'string' ? params.subSlug : '';
  const subCategories = getGpsSubCategories();
  const currentSub = getGpsSubCategoryBySlug(subSlug);

  if (!currentSub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Sub-category not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const isAccessories = parentSlug === 'gps-tracker-accessories';
  const mainImageUrl = getAccessoriesMainImageUrl();
  const [mainImageOk, setMainImageOk] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-8">
        {isAccessories && mainImageOk && (
          <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={mainImageUrl}
              alt="Accessories"
              width={1200}
              height={320}
              className="w-full h-48 sm:h-64 object-cover"
              unoptimized
              onError={() => setMainImageOk(false)}
            />
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <h2 className="text-lg font-semibold text-[#1658a1] mb-4">{getParentCategoryName(parentSlug)}</h2>
            <ul className="space-y-1">
              {subCategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/category/${parentSlug}/${sub.slug}`}
                    className={`text-sm block py-1.5 ${sub.slug === subSlug ? 'font-semibold text-[#1658a1]' : 'text-gray-600 hover:text-[#1658a1]'}`}
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b-2 border-[#db1f26] w-fit mb-6">
              {currentSub.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentSub.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  subSlug={subSlug}
                  categoryLabel={currentSub.label}
                  imageIndex={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
